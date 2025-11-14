import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import Layout from '../components/Layout/Layout';
import { Users, UserPlus, Edit, Trash2, Shield, User as UserIcon, Search, Filter } from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAdmin, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: isSuperAdmin ? 'admin' : 'recruiter', // Default to admin for super_admin, recruiter for admin
  });

  useEffect(() => {
    if (!isSuperAdmin) {
      setError('Access denied. Super admin privileges required.');
      return;
    }
    fetchUsers();
  }, [isSuperAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Note: You'll need to create this endpoint in Laravel
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      setShowAddModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: isSuperAdmin ? 'admin' : 'recruiter', // Default to admin for super_admin, recruiter for admin
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    // Sort by role hierarchy: super_admin > admin > recruiter
    const roleOrder = { super_admin: 0, admin: 1, recruiter: 2 };
    return (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
  });

  if (!isSuperAdmin) {
    return (
      <Layout>
        <div className="min-h-screen bg-goodwill-light flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-goodwill-border/50 animate-fade-in">
            <h2 className="text-sm font-semibold text-goodwill-dark mb-1.5">Access Denied</h2>
            <p className="text-xs text-goodwill-text-muted">You need super admin privileges to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-goodwill-light p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-goodwill-border/50 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-goodwill-dark flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-goodwill-primary" />
                User Management
              </h1>
              <p className="text-xs text-goodwill-text-muted mt-0.5">
                Manage all users and roles (Super Admin Only)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/create-super-admin')}
                className="bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 flex items-center gap-1.5 text-xs font-medium transition-all duration-200 hover-lift"
                title="Create Super Admin"
              >
                <Shield className="w-3.5 h-3.5" />
                Create Super Admin
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="bg-goodwill-primary text-white px-3 py-1.5 rounded-lg hover:bg-goodwill-primary/90 flex items-center gap-1.5 text-xs font-medium transition-all duration-200 hover-lift"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-goodwill-border/50 animate-fade-in-up">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-goodwill-text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-goodwill-text-muted" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="recruiter">Recruiter</option>
                </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-goodwill-secondary/10 border-l-4 border-goodwill-secondary p-3 rounded-lg mb-4 text-xs animate-fade-in">
            <p className="text-goodwill-secondary">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-goodwill-border/50 animate-fade-in-up">
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-goodwill-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-goodwill-light">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-goodwill-dark">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-goodwill-dark">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-goodwill-dark">Role</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-goodwill-dark">Credentials</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-goodwill-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-goodwill-border/50">
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-goodwill-light/50 transition-colors duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-goodwill-primary flex items-center justify-center text-white text-xs">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-medium text-goodwill-dark">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-goodwill-text-muted">{user.email}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'super_admin'
                            ? 'bg-purple-600 text-white'
                            : user.role === 'admin' 
                            ? 'bg-goodwill-primary text-white' 
                            : 'bg-goodwill-light text-goodwill-dark'
                        }`}>
                          {user.role === 'super_admin' ? 'Super Admin' : user.role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-goodwill-text-muted">
                        {user.credentials_count || 0}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {/* Super admin can edit anyone */}
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1 text-goodwill-primary hover:bg-goodwill-primary/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {user.id !== currentUser?.id && (
                            // Super admin can delete anyone (except themselves)
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1 text-goodwill-secondary hover:bg-goodwill-secondary/10 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-6 text-center text-goodwill-text-muted">
                  <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No users found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 animate-scale-in">
            <h2 className="text-sm font-semibold text-goodwill-dark mb-3">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-goodwill-dark mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-goodwill-dark mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-goodwill-dark mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary"
                >
                  {editingUser ? (
                    // Editing existing user - Super admin can change any role
                    (() => {
                      const currentRole = editingUser.role;
                      return (
                        <>
                          <option value="recruiter">Recruiter</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </>
                      );
                    })()
                  ) : (
                    // Creating new user - Super admin can create any role
                    <>
                      <option value="recruiter">Recruiter</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary"
                />
              </div>
              {formData.password && (
                <div>
                  <label className="block text-xs font-medium text-goodwill-dark mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required={!!formData.password}
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-goodwill-border/50 rounded-lg focus:ring-2 focus:ring-goodwill-primary"
                  />
                </div>
              )}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-goodwill-border/50 rounded-lg text-goodwill-dark hover:bg-goodwill-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 text-xs bg-goodwill-primary text-white rounded-lg hover:bg-goodwill-primary/90 transition-colors"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
};

export default AdminUsers;

