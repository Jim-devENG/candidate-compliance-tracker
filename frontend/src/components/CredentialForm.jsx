import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../config/api';

const CredentialForm = ({ isOpen, onClose, credential, onSuccess }) => {
  const [formData, setFormData] = useState({
    candidate_name: '',
    position: '',
    credential_type: '',
    issue_date: '',
    expiry_date: '',
    email: '',
    status: '',
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (credential) {
      setFormData({
        candidate_name: credential.candidate_name || '',
        position: credential.position || '',
        credential_type: credential.credential_type || '',
        issue_date: credential.issue_date || '',
        expiry_date: credential.expiry_date || '',
        email: credential.email || '',
        status: credential.status || '',
      });
      setDocumentFile(null);
    } else {
      setFormData({
        candidate_name: '',
        position: '',
        credential_type: '',
        issue_date: '',
        expiry_date: '',
        email: '',
        status: '',
      });
      setDocumentFile(null);
    }
    setError(null);
  }, [credential, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (documentFile) {
        fd.append('document', documentFile);
      }

      if (credential) {
        // Update existing credential
        await api.post(`/credentials/${credential.id}?_method=PUT`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Create new credential
        await api.post('/credentials', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to save credential'
      );
      console.error('Error saving credential:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={loading ? undefined : onClose} />
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div className="bg-goodwill-light/95 border border-goodwill-border rounded-lg shadow-2xl max-w-lg w-full mx-auto">
          <div className="relative overflow-hidden rounded-t-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
            <div className="px-3 pt-2.5 pb-2 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-goodwill-dark tracking-tight">
                  {credential ? 'Edit Credential' : 'Add New Credential'}
                </h2>
                <p className="text-xs text-goodwill-text-muted mt-0.5">
                  Provide candidate and credential details.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-6 w-6 rounded-lg border border-goodwill-border text-goodwill-text hover:bg-goodwill-light transition-colors"
                disabled={loading}
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5 text-goodwill-text" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-3">
          {error && (
            <div className="mb-2 p-2 text-xs bg-goodwill-secondary/10 border border-goodwill-secondary/30 text-goodwill-dark rounded">
              {error}
            </div>
          )}

            {/* Candidate */}
            <h3 className="text-xs font-semibold text-goodwill-text-muted uppercase tracking-wider mb-2">Candidate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">
                Candidate Name *
              </label>
              <input
                type="text"
                name="candidate_name"
                value={formData.candidate_name}
                onChange={handleChange}
                required
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">
                Credential Type *
              </label>
              <input
                type="text"
                name="credential_type"
                value={formData.credential_type}
                onChange={handleChange}
                required
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
            </div>
            </div>

            {/* Dates & Status */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dates & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">Issue Date *</label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">Expiry Date *</label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
                min={formData.issue_date}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-goodwill-dark mb-0.5">
                Status <span className="text-xs text-goodwill-text-muted">(Optional)</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-goodwill-border bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              >
                <option value="">Auto-calculate</option>
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

            {/* Document */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Document</h3>
            <div className="rounded-lg border border-dashed border-gray-300 p-2 bg-gray-50 mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Document (PDF/DOC, optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                className="w-full px-2 py-1.5 text-xs rounded-lg border border-goodwill-border bg-white focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
              />
              <p className="text-xs text-goodwill-text-muted mt-1">PDF, DOC, DOCX. Max 5MB.</p>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-sm rounded-lg border border-goodwill-border text-goodwill-dark hover:bg-goodwill-light transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : credential ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CredentialForm;

