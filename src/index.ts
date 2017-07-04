import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import MuzoEvent from './MuzoEvent';

// TODO: Return appropriate LexResponse
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);

export async function handler(event: MuzoEvent, context: Context, callback: Callback) {
  console.log('handler');
  console.log(event);

  try {
    let response = {};

    const authData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authData.body['access_token']);

    if (event.currentIntent.name === 'GetSuggestions') {
      // TODO: Get appropriate data for Spotify API request from event params using spotify-web-api-node
      // TODO: Send request to Spotify API
      const trackData = await spotifyApi.searchTracks('artist:Kanye West');

      console.log(JSON.stringify(trackData.body));
    }

    if (event.currentIntent.name === 'GetLyricData') {
      const songs = await lyricist.search(event.inputTranscript);

      console.log(songs);

      response = {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled', // TODO: Handle failed state
          message: {
            contentType: 'PlainText',
            content: songs[0].full_title,
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
