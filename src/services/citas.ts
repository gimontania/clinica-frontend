import { api } from '../lib/axios';
import type { CitaFormData } from '../schemas/citaSchema';


export interface Cita extends CitaFormData {
  id: string;
  estado: string;
}


export const create = (data: CitaFormData) =>
  api.post<Cita>('/citas', data);


export const updateEstado = (id: string, estado: string) =>
  api.put<Cita>(`/citas/${id}`, { estado });
