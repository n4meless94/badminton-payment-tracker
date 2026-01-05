import { useState, useEffect, createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('badminton-auth-user', null);
  const [authSettings, setAuthSettings] = useLocalStorage('badminton-auth-settings', {
    authType: 'password', // 'password', 'google', 'multi-user'
    adminPassword: '', // For simple password auth
    allowedUsers: [], // For multi-user auth
    requireAuth: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simple password authentication
  const loginWithPassword = async (password) => {
    setIsLoading(true);
    try {
      if (password === authSettings.adminPassword) {
        const userData = {
          id: 'admin',
          name: 'Club Admin',
          role: 'admin',
          loginTime: new Date().toISOString(),
          authType: 'password'
        };
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid password' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google authentication (using Google Identity Services)
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // This would integrate with Google Identity Services
      // For now, we'll simulate it
      return new Promise((resolve) => {
        // In real implementation, this would use Google's API
        setTimeout(() => {
          const userData = {
            id: 'google-user',
            name: 'Google User',
            email: 'user@gmail.com',
            role: 'admin',
            loginTime: new Date().toISOString(),
            authType: 'google'
          };
          setUser(userData);
          resolve({ success: true, user: userData });
        }, 1000);
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Multi-user authentication
  const loginWithCredentials = async (username, password) => {
    setIsLoading(true);
    try {
      const allowedUser = authSettings.allowedUsers.find(
        u => u.username === username && u.password === password
      );
      
      if (allowedUser) {
        const userData = {
          id: allowedUser.id,
          name: allowedUser.name,
          username: allowedUser.username,
          role: allowedUser.role,
          loginTime: new Date().toISOString(),
          authType: 'multi-user'
        };
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  // Check if user has permission
  const hasPermission = (requiredRole = 'member') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (requiredRole === 'member' && (user.role === 'member' || user.role === 'admin')) return true;
    return false;
  };

  // Update auth settings
  const updateAuthSettings = (newSettings) => {
    setAuthSettings({ ...authSettings, ...newSettings });
  };

  const value = {
    user,
    authSettings,
    isLoading,
    isAuthenticated: !!user,
    loginWithPassword,
    loginWithGoogle,
    loginWithCredentials,
    logout,
    hasPermission,
    updateAuthSettings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}