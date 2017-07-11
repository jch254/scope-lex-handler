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
    dialogAction: {
      type: 'ElicitIntent',
      message: {
        contentType: 'PlainText',
        content: `Kia ora and hello!

Scope is a bot that identifies songs from lyrics/titles.

It's easy to scope a song, just send the word 'scope' followed by the lyric or title you're looking for. \
Scope will reply with details of the closest match. For example, scope I got the digital dash.

If Scope matches the wrong song, simply reply with the word 'wrong' to select the right song.`,
      },
    },
  };
}

