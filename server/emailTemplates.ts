import { IParticipant } from './types.js';

/**
 * Generates Participant Confirmation Email (HTML & Plain Text)
 * Adheres strictly to Section 7: table-based 600px inline styles, Outlook-safe.
 */
export function generateParticipantEmail(participant: IParticipant, baseUrl: string = ''): { subject: string; html: string; text: string } {
  const firstName = participant.fullName.trim().split(' ')[0] || 'Applicant';
  const subject = 'Your application has been received — EnterpriseCEO Media Owners & Executives Masterclass';

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: 'Plus Jakarta Sans', Arial, Helvetica, sans-serif; color: #111827;">
  <!-- Preheader text -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    Your application for the EnterpriseCEO Media Owners &amp; Executives Masterclass has been received by the admissions committee.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #F3F4F6; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container (600px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td align="left" style="background-color: #0B132B; padding: 28px 32px; border-top: 6px solid #F97316;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #F97316; margin-bottom: 4px;">
                      ENTERPRISECEO LEADERSHIP INITIATIVE
                    </div>
                    <div style="font-size: 20px; font-weight: 700; color: #FFFFFF; line-height: 1.3;">
                      Media Owners &amp; Executives Masterclass
                    </div>
                    <div style="font-size: 13px; color: #E0E7FF; margin-top: 6px;">
                      21–22 October 2026
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #1F2937;">
              <p style="margin: 0 0 16px 0; font-size: 17px; font-weight: 600; color: #0B132B;">
                Dear ${firstName},
              </p>
              
              <p style="margin: 0 0 18px 0;">
                Thank you for applying to attend the <strong>EnterpriseCEO Media Owners &amp; Executives Masterclass</strong> (21–22 October 2026).
              </p>

              <!-- Notice Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF7ED; border-left: 4px solid #F97316; border-radius: 4px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 14px; line-height: 1.5; color: #9A3412;">
                    <strong>Admissions Notice:</strong> Participation is strictly by invitation and selective registration, limited to a curated executive class of <strong>30 senior media leaders</strong>. Our admissions committee reviews each executive application to ensure a high-calibre peer network.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0;">
                Our committee is currently reviewing your submission. You will receive an official notification regarding your admission and seat confirmation within <strong>48 hours</strong>.
              </p>

              <!-- Programme Focus Brief -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; margin: 24px 0; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B132B; margin-bottom: 8px;">
                      Programme Focus
                    </div>
                    <div style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                      A strategic intensive designed to build scalable and resilient media enterprises, develop strong personal and institutional brands, design sustainable revenue systems, lead high-performance media organisations, and navigate economic and digital disruptions.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Application Summary -->
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0B132B; margin: 28px 0 10px 0;">
                Summary of Submitted Details
              </div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280; width: 38%;">Full Name:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600;">${participant.fullName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Email Address:</td>
                  <td style="padding: 8px 0; color: #111827;">${participant.email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #111827;">${participant.phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Organization/ Media House:</td>
                  <td style="padding: 8px 0; color: #111827;">${participant.organisation || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Current Position/ Designation:</td>
                  <td style="padding: 8px 0; color: #111827;">${participant.jobTitle || participant.position || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Category:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600;">${participant.category || participant.organisationType || 'N/A'}${participant.otherCategory ? ` (${participant.otherCategory})` : ''}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Years of Experience:</td>
                  <td style="padding: 8px 0; color: #111827;">${participant.yearsExperience || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Strategic Gain / Objectives:</td>
                  <td style="padding: 8px 0; color: #111827;">${participant.goals || participant.notes || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 8px 0; color: #6B7280;">Paid Event Acknowledgment:</td>
                  <td style="padding: 8px 0; color: #047857; font-weight: 700;">Yes (Confirmed)</td>
                </tr>
              </table>

              <p style="margin: 0 0 20px 0; font-size: 14px; color: #4B5563;">
                If you have urgent inquiries, you can reach out to our masterclass secretariat at <a href="mailto:hello@enterpriseceo.africa" style="color: #F97316; text-decoration: none; font-weight: 600;">hello@enterpriseceo.africa</a>.
              </p>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #1F2937;">
                Warm regards,<br />
                <strong>The EnterpriseCEO Admissions Committee</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #F9FAFB; border-top: 1px solid #E5E7EB; padding: 24px 32px; font-size: 12px; color: #6B7280; line-height: 1.5;">
              <div style="font-weight: 700; color: #0B132B; margin-bottom: 4px;">
                EnterpriseCEO Media Leadership Initiative
              </div>
              <div>
                Lagos, Nigeria &bull; <a href="mailto:hello@enterpriseceo.africa" style="color: #6B7280; text-decoration: underline;">hello@enterpriseceo.africa</a>
              </div>
              <div style="margin-top: 8px; font-size: 11px; color: #9CA3AF;">
                This email was sent in response to your application submitted on mmc.enterpriseceo.africa.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
EnterpriseCEO Media Owners & Executives Masterclass
21–22 October 2026

Dear ${firstName},

Thank you for applying to attend the EnterpriseCEO Media Owners & Executives Masterclass (21–22 October 2026).

Admissions Notice:
Participation is strictly by invitation and selective registration, limited to a curated executive class of 50 senior media leaders. Our admissions committee reviews each executive application to ensure a high-calibre peer network.

Our committee is currently reviewing your submission. You will receive an official notification regarding your admission and seat confirmation within 48 hours.

Submitted details:
- Full Name: ${participant.fullName}
- Job Title: ${participant.jobTitle}
- Organisation: ${participant.organisation} (${participant.organisationType}${participant.otherOrgType ? ` - ${participant.otherOrgType}` : ''})

If you have urgent inquiries, you can reach out to our masterclass secretariat at hello@enterpriseceo.africa or call +234 (0) 706 173 7282 | +234 (0) 906 791 5609.

Warm regards,
The EnterpriseCEO Admissions Committee
Lagos, Nigeria
  `.trim();

  return { subject, html, text };
}

/**
 * Generates Admin Notification Email (HTML & Plain Text)
 * Adheres strictly to Section 7: all submitted fields in a readable layout + direct link to dashboard
 */
export function generateAdminNotificationEmail(participant: IParticipant, dashboardUrl: string = ''): { subject: string; html: string; text: string } {
  const subject = `New Masterclass Application: ${participant.fullName} — ${participant.organisation}`;
  const directLink = dashboardUrl ? `${dashboardUrl}?id=${participant.id}` : '#';

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: 'Plus Jakarta Sans', Arial, Helvetica, sans-serif; color: #111827;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    New application received from ${participant.fullName} (${participant.organisation}).
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #F3F4F6; padding: 24px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #0B132B; padding: 24px 30px; border-top: 5px solid #F97316;">
              <span style="font-size: 11px; font-weight: 700; color: #F97316; letter-spacing: 0.12em; text-transform: uppercase;">
                ADMIN ALERT &bull; NEW SUBMISSION
              </span>
              <h2 style="font-size: 19px; color: #FFFFFF; margin: 4px 0 0 0;">
                ${participant.fullName}
              </h2>
              <div style="font-size: 13px; color: #CBD5E1; margin-top: 2px;">
                ${participant.jobTitle}, ${participant.organisation}
              </div>
            </td>
          </tr>

          <!-- Table of fields -->
          <tr>
            <td style="padding: 28px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; width: 35%; font-weight: 600;">Status</td>
                  <td style="padding: 10px 0;">
                    <span style="background-color: #FEF3C7; color: #92400E; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; text-transform: uppercase;">
                      ${participant.status}
                    </span>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Email Address</td>
                  <td style="padding: 10px 0; color: #111827;"><a href="mailto:${participant.email}" style="color: #F97316; text-decoration: none;">${participant.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Phone Number</td>
                  <td style="padding: 10px 0; color: #111827;">${participant.phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Organization/ Media House</td>
                  <td style="padding: 10px 0; color: #111827;">${participant.organisation || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Current Position/ Designation</td>
                  <td style="padding: 10px 0; color: #111827;">${participant.jobTitle || participant.position || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Category Description</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 600;">${participant.category || participant.organisationType || 'N/A'}${participant.otherCategory ? ` (${participant.otherCategory})` : ''}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Years of Media Experience</td>
                  <td style="padding: 10px 0; color: #111827;">${participant.yearsExperience || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600; vertical-align: top;">What they hope to gain</td>
                  <td style="padding: 10px 0; color: #111827; background-color: #F9FAFB; padding: 8px 10px; border-radius: 4px;">${participant.goals || participant.notes || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #F3F4F6;">
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Paid Event Acknowledgment</td>
                  <td style="padding: 10px 0; color: #047857; font-weight: 700;">Yes (Confirmed)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6B7280; font-weight: 600;">Submitted At</td>
                  <td style="padding: 10px 0; color: #4B5563;">${new Date(participant.createdAt).toUTCString()}</td>
                </tr>
              </table>

              <!-- Button to Admin Dashboard -->
              <div style="margin-top: 28px; text-align: center;">
                <a href="${directLink}" style="background-color: #F97316; color: #FFFFFF; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                  Open Participant in Admin Dashboard &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; border-top: 1px solid #E5E7EB; padding: 16px 30px; font-size: 11px; color: #9CA3AF; text-align: center;">
              EnterpriseCEO Masterclass Internal Notification System &bull; Confidential
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
NEW MASTERCLASS APPLICATION: ${participant.fullName} — ${participant.organisation || 'Independent'}

Status: ${participant.status}
Full Name: ${participant.fullName}
Email Address: ${participant.email}
Phone Number: ${participant.phone}
Organization/ Media House: ${participant.organisation || 'N/A'}
Current Position/ Designation: ${participant.jobTitle || participant.position || 'N/A'}
Which Category Best Describes You: ${participant.category || participant.organisationType || 'N/A'}${participant.otherCategory ? ` (${participant.otherCategory})` : ''}
Years of Media Experience: ${participant.yearsExperience || 'N/A'}
What they hope to gain: ${participant.goals || participant.notes || 'N/A'}
Paid Event Acknowledgment: Yes (Confirmed)
Submitted: ${new Date(participant.createdAt).toUTCString()}

Dashboard Link: ${directLink}
  `.trim();

  return { subject, html, text };
}
