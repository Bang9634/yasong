import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  signup: (email: string, username: string, password: string, name: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 localStorage에서 토큰 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 로그인
  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        email: response.email,
        username: response.username,
        name: response.name
      }));

      setToken(response.token);
      setUser({
        id: response.id,
        email: response.email,
        username: response.username,
        name: response.name
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  // 회원가입
  const signup = async (email: string, username: string, password: string, name: string) => {
    try {
      const response = await authAPI.signup(email, username, password, name);
      
      // 회원가입 후 자동 로그인
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        email: response.email,
        name: response.name
      }));

      setToken(response.token);
      setUser({
        id: response.id,
        email: response.email,
        username: response.username,
        name: response.name
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};