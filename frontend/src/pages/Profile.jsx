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
    <div className="min-h-screen bg-goodwill-light py-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-goodwill-border/50">
          {/* Header */}
          <div className="bg-goodwill-primary px-4 py-3 border-b border-goodwill-primary/20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-white/80 transition-colors p-1.5 hover:bg-white/10 rounded"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">My Profile</h1>
                <p className="text-white/90 text-xs mt-0.5">Manage your account settings</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-goodwill-primary/10 text-goodwill-dark border border-goodwill-primary/30'
                    : 'bg-goodwill-secondary/10 text-goodwill-dark border border-goodwill-secondary/30'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-start gap-4 pb-4 border-b border-goodwill-border/50">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm relative">
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
                          <span className="text-lg font-bold text-white">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-0.5 -right-0.5 w-6 h-6 bg-goodwill-secondary text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 group"
                        title="Remove avatar"
                      >
                        <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-xs text-goodwill-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-goodwill-primary file:text-white hover:file:bg-goodwill-primary/90 file:transition-all file:duration-200 file:cursor-pointer"
                  />
                  <p className="mt-1.5 text-xs text-goodwill-text-muted">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-goodwill-dark">Basic Information</h2>

                <div>
                  <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-goodwill-border/50 rounded-lg bg-white text-sm text-goodwill-dark focus:ring-1 focus:ring-goodwill-primary focus:border-goodwill-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-goodwill-border/50 rounded-lg bg-white text-sm text-goodwill-dark focus:ring-1 focus:ring-goodwill-primary focus:border-goodwill-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                    Role
                  </label>
                  <div className="px-3 py-2 bg-goodwill-light/50 border border-goodwill-border/50 rounded-lg">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-goodwill-primary/10 text-goodwill-primary capitalize">
                      {user.role}
                    </span>
                    <p className="text-xs text-goodwill-text-muted mt-1">
                      Role cannot be changed. Contact an administrator if you need to change your role.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-4 border-t border-goodwill-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-goodwill-dark flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-goodwill-primary" strokeWidth={2} />
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
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      showPasswordSection
                        ? 'bg-goodwill-secondary/10 border border-goodwill-secondary text-goodwill-secondary hover:bg-goodwill-secondary/20'
                        : 'bg-goodwill-primary text-white hover:bg-goodwill-primary/90'
                    }`}
                  >
                    <Lock className="w-3 h-3" strokeWidth={2} />
                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {showPasswordSection && (
                  <div className="space-y-3 bg-goodwill-light/50 p-3 rounded-lg border border-goodwill-border/50">
                    <div>
                      <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-goodwill-border/50 rounded-lg bg-white text-sm text-goodwill-dark focus:ring-1 focus:ring-goodwill-primary focus:border-goodwill-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        minLength={8}
                        className="w-full px-3 py-2 border border-goodwill-border/50 rounded-lg bg-white text-sm text-goodwill-dark focus:ring-1 focus:ring-goodwill-primary focus:border-goodwill-primary"
                      />
                      <p className="mt-1 text-xs text-goodwill-text-muted">
                        Must be at least 8 characters long.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-goodwill-dark mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        minLength={8}
                        className="w-full px-3 py-2 border border-goodwill-border/50 rounded-lg bg-white text-sm text-goodwill-dark focus:ring-1 focus:ring-goodwill-primary focus:border-goodwill-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-goodwill-border/50">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // Reset form to original user data
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
                    // Navigate back to dashboard
                    navigate('/dashboard');
                  }}
                  className="px-4 py-2 bg-white border border-goodwill-border/50 rounded-lg text-xs font-medium text-goodwill-dark hover:border-goodwill-primary hover:text-goodwill-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  disabled={loading}
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-goodwill-primary text-white rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 hover:bg-goodwill-primary/90 group"
                >
                  <Save className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''} transition-transform duration-200`} strokeWidth={2} />
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

