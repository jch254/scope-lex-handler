/// <reference path="globals.d.ts" />
import { Callback, Context } from 'aws-lambda';
import * as Lyricist from 'lyricist';
import * as SpotifyWebApi from 'spotify-web-api-node';

import handleGetLyricDataIntent from './handlers/getLyricDataHandler';
import handleGetStarted from './handlers/getStartedHandler';
import handleWrongLyricDataIntent from './handlers/wrongLyricDataHandler';
import { getUserProfile } from './utils';
import LexEvent from './LexEvent';

const lyricist = new Lyricist(process.env.GENIUS_ACCESS_TOKEN);
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// TODO: Create @types/lyricist and @types/spotify-web-api-node
export async function handler(event: LexEvent, context: Context, callback: Callback) {
  try {
    console.log(`Event: ${JSON.stringify(event)}`);

    const userProfile = await getUserProfile(event.userId, event.bot);

    let response = {};
    switch (event.currentIntent.name) {
      case 'GetStarted':
        response = await handleGetStarted(event, userProfile);
        break;
      case 'GetLyricData':
        response = await handleGetLyricDataIntent(event, userProfile, lyricist, spotifyApi);
        break;
      case 'WrongLyricData':
        response = await handleWrongLyricDataIntent(event, userProfile);
        break;
      default:
        break;
    }

    console.log(`Response: ${JSON.stringify(response)}`);

    return callback(undefined, response);
  } catch (err) {
    console.log(err);

    const errorResponse = {
      sessionAttributes: {},
      dialogAction: {
        type: 'Close',
        fulfillmentState: 'Failed',
        message: {
          contentType: 'PlainText',
          content: 'Damn! Scope is having trouble right now... Try scope another lyric or title or come back later.',
        },
      },
    };

    return callback(undefined, errorResponse);
  }
}
