import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import MuzoEvent from './MuzoEvent';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);

// TODO: Return appropriate typed LexResponse
// TODO: Handle failed states
// TODO: Improve error handing
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
      const fullGeniusSong = await lyricist.song(geniusSongs[0].id);
      const spotifyMedia = fullGeniusSong.media.find((media: any) => media.provider === 'Spotify');

      let audioFeatures = {};

      if (spotifyMedia) {
        const spotifyNativeUriParts = spotifyMedia.native_uri.split(':');
        const spotifyTrackId = spotifyNativeUriParts[spotifyNativeUriParts.length - 1];
        
        audioFeatures = await spotifyApi.getAudioFeaturesForTrack(spotifyTrackId);
      }

      console.log(JSON.stringify(geniusSongs));
      console.log(JSON.stringify(fullGeniusSong));
      console.log(JSON.stringify(audioFeatures));

      // TODO: Return data from audioFeatures

      // TODO: Return data from fullGeniusSong:
      // - Artist: primary_artist.name (link to primary_artist.url if possible),
      // - Album: album.name (link to album.url if possible),
      // - Release date: release_date,
      // - Producers: producer_artists[*].name (link to producer_artists[*].url if possible)
      // - Writers: writer_artists[*].name (link to writer_artists[*].url if possible)
      // - Samples: song_relationships[type === "samples"].songs
      // - Sampled by: song_relationships[type === "sampled_in"].songs
      // - YouTube link: media[provider === "youtube"].url

      // TODO: Format data nicely (link to Genius and Spotify)

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: fullGeniusSong.full_title,
          },
          responseCard: {
            contentType: 'application/vnd.amazonaws.card.generic',
            version: 1,
            genericAttachments: [{
              title: fullGeniusSong.title_with_featured,
              subTitle: fullGeniusSong.primary_artist.name,
              imageUrl: fullGeniusSong.song_art_image_thumbnail_url,
              attachmentLinkUrl: fullGeniusSong.url,
            }],
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
