import { useState, useEffect } from 'react';

export function getAdminHeaders() {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('admin_token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    window.dispatchEvent(new Event('storage'));
  };
  
  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    window.dispatchEvent(new Event('storage'));
  };
  
  return { token, login, logout, isAuthenticated: !!token };
}
