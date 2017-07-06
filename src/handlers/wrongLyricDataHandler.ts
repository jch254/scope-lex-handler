import MuzoEvent from '../MuzoEvent';
import MuzoResponse from '../MuzoResponse';

// TODO: Grab currentLyricDataGeniusSongs from sessionAttributes
// TODO: Return responseCard with buttons to select one of the first five currentLyricDataGeniusSongs
// TODO: Return the same data as getLyricDataHandler after song selected
export default async function wrongLyricDataHandler(
  event: MuzoEvent,
  lyricist: any,
  spotifyApi: any,
): Promise<MuzoResponse> {
  console.log('wrongLyricDataHandler');

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

