import { GetLyricDataIntent } from './handlers/getLyricDataHandler';
import { GetStartedIntent } from './handlers/getStartedHandler';
import { WrongLyricDataIntent } from './handlers/wrongLyricDataHandler';
import SessionAttributes from './SessionAttributes';

export interface LexBot {
  name: string;
  alias: string;
  version: string;
}

interface LexEvent {
  currentIntent: GetStartedIntent | GetLyricDataIntent | WrongLyricDataIntent;
  invocationSource: 'DialogCodeHook' | 'FulfillmentCodeHook';
  sessionAttributes: SessionAttributes;
  inputTranscript: string;
  userId: string;
  bot: LexBot;
}

export default LexEvent;
