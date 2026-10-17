import { useState } from 'react';
import MetricCard from './components/MetricCard';
import StatusBadge from './components/StatusBadge';
import PaginaPacientes from './components/pacientes/PaginaPacientes';
import type { Metrica } from './types';

function App() {
  //guardamos si el sistema está funcionando
  const [activo, setActivo] = useState(true);

  //guardamos la cantidad de pacientes
  const [pacientes, setPacientes] = useState(120);

  //controlamos qué página mostramos
  const [pagina, setPagina] = useState<'dashboard' | 'pacientes'>(
    'dashboard',
  );

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
      id: 'citas',
      titulo: 'Citas Hoy',
      valor: 18,
      descripcion: 'Citas programadas',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'pendientes',
      titulo: 'Consultas Pendientes',
      valor: 5,
      descripcion: 'Consultas por atender',
      tendencia: 'negativa',
      icono: '📝',
    },
    {
      id: 'disponibilidad',
      titulo: 'Disponibilidad',
      valor: '85%',
      descripcion: 'Turnos disponibles',
      tendencia: 'positiva',
      icono: '🕒',
    },
  ];

  // Mostramos la página seleccionada
  if (pagina === 'pacientes') {
    return (
      <>
        <nav className="bg-white p-4 shadow-sm">
          <button
            onClick={() => setPagina('dashboard')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Volver al Dashboard
          </button>
        </nav>

        <PaginaPacientes />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">
        Clínica Salud Integral
      </h1>

      {/*botón para abrir la página de pacientes*/}
      <button
        onClick={() => setPagina('pacientes')}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
      >
        Ver pacientes
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

      {/*mostramos las tarjetas de métricas*/}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {metricas.map((metrica) => (
          <MetricCard key={metrica.id} metrica={metrica} />
        ))}
      </section>

      {/*modificamos la cantidad de pacientes*/}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setPacientes(pacientes - 1)}
          className="rounded-lg bg-rose-600 px-4 py-2 text-white"
        >
          - Paciente
        </button>

        <button
          onClick={() => setPacientes(pacientes + 1)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
        >
          + Paciente
        </button>
      </div>
    </main>
  );
}

export default App;
