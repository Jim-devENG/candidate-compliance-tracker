import { useState, useMemo } from 'react';
import { CSVLink } from 'react-csv';
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
    if (!window.confirm('Send reminder emails to credential managers (30, 14, and 7 days before expiry)?')) {
      return;
    }

    setSendingEmails(prev => ({ ...prev, reminders: true }));
    try {
      const response = await api.post('/emails/send-reminders');
      setEmailResult({
        success: true,
        message: 'Reminder emails sent successfully!',
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
      <NotificationBanner expiringSoonCount={expiringSoonCount} />

      {/* Email Triggers - Admin Only */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">📧 Email Management</h3>
              <p className="text-white/90 text-sm">Manually trigger reminder and summary emails</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendReminders}
                disabled={sendingEmails.reminders}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {sendingEmails.reminders ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Reminders
                  </>
                )}
              </button>
              <button
                onClick={handleSendSummary}
                disabled={sendingEmails.summary}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                {sendingEmails.summary ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Send Summary
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <QuickStats credentials={allCredentials} />

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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

      {/* Search and Filters */}
      <div className="bg-indigo-500 rounded-2xl shadow-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              🔍 Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter candidate name..."
              value={filters.name}
              onChange={(e) => updateFilters({ name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white focus:bg-white shadow-lg transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              📋 Filter by Type
            </label>
            <input
              type="text"
              placeholder="Enter credential type..."
              value={filters.type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white focus:bg-white shadow-lg transition-all"
            />
          </div>
          <div className="flex items-end">
            <CSVLink
              data={csvData}
              filename={`credentials-${new Date().toISOString().split('T')[0]}.csv`}
              className="w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-center transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <StatusChart credentials={allCredentials} />
        </div>
        <div>
          <CredentialsByType credentials={allCredentials} />
        </div>
      </div>

      {/* Upcoming Expiries */}
      <div className="mb-6">
        <UpcomingExpiries credentials={allCredentials} />
      </div>

      {/* Quick Filters */}
      <QuickFilters onFilterChange={handleQuickFilter} activeFilter={quickFilter} />

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center bg-blue-50">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading credentials...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 text-red-600 font-semibold">{error}</div>
        ) : credentials.length === 0 ? (
          <div className="p-12 text-center bg-gray-50">
            <p className="text-gray-600 font-medium">No credentials found. Click "Add New Credential" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-indigo-600">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">
                    Position
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">
                    Issue
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider hidden xl:table-cell">
                    Doc
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCredentials.map((credential, index) => (
                  <tr 
                    key={credential.id} 
                    className={`hover:bg-indigo-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-3 py-2 text-xs font-semibold text-gray-900 max-w-[120px] truncate">
                      {credential.candidate_name}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700 hidden md:table-cell max-w-[100px] truncate">
                      {credential.position}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700 max-w-[100px] truncate">
                      {credential.credential_type}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700 hidden lg:table-cell">
                      {credential.issue_date
                        ? new Date(credential.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700">
                      {credential.expiry_date
                        ? new Date(credential.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-700 hidden lg:table-cell max-w-[120px] truncate">
                      {credential.email}
                    </td>
                    <td className="px-3 py-2 text-xs hidden xl:table-cell">
                      {credential.document_url ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={credential.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                            title="View Document"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          <a
                            href={credential.document_url}
                            download
                            className="p-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 transition-all"
                            title="Download Document"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <StatusTag status={credential.status} expiryDate={credential.expiry_date} />
                    </td>
                    <td className="px-3 py-2 text-right text-xs font-medium">
                      {isAdmin && (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleEdit(credential)}
                            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                            title="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(credential.id)}
                            disabled={deletingId === credential.id}
                            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === credential.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-indigo-50 rounded-2xl shadow-lg">
          <div className="text-sm font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded-xl shadow-sm">
            📄 Page {pagination.current_page} of {pagination.last_page} • {pagination.total} total
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all disabled:hover:scale-100"
            >
              ← Prev
            </button>
            <span className="px-4 py-2 text-sm font-bold text-gray-700 bg-white rounded-xl shadow-sm">Page {page}</span>
            <button
              onClick={() => setPage(Math.min(pagination.last_page || page + 1, page + 1))}
              disabled={pagination.last_page ? page >= pagination.last_page : true}
              className="px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all disabled:hover:scale-100"
            >
              Next →
            </button>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="ml-2 px-3 py-2 border-0 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500"
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

