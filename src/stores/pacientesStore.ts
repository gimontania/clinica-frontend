import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/axios';
import { extraerMensajeError } from '../lib/errores';
import {
  create as crearPacienteApi,
  update as actualizarPacienteApi,
  remove as eliminarPacienteApi,
} from '../services/pacientes';
import type { Paciente } from '../types/paciente';
import type { RespuestaPaginada } from '../types/api';

//definimos el estado y las acciones de pacientes
interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  crear: (datos: Omit<Paciente, 'id'>) => Promise<void>;
  actualizar: (
    id: string,
    datos: Partial<Omit<Paciente, 'id'>>
  ) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      //cargamos los pacientes desde la API
      cargar: async (query) => {
        set({ cargando: true, error: null });

        try {
          const respuesta = await api.get<RespuestaPaginada<Paciente>>(
            '/pacientes',
            { params: { query } },
          );

          set({
            pacientes: respuesta.data.data,
            cargando: false,
          });
        } catch (err: unknown) {
          set({
            error: extraerMensajeError(err),
            cargando: false,
          });
        }
      },

      //creamos un paciente
      crear: async (datos) => {
        set({ error: null });

        try {
          const respuesta = await crearPacienteApi(datos);

          set((state) => ({
            pacientes: [...state.pacientes, respuesta.data],
          }));
        } catch (err: unknown) {
          const mensaje = extraerMensajeError(err);
          set({ error: mensaje });
          throw err;
        }
      },

      //actualizamos los datos de un paciente
      actualizar: async (id, datos) => {
        set({ error: null });

        try {
          const respuesta = await actualizarPacienteApi(id, datos);

          set((state) => ({
            pacientes: state.pacientes.map((paciente) =>
              paciente.id === id ? respuesta.data : paciente,
            ),
          }));
        } catch (err: unknown) {
          const mensaje = extraerMensajeError(err);
          set({ error: mensaje });
          throw err;
        }
      },

      //eliminamos un paciente
      eliminar: async (id) => {
        set({ error: null });

        try {
          await eliminarPacienteApi(id);

          set((state) => ({
            pacientes: state.pacientes.filter(
              (paciente) => paciente.id !== id,
            ),
          }));
        } catch (err: unknown) {
          const mensaje = extraerMensajeError(err);
          set({ error: mensaje });
          throw err;
        }
      },
    }),
    { name: 'PacientesStore' },
  ),
);
