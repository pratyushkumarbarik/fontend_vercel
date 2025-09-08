import React, { createContext, useContext, useState, useEffect } from 'react';
import { itemsAPI } from '../utils/api'; // ✅ use your axios API wrapper

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // ✅ use itemsAPI.login instead of localhost fetch
  const login = async (email, password) => {
    try {
      const res = await itemsAPI.login(email, password);

      if (res && res.data?.token) {
        const adminUser = {
          id: '1',
          email,
          role: 'admin',
          token: res.data.token,
        };

        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
