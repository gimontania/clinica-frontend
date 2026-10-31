import { api } from '../lib/axios';
import type { LoginFormData } from '../schemas/loginSchema';
import type { Usuario } from '../stores/authStore';

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export const login = async (
  datos: LoginFormData
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', datos);

  return data;
};

export const actualizarPerfil = async (
  formData: FormData
): Promise<Usuario> => {
  const { data } = await api.put<Usuario>('/auth/perfil', formData);

  return data;
};
