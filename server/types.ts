export interface IParticipant {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  organisation?: string;
  jobTitle?: string; // Current Position / Designation
  position?: string;
  category: 'Media Owner' | 'CEO/ Managing Director' | 'Publisher' | 'Editor' | 'Broadcaster' | 'Media Entrepreneur' | 'Communications Executive' | 'Other' | string;
  otherCategory?: string;
  yearsExperience: 'Less than 5 Years' | '5-10 Years' | '11-20 Years' | 'Over 20 Years' | string;
  goals: string; // What do you hope to gain from attending this Masterclass?
  paidEventConsent: boolean; // Paid event understanding ("Yes")
  organisationType?: string; // Backward compatibility alias
  otherOrgType?: string;
  country?: string;
  day3Interest?: boolean;
  howHeard?: string;
  otherSource?: string;
  notes?: string;
  consent: boolean;
  status: 'pending' | 'reviewed' | 'invited' | 'declined';
  paymentStatus: 'paid' | 'unpaid' | 'pay_in_person';
  paymentReference?: string;
  paymentAmount?: number;
  paymentMethod?: 'paystack' | 'offline' | 'manual';
  paidAt?: string;
  adminTags?: string[];
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRegistrationDTO {
  fullName: string;
  email: string;
  phone: string;
  organisation?: string;
  organization?: string;
  jobTitle?: string;
  position?: string;
  category: string;
  otherCategory?: string;
  yearsExperience: string;
  goals: string;
  paidEventConsent: boolean;
  country?: string;
  howHeard?: string;
  otherSource?: string;
  notes?: string;
  emailVerified?: boolean;
}

export interface IAdminUser {
  id: string;
  _id?: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin';
  createdAt: string;
}

export interface IEmailLog {
  id: string;
  type: 'participant_confirmation' | 'admin_notification' | 'test';
  to: string;
  from: string;
  subject: string;
  status: 'sent' | 'queued' | 'simulated' | 'failed';
  html: string;
  text: string;
  error?: string;
  createdAt: string;
}
