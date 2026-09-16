import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid,
  Legend
} from 'recharts';
import { AdminAnalyticsData } from './types';
import { BarChart3, PieChart as PieIcon, TrendingUp, Cpu, AlertCircle } from 'lucide-react';

interface AdminAnalyticsProps {
  analytics: AdminAnalyticsData | null;
  isLoading: boolean;
}

const BRAND_COLORS = ['#0B132B', '#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B'];

export function AdminAnalytics({ analytics, isLoading }: AdminAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="p-16 text-center text-grey-500 bg-white rounded-lg border border-grey-200">
        <p className="text-sm font-semibold text-navy-900">Calculating real-time class analytics...</p>
      </div>
    );
  }

  const total = analytics?.total ?? 0;

  if (total === 0) {
    return (
      <div className="bg-white rounded-lg border border-grey-200 p-12 text-center max-w-lg mx-auto">
        <BarChart3 className="w-12 h-12 text-grey-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-navy-900">No Application Data Yet</h3>
        <p className="text-xs text-grey-500 mt-2 leading-relaxed">
          Analytics require real submitted registrations. As senior media executives submit applications through the registration form, distribution charts, timeline metrics, and sector breakdowns will compute automatically.
        </p>
      </div>
    );
  }

  // Data mappings for Recharts
  const orgTypeData = Object.entries(analytics?.orgTypes || {}).map(([name, value]) => ({
    name,
    count: value,
  }));

  const statusData = [
    { name: 'Pending', value: analytics?.statusCounts?.pending ?? 0, color: '#F59E0B' },
    { name: 'Reviewed', value: analytics?.statusCounts?.reviewed ?? 0, color: '#3B82F6' },
    { name: 'Invited', value: analytics?.statusCounts?.invited ?? 0, color: '#10B981' },
    { name: 'Declined', value: analytics?.statusCounts?.declined ?? 0, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const howHeardData = Object.entries(analytics?.howHeardCounts || {}).map(([name, value]) => ({
    name,
    count: value,
  }));

  const timelineData = (analytics?.timeline || []).map(t => ({
    date: t.date,
    applications: t.count,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Admissions Analytics &amp; Demographics</h1>
          <p className="text-xs text-grey-600 mt-0.5">
            Real-time class composition across {total} registered applicant{total === 1 ? '' : 's'}.
          </p>
        </div>
        <div className="text-xs bg-grey-100 text-navy-900 px-3 py-1.5 rounded font-semibold border border-grey-200">
          Class Target: 30 Executive Seats
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Applications Over Time */}
        <div className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Registration Timeline</h2>
              <p className="text-xs text-grey-500">Submissions over time</p>
            </div>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                  itemStyle={{ color: '#F97316' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#F97316" 
                  strokeWidth={3} 
                  dot={{ fill: '#0B132B', r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Organisation / Sector Breakdown */}
        <div className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Sector Representation</h2>
              <p className="text-xs text-grey-500">Distribution by media enterprise type</p>
            </div>
            <BarChart3 className="w-4 h-4 text-navy-900" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orgTypeData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" allowDecimals={false} stroke="#9CA3AF" fontSize={11} />
                <YAxis dataKey="name" type="category" width={110} stroke="#4B5563" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0B132B" radius={[0, 4, 4, 0]}>
                  {orgTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Referral Channels */}
        <div className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Discovery Channels</h2>
              <p className="text-xs text-grey-500">How executives heard about the Masterclass</p>
            </div>
            <PieIcon className="w-4 h-4 text-grey-400" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={howHeardData} margin={{ bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0B132B', color: '#FFF', borderRadius: '6px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
