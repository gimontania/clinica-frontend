import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from './MetricCard';
import StatusBadge from './StatusBadge';
import type { Metrica } from '../types';
import { api } from '../lib/axios';

//definimos los datos que devuelve la API
interface RespuestaApi {
  data: unknown[] | number;
  total?: number;
}

export default function PaginaDashboard() {
  //guardamos si el sistema está funcionando
  const [activo, setActivo] = useState(true);

  //guardamos las cantidades de las métricas
  const [pacientes, setPacientes] = useState(0);
  const [medicos, setMedicos] = useState(0);
  const [citasProgramadas, setCitasProgramadas] = useState(0);
  const [completadas, setCompletadas] = useState(0);

  //guardamos el estado de carga y los errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  //navegamos a otras páginas
  const navegar = useNavigate();

  //obtenemos las métricas desde el backend
  useEffect(() => {
    async function cargarMetricas() {
      try {
        setCargando(true);
        setError('');

        //consultamos los cuatro endpoints
        const [respuestaPacientes, respuestaMedicos, respuestaProgramadas, respuestaCompletadas] =
          await Promise.all([
            api.get<RespuestaApi>('/pacientes'),
            api.get<RespuestaApi>('/medicos'),
            api.get<RespuestaApi>('/citas?estado=Programada'),
            api.get<RespuestaApi>('/citas?estado=Completada'),
          ]);

        //guardamos las cantidades reales
        setPacientes(
          respuestaPacientes.data.total ??
          (Array.isArray(respuestaPacientes.data.data)
            ? respuestaPacientes.data.data.length
            : 0)
        );

        setMedicos(
          respuestaMedicos.data.total ??
          (Array.isArray(respuestaMedicos.data.data)
            ? respuestaMedicos.data.data.length
            : 0)
        );

        setCitasProgramadas(
          respuestaProgramadas.data.total ??
          (Array.isArray(respuestaProgramadas.data.data)
            ? respuestaProgramadas.data.data.length
            : 0)
        );

        setCompletadas(
          respuestaCompletadas.data.total ??
          (Array.isArray(respuestaCompletadas.data.data)
            ? respuestaCompletadas.data.data.length
            : 0)
        );
      } catch {
        //mostramos un mensaje si falla alguna consulta
        setError('No se pudieron cargar las métricas.');
      } finally {
        setCargando(false);
      }
    }

    cargarMetricas();
  }, []);

  //definimos las métricas del Dashboard
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

      {/*botón para abrir la página de pacientes*/}
      <button
        onClick={() => navegar('/pacientes')}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
      >
        Ver pacientes
      </button>

      {/*botón para abrir el formulario de citas*/}
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

      {/*aviso de mantenimiento*/}
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

      {/*mostramos la carga o el error de la API*/}
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

      {/*mostramos las tarjetas de métricas*/}
      {!cargando && !error && (
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {metricas.map((metrica) => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </section>
      )}
    </main>
  );
}
