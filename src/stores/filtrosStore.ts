import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EstadoCita } from '../services/citas';
import type { EstadoPaciente } from '../types/paciente';

//definimos los filtros de la aplicación
interface FiltrosState {
  queryPacientes: string;
  estadoPacienteFiltro: EstadoPaciente | 'Todos';
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCita | 'Todos';
  setQueryPacientes: (query: string) => void;
  setEstadoPaciente: (estado: EstadoPaciente | 'Todos') => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCita | 'Todos') => void;
  resetFiltros: () => void;
}

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      queryPacientes: '',
      estadoPacienteFiltro: 'Todos',
      especialidadFiltro: 'Todas',
      estadoCitaFiltro: 'Todos',

      //actualizamos la búsqueda de pacientes
      setQueryPacientes: (query) => set({ queryPacientes: query }),

      //actualizamos el estado del paciente
      setEstadoPaciente: (estado) =>
        set({ estadoPacienteFiltro: estado }),

      //actualizamos la especialidad
      setEspecialidad: (especialidad) =>
        set({ especialidadFiltro: especialidad }),

      //actualizamos el estado de las citas
      setEstadoCita: (estado) => set({ estadoCitaFiltro: estado }),

      //reiniciamos todos los filtros
      resetFiltros: () =>
        set({
          queryPacientes: '',
          estadoPacienteFiltro: 'Todos',
          especialidadFiltro: 'Todas',
          estadoCitaFiltro: 'Todos',
        }),
    }),
    { name: 'FiltrosStore' },
  ),
);
