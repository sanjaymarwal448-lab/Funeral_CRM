import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Only allow POST requests from Twilio
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Parse URL-encoded body from Twilio
    const params = new URLSearchParams(event.body || '');
    const incomingMessage = params.get('Body') || '';
    const fromNumber = params.get('From') || '';

    console.log(`Received SMS from ${fromNumber}: "${incomingMessage}"`);

    // Retrieve environment variables
    const apiKey = process.env.OPENAI_API_KEY || '';
    const companyName = process.env.COMPANY_NAME || 'Evergreen Funeral Directors';
    const aiTone = process.env.AI_TONE || 'Empathetic & Dignified';

    let aiReply = '';

    if (apiKey) {
      // Call OpenAI API for a live, real-time response
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an AI Care Assistant representing ${companyName}. Your communication tone is ${aiTone}. Provide an empathetic, professional, and comforting response to the family member who is contacting the funeral home. Keep the response concise, clear, and dignified.`
              },
              {
                role: 'user',
                content: incomingMessage
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });

        const data = await response.json();
        aiReply = data.choices?.[0]?.message?.content || '';
      } catch (err) {
        console.error('OpenAI fetch error, falling back:', err);
      }
    }

    // Dynamic fallback response if API key is not configured
    if (!aiReply) {
      aiReply = `Thank you for contacting ${companyName}. We have received your message: "${incomingMessage.slice(0, 30)}...". A funeral director will review this and contact you shortly. Please accept our deepest condolences.`;
    }

    // Build Twilio XML TwiML Response
    const twiml = `
      <Response>
        <Message>${aiReply}</Message>
      </Response>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
      body: twiml.trim(),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
