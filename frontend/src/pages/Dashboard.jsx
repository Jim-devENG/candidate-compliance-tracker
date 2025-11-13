import { useState, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import { Mail, FileText, Download, Edit, Trash2, Filter } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import StatusCard from '../components/StatusCard';
import StatusTag from '../components/StatusTag';
import CredentialForm from '../components/CredentialForm';
import EmailResultModal from '../components/EmailResultModal';
import NotificationBanner from '../components/NotificationBanner';
import QuickStats from '../components/QuickStats';
import StatusChart from '../components/StatusChart';
import CredentialsByType from '../components/CredentialsByType';
import UpcomingExpiries from '../components/UpcomingExpiries';
import QuickFilters from '../components/QuickFilters';
import { useFetchCredentials } from '../hooks/useFetchCredentials';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const Dashboard = () => {
  const { credentials, allCredentials, loading, error, filters, updateFilters, refresh, page, perPage, setPage, setPerPage, pagination } = useFetchCredentials();
  const { isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [quickFilter, setQuickFilter] = useState('all');
  const [sendingEmails, setSendingEmails] = useState({ reminders: false, summary: false });
  const [emailResult, setEmailResult] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Apply quick filter to credentials (for table display)
  const filteredCredentials = useMemo(() => {
    if (quickFilter === 'all') return credentials;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    switch (quickFilter) {
      case 'active':
        return credentials.filter(c => c.status === 'active');
      case 'expiring_soon':
        return credentials.filter(c => c.status === 'expiring_soon');
      case 'expired':
        return credentials.filter(c => c.status === 'expired');
      case 'this_week': {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return credentials.filter(c => {
          if (!c.expiry_date) return false;
          const expiry = new Date(c.expiry_date);
          return expiry >= now && expiry <= nextWeek;
        });
      }
      case 'this_month': {
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return credentials.filter(c => {
          if (!c.expiry_date) return false;
          const expiry = new Date(c.expiry_date);
          return expiry >= now && expiry <= nextMonth;
        });
      }
      default:
        return credentials;
    }
  }, [credentials, quickFilter]);

  const handleQuickFilter = (filterValue) => {
    setQuickFilter(filterValue);
    setPage(1);
  };

  // Calculate status counts (use all credentials, not filtered)
  const statusCounts = allCredentials.reduce(
    (acc, cred) => {
      acc[cred.status] = (acc[cred.status] || 0) + 1;
      return acc;
    },
    { active: 0, expiring_soon: 0, expired: 0, pending: 0 }
  );

  const handleAdd = () => {
    setEditingCredential(null);
    setIsFormOpen(true);
  };

  const handleEdit = (credential) => {
    setEditingCredential(credential);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/credentials/${id}`);
      refresh();
    } catch (err) {
      alert('Failed to delete credential: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    refresh();
  };

  const handleSendReminders = async () => {
    if (!window.confirm('Send reminder emails to ALL candidates with expiry dates? This will notify all credential managers about their candidates\' upcoming expirations.')) {
      return;
    }

    setSendingEmails(prev => ({ ...prev, reminders: true }));
    try {
      const response = await api.post('/emails/send-reminders', {
        send_to_all: true // Explicitly send to all candidates
      });
      setEmailResult({
        success: true,
        message: 'Reminder emails sent to all candidates successfully!',
        total_sent: response.data.total_sent,
        errors: response.data.errors || [],
      });
      setIsEmailModalOpen(true);
    } catch (err) {
      setEmailResult({
        success: false,
        message: 'Failed to send reminder emails',
        error: err.response?.data?.message || err.message,
      });
      setIsEmailModalOpen(true);
    } finally {
      setSendingEmails(prev => ({ ...prev, reminders: false }));
    }
  };

  const handleSendSummary = async () => {
    if (!window.confirm('Send summary email to Admin users listing all credentials expiring within 30 days?')) {
      return;
    }

    setSendingEmails(prev => ({ ...prev, summary: true }));
    try {
      const response = await api.post('/emails/send-summary');
      setEmailResult({
        success: true,
        message: 'Summary email sent successfully!',
        total_sent: response.data.total_sent,
        credentials_count: response.data.credentials_count,
        errors: response.data.errors || [],
      });
      setIsEmailModalOpen(true);
    } catch (err) {
      setEmailResult({
        success: false,
        message: 'Failed to send summary email',
        error: err.response?.data?.message || err.message,
      });
      setIsEmailModalOpen(true);
    } finally {
      setSendingEmails(prev => ({ ...prev, summary: false }));
    }
  };

  // Prepare CSV data (use all credentials for export)
  const csvData = allCredentials.map((cred) => ({
    'Candidate Name': cred.candidate_name,
    Position: cred.position,
    'Credential Type': cred.credential_type,
    'Issue Date': cred.issue_date,
    'Expiry Date': cred.expiry_date,
    Email: cred.email,
    Status: cred.status,
  }));

  // Calculate expiring soon count (use all credentials, not filtered)
  const expiringSoonCount = allCredentials.filter((cred) => {
    if (cred.status === 'expiring_soon') return true;
    if (!cred.expiry_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(cred.expiry_date);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  return (
    <Layout onAddClick={handleAdd}>
      {/* Notification Banner */}
      <div className="animate-fade-in-down">
        <NotificationBanner expiringSoonCount={expiringSoonCount} />
      </div>

      {/* Email Triggers - Admin Only */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-goodwill-border/50 hover:border-goodwill-primary/30 transition-all duration-300 overflow-hidden relative animate-fade-in-up">
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Header Section */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-goodwill-primary/10 rounded-lg">
                    <Mail className="w-4 h-4 text-goodwill-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-goodwill-dark">Email Management</h3>
                    <p className="text-xs text-goodwill-text-muted">Trigger reminder and summary emails</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSendReminders}
                  disabled={sendingEmails.reminders}
                  className="px-3 py-2 bg-white border border-goodwill-primary rounded-lg text-xs font-medium text-goodwill-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 hover:bg-goodwill-primary hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    {sendingEmails.reminders ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-goodwill-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>Send Reminders</span>
                      </>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={handleSendSummary}
                  disabled={sendingEmails.summary}
                  className="px-3 py-2 bg-white border border-goodwill-secondary rounded-lg text-xs font-medium text-goodwill-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 hover:bg-goodwill-secondary hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    {sendingEmails.summary ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-goodwill-secondary border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>Send Summary</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <QuickStats credentials={allCredentials} />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 stagger-children">
        <StatusCard
          title="Active"
          count={statusCounts.active}
          color="green"
          icon="check"
        />
        <StatusCard
          title="Expiring Soon"
          count={statusCounts.expiring_soon}
          color="yellow"
          icon="warning"
        />
        <StatusCard
          title="Expired"
          count={statusCounts.expired}
          color="red"
          icon="error"
        />
        <StatusCard
          title="Total"
          count={credentials.length}
          color="gray"
          icon="chart"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 stagger-children">
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <StatusChart credentials={allCredentials} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CredentialsByType credentials={allCredentials} />
        </div>
      </div>

      {/* Upcoming Expiries */}
      <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <UpcomingExpiries credentials={allCredentials} />
      </div>

      {/* Quick Filters */}
      <div className="animate-slide-in-left mb-4" style={{ animationDelay: '0.3s' }}>
        <QuickFilters onFilterChange={handleQuickFilter} activeFilter={quickFilter} />
      </div>

      {/* Search and Filters */}
      <div className="bg-goodwill-primary rounded-lg shadow-sm p-4 mb-2 border border-goodwill-primary/20 animate-slide-in-right">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter candidate name..."
              value={filters.name}
              onChange={(e) => updateFilters({ name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-goodwill-border/50 rounded-lg focus:ring-1 focus:ring-white focus:bg-white text-sm transition-all duration-300 text-goodwill-dark placeholder:text-goodwill-text-muted/70"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3 h-3" strokeWidth={2} />
              Filter by Type
            </label>
            <input
              type="text"
              placeholder="Enter credential type..."
              value={filters.type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-goodwill-border/50 rounded-lg focus:ring-1 focus:ring-white focus:bg-white text-sm transition-all duration-300 text-goodwill-dark placeholder:text-goodwill-text-muted/70"
            />
          </div>
          <div className="flex items-end">
            <CSVLink
              data={csvData}
              filename={`credentials-${new Date().toISOString().split('T')[0]}.csv`}
              className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-center transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={2} />
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-goodwill-border/50 animate-scale-in">
        {loading ? (
          <div className="p-12 text-center bg-goodwill-light/50">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-goodwill-primary border-t-transparent animate-glow"></div>
            <p className="mt-4 text-goodwill-dark font-semibold animate-pulse">Loading credentials...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-goodwill-secondary/10 text-goodwill-dark font-semibold rounded-2xl border border-goodwill-secondary/30">{error}</div>
        ) : credentials.length === 0 ? (
          <div className="p-12 text-center bg-goodwill-light/30">
            <p className="text-goodwill-dark font-semibold">No credentials found. Click "Add New Credential" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full divide-y divide-goodwill-border">
              <thead className="bg-goodwill-primary border-b border-goodwill-primary/20 animate-fade-in-down">
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider hidden md:table-cell">
                    Position
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider hidden lg:table-cell">
                    Issue
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider hidden lg:table-cell">
                    Email
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider hidden xl:table-cell">
                    Doc
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-goodwill-border/30">
                {filteredCredentials.map((credential, index) => (
                  <tr 
                    key={credential.id} 
                    className={`hover:bg-goodwill-light/50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-goodwill-light/30'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-3 py-2 text-sm font-medium text-goodwill-dark max-w-[120px] truncate">
                      {credential.candidate_name}
                    </td>
                    <td className="px-3 py-2 text-sm text-goodwill-text-muted hidden md:table-cell max-w-[100px] truncate">
                      {credential.position}
                    </td>
                    <td className="px-3 py-2 text-sm text-goodwill-text-muted max-w-[100px] truncate">
                      {credential.credential_type}
                    </td>
                    <td className="px-3 py-2 text-xs text-goodwill-text-muted hidden lg:table-cell">
                      {credential.issue_date
                        ? new Date(credential.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-xs text-goodwill-text-muted font-medium">
                      {credential.expiry_date
                        ? new Date(credential.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-xs text-goodwill-text-muted hidden lg:table-cell max-w-[120px] truncate">
                      {credential.email}
                    </td>
                    <td className="px-3 py-2 hidden xl:table-cell">
                      {credential.document_url ? (
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={credential.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-goodwill-primary/10 border border-goodwill-primary/20 rounded hover:bg-goodwill-primary/20 transition-all duration-200 flex items-center justify-center"
                            title="View Document"
                          >
                            <FileText className="w-3 h-3 text-goodwill-primary" strokeWidth={2} />
                          </a>
                          <a
                            href={credential.document_url}
                            download
                            className="p-1.5 bg-goodwill-primary/10 border border-goodwill-primary/20 rounded hover:bg-goodwill-primary/20 transition-all duration-200 flex items-center justify-center"
                            title="Download Document"
                          >
                            <Download className="w-3 h-3 text-goodwill-primary" strokeWidth={2} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-goodwill-text-muted text-sm">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <StatusTag status={credential.status} expiryDate={credential.expiry_date} />
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-medium">
                      {isAdmin && (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(credential)}
                            className="p-1.5 bg-goodwill-primary text-white rounded hover:bg-goodwill-primary/90 transition-all duration-200 group"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleDelete(credential.id)}
                            disabled={deletingId === credential.id}
                            className="p-1.5 bg-goodwill-secondary text-white rounded hover:bg-goodwill-secondary/90 transition-all duration-200 disabled:opacity-50 group"
                            title="Delete"
                          >
                            {deletingId === credential.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {!loading && !error && filteredCredentials.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-lg shadow-sm border border-goodwill-border/50 animate-fade-in-up">
          <div className="text-xs font-medium text-goodwill-text-muted">
            Page {pagination.current_page} of {pagination.last_page} • {pagination.total} total
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded bg-goodwill-primary text-white text-xs font-medium hover:bg-goodwill-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 text-xs font-medium text-goodwill-dark bg-goodwill-light rounded">Page {page}</span>
            <button
              onClick={() => setPage(Math.min(pagination.last_page || page + 1, page + 1))}
              disabled={pagination.last_page ? page >= pagination.last_page : true}
              className="px-3 py-1.5 rounded bg-goodwill-secondary text-white text-xs font-medium hover:bg-goodwill-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next →
            </button>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="ml-2 px-2 py-1.5 border border-goodwill-border/50 bg-white rounded text-xs font-medium text-goodwill-dark focus:ring-1 focus:ring-goodwill-primary transition-all duration-200 cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>
      )}

      {/* Credential Form Modal */}
      <CredentialForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCredential(null);
        }}
        credential={editingCredential}
        onSuccess={handleFormSuccess}
      />

      {/* Email Result Modal */}
      <EmailResultModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailResult(null);
        }}
        result={emailResult}
      />
    </Layout>
  );
};

export default Dashboard;

