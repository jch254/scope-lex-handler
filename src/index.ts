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
// TODO: Handle failed state
export async function handler(event: MuzoEvent, context: Context, callback: Callback) {
  console.log('handler');
  console.log(event);

  try {
    let response = {};

    const authData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authData.body['access_token']);

    if (event.currentIntent.name === 'GetSuggestions') {
      // TODO: Get appropriate data for Spotify API request from event slots using spotify-web-api-node
      // TODO: Send request to Spotify API
      const trackData = await spotifyApi.searchTracks(event.currentIntent.slots.track);

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
      const songs = await lyricist.search(event.currentIntent.slots.lyric);

      console.log(JSON.stringify(songs));

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled',
          message: {
            contentType: 'PlainText',
            content: songs[0].title_with_featured,
          },
          responseCard: {
            genericAttachments: [{
              title: songs[0].title_with_featured,
              subTitle: songs[0].primary_artist.name,
              imageUrl: songs[0].song_art_image_thumbnail_url,
              attachmentLinkUrl: songs[0].url,
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
