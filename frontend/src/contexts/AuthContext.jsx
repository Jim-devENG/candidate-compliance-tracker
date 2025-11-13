import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenExpiresAt, setTokenExpiresAt] = useState(null);

  // Real-time token validation function
  const validateToken = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }

    try {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token is still valid
      const response = await api.get('/user');
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Update token expiration if provided
      if (response.data.token_expires_at) {
        setTokenExpiresAt(response.data.token_expires_at);
      }
      
      return true;
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      setTokenExpiresAt(null);
      return false;
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    validateToken().finally(() => {
      setLoading(false);
    });
  }, []);

  // Real-time token validation - check every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      validateToken().catch(() => {
        // Silent validation - errors are handled in validateToken
      });
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogout = (event) => {
      setUser(null);
      setIsAuthenticated(false);
      setTokenExpiresAt(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Monitor token expiration and warn/logout before expiry
  useEffect(() => {
    if (!tokenExpiresAt) return;

    const checkExpiration = () => {
      const now = new Date();
      const expiresAt = new Date(tokenExpiresAt);
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      // If token expires in less than 5 minutes, try to refresh by validating
      if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
        // Token is about to expire, validate to check if still valid
        validateToken();
      }

      // If token has expired, logout
      if (timeUntilExpiry <= 0) {
        localStorage.removeItem('auth_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        setTokenExpiresAt(null);
        // Redirect will be handled by API interceptor or ProtectedRoute
      }
    };

    // Check immediately
    checkExpiration();

    // Then check every minute
    const interval = setInterval(checkExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await api.post('/login', { email, password, remember_me: rememberMe });
      const { token, user: userData, expires_at } = response.data;
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Store expiration time for real-time monitoring
      if (expires_at) {
        setTokenExpiresAt(expires_at);
      }
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      // Better error handling for login
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password, passwordConfirmation, role = 'recruiter', avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
      formData.append('role', role);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      const response = await api.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { token, user: userData, expires_at } = response.data;
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Store expiration time for real-time monitoring
      if (expires_at) {
        setTokenExpiresAt(expires_at);
      }
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      // Better error handling for registration
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      // Only call logout endpoint if we have a valid token
      const token = localStorage.getItem('auth_token');
      if (token && isAuthenticated) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user data
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      setTokenExpiresAt(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/user');
      const updatedUser = {
        ...response.data.user,
        avatar_url: response.data.user.avatar_url || null,
      };
      setUser(updatedUser);
      console.log('User data refreshed:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return null;
    }
  };

  const updateProfile = async (name, email, password, passwordConfirmation, currentPassword, avatarFile) => {
    try {
      const formData = new FormData();
      
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);
      if (password) {
        formData.append('password', password);
        formData.append('password_confirmation', passwordConfirmation);
        formData.append('current_password', currentPassword);
      }
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await api.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { user: userData, message } = response.data;

      // Update user state - ensure avatar_url is included and properly formatted
      const updatedUser = {
        ...userData,
        avatar_url: userData.avatar_url || null,
      };
      
      console.log('Updating user context with avatar_url:', updatedUser.avatar_url);
      setUser(updatedUser);

      // Also refresh from server to ensure we have the latest data
      // This ensures the avatar URL is generated with the correct host
      setTimeout(async () => {
        await refreshUser();
      }, 500);

      return { success: true, user: updatedUser, message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.errors || 'Failed to update profile',
      };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAdmin: user?.role === 'admin',
    isRecruiter: user?.role === 'recruiter',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

