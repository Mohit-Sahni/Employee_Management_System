import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => void;
}

const USERS_KEY = 'ems_users';
const AUTH_KEY = 'ems_auth';

function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  if (data) return JSON.parse(data);
  const defaults: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@company.com',
      password: 'employee123',
      role: 'employee',
      employeeId: 'EMP-001',
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  return defaults;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string, remember: boolean) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 800));
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      if (remember) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
      }
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    }
    set({ error: 'Invalid email or password', isLoading: false });
    return false;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  checkAuth: () => {
    const stored = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      set({ user, isAuthenticated: true });
    }
  },
}));
