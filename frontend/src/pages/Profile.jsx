import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Lock, X, Save, XCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      // Only update preview if we don't have a local file selected
      // This prevents resetting the preview when user state updates after save
      if (!avatar) {
        if (user.avatar_url) {
          // Backend now returns full URLs (production-ready), use it directly
          // The backend automatically uses the request's host (network IP for mobile access)
          let avatarUrl = user.avatar_url;
          
          // Only add fallback if URL doesn't start with http/https/data
          if (!avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
            // Fallback: If it's a relative URL, prepend the API base URL
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
            const baseUrl = apiBase.replace('/api', '');
            avatarUrl = avatarUrl.startsWith('/') 
              ? `${baseUrl}${avatarUrl}`
              : `${baseUrl}/${avatarUrl}`;
          }
          
          console.log('Setting avatar preview from user:', avatarUrl);
          setAvatarPreview(avatarUrl);
        } else {
          console.log('No avatar URL in user object');
          setAvatarPreview(null);
        }
      }
    }
  }, [user?.id, user?.avatar_url]); // Only depend on user id and avatar_url, not entire user object

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarPreview(reader.result);
          console.log('Avatar preview set:', reader.result.substring(0, 50));
        }
      };
      reader.onerror = () => {
        setMessage({ type: 'error', text: 'Failed to read image file' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation,
        formData.current_password,
        avatar
      );

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
        setFormData((prev) => ({
          ...prev,
          current_password: '',
          password: '',
          password_confirmation: '',
        }));
        setShowPasswordSection(false);
        setAvatar(null);
        
        // Refresh user data from server to ensure we have the latest (especially for avatar URL)
        // This ensures the dashboard and other components get the updated data
        setTimeout(async () => {
          const refreshedUser = await refreshUser();
          if (refreshedUser?.avatar_url) {
            setAvatarPreview(refreshedUser.avatar_url);
            console.log('Avatar preview updated from refreshed user:', refreshedUser.avatar_url);
          }
        }, 300);
        
        // Also update preview immediately from the response
        if (result.user?.avatar_url) {
          let avatarUrl = result.user.avatar_url;
          
          // Only add fallback if URL doesn't start with http/https/data
          if (!avatarUrl.startsWith('http') && !avatarUrl.startsWith('data:')) {
            // Fallback: If it's a relative URL, prepend the API base URL
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
            const baseUrl = apiBase.replace('/api', '');
            avatarUrl = avatarUrl.startsWith('/') 
              ? `${baseUrl}${avatarUrl}`
              : `${baseUrl}/${avatarUrl}`;
          }
          
          console.log('Avatar URL from backend response:', avatarUrl);
          setAvatarPreview(avatarUrl);
        } else {
          console.log('No avatar URL in response');
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(user?.avatar_url || null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-goodwill-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-goodwill-light via-goodwill-light to-goodwill-light/80 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white via-goodwill-light to-white rounded-2xl shadow-large overflow-hidden border border-goodwill-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-8 py-6 border-b border-blue-700/30" style={{ background: 'linear-gradient(to right, #02646f, #02646f, #02646f)' }}>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/10 rounded-lg"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-white/90 mt-2">Manage your account settings and preferences</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-goodwill-primary/10 text-goodwill-dark border border-goodwill-primary/30'
                    : 'bg-goodwill-secondary/10 text-goodwill-dark border border-goodwill-secondary/30'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-start gap-6 pb-6 border-b border-goodwill-border">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                      {avatarPreview ? (
                        <img
                          key={`avatar-preview-${user.id}-${user.updated_at || Date.now()}-${avatarPreview.substring(0, 30)}`}
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          style={{ display: 'block', width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
                          onError={(e) => {
                            console.error('Avatar image failed to load:', avatarPreview);
                            console.error('Error details:', e);
                            // Don't hide, show fallback instead
                            e.target.style.display = 'none';
                            // Trigger fallback by clearing preview
                            setTimeout(() => {
                              if (!avatar) {
                                setAvatarPreview(null);
                              }
                            }, 100);
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'block';
                            console.log('Avatar image loaded successfully:', avatarPreview);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-goodwill-primary to-goodwill-accent">
                          <span className="text-3xl font-bold text-white">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-goodwill-secondary via-goodwill-secondary to-goodwill-secondary/90 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="Remove avatar"
                      >
                        <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-goodwill-dark mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-goodwill-text-muted file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-goodwill-primary file:to-goodwill-primary/90 file:text-white hover:file:from-goodwill-primary/90 hover:file:to-goodwill-primary file:transition-all file:duration-200 file:cursor-pointer file:shadow-md hover:file:shadow-lg"
                  />
                  <p className="mt-2 text-xs text-goodwill-text-muted">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-goodwill-dark">Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-goodwill-dark mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-goodwill-border rounded-lg bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-goodwill-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-goodwill-border rounded-lg bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-goodwill-dark mb-2">
                    Role
                  </label>
                  <div className="px-4 py-2 bg-goodwill-light border border-goodwill-border rounded-lg">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-goodwill-primary/10 text-goodwill-primary capitalize">
                      {user.role}
                    </span>
                    <p className="text-xs text-goodwill-text-muted mt-1">
                      Role cannot be changed. Contact an administrator if you need to change your role.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-6 border-t border-goodwill-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-goodwill-dark flex items-center gap-2">
                    <Lock className="w-5 h-5 text-goodwill-primary" />
                    Change Password
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(!showPasswordSection);
                      if (showPasswordSection) {
                        setFormData((prev) => ({
                          ...prev,
                          current_password: '',
                          password: '',
                          password_confirmation: '',
                        }));
                      }
                    }}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] ${
                      showPasswordSection
                        ? 'bg-gradient-to-r from-goodwill-secondary/10 to-goodwill-secondary/5 border-2 border-goodwill-secondary text-goodwill-secondary hover:from-goodwill-secondary/20 hover:to-goodwill-secondary/10 shadow-sm hover:shadow-md'
                        : 'bg-gradient-to-r from-goodwill-primary to-goodwill-primary/90 text-white hover:from-goodwill-primary/90 hover:to-goodwill-primary shadow-md hover:shadow-lg'
                    }`}
                  >
                    <Lock className="w-4 h-4" strokeWidth={2.5} />
                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {showPasswordSection && (
                  <div className="space-y-4 bg-goodwill-light p-4 rounded-lg border border-goodwill-border">
                    <div>
                      <label className="block text-sm font-medium text-goodwill-dark mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-goodwill-border rounded-lg bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-goodwill-dark mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        minLength={8}
                        className="w-full px-4 py-2 border border-goodwill-border rounded-lg bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
                      />
                      <p className="mt-1 text-xs text-goodwill-text-muted">
                        Must be at least 8 characters long.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-goodwill-dark mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        minLength={8}
                        className="w-full px-4 py-2 border border-goodwill-border rounded-lg bg-white text-goodwill-dark focus:ring-2 focus:ring-goodwill-primary focus:border-goodwill-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-goodwill-border">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      current_password: '',
                      password: '',
                      password_confirmation: '',
                    });
                    setAvatar(null);
                    setAvatarPreview(user.avatar_url || null);
                    setShowPasswordSection(false);
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-6 py-3 bg-white border-2 border-goodwill-border rounded-xl text-goodwill-dark hover:border-goodwill-primary hover:text-goodwill-primary font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] group"
                  disabled={loading}
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-goodwill-primary via-goodwill-primary to-goodwill-primary/90 hover:from-goodwill-primary/90 hover:via-goodwill-primary hover:to-goodwill-primary text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                >
                  <Save className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:scale-110'} transition-transform duration-200`} strokeWidth={2.5} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

