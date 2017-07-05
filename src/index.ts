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
    
      let responseMessage = `Title: ${fullGeniusSong.title}
Artist: ${fullGeniusSong.primary_artist.name}`;

      if (fullGeniusSong.album !== null) {
        responseMessage += `
Album: ${fullGeniusSong.album.name}`;
      }

      responseMessage += `
Release date: ${fullGeniusSong.release_date}`;

      if (audioFeatures !== undefined) {
        responseMessage += `
BPM: ${audioFeatures.tempo}`;
      }

      if (audioFeatures !== undefined) {
        responseMessage += `
Key: ${audioFeatures.key}`; // TODO: Convert to proper notation
      }

      if (fullGeniusSong.song_relationships.find((r: any) => r.type === 'samples').songs.length > 0) {
        responseMessage += `

Sample(s)
${fullGeniusSong
  .song_relationships
  .find((r: any) => r.type === 'samples')
  .songs
  .map((s: any) => `- ${s.full_title}`)
  .join('\n')
}`;
      }

      if (fullGeniusSong.producer_artists !== null) {
        responseMessage += `

Producer(s)
${fullGeniusSong
  .producer_artists
  .map((p: any) => `- ${p.name}`)
  .join('\n')
}`;
      }

      if (fullGeniusSong.producer_artists !== null) {
        responseMessage += `

Writer(s)
${fullGeniusSong
  .writer_artists
  .map((w: any) => `- ${w.name}`)
  .join('\n')
}`;
      }

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
