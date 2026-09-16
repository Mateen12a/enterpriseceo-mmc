import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  X, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText,
  Loader2,
  CreditCard,
  Tag,
  Plus,
  AlertCircle,
  Building,
  Check
} from 'lucide-react';
import { AdminParticipant } from './types';

interface AdminParticipantsProps {
  participants: AdminParticipant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  searchQuery: string;
  selectedOrgType: string;
  selectedStatus: string;
  selectedPaymentStatus: string;
  selectedTag: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSearchChange: (q: string) => void;
  onOrgTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  onPaymentStatusChange: (pStatus: string) => void;
  onTagChange: (tag: string) => void;
  onDateFromChange: (d: string) => void;
  onDateToChange: (d: string) => void;
  onSortChange: (sortField: string) => void;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onExportCsv: () => void;
  onUpdateStatus: (id: string, newStatus: AdminParticipant['status']) => Promise<void>;
  onUpdatePayment: (id: string, paymentData: {
    paymentStatus: 'paid' | 'unpaid' | 'pay_in_person';
    paymentReference?: string;
    paymentAmount?: number;
    paymentMethod?: 'paystack' | 'offline' | 'manual';
  }) => Promise<void>;
  onUpdateTags: (id: string, tags: string[]) => Promise<void>;
  selectedParticipant: AdminParticipant | null;
  onSelectParticipant: (p: AdminParticipant | null) => void;
}

export function AdminParticipants({
  participants,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  searchQuery,
  selectedOrgType,
  selectedStatus,
  selectedPaymentStatus,
  selectedTag,
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
  onSearchChange,
  onOrgTypeChange,
  onStatusChange,
  onPaymentStatusChange,
  onTagChange,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onExportCsv,
  onUpdateStatus,
  onUpdatePayment,
  onUpdateTags,
  selectedParticipant,
  onSelectParticipant,
}: AdminParticipantsProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isUpdatingTags, setIsUpdatingTags] = useState(false);

  // Drawer Payment Form State
  const [editPaymentStatus, setEditPaymentStatus] = useState<'paid' | 'unpaid' | 'pay_in_person'>('unpaid');
  const [editPaymentRef, setEditPaymentRef] = useState('');
  const [editPaymentAmount, setEditPaymentAmount] = useState<string>('250000');
  const [editPaymentMethod, setEditPaymentMethod] = useState<'paystack' | 'offline' | 'manual'>('offline');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Drawer Tags State
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [tagsSuccessMsg, setTagsSuccessMsg] = useState<string | null>(null);

  // Sync drawer form state when participant is selected
  React.useEffect(() => {
    if (selectedParticipant) {
      setEditPaymentStatus(selectedParticipant.paymentStatus || 'unpaid');
      setEditPaymentRef(selectedParticipant.paymentReference || '');
      setEditPaymentAmount(selectedParticipant.paymentAmount ? String(selectedParticipant.paymentAmount) : '250000');
      setEditPaymentMethod(selectedParticipant.paymentMethod || 'offline');
      setCurrentTags(selectedParticipant.adminTags || []);
      setPaymentSuccessMsg(null);
      setTagsSuccessMsg(null);
    }
  }, [selectedParticipant]);

  const handleStatusUpdate = async (status: AdminParticipant['status']) => {
    if (!selectedParticipant) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(selectedParticipant.id, status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;
    setIsUpdatingPayment(true);
    setPaymentSuccessMsg(null);

    try {
      await onUpdatePayment(selectedParticipant.id, {
        paymentStatus: editPaymentStatus,
        paymentReference: editPaymentRef.trim() || undefined,
        paymentAmount: Number(editPaymentAmount) || undefined,
        paymentMethod: editPaymentMethod,
      });
      setPaymentSuccessMsg('Payment status updated successfully.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (!currentTags.includes(trimmed)) {
      const updated = [...currentTags, trimmed];
      setCurrentTags(updated);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = currentTags.filter(t => t !== tagToRemove);
    setCurrentTags(updated);
  };

  const handleSaveTags = async () => {
    if (!selectedParticipant) return;
    setIsUpdatingTags(true);
    setTagsSuccessMsg(null);

    try {
      await onUpdateTags(selectedParticipant.id, currentTags);
      setTagsSuccessMsg('Tags saved successfully.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingTags(false);
    }
  };

  const statusBadge = (status: AdminParticipant['status']) => {
    const map: Record<string, { bg: string; text: string; border: string }> = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
      reviewed: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      invited: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
      declined: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
    };
    const c = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${c.bg} ${c.text} ${c.border}`}>
        {status}
      </span>
    );
  };

  const paymentBadge = (p: AdminParticipant) => {
    const status = p.paymentStatus || 'unpaid';
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-emerald-50 text-emerald-800 border-emerald-300">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          Paid
        </span>
      );
    }
    if (status === 'pay_in_person') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-orange-50 text-orange-800 border-orange-300">
          <Building className="w-3 h-3 text-orange-600" />
          Pay in Person
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-grey-100 text-grey-600 border-grey-200">
        Unpaid
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Filters & Export */}
      <div className="bg-white p-4 rounded-lg border border-grey-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-grey-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by name, email, organisation, role, or tag..."
              className="block w-full pl-9 pr-3 py-2 text-xs border border-grey-300 rounded-md focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 text-ink-900 placeholder:text-grey-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-grey-400 hover:text-grey-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Export Button & Capacity Notice */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block text-[11px] text-grey-500 font-medium">
              Accommodating <strong>{total}</strong> applications (no cutoff limit)
            </span>
            <button
              onClick={onExportCsv}
              className="inline-flex items-center text-xs font-bold px-3.5 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-md transition-colors shadow-sm cursor-pointer"
              title="Exports currently filtered applications as CSV"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
              Export Filtered CSV
            </button>
          </div>
        </div>

        {/* Filter Dropdowns & Date Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-grey-100 text-xs">
          {/* Org Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-grey-500 mb-1">
              Sector / Org Type
            </label>
            <select
              value={selectedOrgType}
              onChange={e => onOrgTypeChange(e.target.value)}
              className="w-full py-1.5 px-2 bg-grey-50 border border-grey-300 rounded text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="all">All Sectors</option>
              <option value="Broadcast">Broadcast</option>
              <option value="Print">Print</option>
              <option value="Digital/Online">Digital/Online</option>
              <option value="Radio">Radio</option>
              <option value="Production/Content Studio">Production/Content Studio</option>
              <option value="Media Owner">Media Owner</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-grey-500 mb-1">
              Admission Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => onStatusChange(e.target.value)}
              className="w-full py-1.5 px-2 bg-grey-50 border border-grey-300 rounded text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="invited">Invited</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-grey-500 mb-1">
              Payment Status
            </label>
            <select
              value={selectedPaymentStatus}
              onChange={e => onPaymentStatusChange(e.target.value)}
              className="w-full py-1.5 px-2 bg-grey-50 border border-grey-300 rounded text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid (Confirmed)</option>
              <option value="pay_in_person">Pay in Person</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-grey-500 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => onDateFromChange(e.target.value)}
              className="w-full py-1.5 px-2 bg-grey-50 border border-grey-300 rounded text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-grey-500 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={e => onDateToChange(e.target.value)}
              className="w-full py-1.5 px-2 bg-grey-50 border border-grey-300 rounded text-xs text-navy-900 focus:outline-none focus:border-navy-900"
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-lg border border-grey-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-grey-50 text-grey-600 font-bold uppercase text-[10px] tracking-wider border-b border-grey-200">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-navy-900" onClick={() => onSortChange('fullName')}>
                  <div className="flex items-center space-x-1">
                    <span>Applicant</span>
                    <ArrowUpDown className="w-3 h-3 text-grey-400" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-navy-900" onClick={() => onSortChange('organisation')}>
                  <div className="flex items-center space-x-1">
                    <span>Organisation</span>
                    <ArrowUpDown className="w-3 h-3 text-grey-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 cursor-pointer hover:text-navy-900" onClick={() => onSortChange('status')}>
                  <div className="flex items-center space-x-1">
                    <span>Admission</span>
                    <ArrowUpDown className="w-3 h-3 text-grey-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 cursor-pointer hover:text-navy-900" onClick={() => onSortChange('createdAt')}>
                  <div className="flex items-center space-x-1">
                    <span>Submitted</span>
                    <ArrowUpDown className="w-3 h-3 text-grey-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100 text-ink-900">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-grey-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                    <span>Loading executive applications...</span>
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-sm mx-auto">
                      <p className="text-sm font-semibold text-navy-900">No applications found</p>
                      <p className="text-xs text-grey-500 mt-1">
                        {searchQuery || selectedOrgType !== 'all' || selectedStatus !== 'all' || selectedPaymentStatus !== 'all' || dateFrom || dateTo
                          ? 'No applications match your active filter criteria. Try clearing some filters.'
                          : 'No applications yet. When senior executives submit applications via the website, they will appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                participants.map(p => (
                  <tr 
                    key={p.id}
                    onClick={() => onSelectParticipant(p)}
                    className="hover:bg-grey-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
                          {p.fullName}
                        </span>
                        {p.emailVerified && (
                          <span title="Email verified via OTP">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-grey-500">{p.jobTitle || p.position}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-navy-900">
                      <div>{p.organisation || 'N/A'}</div>
                      <div className="text-[10px] text-grey-500">{p.organisationType || p.category}</div>
                    </td>
                    <td className="py-3 px-4 text-grey-600">
                      <div>{p.email}</div>
                      <div className="text-[11px] text-grey-400">{p.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {statusBadge(p.status)}
                    </td>
                    <td className="py-3 px-4">
                      {paymentBadge(p)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {p.adminTags && p.adminTags.length > 0 ? (
                          p.adminTags.map((t, idx) => (
                            <span 
                              key={idx}
                              className="text-[9px] font-semibold bg-navy-50 text-navy-800 border border-navy-200 px-1.5 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-grey-400 italic">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-grey-500 text-[11px] whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectParticipant(p);
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-navy-900 transition-colors px-2 py-1 rounded hover:bg-grey-100 cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-grey-50 border-t border-grey-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-grey-600">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-navy-900">{total > 0 ? (page - 1) * pageSize + 1 : 0}</strong> to{' '}
              <strong className="text-navy-900">{Math.min(page * pageSize, total)}</strong> of{' '}
              <strong className="text-navy-900">{total}</strong> applications
            </span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="py-1 px-2 border border-grey-300 rounded bg-white text-xs text-navy-900 cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
              <option value={200}>200 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded border border-grey-300 bg-white hover:bg-grey-100 disabled:opacity-40 disabled:cursor-not-allowed text-navy-900 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-navy-900">
              Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded border border-grey-300 bg-white hover:bg-grey-100 disabled:opacity-40 disabled:cursor-not-allowed text-navy-900 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Participant Detail Drawer / Modal */}
      {selectedParticipant && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden bg-navy-900/60 backdrop-blur-xs flex justify-end"
          onClick={() => onSelectParticipant(null)}
        >
          <div 
            className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col font-sans"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-navy-900 text-white border-t-4 border-orange-500 flex items-start justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Dossier ID: {selectedParticipant.id}
                  </span>
                  {selectedParticipant.emailVerified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Email Verified
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedParticipant.fullName}
                </h2>
                <p className="text-xs text-grey-300">
                  {selectedParticipant.jobTitle || selectedParticipant.position} &bull; {selectedParticipant.organisation}
                </p>
              </div>
              <button
                onClick={() => onSelectParticipant(null)}
                className="text-grey-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Switcher Bar */}
            <div className="p-4 bg-grey-50 border-b border-grey-200 shrink-0">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-900 mb-2">
                Admissions Committee Decision (Updates immediately)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['pending', 'reviewed', 'invited', 'declined'] as const).map(st => {
                  const isActive = selectedParticipant.status === st;
                  const colors: Record<string, string> = {
                    pending: isActive ? 'bg-amber-600 text-white font-bold' : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-50',
                    reviewed: isActive ? 'bg-blue-600 text-white font-bold' : 'bg-white text-blue-900 border-blue-300 hover:bg-blue-50',
                    invited: isActive ? 'bg-emerald-600 text-white font-bold' : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-50',
                    declined: isActive ? 'bg-red-600 text-white font-bold' : 'bg-white text-red-900 border-red-300 hover:bg-red-50',
                  };

                  return (
                    <button
                      key={st}
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusUpdate(st)}
                      className={`py-2 px-2 text-xs rounded border transition-all text-center uppercase tracking-wide cursor-pointer disabled:opacity-50 ${colors[st]}`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
              {isUpdatingStatus && (
                <div className="text-[11px] text-orange-600 mt-2 flex items-center">
                  <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                  Saving status to database...
                </div>
              )}
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 space-y-6 flex-1 text-xs text-ink-900">
              
              {/* Payment Status & Gateway Management */}
              <div className="p-4 bg-navy-50/70 rounded-lg border border-navy-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                    Payment &amp; Invoicing Management
                  </span>
                  {paymentBadge(selectedParticipant)}
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-navy-900 mb-1">
                        Payment Status
                      </label>
                      <select
                        value={editPaymentStatus}
                        onChange={e => setEditPaymentStatus(e.target.value as any)}
                        className="w-full py-1.5 px-2 bg-white border border-navy-300 rounded text-xs text-navy-900"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="pay_in_person">Pay in Person</option>
                        <option value="paid">Paid (Confirmed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-navy-900 mb-1">
                        Payment Method
                      </label>
                      <select
                        value={editPaymentMethod}
                        onChange={e => setEditPaymentMethod(e.target.value as any)}
                        className="w-full py-1.5 px-2 bg-white border border-navy-300 rounded text-xs text-navy-900"
                      >
                        <option value="paystack">Paystack Online</option>
                        <option value="offline">Pay in Person / Invoice</option>
                        <option value="manual">Manual Admin Override</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-navy-900 mb-1">
                        Amount (NGN)
                      </label>
                      <input
                        type="number"
                        value={editPaymentAmount}
                        onChange={e => setEditPaymentAmount(e.target.value)}
                        placeholder="250000"
                        className="w-full py-1.5 px-2 bg-white border border-navy-300 rounded text-xs text-navy-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-navy-900 mb-1">
                        Transaction / Receipt Ref
                      </label>
                      <input
                        type="text"
                        value={editPaymentRef}
                        onChange={e => setEditPaymentRef(e.target.value)}
                        placeholder="e.g. REC-89421 or Paystack Ref"
                        className="w-full py-1.5 px-2 bg-white border border-navy-300 rounded text-xs text-navy-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {paymentSuccessMsg ? (
                      <span className="text-[11px] text-emerald-700 font-medium">{paymentSuccessMsg}</span>
                    ) : (
                      <span className="text-[11px] text-grey-500">Admins can manually mark cash/transfer as Paid</span>
                    )}
                    <button
                      type="submit"
                      disabled={isUpdatingPayment}
                      className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isUpdatingPayment ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Payment'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Admin Tags Section */}
              <div className="p-4 bg-grey-50 rounded-lg border border-grey-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-orange-500" />
                    Admin Tags
                  </span>
                  <span className="text-[11px] text-grey-500">Filterable in dossier search</span>
                </div>

                {/* Quick Add Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-grey-500 font-semibold">Quick add:</span>
                  {[
                    'Paid (Paystack)', 
                    'Pay in Person', 
                    'VIP Delegate', 
                    'Pan-Atlantic Alum', 
                    'Corporate Sponsored'
                  ].map(quickTag => (
                    <button
                      key={quickTag}
                      type="button"
                      onClick={() => handleAddTag(quickTag)}
                      className="text-[10px] px-2 py-0.5 rounded bg-white border border-grey-300 hover:border-orange-500 text-navy-900 font-medium transition-colors cursor-pointer"
                    >
                      + {quickTag}
                    </button>
                  ))}
                </div>

                {/* Current Active Tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-white rounded border border-grey-200 items-center">
                  {currentTags.length === 0 ? (
                    <span className="text-grey-400 italic text-[11px]">No tags assigned yet.</span>
                  ) : (
                    currentTags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-navy-900 text-white font-semibold rounded text-[11px]"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-orange-400 text-grey-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Custom Tag Input & Save Button */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(newTagInput);
                      }
                    }}
                    placeholder="Type custom tag and press Enter..."
                    className="flex-1 py-1.5 px-2.5 bg-white border border-grey-300 rounded text-xs text-navy-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(newTagInput)}
                    className="px-2.5 py-1.5 bg-grey-200 hover:bg-grey-300 text-navy-900 font-semibold rounded text-xs cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTags}
                    disabled={isUpdatingTags}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded text-xs cursor-pointer"
                  >
                    {isUpdatingTags ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Tags'}
                  </button>
                </div>

                {tagsSuccessMsg && (
                  <p className="text-[11px] text-emerald-700 font-medium">{tagsSuccessMsg}</p>
                )}
              </div>

              {/* Applicant Profile Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-grey-50 rounded border border-grey-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1">
                    Email Address
                  </span>
                  <a href={`mailto:${selectedParticipant.email}`} className="text-orange-600 hover:underline font-medium">
                    {selectedParticipant.email}
                  </a>
                </div>

                <div className="p-3 bg-grey-50 rounded border border-grey-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1">
                    Phone Number
                  </span>
                  <a href={`tel:${selectedParticipant.phone}`} className="text-navy-900 font-medium">
                    {selectedParticipant.phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-grey-50 rounded border border-grey-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1">
                    Organization / Media House
                  </span>
                  <span className="font-semibold text-navy-900">
                    {selectedParticipant.organisation || 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-grey-50 rounded border border-grey-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1">
                    Current Position / Designation
                  </span>
                  <span className="font-semibold text-navy-900">
                    {selectedParticipant.jobTitle || selectedParticipant.position || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-grey-50 rounded border border-grey-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1">
                    Category Description
                  </span>
                  <span className="font-semibold text-navy-900">
                    {selectedParticipant.category || selectedParticipant.organisationType || 'N/A'}
                    {selectedParticipant.otherCategory ? ` (${selectedParticipant.otherCategory})` : ''}
                  </span>
                </div>

                <div className="p-3 bg-grey-50 rounded border border-grey-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1">
                    Media Industry Experience
                  </span>
                  <span className="font-semibold text-navy-900">
                    {selectedParticipant.yearsExperience || 'N/A'}
                  </span>
                </div>
              </div>

              {/* What do you hope to gain */}
              <div className="p-4 bg-grey-50 rounded border border-grey-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-grey-500 block mb-1.5">
                  What do you hope to gain from attending this Masterclass?
                </span>
                <p className="text-xs text-navy-900 leading-relaxed italic bg-white p-3 rounded border border-grey-200 whitespace-pre-wrap">
                  {selectedParticipant.goals || selectedParticipant.notes ? `"${selectedParticipant.goals || selectedParticipant.notes}"` : 'No custom goals provided.'}
                </p>
              </div>

              {/* Timestamps */}
              <div className="text-[11px] text-grey-400 pt-2 flex justify-between border-t border-grey-100">
                <span>Submitted: {new Date(selectedParticipant.createdAt).toLocaleString()}</span>
                <span>Last Updated: {new Date(selectedParticipant.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Footer Close */}
            <div className="p-4 bg-grey-100 border-t border-grey-200 flex justify-end shrink-0">
              <button
                onClick={() => onSelectParticipant(null)}
                className="px-4 py-2 bg-navy-900 text-white rounded text-xs font-bold hover:bg-navy-800 transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
