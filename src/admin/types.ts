export interface AdminParticipant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organisation?: string;
  jobTitle?: string;
  position?: string;
  category?: string;
  otherCategory?: string;
  yearsExperience?: string;
  goals?: string;
  paidEventConsent?: boolean;
  organisationType?: string;
  otherOrgType?: string;
  country?: string;
  howHeard?: string;
  otherSource?: string;
  notes?: string;
  consent: boolean;
  status: 'pending' | 'reviewed' | 'invited' | 'declined';
  paymentStatus?: 'paid' | 'unpaid' | 'pay_in_person';
  paymentReference?: string;
  paymentAmount?: number;
  paymentMethod?: 'flutterwave' | 'offline' | 'manual';
  paidAt?: string;
  adminTags?: string[];
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAnalyticsData {
  total: number;
  statusCounts: {
    pending: number;
    reviewed: number;
    invited: number;
    declined: number;
  };
  paymentCounts?: {
    paid: number;
    unpaid: number;
    pay_in_person: number;
  };
  orgTypes: Record<string, number>;
  howHeardCounts: Record<string, number>;
  timeline: Array<{ date: string; count: number }>;
  capacityTarget: number;
}

export interface AdminEmailLog {
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
