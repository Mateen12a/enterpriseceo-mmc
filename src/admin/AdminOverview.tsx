import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Layers, 
  ArrowUpRight, 
  Download,
  Mail,
  CreditCard,
  Building
} from 'lucide-react';
import { AdminAnalyticsData, AdminParticipant } from './types';

interface AdminOverviewProps {
  analytics: AdminAnalyticsData | null;
  recentParticipants: AdminParticipant[];
  onNavigateToParticipants: (statusFilter?: string) => void;
  onNavigateToEmails: () => void;
  onOpenParticipant: (p: AdminParticipant) => void;
  onExportCsv: () => void;
}

export function AdminOverview({
  analytics,
  recentParticipants,
  onNavigateToParticipants,
  onNavigateToEmails,
  onOpenParticipant,
  onExportCsv,
}: AdminOverviewProps) {
  const total = analytics?.total ?? 0;
  const pending = analytics?.statusCounts?.pending ?? 0;
  const invited = analytics?.statusCounts?.invited ?? 0;
  const reviewed = analytics?.statusCounts?.reviewed ?? 0;
  const declined = analytics?.statusCounts?.declined ?? 0;
  const paidCount = analytics?.paymentCounts?.paid ?? 0;
  const payInPersonCount = analytics?.paymentCounts?.pay_in_person ?? 0;
  const unpaidCount = analytics?.paymentCounts?.unpaid ?? Math.max(0, total - paidCount - payInPersonCount);
  const target = analytics?.capacityTarget ?? 30;
  const capacityPct = Math.min(100, Math.round((invited / target) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-lg border border-grey-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-navy-900 tracking-tight">Executive Admissions Overview</h1>
          <p className="text-xs text-grey-600 mt-0.5">
            EnterpriseCEO Media Owners &amp; Executives Masterclass &bull; Open admissions &mdash; every complete application is accommodated
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center text-xs font-semibold px-3 py-2 bg-grey-100 hover:bg-grey-200 text-navy-900 rounded-md transition-colors border border-grey-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-grey-600" />
            Export CSV
          </button>
          <button
            onClick={() => onNavigateToParticipants()}
            className="inline-flex items-center text-xs font-bold px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors shadow-sm cursor-pointer"
          >
            Manage Applications
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Metric Cards: 4 Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Applications */}
        <div 
          onClick={() => onNavigateToParticipants('all')}
          className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm hover:border-navy-900/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-grey-500">Total Applicants</span>
            <div className="w-8 h-8 rounded-md bg-navy-900/5 flex items-center justify-center text-navy-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-navy-900">{total}</span>
            <span className="text-xs text-grey-500">all accommodated</span>
          </div>
          <div className="mt-3 text-[11px] text-grey-500 flex items-center justify-between border-t border-grey-100 pt-2">
            <span>Reviewed: {reviewed}</span>
            <span className="text-orange-600 font-semibold group-hover:underline">View All &rarr;</span>
          </div>
        </div>

        {/* Card 2: Pending Action */}
        <div 
          onClick={() => onNavigateToParticipants('pending')}
          className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
            <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-900">{pending}</span>
            <span className="text-xs text-amber-700">awaiting decision</span>
          </div>
          <div className="mt-3 text-[11px] text-grey-500 flex items-center justify-between border-t border-grey-100 pt-2">
            <span>Requires screening</span>
            <span className="text-amber-700 font-semibold group-hover:underline">Filter Pending &rarr;</span>
          </div>
        </div>

        {/* Card 3: Paid Online (Paystack) */}
        <div 
          onClick={() => onNavigateToParticipants('all')}
          className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Paid Confirmed</span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-900">{paidCount}</span>
            <span className="text-xs text-emerald-700">delegates paid</span>
          </div>
          <div className="mt-3 text-[11px] text-grey-500 flex items-center justify-between border-t border-grey-100 pt-2">
            <span>Auto-invited on receipt</span>
            <span className="text-emerald-700 font-semibold group-hover:underline">View Paid &rarr;</span>
          </div>
        </div>

        {/* Card 4: Pay in Person / Invoice */}
        <div 
          onClick={() => onNavigateToParticipants('all')}
          className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">In-Person / Invoice</span>
            <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center text-orange-600">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-900">{payInPersonCount}</span>
            <span className="text-xs text-orange-700">pending venue/invoice</span>
          </div>
          <div className="mt-3 text-[11px] text-grey-500 flex items-center justify-between border-t border-grey-100 pt-2">
            <span>Unpaid: {unpaidCount}</span>
            <span className="text-orange-700 font-semibold group-hover:underline">Inspect &rarr;</span>
          </div>
        </div>
      </div>

      {/* Class Composition & Recent Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-grey-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-grey-200 flex items-center justify-between bg-grey-50/50">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Latest Submissions</h2>
              <p className="text-xs text-grey-500 mt-0.5">Most recent executive registrations</p>
            </div>
            <button
              onClick={() => onNavigateToParticipants()}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              View Full Table &rarr;
            </button>
          </div>

          <div className="divide-y divide-grey-100 flex-1 overflow-x-auto">
            {recentParticipants.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-10 h-10 text-grey-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-navy-900">No applications yet</h3>
                <p className="text-xs text-grey-500 mt-1 max-w-sm mx-auto">
                  When executives submit registrations through the public masterclass form, their applications will appear here instantly.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-grey-50 text-grey-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Applicant</th>
                    <th className="py-2.5 px-4">Organisation</th>
                    <th className="py-2.5 px-4">Sector</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-100 text-ink-900">
                  {recentParticipants.slice(0, 6).map((p) => {
                    const statusColors: Record<string, string> = {
                      pending: 'bg-amber-50 text-amber-800 border-amber-200',
                      reviewed: 'bg-blue-50 text-blue-800 border-blue-200',
                      invited: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                      declined: 'bg-red-50 text-red-800 border-red-200',
                    };

                    return (
                      <tr key={p.id} className="hover:bg-grey-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-navy-900">
                          <div>{p.fullName}</div>
                          <div className="text-[11px] font-normal text-grey-500">{p.jobTitle}</div>
                        </td>
                        <td className="py-3 px-4 text-grey-700">{p.organisation}</td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] bg-grey-100 text-grey-700 px-2 py-0.5 rounded">
                            {p.organisationType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[p.status] || 'bg-grey-100 text-grey-700 border-grey-200'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onOpenParticipant(p)}
                            className="text-xs font-semibold text-orange-600 hover:text-navy-900 transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick System Status & Email Hub */}
        <div className="space-y-6">
          {/* Sector Breakdown Card */}
          <div className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm">
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Sectors Represented</span>
              <Layers className="w-4 h-4 text-grey-400" />
            </h2>
            {total === 0 ? (
              <p className="text-xs text-grey-400 italic py-4 text-center">No applications yet to categorize.</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(analytics?.orgTypes || {}).map(([type, count]) => {
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={type} className="text-xs">
                      <div className="flex justify-between text-navy-900 font-medium mb-1">
                        <span>{type}</span>
                        <span className="text-grey-500 font-semibold">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-grey-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-navy-900 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email System Quick Status */}
          <div className="bg-navy-900 text-white p-5 rounded-lg border-t-4 border-orange-500 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Email Delivery System
              </span>
            </div>
            <p className="text-xs text-grey-300 leading-relaxed">
              Every applicant receives an immediate table-styled confirmation email, and the admissions committee receives an internal alert.
            </p>
            <div className="mt-4 pt-4 border-t border-navy-800 flex items-center justify-between">
              <span className="text-[11px] text-grey-400">Resend &bull; 600px Table templates</span>
              <button
                onClick={onNavigateToEmails}
                className="text-xs font-bold text-orange-400 hover:text-white transition-colors"
              >
                Inspect Logs &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
