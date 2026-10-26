import type { Paciente } from './paciente';

//definimos los datos para crear un paciente
export type CrearPacienteDTO = Omit<Paciente, 'id'>;

//definimos los datos para actualizar un paciente
export type ActualizarPacienteDTO = Partial<Omit<Paciente, 'id'>>;

//definimos los datos básicos que mostramos de un paciente
export type ResumenPaciente = Pick<
  Paciente,
  'id' | 'nombre' | 'apellido' | 'email'
>;
