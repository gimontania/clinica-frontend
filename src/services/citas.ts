import { api } from '../lib/axios';
import type { CitaFormData } from '../schemas/citaSchema';

//definimos los estados posibles de una cita
export type EstadoCita = 'Programada' | 'Completada' | 'Cancelada';

//definimos los datos de una cita
export interface Cita extends CitaFormData {
  id: string;
  estado: EstadoCita;
  pacienteId?: string;
}

//creamos una cita
export const create = (data: CitaFormData) =>
  api.post<Cita>('/citas', data);

//actualizamos el estado de una cita
export const updateEstado = (id: string, estado: EstadoCita) =>
  api.put<Cita>(`/citas/${id}`, { estado });
