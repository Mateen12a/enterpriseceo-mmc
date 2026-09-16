import React, { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw, Send, Loader2, CheckCircle, XCircle, CircleDashed } from 'lucide-react';
import { AdminEmailLog } from './types';

interface AdminEmailsProps {
  token: string | null;
}

const typeLabels: Record<string, string> = {
  participant_confirmation: 'Participant Confirmation',
  admin_notification: 'Admin Alert',
  test: 'Test Email',
};

const statusStyles: Record<string, string> = {
  sent: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  queued: 'bg-blue-50 text-blue-800 border-blue-200',
  simulated: 'bg-grey-100 text-grey-600 border-grey-200',
  failed: 'bg-red-50 text-red-800 border-red-200',
};

const statusIcons: Record<string, React.ElementType> = {
  sent: CheckCircle,
  queued: CircleDashed,
  simulated: CircleDashed,
  failed: XCircle,
};

export function AdminEmails({ token }: AdminEmailsProps) {
  const [logs, setLogs] = useState<AdminEmailLog[]>([]);
  const [resendActive, setResendActive] = useState(false);
  const [sendingFrom, setSendingFrom] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const fetchEmails = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/emails', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setResendActive(Boolean(data.resendActive));
        setSendingFrom(data.sendingFrom || '');
      }
    } catch (err) {
      console.error('Failed to load email logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleSendTest = async () => {
    const email = testEmail.trim();
    if (!email.includes('@')) {
      setTestResult({ ok: false, message: 'Enter a valid email address first.' });
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ ok: true, message: data.simulated ? 'Simulated test email logged (Resend not configured).' : 'Test email dispatched successfully.' });
        fetchEmails();
      } else {
        setTestResult({ ok: false, message: data.error || 'Test email failed.' });
      }
    } catch (err) {
      setTestResult({ ok: false, message: 'Network error while sending test email.' });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Delivery Status Banner */}
      <div className="bg-white p-5 rounded-lg border border-grey-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${resendActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-navy-900 uppercase tracking-wide">Email Delivery System</h1>
            <p className="text-xs text-grey-500 mt-0.5">
              {resendActive ? (
                <>Live via Resend &bull; Sending from <strong className="text-navy-900">{sendingFrom}</strong></>
              ) : (
                <>Resend not configured &mdash; emails are <strong>simulated and logged only</strong>. Add <code className="bg-grey-100 px-1 rounded">RESEND_API_KEY</code> to go live.</>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={fetchEmails}
          className="inline-flex items-center text-xs font-semibold px-3 py-2 bg-grey-100 hover:bg-grey-200 text-navy-900 rounded-md transition-colors border border-grey-300 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Test Dispatch */}
      <div className="bg-navy-900 text-white p-5 rounded-lg border-t-4 border-orange-500 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Send className="w-3 h-3" />
              Dispatch Test Email
            </span>
            <p className="text-[11px] text-grey-300 mt-1">Verify deliverability and template rendering before launch.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="you@enterpriseceo.africa"
              className="flex-1 sm:w-64 py-1.5 px-2.5 bg-white/10 border border-white/20 rounded text-xs text-white placeholder:text-grey-400 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleSendTest}
              disabled={isSendingTest}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isSendingTest ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send Test'}
            </button>
          </div>
        </div>
        {testResult && (
          <p className={`text-[11px] mt-2 font-medium ${testResult.ok ? 'text-emerald-400' : 'text-red-400'}`}>
            {testResult.message}
          </p>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-grey-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-grey-50 text-grey-600 font-bold uppercase text-[10px] tracking-wider border-b border-grey-200">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100 text-ink-900">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-grey-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500 mb-2" />
                    Loading email logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <Mail className="w-8 h-8 text-grey-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-navy-900">No emails dispatched yet</p>
                    <p className="text-xs text-grey-500 mt-1">
                      Confirmation and admin notification emails will be logged here as registrations arrive.
                    </p>
                  </td>
                </tr>
              ) : (
                [...logs].reverse().map(log => {
                  const StatusIcon = statusIcons[log.status] || CircleDashed;
                  return (
                    <tr key={log.id} className="hover:bg-grey-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-navy-900">
                        {typeLabels[log.type] || log.type}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusStyles[log.status] || statusStyles.simulated}`}>
                          <StatusIcon className="w-3 h-3" />
                          {log.status}
                        </span>
                        {log.error && (
                          <span className="block text-[10px] text-red-600 mt-1 max-w-[220px] truncate" title={log.error}>
                            {log.error}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-grey-600">{log.to}</td>
                      <td className="py-3 px-4 text-grey-700 max-w-[320px] truncate" title={log.subject}>
                        {log.subject}
                      </td>
                      <td className="py-3 px-4 text-grey-500 text-[11px] whitespace-nowrap text-right">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
