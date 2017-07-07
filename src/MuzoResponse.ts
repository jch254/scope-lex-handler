import { GetLyricDataSlots, GetSuggestionsSlots, WrongLyricDataSlots } from './MuzoEvent';
import MuzoSessionAttributes from './MuzoSessionAttributes';

interface Button {
  text: string;
  value: string;
}

interface GenericAttachment {
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  attachmentLinkUrl?: string;
  buttons?: Button[];
}

interface DialogAction {
  type: 'Delegate' | 'Close' | 'ConfirmIntent' | 'ElicitSlot' | 'ElicitIntent';
  slots?: GetSuggestionsSlots | GetLyricDataSlots | WrongLyricDataSlots;
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

interface MuzoResponse {
  sessionAttributes?: MuzoSessionAttributes;
  dialogAction: DialogAction;
}

export default MuzoResponse;
