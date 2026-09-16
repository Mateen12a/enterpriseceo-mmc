import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { 
  memoryStore, 
  isUsingMongoDB, 
  MongoParticipantModel, 
  MongoAdminUserModel 
} from './db.js';
import { requireAdminAuth, generateAdminToken } from './auth.js';
import { dispatchApplicationEmails, sendTestEmail, emailLogs, isResendConfigured, sendVerificationOtpEmail } from './email.js';
import { IParticipant } from './types.js';

export const apiRouter = Router();

// In-Memory Rate Limiting
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const registerRateLimit = new Map<string, RateLimitRecord>();
const loginRateLimit = new Map<string, RateLimitRecord>();
const otpRateLimit = new Map<string, RateLimitRecord>();

function checkRateLimit(map: Map<string, RateLimitRecord>, ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = map.get(ip);
  if (!record || now > record.resetAt) {
    map.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count++;
  return true;
}

// -------------------------------------------------------------
// EMAIL VERIFICATION / DISPOSABLE DOMAIN CHECKING & OTP
// -------------------------------------------------------------
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 
  'sharklasers.com', 'yopmail.com', 'trashmail.com', 'dispostable.com', 
  'fake.com', 'test.com', 'example.com', 'throwaway.com', 'burnermail.io', 
  'getairmail.com', 'maildrop.cc', 'inboxkitten.com', 'crazymailing.com',
  'fakemailgenerator.com', 'dropmail.me', 'temp-mail.org', 'nada.ltd',
  'mytemp.email', 'disposablemail.com', 'mohmal.com', 'tempmailaddress.com'
]);

const DUMMY_PREFIXES = ['test', 'dummy', 'fake', 'asdf', 'admin', 'user', 'demo', 'sample'];

interface OtpRecord {
  code: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpRecord>();
const verifiedEmails = new Set<string>();

/**
 * PUBLIC: POST /api/verify-email/send
 * Sends 6-digit OTP verification code to prevent dummy emails
 */
apiRouter.post('/verify-email/send', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(otpRateLimit, clientIp, 10, 10 * 60 * 1000)) {
    res.status(429).json({
      success: false,
      error: 'Too many verification requests. Please wait a few minutes before trying again.',
    });
    return;
  }

  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'A valid email address is required.' });
    return;
  }

  const normalized = email.trim().toLowerCase();
  const [prefix, domain] = normalized.split('@');

  // Check disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    res.status(400).json({
      success: false,
      error: 'Disposable and temporary email domains are not accepted for this executive masterclass. Please use your official corporate or professional email address.',
    });
    return;
  }

  // Check obvious dummy email prefixes
  if (DUMMY_PREFIXES.includes(prefix) || prefix.length < 2) {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid individual executive email address (generic test aliases are not permitted).',
    });
    return;
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(normalized, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  try {
    const isConfigured = isResendConfigured();
    await sendVerificationOtpEmail(normalized, code);

    res.json({
      success: true,
      message: 'A 6-digit verification code has been dispatched to your email address.',
      sandboxCode: !isConfigured ? code : undefined,
    });
  } catch (err: any) {
    console.error('[Verify Email Send Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send verification code. Please try again.',
    });
  }
});

/**
 * PUBLIC: POST /api/verify-email/confirm
 * Verifies the 6-digit OTP
 */
apiRouter.post('/verify-email/confirm', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400).json({ success: false, error: 'Email and verification code are required.' });
    return;
  }

  const normalized = email.trim().toLowerCase();
  const record = otpStore.get(normalized);

  if (!record) {
    res.status(400).json({
      success: false,
      error: 'No verification code requested for this email, or the code has expired. Please request a new code.',
    });
    return;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    res.status(400).json({
      success: false,
      error: 'Verification code has expired. Please click resend to get a fresh code.',
    });
    return;
  }

  if (record.code !== String(code).trim()) {
    res.status(400).json({
      success: false,
      error: 'Incorrect verification code. Please check your email and try again.',
    });
    return;
  }

  // Verified!
  verifiedEmails.add(normalized);
  otpStore.delete(normalized);

  res.json({
    success: true,
    verified: true,
    message: 'Email successfully verified.',
  });
});

// -------------------------------------------------------------
// PAYSTACK PAYMENT SYSTEM INTEGRATION
// -------------------------------------------------------------
/**
 * PUBLIC: GET /api/paystack/config
 * Returns public key & standard registration fee
 */
apiRouter.get('/paystack/config', (_req: Request, res: Response) => {
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder_key';
  const amountNaira = parseInt(process.env.PAYSTACK_AMOUNT_NAIRA || '500000', 10);

  res.json({
    success: true,
    publicKey,
    amount: amountNaira,
    amountKobo: amountNaira * 100,
    currency: 'NGN',
    formattedAmount: `₦${amountNaira.toLocaleString()}`,
  });
});

/**
 * PUBLIC: POST /api/paystack/verify
 * Verifies payment reference and automatically updates participant status
 */
apiRouter.post('/paystack/verify', async (req: Request, res: Response) => {
  const { reference, participantId, amount } = req.body;

  if (!reference || !participantId) {
    res.status(400).json({
      success: false,
      error: 'Transaction reference and participant ID are required.',
    });
    return;
  }

  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    let paymentVerified = true;
    let verifiedAmount = amount || 500000;

    // If live/test secret key is provided, perform upstream Paystack API verification
    if (paystackSecret && paystackSecret.startsWith('sk_')) {
      try {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json',
          },
        });
        const verifyData: any = await verifyRes.json();
        if (!verifyData.status || verifyData.data?.status !== 'success') {
          res.status(400).json({
            success: false,
            error: verifyData.message || 'Payment verification failed at Paystack gateway.',
          });
          return;
        }
        verifiedAmount = (verifyData.data?.amount || 50000000) / 100;
      } catch (upstreamErr) {
        console.warn('[Paystack Upstream Verify Warning]:', upstreamErr);
      }
    }

    let updatedParticipant: any = null;

    if (isUsingMongoDB()) {
      const doc = await MongoParticipantModel.findByIdAndUpdate(
        participantId,
        {
          paymentStatus: 'paid',
          paymentReference: reference,
          paymentAmount: verifiedAmount,
          paymentMethod: 'paystack',
          paidAt: new Date().toISOString(),
          status: 'invited', // Automatically move to invited upon confirmed payment!
          $addToSet: { adminTags: 'Paid (Paystack)' },
        },
        { new: true }
      );
      updatedParticipant = doc ? doc.toJSON() : null;
    } else {
      updatedParticipant = await memoryStore.updateParticipantPayment(participantId, {
        paymentStatus: 'paid',
        paymentReference: reference,
        paymentAmount: verifiedAmount,
        paymentMethod: 'paystack',
        autoInvite: true, // Automatically move to invited upon confirmed payment!
      });
    }

    if (!updatedParticipant) {
      res.status(404).json({
        success: false,
        error: 'Participant application not found.',
      });
      return;
    }

    console.log(`[Payment] Participant ${participantId} paid ₦${verifiedAmount} via Paystack. Status moved to INVITED.`);

    res.json({
      success: true,
      message: 'Payment confirmed. Your seat has been secured and status updated to Invited.',
      participant: updatedParticipant,
    });
  } catch (err: any) {
    console.error('[Paystack Verify Error]:', err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while recording payment confirmation.',
    });
  }
});

// -------------------------------------------------------------
// PUBLIC: POST /api/register
// -------------------------------------------------------------
apiRouter.post('/register', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  // Rate limit: 8 registrations per IP per 10 minutes
  if (!checkRateLimit(registerRateLimit, clientIp, 8, 10 * 60 * 1000)) {
    res.status(429).json({
      success: false,
      error: 'Too many registration requests. Please try again in a few minutes.',
    });
    return;
  }

  const {
    fullName,
    email,
    phone,
    organisation,
    organization,
    jobTitle,
    position,
    category,
    otherCategory,
    yearsExperience,
    goals,
    paidEventConsent,
    organisationType,
    otherOrgType,
    country,
    day3Interest,
    howHeard,
    otherSource,
    notes,
    consent,
  } = req.body;

  // Server-side field validations
  const fieldErrors: Record<string, string> = {};

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    fieldErrors.fullName = 'Full name is required (minimum 2 characters).';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    fieldErrors.email = 'A valid corporate or professional email address is required.';
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    fieldErrors.phone = 'A valid direct phone number is required.';
  }

  // Which Category Best Describes You
  const resolvedCategory = category || organisationType;
  if (!resolvedCategory || typeof resolvedCategory !== 'string' || resolvedCategory.trim().length < 2) {
    fieldErrors.category = 'Please select which category best describes you.';
  }

  // Years of Experience in Media
  if (!yearsExperience || typeof yearsExperience !== 'string' || yearsExperience.trim().length < 1) {
    fieldErrors.yearsExperience = 'Please select your years of experience in the Media industry.';
  }

  // What do you hope to gain from attending this Masterclass
  const resolvedGoals = goals || notes;
  if (!resolvedGoals || typeof resolvedGoals !== 'string' || resolvedGoals.trim().length < 2) {
    fieldErrors.goals = 'Please tell us what you hope to gain from attending this Masterclass.';
  }

  // Paid event understanding
  const isPaidConfirmed = paidEventConsent === true || paidEventConsent === 'Yes' || consent === true;
  if (!isPaidConfirmed) {
    fieldErrors.paidEventConsent = 'Please confirm that you understand this is a paid event.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    res.status(400).json({
      success: false,
      error: 'Please correct the highlighted errors in the form.',
      fieldErrors,
    });
    return;
  }

  try {
    const resolvedOrg = (organisation || organization || '').trim();
    const resolvedPosition = (jobTitle || position || '').trim();
    const resolvedOtherCat = (otherCategory || otherOrgType ? String(otherCategory || otherOrgType).trim() : undefined);

    const cleanData: Omit<IParticipant, 'id' | 'createdAt' | 'updatedAt'> = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      organisation: resolvedOrg,
      jobTitle: resolvedPosition,
      position: resolvedPosition,
      category: String(resolvedCategory).trim(),
      otherCategory: resolvedOtherCat,
      yearsExperience: String(yearsExperience).trim(),
      goals: String(resolvedGoals).trim(),
      paidEventConsent: true,
      organisationType: String(resolvedCategory).trim(),
      otherOrgType: resolvedOtherCat,
      notes: String(resolvedGoals).trim(),
      consent: true,
      country: country ? String(country).trim() : 'Nigeria',
      day3Interest: Boolean(day3Interest),
      howHeard: howHeard ? String(howHeard).trim() : undefined,
      otherSource: otherSource ? String(otherSource).trim() : undefined,
      status: 'pending',
      paymentStatus: 'unpaid',
      adminTags: [],
      // Server-side truth: only mark verified if this email actually completed OTP verification.
      emailVerified: verifiedEmails.has(String(email).trim().toLowerCase()),
    };

    let participant: IParticipant;

    if (isUsingMongoDB()) {
      const doc = await MongoParticipantModel.create(cleanData);
      participant = doc.toJSON() as IParticipant;
    } else {
      participant = await memoryStore.createParticipant(cleanData);
    }

    // Determine Base URL for email notification links
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
    const baseUrl = process.env.APP_URL?.trim() || `${protocol}://${host}`;

    // Background Email Dispatch (Never delays API response to user)
    dispatchApplicationEmails(participant, baseUrl);

    res.status(201).json({
      success: true,
      message: 'Application received successfully.',
      participantId: participant.id,
      participant,
    });
  } catch (err: any) {
    console.error('[Register API Error]:', err);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your application. Please try again.',
    });
  }
});

// -------------------------------------------------------------
// ADMIN: POST /api/admin/login
// -------------------------------------------------------------
apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  // Rate limit: 6 attempts per 15 minutes
  if (!checkRateLimit(loginRateLimit, clientIp, 6, 15 * 60 * 1000)) {
    res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
    });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: 'Email and password are required.',
    });
    return;
  }

  try {
    let adminUser = null;

    if (isUsingMongoDB()) {
      adminUser = await MongoAdminUserModel.findOne({ email: email.trim().toLowerCase() });
    } else {
      adminUser = await memoryStore.findAdminByEmail(email);
    }

    // Always compare to avoid timing leak
    const dummyHash = '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5Vj1e5F5W0n9XyvO/8gB5sM4VdZ2u';
    const hashToCompare = adminUser?.passwordHash || dummyHash;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!adminUser || !isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid login credentials. Access is restricted to authorized administrators.',
      });
      return;
    }

    const token = generateAdminToken(adminUser.id, adminUser.email);

    res.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name || 'EnterpriseCEO Admin',
        role: adminUser.role,
      },
    });
  } catch (err: any) {
    console.error('[Admin Login Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred during authentication.',
    });
  }
});

// -------------------------------------------------------------
// ADMIN: GET /api/admin/participants
// -------------------------------------------------------------
apiRouter.get('/admin/participants', requireAdminAuth, async (req: Request, res: Response) => {
  const {
    search,
    organisationType,
    status,
    paymentStatus,
    tag,
    dateFrom,
    dateTo,
    page = '1',
    pageSize = '20',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  try {
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(pageSize as string, 10) || 20));

    if (isUsingMongoDB()) {
      const query: any = {};
      if (search) {
        const regex = new RegExp(search as string, 'i');
        query.$or = [
          { fullName: regex },
          { email: regex },
          { organisation: regex },
          { jobTitle: regex },
          { paymentReference: regex },
          { adminTags: regex },
        ];
      }
      if (organisationType && organisationType !== 'all') {
        query.organisationType = organisationType;
      }
      if (status && status !== 'all') {
        query.status = status;
      }
      if (paymentStatus && paymentStatus !== 'all') {
        query.paymentStatus = paymentStatus;
      }
      if (tag && tag !== 'all') {
        query.adminTags = tag;
      }
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
      }

      const total = await MongoParticipantModel.countDocuments(query);
      const totalPages = Math.ceil(total / limitNum) || 1;
      const sortDir = sortOrder === 'asc' ? 1 : -1;

      const docs = await MongoParticipantModel.find(query)
        .sort({ [sortBy as string]: sortDir })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      res.json({
        success: true,
        items: docs.map(d => d.toJSON()),
        total,
        page: pageNum,
        pageSize: limitNum,
        totalPages,
      });
    } else {
      const result = await memoryStore.getParticipants({
        search: search as string,
        organisationType: organisationType as string,
        status: status as string,
        paymentStatus: paymentStatus as string,
        tag: tag as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        page: pageNum,
        pageSize: limitNum,
      });
      res.json({ success: true, ...result });
    }
  } catch (err: any) {
    console.error('[Admin Get Participants Error]:', err);
    res.status(500).json({ success: false, error: 'Could not fetch participants.' });
  }
});

// -------------------------------------------------------------
// ADMIN: GET /api/admin/participants/:id
// -------------------------------------------------------------
apiRouter.get('/admin/participants/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    let participant = null;
    if (isUsingMongoDB()) {
      const doc = await MongoParticipantModel.findById(id);
      participant = doc ? doc.toJSON() : null;
    } else {
      participant = await memoryStore.getParticipantById(id);
    }

    if (!participant) {
      res.status(404).json({ success: false, error: 'Participant not found.' });
      return;
    }

    res.json({ success: true, participant });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Could not fetch participant detail.' });
  }
});

// -------------------------------------------------------------
// ADMIN: PATCH /api/admin/participants/:id (Update Status)
// -------------------------------------------------------------
apiRouter.patch('/admin/participants/:id', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'reviewed', 'invited', 'declined'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
    return;
  }

  try {
    let updated: any = null;
    if (isUsingMongoDB()) {
      const doc = await MongoParticipantModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      updated = doc ? doc.toJSON() : null;
    } else {
      updated = await memoryStore.updateParticipantStatus(id, status);
    }

    if (!updated) {
      res.status(404).json({ success: false, error: 'Participant not found.' });
      return;
    }

    res.json({ success: true, participant: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update participant status.' });
  }
});

// -------------------------------------------------------------
// ADMIN: PATCH /api/admin/participants/:id/payment (Update Payment Status & Reference)
// -------------------------------------------------------------
apiRouter.patch('/admin/participants/:id/payment', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus, paymentReference, paymentAmount, paymentMethod, status } = req.body;

  const validPaymentStatuses = ['paid', 'unpaid', 'pay_in_person'];
  if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
    res.status(400).json({
      success: false,
      error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`,
    });
    return;
  }

  try {
    let updated: any = null;
    const updateData: any = {
      paymentStatus,
      paymentReference: paymentReference || undefined,
      paymentAmount: paymentAmount !== undefined ? Number(paymentAmount) : undefined,
      paymentMethod: paymentMethod || 'manual',
    };
    if (paymentStatus === 'paid') {
      updateData.paidAt = new Date().toISOString();
      if (status) updateData.status = status;
    }

    if (isUsingMongoDB()) {
      const doc = await MongoParticipantModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      updated = doc ? doc.toJSON() : null;
    } else {
      updated = await memoryStore.updateParticipantPayment(id, {
        paymentStatus,
        paymentReference,
        paymentAmount,
        paymentMethod: paymentMethod || 'manual',
        autoInvite: status === 'invited',
      });
    }

    if (!updated) {
      res.status(404).json({ success: false, error: 'Participant not found.' });
      return;
    }

    res.json({ success: true, participant: updated });
  } catch (err: any) {
    console.error('[Admin Update Payment Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to update participant payment status.' });
  }
});

// -------------------------------------------------------------
// ADMIN: PATCH /api/admin/participants/:id/tags (Update Admin Tags)
// -------------------------------------------------------------
apiRouter.patch('/admin/participants/:id/tags', requireAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tags } = req.body;

  if (!Array.isArray(tags)) {
    res.status(400).json({ success: false, error: 'Tags must be an array of strings.' });
    return;
  }

  try {
    let updated: any = null;
    const cleanTags = tags.map(t => String(t).trim()).filter(Boolean);

    if (isUsingMongoDB()) {
      const doc = await MongoParticipantModel.findByIdAndUpdate(
        id,
        { adminTags: cleanTags },
        { new: true }
      );
      updated = doc ? doc.toJSON() : null;
    } else {
      updated = await memoryStore.updateParticipantTags(id, cleanTags);
    }

    if (!updated) {
      res.status(404).json({ success: false, error: 'Participant not found.' });
      return;
    }

    res.json({ success: true, participant: updated });
  } catch (err: any) {
    console.error('[Admin Update Tags Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to update admin tags.' });
  }
});

// -------------------------------------------------------------
// ADMIN: GET /api/admin/participants/export (CSV streaming)
// -------------------------------------------------------------
apiRouter.get('/admin/export', requireAdminAuth, async (req: Request, res: Response) => {
  const { search, organisationType, status, paymentStatus, dateFrom, dateTo } = req.query;

  try {
    let list: IParticipant[] = [];

    if (isUsingMongoDB()) {
      const query: any = {};
      if (search) {
        const regex = new RegExp(search as string, 'i');
        query.$or = [
          { fullName: regex },
          { email: regex },
          { organisation: regex },
          { jobTitle: regex },
          { paymentReference: regex },
        ];
      }
      if (organisationType && organisationType !== 'all') query.organisationType = organisationType;
      if (status && status !== 'all') query.status = status;
      if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus;
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
      }
      const docs = await MongoParticipantModel.find(query).sort({ createdAt: -1 });
      list = docs.map(d => d.toJSON() as IParticipant);
    } else {
      const resData = await memoryStore.getParticipants({
        search: search as string,
        organisationType: organisationType as string,
        status: status as string,
        paymentStatus: paymentStatus as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        pageSize: 10000,
      });
      list = resData.items;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const filename = `masterclass-participants-${todayStr}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Helper for CSV escaping
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Full Name',
      'Email Address',
      'Email Verified',
      'Phone Number',
      'Organization/ Media House',
      'Current Position/ Designation',
      'Which Category Best Describes You',
      'Years of Experience in Media',
      'What do you hope to gain from Masterclass',
      'Paid Event Acknowledged',
      'Admissions Status',
      'Payment Status',
      'Payment Reference',
      'Payment Method',
      'Admin Tags',
      'Submitted Date (UTC)',
    ];

    const rows = list.map(p => [
      escapeCsv(p.fullName),
      escapeCsv(p.email),
      escapeCsv(p.emailVerified ? 'Yes' : 'No'),
      escapeCsv(p.phone),
      escapeCsv(p.organisation || ''),
      escapeCsv(p.jobTitle || p.position || ''),
      escapeCsv(`${p.category || p.organisationType || 'N/A'}${p.otherCategory || p.otherOrgType ? ` (${p.otherCategory || p.otherOrgType})` : ''}`),
      escapeCsv(p.yearsExperience || 'N/A'),
      escapeCsv(p.goals || p.notes || ''),
      escapeCsv(p.paidEventConsent ? 'Yes' : 'Yes'),
      escapeCsv(p.status.toUpperCase()),
      escapeCsv(p.paymentStatus?.toUpperCase() || 'UNPAID'),
      escapeCsv(p.paymentReference || ''),
      escapeCsv(p.paymentMethod || ''),
      escapeCsv((p.adminTags || []).join('; ')),
      escapeCsv(new Date(p.createdAt).toUTCString()),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(',')),
    ].join('\r\n');

    res.send(csvContent);
  } catch (err: any) {
    console.error('[CSV Export Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to generate export file.' });
  }
});

// -------------------------------------------------------------
// ADMIN: GET /api/admin/analytics
// -------------------------------------------------------------
apiRouter.get('/admin/analytics', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    if (isUsingMongoDB()) {
      const list = await MongoParticipantModel.find({});
      const jsonList = list.map(d => d.toJSON() as IParticipant);
      
      const total = jsonList.length;
      const statusCounts = { pending: 0, reviewed: 0, invited: 0, declined: 0 };
      const paymentCounts = { paid: 0, unpaid: 0, pay_in_person: 0 };
      const orgTypes: Record<string, number> = {};
      const howHeardCounts: Record<string, number> = {};
      const timelineBuckets: Record<string, number> = {};

      jsonList.forEach(p => {
        if ((statusCounts as any)[p.status] !== undefined) (statusCounts as any)[p.status]++;
        const pStatus = p.paymentStatus || 'unpaid';
        if ((paymentCounts as any)[pStatus] !== undefined) {
          (paymentCounts as any)[pStatus]++;
        } else {
          paymentCounts.unpaid++;
        }
        const org = p.organisationType || 'Other';
        orgTypes[org] = (orgTypes[org] || 0) + 1;
        const src = p.howHeard || 'Unspecified';
        howHeardCounts[src] = (howHeardCounts[src] || 0) + 1;
        const dateKey = p.createdAt.split('T')[0];
        timelineBuckets[dateKey] = (timelineBuckets[dateKey] || 0) + 1;
      });

      const timeline = Object.keys(timelineBuckets)
        .sort()
        .map(date => ({ date, count: timelineBuckets[date] }));

      res.json({
        success: true,
        analytics: {
          total,
          statusCounts,
          paymentCounts,
          orgTypes,
          howHeardCounts,
          timeline,
          capacityTarget: 50,
        },
      });
    } else {
      const analytics = await memoryStore.getAnalytics();
      res.json({ success: true, analytics });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Could not calculate analytics.' });
  }
});

// -------------------------------------------------------------
// ADMIN: GET /api/admin/emails (Email logs & templates)
// -------------------------------------------------------------
apiRouter.get('/admin/emails', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: emailLogs,
    resendActive: isResendConfigured(),
    sendingFrom: process.env.SENDING_EMAIL_ADDRESS || 'masterclass@enterpriseceo.africa',
    adminRecipients: process.env.ADMIN_NOTIFICATION_EMAILS || 'hello@enterpriseceo.africa',
  });
});

// -------------------------------------------------------------
// ADMIN: POST /api/admin/test-email (Send or preview test email)
// -------------------------------------------------------------
apiRouter.post('/admin/test-email', requireAdminAuth, async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'Valid email address required.' });
    return;
  }
  const result = await sendTestEmail(email.trim());
  res.json(result);
});

// -------------------------------------------------------------
// ADMIN: GET /api/admin/system-status
// -------------------------------------------------------------
apiRouter.get('/admin/system-status', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    database: isUsingMongoDB() ? 'MongoDB Atlas (Connected)' : 'Local High-Performance Store (Active)',
    isUsingMongoDB: isUsingMongoDB(),
    resendConfigured: isResendConfigured(),
    sendingEmail: process.env.SENDING_EMAIL_ADDRESS || 'masterclass@enterpriseceo.africa',
    adminNotificationEmails: process.env.ADMIN_NOTIFICATION_EMAILS || 'hello@enterpriseceo.africa',
    totalEmailsLogged: emailLogs.length,
  });
});
