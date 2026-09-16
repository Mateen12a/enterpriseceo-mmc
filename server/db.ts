import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IParticipant, IAdminUser } from './types.js';

// Mongoose Schemas (used when MONGODB_URI is provided)
const ParticipantSchema = new Schema<IParticipant>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    organisation: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    position: { type: String },
    category: { type: String, required: true },
    otherCategory: { type: String },
    yearsExperience: { type: String, required: true },
    goals: { type: String, required: true },
    paidEventConsent: { type: Boolean, required: true, default: true },
    organisationType: { type: String },
    otherOrgType: { type: String },
    country: { type: String, default: 'Nigeria' },
    howHeard: { type: String },
    otherSource: { type: String },
    notes: { type: String },
    consent: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'invited', 'declined'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid', 'pay_in_person'],
      default: 'unpaid',
    },
    paymentReference: { type: String },
    paymentAmount: { type: Number },
    paymentMethod: { type: String },
    paidAt: { type: String },
    adminTags: { type: [String], default: [] },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'Admin' },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const MongoParticipantModel = mongoose.model<IParticipant>('Participant', ParticipantSchema);
export const MongoAdminUserModel = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

// In-Memory / File Fallback Store (Ensures zero downtime if MongoDB Atlas is not yet configured)
class MemoryStore {
  private participants: Map<string, IParticipant> = new Map();
  private adminUsers: Map<string, IAdminUser> = new Map();

  async createParticipant(data: Omit<IParticipant, 'id' | 'createdAt' | 'updatedAt'>): Promise<IParticipant> {
    const id = `pt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();
    const item: IParticipant = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.participants.set(id, item);
    return item;
  }

  async getParticipants(filter?: {
    search?: string;
    organisationType?: string;
    status?: string;
    paymentStatus?: string;
    tag?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Promise<{ items: IParticipant[]; total: number; page: number; pageSize: number; totalPages: number }> {
    let list = Array.from(this.participants.values());

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.organisation && p.organisation.toLowerCase().includes(q)) ||
        (p.jobTitle && p.jobTitle.toLowerCase().includes(q)) ||
        (p.position && p.position.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.paymentReference && p.paymentReference.toLowerCase().includes(q)) ||
        (p.adminTags && p.adminTags.some(t => t.toLowerCase().includes(q))) ||
        (p.yearsExperience && p.yearsExperience.toLowerCase().includes(q))
      );
    }

    if (filter?.organisationType && filter.organisationType !== 'all') {
      list = list.filter(p => p.organisationType === filter.organisationType);
    }

    if (filter?.status && filter.status !== 'all') {
      list = list.filter(p => p.status === filter.status);
    }

    if (filter?.paymentStatus && filter.paymentStatus !== 'all') {
      list = list.filter(p => p.paymentStatus === filter.paymentStatus);
    }

    if (filter?.tag && filter.tag !== 'all') {
      list = list.filter(p => p.adminTags && p.adminTags.includes(filter.tag!));
    }

    if (filter?.dateFrom) {
      const from = new Date(filter.dateFrom).getTime();
      list = list.filter(p => new Date(p.createdAt).getTime() >= from);
    }

    if (filter?.dateTo) {
      const to = new Date(filter.dateTo).getTime();
      list = list.filter(p => new Date(p.createdAt).getTime() <= to);
    }

    // Sorting
    const sortOrder = filter?.sortOrder === 'asc' ? 1 : -1;
    const sortBy = filter?.sortBy || 'createdAt';
    list.sort((a: any, b: any) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    const total = list.length;
    const page = filter?.page || 1;
    const pageSize = filter?.pageSize || 20;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    const items = list.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  }

  async getParticipantById(id: string): Promise<IParticipant | null> {
    return this.participants.get(id) || null;
  }

  async updateParticipantStatus(id: string, status: IParticipant['status']): Promise<IParticipant | null> {
    const item = this.participants.get(id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.participants.set(id, item);
    return item;
  }

  async updateParticipantPayment(
    id: string,
    data: {
      paymentStatus: 'paid' | 'unpaid' | 'pay_in_person';
      paymentReference?: string;
      paymentAmount?: number;
      paymentMethod?: 'paystack' | 'offline' | 'manual';
      autoInvite?: boolean;
    }
  ): Promise<IParticipant | null> {
    const item = this.participants.get(id);
    if (!item) return null;
    item.paymentStatus = data.paymentStatus;
    if (data.paymentReference) item.paymentReference = data.paymentReference;
    if (data.paymentAmount !== undefined) item.paymentAmount = data.paymentAmount;
    if (data.paymentMethod) item.paymentMethod = data.paymentMethod;
    if (data.paymentStatus === 'paid') {
      item.paidAt = new Date().toISOString();
      if (data.autoInvite) {
        item.status = 'invited';
      }
      const existingTags = item.adminTags || [];
      if (!existingTags.includes('Paid (Paystack)') && data.paymentMethod === 'paystack') {
        item.adminTags = [...existingTags, 'Paid (Paystack)'];
      }
    } else if (data.paymentStatus === 'pay_in_person') {
      const existingTags = item.adminTags || [];
      if (!existingTags.includes('Pay in Person')) {
        item.adminTags = [...existingTags, 'Pay in Person'];
      }
    }
    item.updatedAt = new Date().toISOString();
    this.participants.set(id, item);
    return item;
  }

  async updateParticipantTags(id: string, tags: string[]): Promise<IParticipant | null> {
    const item = this.participants.get(id);
    if (!item) return null;
    item.adminTags = tags;
    item.updatedAt = new Date().toISOString();
    this.participants.set(id, item);
    return item;
  }

  async getAnalytics() {
    const list = Array.from(this.participants.values());
    const total = list.length;
    const statusCounts = { pending: 0, reviewed: 0, invited: 0, declined: 0 };
    const paymentCounts = { paid: 0, unpaid: 0, pay_in_person: 0 };
    const orgTypes: Record<string, number> = {};
    const howHeardCounts: Record<string, number> = {};

    const timelineBuckets: Record<string, number> = {};

    list.forEach(p => {
      // Status
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status]++;
      }
      // Payment Status
      const payStatus = p.paymentStatus || 'unpaid';
      if ((paymentCounts as any)[payStatus] !== undefined) {
        (paymentCounts as any)[payStatus]++;
      } else {
        paymentCounts.unpaid++;
      }
      // Org Types
      const org = p.organisationType || 'Other';
      orgTypes[org] = (orgTypes[org] || 0) + 1;

      // How Heard
      const source = p.howHeard || 'Unspecified';
      howHeardCounts[source] = (howHeardCounts[source] || 0) + 1;

      // Timeline (date YYYY-MM-DD)
      const dateKey = p.createdAt.split('T')[0];
      timelineBuckets[dateKey] = (timelineBuckets[dateKey] || 0) + 1;
    });

    const timeline = Object.keys(timelineBuckets)
      .sort()
      .map(date => ({ date, count: timelineBuckets[date] }));

    return {
      total,
      statusCounts,
      paymentCounts,
      orgTypes,
      howHeardCounts,
      timeline,
      capacityTarget: 50,
    };
  }

  // Admin users
  async findAdminByEmail(email: string): Promise<IAdminUser | null> {
    const normalized = email.trim().toLowerCase();
    for (const user of this.adminUsers.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    return null;
  }

  async seedAdmin(email: string, passwordPlain: string, name: string = 'EnterpriseCEO Admin'): Promise<IAdminUser> {
    const existing = await this.findAdminByEmail(email);
    if (existing) return existing;

    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const id = `adm-${Date.now()}`;
    const user: IAdminUser = {
      id,
      email: email.trim().toLowerCase(),
      passwordHash,
      name,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    this.adminUsers.set(id, user);
    return user;
  }
}

export const memoryStore = new MemoryStore();

let isConnectedToMongo = false;

export function isUsingMongoDB(): boolean {
  return isConnectedToMongo;
}

export async function initDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@enterpriseceo.africa';
  // Never seed a guessable password. In dev without ADMIN_INITIAL_PASSWORD the admin
  // account simply is not created; in production the env var is mandatory.
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminPassword) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_INITIAL_PASSWORD is required in production to create the initial admin account.');
    }
    console.warn('[Database] ADMIN_INITIAL_PASSWORD not set - no admin account will be seeded this boot.');
  }

  if (adminPassword) {
    // Seed memory store so it's ready for instant access
    await memoryStore.seedAdmin(adminEmail, adminPassword);
  }

  if (!uri || uri.trim() === '') {
    console.log('[Database] MONGODB_URI not configured. Operating in high-performance local store mode.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedToMongo = true;
    console.log('[Database] Successfully connected to MongoDB Atlas cluster.');

    // Seed Admin in MongoDB if not present
    if (adminPassword) {
      const existingAdmin = await MongoAdminUserModel.findOne({ email: adminEmail.toLowerCase() });
      if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await MongoAdminUserModel.create({
          email: adminEmail.toLowerCase(),
          passwordHash,
          name: 'EnterpriseCEO Administrator',
          role: 'admin',
        });
        console.log(`[Database] Seeded initial admin account: ${adminEmail}`);
      }
    }
  } catch (err: any) {
    console.warn('[Database] Could not connect to MongoDB Atlas cluster:', err?.message);
    console.warn('[Database] Seamlessly falling back to local store mode.');
    isConnectedToMongo = false;
  }
}
