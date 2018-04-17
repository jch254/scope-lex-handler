import { Context } from 'aws-lambda';
import * as uuidv4 from 'uuid/v4';

import { handler } from './index';

handler(
  {
    currentIntent: {
      name: 'GetLyricData',
      slots: {
        lyric: 'do you fools listen to music or do you just skim through it',
        geniusSongId: null,
      },
    },
    invocationSource: 'DialogCodeHook',
    sessionAttributes: {},
    inputTranscript: 'scope do you fools listen to music or do you just skim through it',
    userId: uuidv4(),
    bot: {
      name: 'scope',
      alias: 'test',
      version: '$LATEST',
    },
  },
  { awsRequestId: uuidv4() } as Context,
  () => {},
);
