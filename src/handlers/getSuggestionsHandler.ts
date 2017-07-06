import MuzoEvent from '../MuzoEvent';
import MuzoResponse from '../MuzoResponse';

// TODO: Get track, genre and artist ids via Spotify API after each response from user and store in sessionAttributes
// TODO: Send getRecommendations request to Spotify API using track, genre and artist ids
// TODO: Refine min_popularity
export default async function getSuggestionsHandler(
  event: MuzoEvent,
  lyricist: any,
  spotifyApi: any,
): Promise<MuzoResponse> {
  console.log('getSuggestionsHandler');

  // const recommendations = await spotifyApi.getRecommendations({
  //   seed_tracks: [''],
  //   seed_genres: [''],
  //   seed_artists: [''],
  //   min_popularity: 50,
  // });

  return {
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message: {
        contentType: 'PlainText',
        content: JSON.stringify('Coming soon!'),
      },
    },
  };
}

