import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist/node6';
import * as SpotifyWebApi from 'spotify-web-api-node';

import handleGetLyricDataIntent from './handlers/getLyricDataHandler';
import handleGetStarted from './handlers/getStartedHandler';
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
  try {
    console.log(`Event: ${JSON.stringify(event)}`);

    let response = {};

    switch (event.currentIntent.name) {
      case 'GetStarted':
        response = await handleGetStarted(event);
        break;
      case 'GetLyricData':
        response = await handleGetLyricDataIntent(event, lyricist, spotifyApi);
        break;
      case 'WrongLyricData':
        response = await handleWrongLyricDataIntent(event);
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
