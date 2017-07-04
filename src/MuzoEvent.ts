export interface GetSuggestionsIntent {
  name: 'GetSuggestions';
  slots: {
    Tracks: string;
    Genres: string;
    Artists: string;
  };
}

export interface GetLyricDataIntent {
  name: 'GetLyricData';
  slots: {
    lyric: string;
  };
}

interface MuzoLexEvent {
  currentIntent: GetSuggestionsIntent | GetLyricDataIntent;
  inputTranscript: string;
}

export default MuzoLexEvent;
