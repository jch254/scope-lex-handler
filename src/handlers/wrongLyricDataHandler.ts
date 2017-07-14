import LexEvent from '../LexEvent';
import LexResponse from '../LexResponse';
import UserProfile from '../UserProfile';

export interface WrongLyricDataSlots {}

export interface WrongLyricDataIntent {
  name: 'WrongLyricData';
  slots: WrongLyricDataSlots;
}

export default async function wrongLyricDataHandler(event: LexEvent, userProfile: UserProfile): Promise<LexResponse> {
  console.log('wrongLyricDataHandler');
  
  const currentGeniusMatches: any[] = event.sessionAttributes.currentGeniusMatches !== undefined ?
    JSON.parse(event.sessionAttributes.currentGeniusMatches) :
    [];

  if (currentGeniusMatches.length === 0) {
    return {
      sessionAttributes: {},
      dialogAction: {
        type: 'ElicitIntent',
        message: {
          contentType: 'PlainText',
          content: `Nothing appears to be wrong ${userProfile.first_name}... \
Try scope another lyric or title. Please note that the 'wrong' command can only be used once per scope.`,
        },
      },
    };
  } else {
    return {
      sessionAttributes: {},
      dialogAction: {
        type: 'ElicitIntent',
        message: {
          contentType: 'PlainText',
          content: 'Scope a song from the matches below...',
        },
        responseCard: {
          contentType: 'application/vnd.amazonaws.card.generic',
          version: 1,
          genericAttachments: currentGeniusMatches
            .map(song => ({
              title: song.titleWithFeatured,
              subTitle: song.artistName,
              imageUrl: song.imageUrl,
              attachmentLinkUrl: song.url,
              buttons: [{
                text: 'Scope it!',
                value: `Exact ${song.id}`,
              }],
            })),
        },
      },
    };
  }
}
