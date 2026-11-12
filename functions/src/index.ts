import { onUserCreated } from "firebase-functions/v2/auth";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Initialize the Firebase Admin SDK
admin.initializeApp();

/**
 * Custom email template styling - Sleek Cosmic Dark & Cyan Portfolio Theme
 */
function generateEmailHtml(displayName: string, email: string, provider: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for connecting!</title>
      <style>
        body {
          background-color: #020617;
          color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          margin: 0;
          padding: 24px;
        }
        .container {
          background-color: #0b1329;
          border: 1px solid #1e293b;
          border-radius: 16px;
          margin: 0 auto;
          max-width: 580px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }
        .banner {
          background: linear-gradient(135deg, #06b6d4 0%, #1e40af 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .banner h1 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          padding: 32px 24px;
          line-height: 1.6;
        }
        .accent-text {
          color: #22d3ee;
          font-weight: 600;
        }
        h2 {
          color: #ffffff;
          font-size: 18px;
          margin-top: 0;
        }
        p {
          color: #cbd5e1;
          font-size: 14px;
        }
        .metadata-box {
          background-color: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
        .metadata-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          border-bottom: 1px dashed #334155;
          padding: 6px 0;
        }
        .metadata-row:last-child {
          border-bottom: none;
        }
        .metadata-label {
          color: #94a3b8;
          font-family: monospace;
          text-transform: uppercase;
        }
        .metadata-value {
          color: #38bdf8;
          font-weight: bold;
        }
        .cta-btn {
          background-color: #06b6d4;
          border: none;
          border-radius: 8px;
          color: #ffffff !important;
          display: inline-block;
          font-size: 13px;
          font-weight: bold;
          padding: 12px 24px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 16px;
          text-align: center;
        }
        .footer {
          border-top: 1px solid #1e293b;
          padding: 24px;
          text-align: center;
          background-color: #030712;
        }
        .footer p {
          color: #64748b;
          font-size: 11px;
          margin: 0 0 8px 0;
        }
        .footer-logo {
          color: #06b6d4;
          font-family: monospace;
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 1.5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="banner">
          <h1>Connection Secured</h1>
        </div>
        <div class="content">
          <h2>Hello ${displayName || "Verified Visitor"},</h2>
          <p>
            Thank you for connecting with Ganesh Enyaram's portfolio network via your verified credentials. 
            We have securely registered your connection credentials in our records.
          </p>
          <p>
            This automated email confirms that your single-sign-on (SSO) authentication handshake completed successfully. 
            You now have access to Ganesh's full communication suite.
          </p>

          <div class="metadata-box">
            <div class="metadata-row">
              <span class="metadata-label">Security Protocol:</span>
              <span class="metadata-value">OAuth 2.0 Integration</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">SSO Provider:</span>
              <span class="metadata-value" style="color: #a855f7;">${provider}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Registered Email:</span>
              <span class="metadata-value">${email}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Status Room:</span>
              <span class="metadata-value" style="color: #22c55e;">ARMED & OK</span>
            </div>
          </div>

          <p>
            If you'd like to schedule a direct live meeting or request custom AI engineering collaborations, please feel free to click the scheduling route below.
          </p>

          <div style="text-align: center;">
            <a href="https://calendly.com/ganesh-enyaram" class="cta-btn">Book Sandbox Meeting</a>
          </div>
        </div>
        <div class="footer">
          <p>This is a secure automated mailing dispatched by Ganesh's personal AI Agent network.</p>
          <p>&copy; ${new Date().getFullYear()} Ganesh Enyaram Portal. Hyderabad, India.</p>
          <div class="footer-logo">SECURE GRID INTERFACE ● LIVE</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Firebase Cloud Function triggered when a new user account is successfully created.
 * Specifically checks for OAuth provider registrations.
 */
export const onUserRegistrationEmailDispatcher = onUserCreated({
  secrets: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"], // Support secure storage references if defined
}, async (event) => {
  const user = event.data;

  if (!user) {
    logger.error("No user payload found in event context.");
    return;
  }

  const email = user.email;
  const displayName = user.displayName || user.email?.split("@")[0] || "Verified Professional";

  if (!email) {
    logger.warn(`User ${user.uid} registered without an email coordinate. Skipping email notification.`);
    return;
  }

  // Detect OAuth providers (e.g. google.com, github.com)
  const oauthProviders = ["google.com", "github.com", "microsoft.com", "apple.com", "facebook.com", "twitter.com"];
  const providerIds = user.providerData?.map(prov => prov.providerId) || [];
  
  // Also check auth factor type in case providerData array is clean during immediate creation
  const isOAuthRegistration = providerIds.some(providerId => oauthProviders.includes(providerId)) || 
                             providerIds.length > 0;

  logger.info(`Processing User Create Event for UID: ${user.uid}`, {
    email,
    displayName,
    providerIds,
    isOAuthRegistration
  });

  // If not OAuth provider (like custom standard email/password), the user gets standard OTP,
  // we strictly trigger this "connection thank you" on successful OAuth-based registration.
  if (!isOAuthRegistration) {
    logger.info(`User ${user.uid} registered using standard credentials (non-OAuth). Skipping automated thank you email.`);
    return;
  }

  const activeProvider = providerIds.find(p => oauthProviders.includes(p)) || "OAuth SSO Provider";
  const emailHtml = generateEmailHtml(displayName, email, activeProvider);

  // Setup transporter. Read from Config / Environment Variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      logger.info(`Initializing secure nodemailer SMTP transport to ${smtpHost}:${smtpPort}`);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"Ganesh Enyaram Portfolio AI" <${smtpUser}>`,
        to: email,
        subject: "Thank you for connecting with my professional network!",
        html: emailHtml
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email successfully dispatched via SMTP! MessageID: ${info.messageId}`);
    } catch (sendError: any) {
      logger.error("Failed to transmit email package via SMTP endpoint:", sendError);
    }
  } else {
    // Elegant fallback simulation log inside standard cloud logs (perfect for sandbox testing)
    logger.info(`
============================================================
[SIMULATED SOUND OUTBOUND EMAIL] No SMTP configurations set in Cloud Function Secrets. 
Dispatching to logging grid for security compliance audit:
------------------------------------------------------------
RECIPIENT: ${email}
SUBJECT: Thank you for connecting with my professional network!
METADATA: Triggered successful OAuth signup [${activeProvider}]
------------------------------------------------------------
EMAIL HTML OUTPUT BODY:
${emailHtml}
============================================================
    `);
  }
});
