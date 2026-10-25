import { api } from '../lib/axios';
import type { Paciente } from '../types/paciente';


export const create = (data: Omit<Paciente, 'id'>) =>
  api.post<Paciente>('/pacientes', data);


export const update = (
  id: string,
  data: Partial<Omit<Paciente, 'id'>>
) => api.put<Paciente>(`/pacientes/${id}`, data);


export const remove = (id: string) =>
  api.delete(`/pacientes/${id}`);
