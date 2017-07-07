import MuzoEvent from '../MuzoEvent';
import MuzoResponse from '../MuzoResponse';

// TODO: Handle expired session
export default async function wrongLyricDataHandler(
  event: MuzoEvent,
  lyricist: any,
  spotifyApi: any,
): Promise<MuzoResponse> {
  console.log('wrongLyricDataHandler');
  
  if (event.invocationSource === 'DialogCodeHook') {
    const currentLyricDataGeniusSongs: any[] = event.sessionAttributes.currentLyricDataGeniusSongs ?
      JSON.parse(event.sessionAttributes.currentLyricDataGeniusSongs) :
      [];

    return {
      dialogAction: {
        type: 'ElicitSlot',
        intentName: 'WrongLyricData',
        message: {
          contentType: 'PlainText',
          content: 'Which song did you want to scope?',
        },
        slots: {
          lyric: null,
        },
        slotToElicit: 'lyric',
        responseCard: {
          contentType: 'application/vnd.amazonaws.card.generic',
          version: 1,
          genericAttachments: [{
            buttons: currentLyricDataGeniusSongs
              .map(song => ({
                text: `${song.primary_artist.name} - ${song.title}`.substring(0, 80),
                value: `${song.id}`,
              })),
          }],
        },
      },
    };
  } else {
    // TODO: Return the same data as getLyricDataHandler

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
}

