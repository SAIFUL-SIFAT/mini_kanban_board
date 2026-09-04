import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  initialize: () => void;
}

/**
 * Zustand Auth Store with localStorage token persistence.
 * Note: Storing JWT in localStorage for single-page client SPA convenience.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanban_token', token);
      localStorage.setItem('kanban_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
  updateUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kanban_user', JSON.stringify(user));
    }
    set({ user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kanban_token');
      localStorage.removeItem('kanban_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  initialize: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }
    try {
      const token = localStorage.getItem('kanban_token');
      const userJson = localStorage.getItem('kanban_user');
      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      localStorage.removeItem('kanban_token');
      localStorage.removeItem('kanban_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
