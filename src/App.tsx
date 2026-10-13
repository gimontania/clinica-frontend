import MetricCard from './components/MetricCard';
import StatusBadge from './components/StatusBadge';
import { useState } from 'react';
import type { Metrica } from './types';

function App() {
  //guardamos si el sistema está funcionando
  const [activo, setActivo] = useState(true);

  //guardamos la cantidad de pacientes
  const [pacientes, setPacientes] = useState(120);

  //definimos las métricas que mostraremos en el Dashboard
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

  return (
    //main, contenedor principal
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">
        Clínica Salud Integral
      </h1>

      {/*mostramos el estado del sistema*/}
      <StatusBadge activo={activo} />

      {/*mostramos un aviso cuando el sistema está en mantenimiento*/}
      {!activo && (
        <p className="mt-4 rounded-lg bg-rose-100 p-3 text-rose-700">
          El sistema está en mantenimiento.
        </p>
      )}

      {/*botón para cambiar el estado del sistema*/}
      <button
        onClick={() => setActivo(!activo)}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Cambiar estado
      </button>

      {/*mostramos las tarjetas de métricas*/}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"> {/*con grid organizamos los elementos en una cuadrícula, como si fueran filas y columnas, ap es el espacio entre las tarjetas*/}
        {metricas.map((metrica) => (
          <MetricCard key={metrica.id} metrica={metrica} />
        ))}
      </section>

      {/*botones para modificar la cantidad de pacientes*/}
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