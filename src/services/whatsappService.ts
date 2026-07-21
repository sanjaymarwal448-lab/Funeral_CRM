import { ChatMessage, Conversation, WhatsAppSettings, ServiceType } from '../types/crm';

export interface AIResponsePayload {
  messageText: string;
  extractedCaseData?: {
    deceasedName: string;
    placeOfDeath: string;
    contactName: string;
    relationship: string;
    suggestedServiceType: ServiceType;
  };
  requiresHumanHandover: boolean;
}

/**
 * AI Funeral Care Assistant Engine
 * Simulates empathetic AI reasoning for grief support, package guidance, and first call intake.
 */
export const generateAiFuneralResponse = (
  userMessage: string,
  conv: Conversation,
  settings: WhatsAppSettings
): AIResponsePayload => {
  const lowerMsg = userMessage.toLowerCase();

  // 1. Handover detection (Human Director requested)
  if (
    lowerMsg.includes('speak with director') ||
    lowerMsg.includes('human') ||
    lowerMsg.includes('talk to someone') ||
    lowerMsg.includes('marcus') ||
    lowerMsg.includes('elena') ||
    lowerMsg.includes('urgent complaint')
  ) {
    return {
      messageText: `I understand completely. I am transferring this conversation to Senior Funeral Director Marcus Vance right now. He will be in touch with you directly on WhatsApp shortly. Please stay on the line.`,
      requiresHumanHandover: true
    };
  }

  // 2. Emergency First Call Intake (Passing has occurred)
  if (
    lowerMsg.includes('passed away') ||
    lowerMsg.includes('died') ||
    lowerMsg.includes('hospital') ||
    lowerMsg.includes('hospice') ||
    lowerMsg.includes('expired') ||
    lowerMsg.includes('first call')
  ) {
    // Extract name if present
    let deceasedName = 'Deceased Family Member';
    if (lowerMsg.includes('mother') || lowerMsg.includes('mom')) deceasedName = 'Mother';
    else if (lowerMsg.includes('father') || lowerMsg.includes('dad')) deceasedName = 'Father';
    else if (lowerMsg.includes('grandfather') || lowerMsg.includes('grandpa')) deceasedName = 'Grandfather';
    else if (lowerMsg.includes('grandmother') || lowerMsg.includes('grandma')) deceasedName = 'Grandmother';

    let place = 'St. Jude Memorial Hospital, Seattle';
    if (lowerMsg.includes('home')) place = 'Private Residence, Seattle';
    else if (lowerMsg.includes('hospice')) place = 'Evergreen Hospice Center';

    return {
      messageText: `Please accept our deepest condolences during this profound moment. Our directors at Elysium are available 24/7. I have initiated the initial first-call arrangement intake for your ${deceasedName}. Our transfer team is on standby. Could you please share the exact facility or room location so we can arrange transport?`,
      extractedCaseData: {
        deceasedName: `${deceasedName} (Intake)`,
        placeOfDeath: place,
        contactName: conv.familyName.split('(')[1]?.replace(')', '') || conv.familyName,
        relationship: 'Next of Kin',
        suggestedServiceType: lowerMsg.includes('cremation') ? 'Direct Cremation' : 'Traditional Funeral'
      },
      requiresHumanHandover: false
    };
  }

  // 3. Package & Pricing Guidance
  if (
    lowerMsg.includes('cost') ||
    lowerMsg.includes('price') ||
    lowerMsg.includes('package') ||
    lowerMsg.includes('cremation') ||
    lowerMsg.includes('funeral')
  ) {
    if (lowerMsg.includes('cremation')) {
      return {
        messageText: `Our **Direct Cremation Preferred Package** is $3,200 total. It includes professional director oversight, secure transport, dignified cremation in our private suite, and a hand-carved walnut urn. Would you like me to send the complete contract to your email (${conv.familyEmail})?`,
        requiresHumanHandover: false
      };
    }

    return {
      messageText: `Our **Traditional Funeral Service Package** ($8,450 estimated total) includes professional director leadership, embalming & preparation, parlor viewing hours, solid mahogany casket options, and chapel service coordination with hearse transport. We also offer Direct Cremation ($3,200) and Celebration of Life ($6,100).`,
      requiresHumanHandover: false
    };
  }

  // 4. Obituary or Document Approval
  if (lowerMsg.includes('obituary') || lowerMsg.includes('approve') || lowerMsg.includes('certificate')) {
    return {
      messageText: `Thank you for confirming the obituary copy! I have recorded your approval in the case file. Our publishing team will submit it to the Seattle Times for morning release.`,
      requiresHumanHandover: false
    };
  }

  // Default empathetic response
  return {
    messageText: `Thank you for reaching out to Elysium Funeral Directors. We are here to support your family every step of the way. How can I best assist you with your arrangement planning today?`,
    requiresHumanHandover: false
  };
};
