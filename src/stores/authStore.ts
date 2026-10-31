import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  foto?: string | null;
}

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario) => void;
  actualizarUsuario: (usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: (token, usuario) =>
        set({ token, usuario, isAuthenticated: true }),

      actualizarUsuario: (usuario) => set({ usuario }),

      logout: () =>
        set({ token: null, usuario: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
