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
