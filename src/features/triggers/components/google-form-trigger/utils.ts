/**
 * Google Form Trigger Script Generator
 *
 * Generates Google Apps Script code for sending form submissions to NodeBase webhooks.
 * URLs are properly escaped with JSON.stringify() to prevent code injection.
 *
 * @param webhookUrl - NodeBase webhook endpoint URL
 * @returns Google Apps Script code as string
 *
 * @example
 * const script = generateGoogleFormScript('https://app.nodebase.com/webhook/abc123');
 */
export const generateGoogleFormScript = (
  webhookUrl: string
) => `function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  // Build responses object
  var responses = {};
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  }

  // Prepare webhook payload
  var payload = {
    formId: e.source.getId(),
    formTitle: e.source.getTitle(),
    responseId: formResponse.getId(),
    timestamp: formResponse.getTimestamp(),
    respondentEmail: formResponse.getRespondentEmail(),
    responses: responses
  };

  // Send to webhook
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  var WEBHOOK_URL = ${JSON.stringify(webhookUrl)};

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
  } catch(error) {
    console.error('Webhook failed:', error);
  }
}`;
