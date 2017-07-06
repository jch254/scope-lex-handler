import MuzoEvent from '../MuzoEvent';
import MuzoResponse from '../MuzoResponse';

// TODO: Grab currentScopeLyricGeniusSongs from sessionAttributes
// TODO: Return responseCard with buttons to select one of the first five currentScopeLyricGeniusSongs
// TODO: Return the same data as scopeLyricHandler after song selected
export default async function wrongLyricHandler(
  event: MuzoEvent,
  lyricist: any,
  spotifyApi: any,
): Promise<MuzoResponse> {
  console.log('wrongLyricHandler');

  return {
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message: {
        contentType: 'PlainText',
        content: 'Coming soon!',
      },
    },
  };
}

