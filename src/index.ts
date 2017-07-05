import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import MuzoEvent from './MuzoEvent';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);

// TODO: Handle error/failed states
// TODO: Improve types/remove any types
export async function handler(event: MuzoEvent, context: Context, callback: Callback) {
  console.log('handler');
  console.log(event);

  try {
    let response = {};

    const authData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authData.body['access_token']);

    if (event.currentIntent.name === 'GetSuggestions') {
      // TODO: Get track, genre and artist ids via Spotify API after each response from user
      // TODO: Send getRecommendations request to Spotify API using track, genre and artist ids
      // TODO: Refine min_popularity
      const trackData = await spotifyApi.searchTracks(event.currentIntent.slots.track);
      // const recommendations = await spotifyApi.getRecommendations({
      //   seed_tracks: [''],
      //   seed_genres: [''],
      //   seed_artists: [''],
      //   min_popularity: 50,
      // });

      console.log(JSON.stringify(trackData.body));

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: JSON.stringify(trackData.body),
          },
        },
      };
    }

    if (event.currentIntent.name === 'GetLyricData') {
      const geniusSongs = await lyricist.search(event.currentIntent.slots.lyric);
      const fullGeniusSong = await lyricist.song(geniusSongs[0].id, { fetchLyrics: false });
      const spotifyMedia = fullGeniusSong.media.find((media: any) => media.provider === 'spotify');
      const youtubeMedia = fullGeniusSong.media.find((media: any) => media.provider === 'youtube');
      const soundcloudMedia = fullGeniusSong.media.find((media: any) => media.provider === 'soundcloud');

      let audioFeatures;

      if (spotifyMedia !== undefined) {
        const spotifyNativeUriParts = spotifyMedia.native_uri.split(':');
        const spotifyTrackId = spotifyNativeUriParts[spotifyNativeUriParts.length - 1];
        
        const audioFeaturesResponse = await spotifyApi.getAudioFeaturesForTrack(spotifyTrackId);
        audioFeatures = audioFeaturesResponse.body;
      }

      console.log(JSON.stringify(geniusSongs));
      console.log(JSON.stringify(fullGeniusSong));
      console.log(JSON.stringify(audioFeatures));

      // TODO: Add data from audioFeatures to responseMessage:
      // {
      //   "body": {
      //       "danceability": 0.551,
      //       "energy": 0.403,
      //       "key": 1,
      //       "loudness": -8.02,
      //       "mode": 1,
      //       "speechiness": 0.061,
      //       "acousticness": 0.193,
      //       "instrumentalness": 0.00219,
      //       "liveness": 0.133,
      //       "valence": 0.117,
      //       "tempo": 78.252,
      //       "type": "audio_features",
      //       "id": "4vgVpxNTdfmcbBvk6hMPn4",
      //       "uri": "spotify:track:4vgVpxNTdfmcbBvk6hMPn4",
      //       "track_href": "https://api.spotify.com/v1/tracks/4vgVpxNTdfmcbBvk6hMPn4",
      //       "analysis_url": "https://api.spotify.com/v1/audio-analysis/4vgVpxNTdfmcbBvk6hMPn4",
      //       "duration_ms": 301587,
      //       "time_signature": 4
      //   }
      // }
      
      const responseMessage =
`Title: ${fullGeniusSong.title}
Artist: ${fullGeniusSong.primary_artist.name}
${
  fullGeniusSong.album !== null ?
    `Album: ${fullGeniusSong.album.name}` :
    ''
}
Release date: ${fullGeniusSong.release_date}

${
  fullGeniusSong.producer_artists !== null ?
    `Producers: ${fullGeniusSong.writer_artists.map((writer: any) => writer.name).join(', ')}` :
    ''
}
${
  fullGeniusSong.writer_artists !== null ?
    `Writers: ${fullGeniusSong.writer_artists.map((writer: any) => writer.name).join(', ')}` :
    ''
}

${
  audioFeatures !== undefined ?
    `BPM: ${audioFeatures.tempo}` :
    ''
}
${
  audioFeatures !== undefined ?
    `Key: ${audioFeatures.key}` :
    ''
}
${
  fullGeniusSong.song_relationships.find((relationship: any) => relationship.type === 'samples').songs.length > 0 ?
    `Samples: ${fullGeniusSong
      .song_relationships
      .find((relationship: any) => relationship.type === 'samples')
      .songs
      .map((song: any) => song.full_title).join(', ')
    }` :
    ''
}`;

      const attachments = [];

      if (spotifyMedia !== undefined) {
        attachments.push({
          title: fullGeniusSong.title_with_featured,
          subTitle: fullGeniusSong.primary_artist.name,
          imageUrl: fullGeniusSong.song_art_image_url,
          attachmentLinkUrl: spotifyMedia.url,
        });
      }

      attachments.push({
        title: fullGeniusSong.title_with_featured,
        subTitle: fullGeniusSong.primary_artist.name,
        imageUrl: fullGeniusSong.song_art_image_url,
        attachmentLinkUrl: fullGeniusSong.url,
      });

      if (youtubeMedia !== undefined) {
        attachments.push({
          title: fullGeniusSong.title_with_featured,
          subTitle: fullGeniusSong.primary_artist.name,
          imageUrl: fullGeniusSong.song_art_image_url,
          attachmentLinkUrl: youtubeMedia.url,
        });
      }

      if (soundcloudMedia !== undefined) {
        attachments.push({
          title: fullGeniusSong.title_with_featured,
          subTitle: fullGeniusSong.primary_artist.name,
          imageUrl: fullGeniusSong.song_art_image_url,
          attachmentLinkUrl: soundcloudMedia.url,
        });
      }

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: responseMessage,
          },
          responseCard: {
            contentType: 'application/vnd.amazonaws.card.generic',
            version: 1,
            genericAttachments: attachments,
          },
        },
      };
    }

    return callback(undefined, response);
  } catch (err) {
    console.log(err);

    return callback(err);
  }
}
