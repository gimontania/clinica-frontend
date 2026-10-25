import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MetricCard from './MetricCard';
import StatusBadge from './StatusBadge';
import type { Metrica } from '../types';
import { api } from '../lib/axios';
import { updateEstado } from '../services/citas';
import { extraerMensajeError } from '../lib/errores';

//definimos la respuesta de la API
interface RespuestaApi {
  data: unknown[] | number;
  total?: number;
}

//definimos los datos de las citas
interface CitaResumen {
  id: string;
  pacienteId: string;
  medicoId: string;
  estado: string;
}

//definimos la respuesta de las citas
interface RespuestaCitas {
  data: CitaResumen[];
  total: number;
}

export default function PaginaDashboard() {
  const [activo, setActivo] = useState(true);

  //guardamos las cantidades de las métricas
  const [pacientes, setPacientes] = useState(0);
  const [medicos, setMedicos] = useState(0);
  const [citasProgramadas, setCitasProgramadas] = useState(0);
  const [completadas, setCompletadas] = useState(0);

  //guardamos las citas
  const [citas, setCitas] = useState<CitaResumen[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState(true);

  //guardamos la carga y los errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const navegar = useNavigate();

  //consultamos las métricas y las citas
  useEffect(() => {
    async function cargarMetricas() {
      try {
        setCargando(true);
        setError('');

        const [
          respuestaPacientes,
          respuestaMedicos,
          respuestaProgramadas,
          respuestaCompletadas,
          respuestaCitas,
        ] = await Promise.all([
          api.get<RespuestaApi>('/pacientes'),
          api.get<RespuestaApi>('/medicos'),
          api.get<RespuestaApi>('/citas?estado=Programada'),
          api.get<RespuestaApi>('/citas?estado=Completada'),
          api.get<RespuestaCitas>('/citas'),
        ]);

        //guardamos las cantidades
        setPacientes(
          respuestaPacientes.data.total ??
            (Array.isArray(respuestaPacientes.data.data)
              ? respuestaPacientes.data.data.length
              : 0),
        );

        setMedicos(
          respuestaMedicos.data.total ??
            (Array.isArray(respuestaMedicos.data.data)
              ? respuestaMedicos.data.data.length
              : 0),
        );

        setCitasProgramadas(
          respuestaProgramadas.data.total ??
            (Array.isArray(respuestaProgramadas.data.data)
              ? respuestaProgramadas.data.data.length
              : 0),
        );

        setCompletadas(
          respuestaCompletadas.data.total ??
            (Array.isArray(respuestaCompletadas.data.data)
              ? respuestaCompletadas.data.data.length
              : 0),
        );

        setCitas(respuestaCitas.data.data);
      } catch (err: unknown) {
        setError(extraerMensajeError(err));
      } finally {
        setCargando(false);
        setCargandoCitas(false);
      }
    }

    cargarMetricas();
  }, []);

  //actualizamos el estado de la cita inmediatamente
  async function cambiarEstadoCita(id: string, nuevoEstado: string) {
    const citasAnteriores = citas;

    setCitas((prev) =>
      prev.map((cita) =>
        cita.id === id ? { ...cita, estado: nuevoEstado } : cita,
      ),
    );

    try {
      await updateEstado(id, nuevoEstado);
      toast.success('Estado de la cita actualizado');
    } catch (err: unknown) {
      //restauramos las citas si falla la API
      setCitas(citasAnteriores);
      toast.error('Cambio revertido');
      console.error(extraerMensajeError(err));
    }
  }

  //definimos las métricas del dashboard
  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes,
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

      {/*botón para abrir pacientes*/}
      <button
        onClick={() => navegar('/pacientes')}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
      >
        Ver pacientes
      </button>

      {/*botón para agendar citas*/}
      <button
        onClick={() => navegar('/citas/nueva')}
        className="ml-3 rounded-lg bg-emerald-600 px-4 py-2 text-white"
      >
        Agendar cita
      </button>

      {/*mostramos el estado del sistema*/}
      <div className="mt-4">
        <StatusBadge activo={activo} />
      </div>

      {!activo && (
        <p className="mt-4 rounded-lg bg-rose-100 p-3 text-rose-700">
          El sistema está en mantenimiento.
        </p>
      )}

      {/*cambiamos el estado del sistema*/}
      <button
        onClick={() => setActivo(!activo)}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Cambiar estado
      </button>

      {/*mostramos la carga o el error*/}
      {cargando && (
        <p className="mt-6 text-slate-600" role="status">
          Cargando métricas...
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-lg bg-rose-100 p-4 text-rose-700" role="alert">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-rose-600 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {/*mostramos las métricas*/}
      {!cargando && !error && (
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </section>
      )}

      {/*mostramos las citas*/}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Gestión de citas
        </h2>

        {cargandoCitas && <p>Cargando citas...</p>}

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
                  Paciente: {cita.pacienteId}
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
                    cambiarEstadoCita(cita.id, e.target.value)
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
