import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import handleGetLyricDataIntent from './handlers/getLyricDataHandler';
import handleGetSuggestionsIntent from './handlers/getSuggestionsHandler';
import handleWrongLyricDataIntent from './handlers/wrongLyricDataHandler';
import LexEvent from './LexEvent';

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// TODO: Handle error/failed states
// TODO: Create @types/lyricist and @types/spotify-web-api-node
export async function handler(event: LexEvent, context: Context, callback: Callback) {
  console.log(`Event: ${JSON.stringify(event)}`);

  try {
    let response = {};

    const authData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(authData.body['access_token']);

    switch (event.currentIntent.name) {
      case 'GetSuggestions':
        response = await handleGetSuggestionsIntent(event, lyricist, spotifyApi);
        break;
      case 'GetLyricData':
        response = await handleGetLyricDataIntent(event, lyricist, spotifyApi);
        break;
      case 'WrongLyricData':
        response = await handleWrongLyricDataIntent(event, lyricist, spotifyApi);
        break;
      default:
        break;
    }

    console.log(`Response: ${JSON.stringify(response)}`);

    return callback(undefined, response);
  } catch (err) {
    console.log(err);

    return callback(err);
  }
}
