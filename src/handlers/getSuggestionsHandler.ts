import LexEvent from '../LexEvent';
import LexResponse from '../LexResponse';

export interface GetSuggestionsSlots {
  song: string | null;
  genre: string | null;
  artist: string | null;
}

export interface GetSuggestionsIntent {
  name: 'GetSuggestions';
  slots: GetSuggestionsSlots;
}

// TODO: Get song, genre and artist ids via Spotify API after each response from user and store in sessionAttributes
// TODO: Send getRecommendations request to Spotify API using song, genre and artist ids
// TODO: Refine min_popularity
export default async function getSuggestionsHandler(
  event: LexEvent,
  lyricist: any,
  spotifyApi: any,
): Promise<LexResponse> {
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
        content: 'Coming soon!',
      },
    },
  };
}
