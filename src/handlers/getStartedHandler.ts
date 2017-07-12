import LexEvent from '../LexEvent';
import LexResponse from '../LexResponse';

export interface GetStartedSlots {}

export interface GetStartedIntent {
  name: 'GetStarted';
  slots: GetStartedSlots;
}

export default async function getStartedHandler(event: LexEvent): Promise<LexResponse> {
  console.log('getStartedHandler');
  
  return {
    sessionAttributes: {},
    dialogAction: {
      type: 'ElicitIntent',
      message: {
        contentType: 'PlainText',
        content: `Kia ora and hello!

Scope is a bot that identifies songs from lyrics/titles.

It's easy to scope a song - just send the word 'scope' followed by the lyric or title you're looking for. \
Scope will reply with details of the closest match.

If Scope matches the wrong song, simply reply with the word 'wrong' to select from the next ten matches.`,
      },
      responseCard: {
        contentType: 'application/vnd.amazonaws.card.generic',
        version: 1,
        genericAttachments: [{
          title: 'Example',
          subTitle: 'Press the button below to try out Scope',
          imageUrl: 'https://img.jch254.com/Scope.jpg',
          buttons: [{
            text: 'Scope waves',
            value: `Scope waves`,
          }],
        }],
      },
    },
  };
}

