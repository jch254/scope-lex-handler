
import { GetLyricDataSlots } from './handlers/getLyricDataHandler';
import { GetStartedSlots } from './handlers/getStartedHandler';
import { WrongLyricDataSlots } from './handlers/wrongLyricDataHandler';
import SessionAttributes from './SessionAttributes';

interface Button {
  text: string;
  value: string;
}

interface GenericAttachment {
  title: string;
  subTitle?: string;
  imageUrl?: string;
  attachmentLinkUrl?: string;
  buttons?: Button[];
}

interface DialogAction {
  type: 'Delegate' | 'Close' | 'ConfirmIntent' | 'ElicitSlot' | 'ElicitIntent';
  slots?: GetStartedSlots | GetLyricDataSlots | WrongLyricDataSlots;
  fulfillmentState?: 'Fulfilled' | 'Failed';
  intentName?: string;
  slotToElicit?: string;
  message?: {
    contentType: 'PlainText';
    content: string;
  };
  responseCard?: {
    version: 1;
    contentType: 'application/vnd.amazonaws.card.generic';
    genericAttachments?: GenericAttachment[];
  };
}

interface LexResponse {
  sessionAttributes?: SessionAttributes;
  dialogAction: DialogAction;
}

export default LexResponse;
