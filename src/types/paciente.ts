export type EstadoPaciente = 'activo' | 'inactivo' | 'en_espera'; //estados posibles de un paciente

//datos que debe tener cada paciente
export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadAsignada: string;
  ultimaCita: string;
  estado: EstadoPaciente;
}
