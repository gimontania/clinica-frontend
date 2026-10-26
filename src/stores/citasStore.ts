import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../lib/axios';
import { extraerMensajeError } from '../lib/errores';
import {
  create as crearCitaApi,
  updateEstado as actualizarEstadoApi,
} from '../services/citas';
import type { Cita, EstadoCita } from '../services/citas';
import type { CitaFormData } from '../schemas/citaSchema';

//definimos los datos que usamos en el dashboard
interface CitaStoreItem {
  id: string;
  pacienteId: string;
  medicoId: string;
  estado: EstadoCita;
  pacienteNombre?: string;
  fecha?: string;
  hora?: string;
  motivo?: string;
  urgencia?: CitaFormData['urgencia'];
}

//definimos la respuesta de la API
interface RespuestaCitas {
  data: CitaStoreItem[];
  total: number;
}

//definimos el estado y las acciones de citas
interface CitasState {
  citas: CitaStoreItem[];
  citaSeleccionada: CitaStoreItem | null;
  cargando: boolean;
  cargarTodas: () => Promise<void>;
  cargarPorPaciente: (id: string) => Promise<void>;
  seleccionar: (id: string) => void;
  actualizarEstado: (id: string, estado: EstadoCita) => Promise<void>;
  agregarCita: (datos: CitaFormData) => Promise<void>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,

      //cargamos todas las citas
      cargarTodas: async () => {
        set({ cargando: true });

        try {
          const respuesta = await api.get<RespuestaCitas>('/citas');

          set({ citas: respuesta.data.data });
        } catch (err: unknown) {
          console.error(extraerMensajeError(err));
          throw err;
        } finally {
          set({ cargando: false });
        }
      },

      //cargamos las citas de un paciente
      cargarPorPaciente: async (id) => {
        set({ cargando: true });

        try {
          const respuesta = await api.get<RespuestaCitas>(
            '/citas',
            { params: { pacienteId: id } },
          );

          set({ citas: respuesta.data.data });
        } catch (err: unknown) {
          console.error(extraerMensajeError(err));
          throw err;
        } finally {
          set({ cargando: false });
        }
      },

      //buscamos una cita entre las que ya tenemos cargadas
      seleccionar: (id) => {
        const cita = get().citas.find((item) => item.id === id) ?? null;

        set({ citaSeleccionada: cita });
      },

      //actualizamos el estado de una cita
      actualizarEstado: async (id, estado) => {
        try {
          await actualizarEstadoApi(id, estado);

          set((state) => ({
            citas: state.citas.map((cita) =>
              cita.id === id ? { ...cita, estado } : cita,
            ),
            citaSeleccionada:
              state.citaSeleccionada?.id === id
                ? { ...state.citaSeleccionada, estado }
                : state.citaSeleccionada,
          }));
        } catch (err: unknown) {
          console.error(extraerMensajeError(err));
          throw err;
        }
      },

      //agregamos una cita nueva
      agregarCita: async (datos) => {
        try {
          const respuesta = await crearCitaApi(datos);
          const cita = respuesta.data as Cita;

          set((state) => ({
            citas: [
              ...state.citas,
              {
                ...cita,
                pacienteId: cita.pacienteId ?? '',
              },
            ],
          }));
        } catch (err: unknown) {
          console.error(extraerMensajeError(err));
          throw err;
        }
      },
    }),
    { name: 'CitasStore' },
  ),
);
