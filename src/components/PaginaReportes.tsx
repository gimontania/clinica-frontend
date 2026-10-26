import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../lib/axios';
import { extraerMensajeError } from '../lib/errores';

//definimos los datos de los reportes
interface Especialidad {
  especialidad: string;
  total: number;
}

interface CitaDiaria {
  fecha: string;
  total: number;
}

interface RespuestaEspecialidades {
  data: Especialidad[];
  total: number;
}

interface RespuestaCitasDiarias {
  data: CitaDiaria[];
  total: number;
}

export default function PaginaReportes() {
  //guardamos los datos de los graficos
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [citasDiarias, setCitasDiarias] = useState<CitaDiaria[]>([]);

  //controlamos la carga y los errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  //consultamos los reportes de la API
  useEffect(() => {
    async function cargarReportes() {
      try {
        setCargando(true);
        setError('');

        const [respuestaEspecialidades, respuestaCitas] = await Promise.all([
          api.get<RespuestaEspecialidades>('/reportes/especialidades'),
          api.get<RespuestaCitasDiarias>('/reportes/citas-diarias'),
        ]);

        setEspecialidades(respuestaEspecialidades.data.data);
        setCitasDiarias(respuestaCitas.data.data);
      } catch (err: unknown) {
        setError(extraerMensajeError(err));
      } finally {
        setCargando(false);
      }
    }

    void cargarReportes();
  }, []);

  //mostramos la fecha en formato corto
  function formatearFecha(fecha: string) {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-2 text-3xl font-bold text-blue-600">
        Reportes y estadísticas
      </h1>

      <p className="mb-8 text-slate-600">
        Información de pacientes y citas de la clínica.
      </p>

      {/*mostramos la carga*/}
      {cargando && (
        <div role="status" className="grid gap-6 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm" />
          <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm" />
          <p className="text-slate-600">Cargando reportes...</p>
        </div>
      )}

      {/*mostramos los errores*/}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-rose-100 p-4 text-rose-700"
        >
          <p>No pudimos cargar los reportes: {error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {/*mostramos los graficos cuando terminan de cargar*/}
      {!cargando && !error && (
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/*grafico de pacientes por especialidad*/}
          <article className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-800">
              Pacientes por especialidad
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Cantidad de pacientes registrados en cada especialidad.
            </p>

            {especialidades.length === 0 ? (
              <p className="py-16 text-center text-slate-500">
                No hay datos de especialidades para mostrar.
              </p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={especialidades}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="especialidad" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      name="Pacientes"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>

          {/*grafico de citas por dia*/}
          <article className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-800">
              Citas de los últimos 7 días
            </h2>

            <p className="mb-6 text-sm text-slate-500">
              Cantidad de citas registradas por día.
            </p>

            {citasDiarias.length === 0 ? (
              <p className="py-16 text-center text-slate-500">
                No hay datos de citas para mostrar.
              </p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={citasDiarias}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="fecha"
                      tickFormatter={formatearFecha}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(etiqueta) =>
                        typeof etiqueta === 'string'
                          ? formatearFecha(etiqueta)
                          : etiqueta
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Citas"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </article>
        </section>
      )}
    </main>
  );
}
