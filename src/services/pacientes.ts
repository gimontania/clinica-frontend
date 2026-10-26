import { api } from '../lib/axios';
import type {
  CrearPacienteDTO,
  ActualizarPacienteDTO,
} from '../types/dtos';
import type { Paciente } from '../types/paciente';

//creamos un paciente
export const create = (data: CrearPacienteDTO) =>
  api.post<Paciente>('/pacientes', data);

//actualizamos un paciente
export const update = (id: string, data: ActualizarPacienteDTO) =>
  api.put<Paciente>(`/pacientes/${id}`, data);

//eliminamos un paciente
export const remove = (id: string) =>
  api.delete(`/pacientes/${id}`);
