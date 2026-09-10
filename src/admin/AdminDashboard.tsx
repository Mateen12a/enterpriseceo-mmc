import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  LogOut, 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { AdminParticipants } from './AdminParticipants';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminParticipant, AdminAnalyticsData } from './types';

interface AdminDashboardProps {
  onBackToPublic: () => void;
}

type TabType = 'overview' | 'participants' | 'analytics';

export function AdminDashboard({ onBackToPublic }: AdminDashboardProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('enterpriseceo_admin_token');
  });
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('enterpriseceo_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Participants Table State
  const [participants, setParticipants] = useState<AdminParticipant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrgType, setSelectedOrgType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected participant for drawer
  const [selectedParticipant, setSelectedParticipant] = useState<AdminParticipant | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);

  // Fetch Participants
  const fetchParticipants = useCallback(async () => {
    if (!token) return;
    setIsLoadingParticipants(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedOrgType !== 'all') params.append('organisationType', selectedOrgType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const res = await fetch(`/api/admin/participants?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();
      if (data.success) {
        setParticipants(data.items || []);
        setTotalParticipants(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setIsLoadingParticipants(false);
    }
  }, [token, page, pageSize, sortBy, sortOrder, searchQuery, selectedOrgType, selectedStatus, dateFrom, dateTo]);

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchParticipants();
      fetchAnalytics();
    }
  }, [token, fetchParticipants, fetchAnalytics]);

  const handleLoginSuccess = (newToken: string, user: { email: string; name: string }) => {
    setToken(newToken);
    setAdminUser(user);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('enterpriseceo_admin_token');
    localStorage.removeItem('enterpriseceo_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  // CSV Export
  const handleExportCsv = () => {
    if (!token) return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedOrgType !== 'all') params.append('organisationType', selectedOrgType);
    if (selectedStatus !== 'all') params.append('status', selectedStatus);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    // Trigger direct stream download
    window.location.href = `/api/admin/export?${params.toString()}`;
  };

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: AdminParticipant['status']) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/participants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setParticipants(prev => prev.map(p => (p.id === id ? { ...p, status: newStatus } : p)));
        if (selectedParticipant && selectedParticipant.id === id) {
          setSelectedParticipant({ ...selectedParticipant, status: newStatus });
        }
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onBackToPublic={onBackToPublic} />;
  }

  interface NavItem {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number | null;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Admissions Overview', icon: LayoutDashboard },
    { id: 'participants', label: 'Participant Dossiers', icon: Users, badge: totalParticipants > 0 ? totalParticipants : null },
    { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-grey-100 flex flex-col md:flex-row font-sans text-ink-900">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy-900 text-white p-4 flex items-center justify-between border-b border-navy-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-orange-400" />
          <span className="font-bold text-sm tracking-tight">EnterpriseCEO Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-1 rounded focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Dark Sidebar (Section 6: --navy-900 with orange active accents) */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} 
        md:flex md:flex-col md:w-64 bg-navy-900 text-white shrink-0 z-30 border-r border-navy-950
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-navy-800">
          <div className="flex items-center space-x-2 text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admissions Portal</span>
          </div>
          <h2 className="font-bold text-base text-white tracking-tight leading-snug">
            EnterpriseCEO
          </h2>
          <p className="text-[11px] text-grey-400">
            Media Owners &amp; Execs Masterclass
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors cursor-pointer
                  ${isActive 
                    ? 'bg-orange-500 text-white shadow-xs' 
                    : 'text-grey-300 hover:bg-navy-800 hover:text-white'}
                `}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-grey-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-navy-900/40 text-white' : 'bg-navy-800 text-orange-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/50 space-y-3">
          <div className="text-xs">
            <div className="text-[10px] text-grey-400 uppercase font-bold tracking-wider">Signed In As</div>
            <div className="font-semibold text-white truncate">{adminUser?.email || 'admin@enterpriseceo.africa'}</div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-navy-800/80">
            <button
              onClick={onBackToPublic}
              className="inline-flex items-center text-[11px] font-semibold text-orange-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Public Site
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center text-[11px] text-grey-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Plain light-grey working canvas) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-grey-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToPublic}
              className="inline-flex items-center text-xs font-semibold text-navy-900 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1 text-grey-500" />
              <span>Back to Public Website</span>
            </button>
            <span className="text-grey-300">|</span>
            <span className="text-xs text-grey-500 font-medium hidden sm:inline">
              21–22 October 2026
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                fetchParticipants();
                fetchAnalytics();
              }}
              title="Refresh Application Data"
              className="p-1.5 text-grey-500 hover:text-navy-900 rounded hover:bg-grey-100 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingParticipants ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center text-xs font-bold px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </button>
          </div>
        </header>

        {/* Tab Views */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <AdminOverview
              analytics={analytics}
              recentParticipants={participants}
              onNavigateToParticipants={(filter) => {
                if (filter) setSelectedStatus(filter);
                setActiveTab('participants');
              }}
              onNavigateToEmails={() => setActiveTab('emails')}
              onOpenParticipant={(p) => setSelectedParticipant(p)}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'participants' && (
            <AdminParticipants
              participants={participants}
              total={totalParticipants}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              isLoading={isLoadingParticipants}
              searchQuery={searchQuery}
              selectedOrgType={selectedOrgType}
              selectedStatus={selectedStatus}
              dateFrom={dateFrom}
              dateTo={dateTo}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSearchChange={q => {
                setSearchQuery(q);
                setPage(1);
              }}
              onOrgTypeChange={t => {
                setSelectedOrgType(t);
                setPage(1);
              }}
              onStatusChange={s => {
                setSelectedStatus(s);
                setPage(1);
              }}
              onDateFromChange={d => {
                setDateFrom(d);
                setPage(1);
              }}
              onDateToChange={d => {
                setDateTo(d);
                setPage(1);
              }}
              onSortChange={f => {
                if (sortBy === f) {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy(f);
                  setSortOrder('desc');
                }
              }}
              onPageChange={p => setPage(p)}
              onPageSizeChange={s => {
                setPageSize(s);
                setPage(1);
              }}
              onExportCsv={handleExportCsv}
              onUpdateStatus={handleUpdateStatus}
              selectedParticipant={selectedParticipant}
              onSelectParticipant={setSelectedParticipant}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalytics analytics={analytics} isLoading={isLoadingAnalytics} />
          )}
        </div>
      </main>
    </div>
  );
}
