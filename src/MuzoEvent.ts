import MuzoSessionAttributes from './MuzoSessionAttributes';

export interface GetSuggestionsSlots {
  track: string | null;
  genre: string | null;
  artist: string | null;
}

export interface GetSuggestionsIntent {
  name: 'GetSuggestions';
  slots: GetSuggestionsSlots;
}

export interface ScopeLyricSlots {
  lyric: string | null;
}

export interface ScopeLyricIntent {
  name: 'ScopeLyric';
  slots: ScopeLyricSlots;
}

export interface WrongLyricSlots {
  lyric: string | null;
}

export interface WrongLyricIntent {
  name: 'WrongLyric';
  slots: WrongLyricIntent;
}

interface MuzoEvent {
  currentIntent: GetSuggestionsIntent | ScopeLyricIntent | WrongLyricIntent;
  invocationSource: 'DialogCodeHook' | 'FulfillmentCodeHook';
  sessionAttributes: MuzoSessionAttributes;
  inputTranscript: string;
  userId: string;

  bot: {
    name: string;
    alias: string;
    version: string;
  };
}

export default MuzoEvent;
