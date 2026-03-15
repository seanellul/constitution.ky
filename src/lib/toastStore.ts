import { create } from 'zustand';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 2500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
