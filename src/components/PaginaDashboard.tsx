import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetricCard from './MetricCard';
import StatusBadge from './StatusBadge';
import type { Metrica } from '../types';
import { api } from '../lib/axios';
import { useCitasStore } from '../stores/citasStore';
import { usePacientesStore } from '../stores/pacientesStore';
import type { EstadoCita } from '../services/citas';
import { extraerMensajeError } from '../lib/errores';
import Spinner from '../shared/components/ui/Spinner';
import AlertaBanner from '../shared/components/ui/AlertaBanner';
import SkeletonMetricCard from '../shared/components/ui/SkeletonMetricCard';

interface RespuestaApi {
  data: unknown[] | number | { total?: number };
  total?: number;
}

export default function PaginaDashboard() {
  const [activo, setActivo] = useState(true);

  const pacientes = usePacientesStore((state) => state.pacientes);
  const cargarPacientes = usePacientesStore((state) => state.cargar);

  const citas = useCitasStore((state) => state.citas);
  const cargandoCitas = useCitasStore((state) => state.cargando);
  const cargarTodas = useCitasStore((state) => state.cargarTodas);
  const actualizarEstado = useCitasStore(
    (state) => state.actualizarEstado,
  );

  const [medicos, setMedicos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const navegar = useNavigate();

  useEffect(() => {
    async function cargarMetricas() {
      try {
        setCargando(true);
        setError('');

        const respuestaMedicos = await api.get<RespuestaApi>('/medicos');

        const datosMedicos = respuestaMedicos.data;
        const totalMedicos =
          typeof datosMedicos === 'object' &&
          datosMedicos !== null &&
          'total' in datosMedicos &&
          typeof datosMedicos.total === 'number'
            ? datosMedicos.total
            : Array.isArray(datosMedicos)
              ? datosMedicos.length
              : 0;

        setMedicos(totalMedicos);

        await Promise.all([cargarPacientes(), cargarTodas()]);
      } catch (err: unknown) {
        setError(extraerMensajeError(err));
      } finally {
        setCargando(false);
      }
    }

    void cargarMetricas();
  }, [cargarPacientes, cargarTodas]);

  const citasProgramadas = citas.filter(
    (cita) => cita.estado === 'Programada',
  ).length;

  const completadas = citas.filter(
    (cita) => cita.estado === 'Completada',
  ).length;

  async function cambiarEstadoCita(id: string, nuevoEstado: EstadoCita) {
    try {
      await actualizarEstado(id, nuevoEstado);
      toast.success('Estado de la cita actualizado');
    } catch (err: unknown) {
      toast.error('No se pudo actualizar el estado');
      console.error(extraerMensajeError(err));
    }
  }

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes.length,
      descripcion: 'Pacientes registrados',
      tendencia: 'positiva',
      icono: '👤',
    },
    {
      id: 'medicos',
      titulo: 'Médicos',
      valor: medicos,
      descripcion: 'Médicos registrados',
      tendencia: 'neutra',
      icono: '🩺',
    },
    {
      id: 'citas',
      titulo: 'Citas Programadas',
      valor: citasProgramadas,
      descripcion: 'Citas pendientes de atención',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'completadas',
      titulo: 'Completadas Hoy',
      valor: completadas,
      descripcion: 'Citas completadas',
      tendencia: 'positiva',
      icono: '✅',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">
        Clínica Salud Integral
      </h1>

      <button
        onClick={() => navegar('/pacientes')}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
      >
        Ver pacientes
      </button>

      <button
        onClick={() => navegar('/citas/nueva')}
        className="ml-3 rounded-lg bg-emerald-600 px-4 py-2 text-white"
      >
        Agendar cita
      </button>

      <button
        onClick={() => navegar('/reportes')}
        className="ml-3 rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Ver reportes completos →
      </button>

      <div className="mt-4">
        <StatusBadge activo={activo} />
      </div>

      {!activo && (
        <AlertaBanner
          tipo="warning"
          mensaje="El sistema está en mantenimiento."
        />
      )}

      <button
        onClick={() => setActivo(!activo)}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Cambiar estado
      </button>

      {cargando && (
        <section
          className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
          aria-label="Cargando métricas"
        >
          {Array.from({ length: 4 }, (_, indice) => (
            <SkeletonMetricCard key={indice} />
          ))}
        </section>
      )}

      {error && (
        <div className="mt-6">
          <AlertaBanner tipo="error" mensaje={error} />
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-rose-600 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </section>
      )}

      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Gestión de citas
        </h2>

        {cargandoCitas && <Spinner mensaje="Cargando citas..." />}

        {!cargandoCitas && citas.length === 0 && (
          <p className="text-gray-500">No hay citas registradas.</p>
        )}

        <div className="flex flex-col gap-4">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">Cita #{cita.id}</p>
                <p className="text-sm text-gray-500">
                  Paciente: {cita.pacienteId || 'Sin paciente asignado'}
                </p>
                <p className="text-sm text-gray-500">
                  Médico: {cita.medicoId}
                </p>
              </div>

              <label className="flex items-center gap-2">
                <span className="text-sm">Estado:</span>

                <select
                  value={cita.estado}
                  onChange={(e) =>
                    cambiarEstadoCita(
                      cita.id,
                      e.target.value as EstadoCita,
                    )
                  }
                  className="rounded-lg border border-gray-300 p-2"
                >
                  <option value="Programada">Programada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
