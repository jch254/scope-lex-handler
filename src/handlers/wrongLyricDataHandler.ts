import MuzoEvent, { WrongLyricDataIntent } from '../MuzoEvent';
import MuzoResponse from '../MuzoResponse';

// TODO: Handle expired session
export default async function wrongLyricDataHandler(
  event: MuzoEvent,
  lyricist: any,
  spotifyApi: any,
): Promise<MuzoResponse> {
  console.log('wrongLyricDataHandler');
  
  if (
    event.invocationSource === 'DialogCodeHook' &&
    (event.currentIntent as WrongLyricDataIntent).slots.songId === null
  ) {
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
          songId: null,
        },
        slotToElicit: 'songId',
        responseCard: {
          contentType: 'application/vnd.amazonaws.card.generic',
          version: 1,
          genericAttachments: currentLyricDataGeniusSongs
            .map(song => ({
              title: song.title_with_featured.substring(0, 80),
              subTitle: song.primary_artist.name.substring(0, 80),
              imageUrl: song.song_art_image_url,
              buttons: [{
                text: 'Scope this song!',
                value: `${song.id}`,
              }],
            })),
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

