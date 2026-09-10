import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { 
  memoryStore, 
  isUsingMongoDB, 
  MongoParticipantModel, 
  MongoAdminUserModel 
} from './db.js';
import { requireAdminAuth, generateAdminToken } from './auth.js';
import { dispatchApplicationEmails, sendTestEmail, emailLogs, isResendConfigured } from './email.js';
import { IParticipant } from './types.js';

export const apiRouter = Router();

// In-Memory Rate Limiting
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const registerRateLimit = new Map<string, RateLimitRecord>();
const loginRateLimit = new Map<string, RateLimitRecord>();

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
    dateFrom,
    dateTo,
    page = '1',
    pageSize = '20',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  try {
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 20));

    if (isUsingMongoDB()) {
      const query: any = {};
      if (search) {
        const regex = new RegExp(search as string, 'i');
        query.$or = [
          { fullName: regex },
          { email: regex },
          { organisation: regex },
          { jobTitle: regex },
        ];
      }
      if (organisationType && organisationType !== 'all') {
        query.organisationType = organisationType;
      }
      if (status && status !== 'all') {
        query.status = status;
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
// ADMIN: GET /api/admin/participants/export (CSV streaming)
// -------------------------------------------------------------
apiRouter.get('/admin/export', requireAdminAuth, async (req: Request, res: Response) => {
  const { search, organisationType, status, dateFrom, dateTo } = req.query;

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
        ];
      }
      if (organisationType && organisationType !== 'all') query.organisationType = organisationType;
      if (status && status !== 'all') query.status = status;
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
      'Phone Number',
      'Organization/ Media House',
      'Current Position/ Designation',
      'Which Category Best Describes You',
      'Years of Experience in Media',
      'What do you hope to gain from Masterclass',
      'Paid Event Acknowledged',
      'Status',
      'Submitted Date (UTC)',
    ];

    const rows = list.map(p => [
      escapeCsv(p.fullName),
      escapeCsv(p.email),
      escapeCsv(p.phone),
      escapeCsv(p.organisation || ''),
      escapeCsv(p.jobTitle || p.position || ''),
      escapeCsv(`${p.category || p.organisationType || 'N/A'}${p.otherCategory || p.otherOrgType ? ` (${p.otherCategory || p.otherOrgType})` : ''}`),
      escapeCsv(p.yearsExperience || 'N/A'),
      escapeCsv(p.goals || p.notes || ''),
      escapeCsv(p.paidEventConsent ? 'Yes' : 'Yes'),
      escapeCsv(p.status.toUpperCase()),
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
      const orgTypes: Record<string, number> = {};
      const howHeardCounts: Record<string, number> = {};
      const timelineBuckets: Record<string, number> = {};

      jsonList.forEach(p => {
        if ((statusCounts as any)[p.status] !== undefined) (statusCounts as any)[p.status]++;
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
