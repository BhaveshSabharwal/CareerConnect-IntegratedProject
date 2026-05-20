const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Beautiful email logger using mock/json transport of nodemailer
const logFilePath = path.join(__dirname, '../logs/emails.log');

// Ensure log directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Setup a JSON transport nodemailer transporter for local verification
const transporter = nodemailer.createTransport({
  jsonTransport: true
});

/**
 * Sends a highly styled email (mocked) and logs details to server/logs/emails.log
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email content in HTML format
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Career Connect" <notifications@careerconnect.com>',
      to,
      subject,
      html,
    });

    const timestamp = new Date().toISOString();
    const logEntry = `
========================================================================
[EMAIL SENT] - ${timestamp}
------------------------------------------------------------------------
To: ${to}
Subject: ${subject}
Message JSON: ${info.message}
------------------------------------------------------------------------
Body Preview:
${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)}...
========================================================================
`;

    // Append to file
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
    console.log(`[Email Mock Transporter] logged email to ${to} for testing.`);
    return true;
  } catch (error) {
    console.error('Error logging mock email:', error);
    return false;
  }
};

module.exports = { sendEmail };
