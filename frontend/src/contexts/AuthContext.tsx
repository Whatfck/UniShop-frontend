import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiService } from '../services/api';
import type { AuthResponse } from '../services/api';
import { generateRandomAvatar, transformImageUrl } from '../utils/apiTransformers';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  phoneVerified: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = apiService.getToken();
    if (token) {
      // Validate token and get user data
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await apiService.getProfile();
      // Transform user data with avatar
      const transformedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.profilePictureUrl ? transformImageUrl(userData.profilePictureUrl) : generateRandomAvatar(userData.id),
        phoneVerified: false, // Default value
        createdAt: new Date(), // Default value
      };
      setUser(transformedUser);
    } catch (error) {
      // Token is invalid, remove it
      apiService.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.login({ email, password });

      // Store token
      apiService.setToken(response.access_token);

      // Transform user data with avatar
      const transformedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatar: response.user.profilePictureUrl ? transformImageUrl(response.user.profilePictureUrl) : generateRandomAvatar(response.user.id),
        phoneVerified: false, // Default value
        createdAt: new Date(), // Default value
      };

      // Set user data
      setUser(transformedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await apiService.register({ name, email, password });

      // Store token
      apiService.setToken(response.access_token);

      // Transform user data with avatar
      const transformedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatar: response.user.profilePictureUrl ? transformImageUrl(response.user.profilePictureUrl) : generateRandomAvatar(response.user.id),
        phoneVerified: false, // Default value
        createdAt: new Date(), // Default value
      };

      // Set user data
      setUser(transformedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.removeToken();
    setUser(null);
  };

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};