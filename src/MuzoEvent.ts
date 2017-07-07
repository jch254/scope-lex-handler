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

export interface GetLyricDataSlots {
  lyric: string | null;
}

export interface GetLyricDataIntent {
  name: 'GetLyricData';
  slots: GetLyricDataSlots;
}

export interface WrongLyricDataSlots {
  songId: string | null;
}

export interface WrongLyricDataIntent {
  name: 'WrongLyricData';
  slots: WrongLyricDataSlots;
}

interface MuzoEvent {
  currentIntent: GetSuggestionsIntent | GetLyricDataIntent | WrongLyricDataIntent;
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
