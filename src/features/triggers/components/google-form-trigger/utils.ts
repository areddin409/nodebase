/**
 * Google Form Trigger Script Generator
 *
 * Generates a Google Apps Script that can be attached to Google Forms to send
 * form submissions to NodeBase webhook endpoints for workflow automation.
 *
 * Security Note: The webhook URL is properly escaped using JSON.stringify()
 * to prevent code injection vulnerabilities when embedding user-provided URLs
 * into the generated JavaScript code.
 */

/**
 * Generates a secure Google Apps Script for form submission webhooks.
 *
 * This function creates a JavaScript function that can be deployed as a
 * Google Apps Script trigger. When attached to a Google Form, it will
 * automatically send form submissions to the specified webhook URL.
 *
 * @param webhookUrl - The NodeBase webhook endpoint URL (properly escaped in output)
 * @returns Generated Google Apps Script code as a string
 *
 * @security The webhook URL is serialized using JSON.stringify() to prevent:
 * - Quote injection attacks (URLs containing single/double quotes)
 * - Code injection vulnerabilities (malicious JavaScript in URLs)
 * - Template injection through unsafe string interpolation
 *
 * @example
 * ```typescript
 * const script = generateGoogleFormScript('https://app.nodebase.com/webhook/abc123');
 * // Generates: var WEBHOOK_URL = "https://app.nodebase.com/webhook/abc123";
 *
 * const unsafeUrl = `'; alert('XSS'); var x='`;
 * const safeScript = generateGoogleFormScript(unsafeUrl);
 * // Generates: var WEBHOOK_URL = "'; alert('XSS'); var x='";
 * // The quotes are properly escaped, preventing code injection
 * ```
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
