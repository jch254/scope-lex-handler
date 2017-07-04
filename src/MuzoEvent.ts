export interface GetSuggestionsIntent {
  name: 'GetSuggestions';
  slots: {
    track: string;
    genre: string;
    artist: string;
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
}

export default MuzoLexEvent;
