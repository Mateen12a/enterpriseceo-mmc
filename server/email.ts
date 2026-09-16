import { Resend } from 'resend';
import { IParticipant, IEmailLog } from './types.js';
import { generateParticipantEmail, generateAdminNotificationEmail } from './emailTemplates.js';

// In-memory / file persistent email logs for inspection in Admin Dashboard
export const emailLogs: IEmailLog[] = [];

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'MY_RESEND_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return Boolean(apiKey && apiKey !== 'MY_RESEND_API_KEY' && apiKey.trim() !== '');
}

/**
 * Sends both participant confirmation and admin notification in background
 * Does not block registration response.
 */
export async function dispatchApplicationEmails(participant: IParticipant, baseUrl: string = ''): Promise<void> {
  const rawSendingFrom = process.env.SENDING_EMAIL_ADDRESS || 'no-reply@mmc.enterpriseceo.africa';
  const sendingFrom = rawSendingFrom.includes('<') ? rawSendingFrom : `EnterpriseCEO Masterclass <${rawSendingFrom}>`;
  const adminRecipientsStr = process.env.ADMIN_NOTIFICATION_EMAILS || 'ajidagbamateen12@gmail.com';
  const adminRecipients = adminRecipientsStr.split(',').map(e => e.trim()).filter(Boolean);
  const dashboardUrl = `${baseUrl.replace(/\/$/, '')}/admin`;

  // 1. Participant Confirmation
  const participantTemplate = generateParticipantEmail(participant, baseUrl);
  const participantLog: IEmailLog = {
    id: `log-${Date.now()}-part`,
    type: 'participant_confirmation',
    to: participant.email,
    from: sendingFrom,
    subject: participantTemplate.subject,
    status: 'queued',
    html: participantTemplate.html,
    text: participantTemplate.text,
    createdAt: new Date().toISOString(),
  };

  // 2. Admin Notification
  const adminTemplate = generateAdminNotificationEmail(participant, dashboardUrl);
  const adminLog: IEmailLog = {
    id: `log-${Date.now()}-admin`,
    type: 'admin_notification',
    to: adminRecipients.join(', '),
    from: sendingFrom,
    subject: adminTemplate.subject,
    status: 'queued',
    html: adminTemplate.html,
    text: adminTemplate.text,
    createdAt: new Date().toISOString(),
  };

  emailLogs.unshift(participantLog);
  emailLogs.unshift(adminLog);

  // Keep logs at max 100 entries
  if (emailLogs.length > 100) {
    emailLogs.length = 100;
  }

  const resend = getResend();

  // Background dispatch
  (async () => {
    try {
      if (resend) {
        // Send to participant
        try {
          await resend.emails.send({
            from: sendingFrom,
            replyTo: 'hello@enterpriseceo.africa',
            to: participant.email,
            subject: participantTemplate.subject,
            html: participantTemplate.html,
            text: participantTemplate.text,
          });
          participantLog.status = 'sent';
          console.log(`[Email] Participant confirmation sent to ${participant.email}`);
        } catch (err: any) {
          participantLog.status = 'failed';
          participantLog.error = err?.message || 'Resend participant email delivery failure';
          console.error('[Email] Failed sending participant email:', err);
        }

        // Send to admin recipients
        try {
          await resend.emails.send({
            from: sendingFrom,
            to: adminRecipients,
            subject: adminTemplate.subject,
            html: adminTemplate.html,
            text: adminTemplate.text,
          });
          adminLog.status = 'sent';
          console.log(`[Email] Admin notification sent to ${adminRecipients.join(', ')}`);
        } catch (err: any) {
          adminLog.status = 'failed';
          adminLog.error = err?.message || 'Resend admin notification delivery failure';
          console.error('[Email] Failed sending admin email:', err);
        }
      } else {
        // Simulated mode (RESEND_API_KEY not provided)
        participantLog.status = 'simulated';
        adminLog.status = 'simulated';
        console.log(`[Email Simulator] Participant confirmation email prepared for ${participant.email}`);
        console.log(`[Email Simulator] Admin notification email prepared for ${adminRecipients.join(', ')}`);
      }
    } catch (globalErr) {
      console.error('[Email] Background dispatch error:', globalErr);
    }
  })();
}

/**
 * Send a manual test email from the Admin Dashboard
 */
export async function sendTestEmail(toEmail: string): Promise<{ success: boolean; message: string; simulated: boolean }> {
  const rawSendingFrom = process.env.SENDING_EMAIL_ADDRESS || 'no-reply@mmc.enterpriseceo.africa';
  const sendingFrom = rawSendingFrom.includes('<') ? rawSendingFrom : `EnterpriseCEO Masterclass <${rawSendingFrom}>`;
  const dummyParticipant: IParticipant = {
    id: 'test-preview-001',
    fullName: 'Olumide Adewunmi (Sample)',
    jobTitle: 'Chief Executive Officer',
    position: 'Chief Executive Officer',
    organisation: 'Apex Media Network',
    category: 'CEO/ Managing Director',
    yearsExperience: '11-20 Years',
    goals: 'Strengthening media executive leadership, AI workflows, and digital monetisation.',
    paidEventConsent: true,
    organisationType: 'CEO/ Managing Director',
    email: toEmail,
    phone: '+234 809 000 1122',
    country: 'Nigeria',
    howHeard: 'EnterpriseCEO Website/Newsletter',
    notes: 'Strengthening media executive leadership, AI workflows, and digital monetisation.',
    consent: true,
    status: 'pending',
    paymentStatus: 'unpaid',
    adminTags: ['Test Delegate'],
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const template = generateParticipantEmail(dummyParticipant);
  const resend = getResend();

  const logEntry: IEmailLog = {
    id: `log-test-${Date.now()}`,
    type: 'test',
    to: toEmail,
    from: sendingFrom,
    subject: `[TEST] ${template.subject}`,
    status: 'queued',
    html: template.html,
    text: template.text,
    createdAt: new Date().toISOString(),
  };
  emailLogs.unshift(logEntry);

  if (!resend) {
    logEntry.status = 'simulated';
    return {
      success: true,
      simulated: true,
      message: 'Email rendered and logged to dashboard preview (RESEND_API_KEY is not configured yet).',
    };
  }

  try {
    await resend.emails.send({
      from: sendingFrom,
      replyTo: 'hello@enterpriseceo.africa',
      to: toEmail,
      subject: `[TEST] ${template.subject}`,
      html: template.html,
      text: template.text,
    });
    logEntry.status = 'sent';
    return {
      success: true,
      simulated: false,
      message: `Test email successfully dispatched to ${toEmail} via Resend.`,
    };
  } catch (err: any) {
    logEntry.status = 'failed';
    logEntry.error = err?.message || 'Dispatch failed';
    return {
      success: false,
      simulated: false,
      message: `Resend dispatch failed: ${err?.message || 'Unknown error'}`,
    };
  }
}

/**
 * Sends a 6-digit email verification code to the applicant's email address
 */
export async function sendVerificationOtpEmail(toEmail: string, code: string): Promise<boolean> {
  const rawSendingFrom = process.env.SENDING_EMAIL_ADDRESS || 'no-reply@mmc.enterpriseceo.africa';
  const sendingFrom = rawSendingFrom.includes('<') ? rawSendingFrom : `EnterpriseCEO Masterclass <${rawSendingFrom}>`;
  const resend = getResend();

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px 15px; color: #1e293b;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background: #0f172a; padding: 24px 30px; border-bottom: 3px solid #f97316;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #f97316; font-weight: bold;">Executive Admissions Verification</p>
            <h1 style="margin: 6px 0 0 0; font-size: 20px; color: #ffffff; font-weight: 700;">EnterpriseCEO Media Masterclass 2026</h1>
          </div>
          <div style="padding: 30px;">
            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #334155;">
              You are completing an application for the <strong>Media Owners &amp; Senior Executives Masterclass</strong>.
            </p>
            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #334155;">
              Please use the one-time executive security code below to verify your professional email address:
            </p>
            <div style="background: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center; padding: 20px; margin: 24px 0;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">${code}</span>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b;">This code expires in 10 minutes. Do not share this code.</p>
            </div>
            <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
              If you did not initiate this application, you can safely ignore this email.
            </p>
          </div>
          <div style="background: #f8fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
            &copy; 2026 EnterpriseCEO &bull; In Partnership with Pan-Atlantic University
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `EnterpriseCEO Masterclass Email Verification\n\nYour 6-digit verification code is: ${code}\n\nThis code expires in 10 minutes.`;

  if (resend) {
    try {
      await resend.emails.send({
        from: sendingFrom,
        replyTo: 'hello@enterpriseceo.africa',
        to: toEmail,
        subject: `Your Verification Code: ${code} - EnterpriseCEO Masterclass`,
        html,
        text,
      });
      console.log(`[Email] OTP verification code dispatched to ${toEmail}`);
      return true;
    } catch (err) {
      console.error('[Email] Failed to dispatch OTP to', toEmail, err);
      return false;
    }
  } else {
    console.log(`[Email-Simulation] Verification code for ${toEmail}: ${code}`);
    return true;
  }
}

