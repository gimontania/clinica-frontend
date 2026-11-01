import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/axios';
import { extraerMensajeError } from '../lib/errores';
import type { Cita, EstadoCita } from '../services/citas';
import type { RespuestaPaginada } from '../types/api';

type FiltroEstado = 'Todos' | EstadoCita;

interface RespuestaApiCitas {
  data: Cita[];
  total: number;
}

const POR_PAGINA = 10;

const estados: FiltroEstado[] = [
  'Todos',
  'Programada',
  'Completada',
  'Cancelada',
];

export default function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pagina = Math.max(1, Number(searchParams.get('pagina')) || 1);
  const estado = (estados.includes(searchParams.get('estado') as FiltroEstado)
    ? searchParams.get('estado')
    : 'Todos') as FiltroEstado;

  const [citas, setCitas] = useState<Cita[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarCitas() {
      try {
        setCargando(true);
        setError('');

        const respuesta = await api.get<RespuestaApiCitas>('/citas', {
          params: estado === 'Todos' ? {} : { estado },
          signal: controlador.signal,
        });

        if (controlador.signal.aborted) return;

        setCitas(respuesta.data.data);
        setTotal(respuesta.data.total);
      } catch (err: unknown) {
        if (controlador.signal.aborted) return;
        setError(extraerMensajeError(err));
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    void cargarCitas();

    return () => controlador.abort();
  }, [estado]);

  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;

  const respuestaPaginada: RespuestaPaginada<Cita> = {
    data: citas.slice(inicio, inicio + POR_PAGINA),
    total,
    pagina,
    totalPaginas,
  };

  function cambiarEstado(nuevoEstado: FiltroEstado) {
    setSearchParams({
      pagina: '1',
      estado: nuevoEstado,
    });
  }

  function cambiarPagina(nuevaPagina: number) {
    setSearchParams({
      pagina: String(nuevaPagina),
      estado,
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="mb-2 text-3xl font-bold text-blue-600">
        Historial de citas
      </h1>

      <p className="mb-6 text-slate-600">
        Consultá y filtrá las citas registradas en la clínica.
      </p>

      <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <label
          htmlFor="estado"
          className="mb-2 block font-semibold text-slate-700"
        >
          Filtrar por estado
        </label>

        <select
          id="estado"
          value={estado}
          onChange={(evento) =>
            cambiarEstado(evento.target.value as FiltroEstado)
          }
          className="w-full rounded-lg border border-slate-300 p-3 md:w-72"
        >
          {estados.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </section>

      {cargando && (
        <section role="status" aria-label="Cargando citas">
          {Array.from({ length: POR_PAGINA }, (_, indice) => (
            <div
              key={indice}
              className="mb-3 h-16 animate-pulse rounded-lg bg-white shadow-sm"
            />
          ))}
        </section>
      )}

      {!cargando && error && (
        <div
          role="alert"
          className="rounded-xl bg-rose-100 p-4 text-rose-700"
        >
          No pudimos cargar el historial: {error}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-3 font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <section className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-200 text-slate-700">
                <tr>
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Hora</th>
                  <th className="p-4">Médico</th>
                  <th className="p-4">Motivo</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                {respuestaPaginada.data.map((cita) => (
                  <tr key={cita.id} className="border-t border-slate-200">
                    <td className="p-4">{cita.pacienteNombre || 'Sin nombre'}</td>
                    <td className="p-4">{cita.fecha}</td>
                    <td className="p-4">{cita.hora}</td>
                    <td className="p-4">{cita.medicoId}</td>
                    <td className="p-4">{cita.motivo}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}

                {respuestaPaginada.data.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-slate-500"
                    >
                      No hay citas para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              Página {respuestaPaginada.pagina} de {respuestaPaginada.totalPaginas}
              {' — '}
              {respuestaPaginada.total} registros
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={pagina <= 1}
                onClick={() => cambiarPagina(pagina - 1)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                ← Anterior
              </button>

              <button
                type="button"
                disabled={pagina >= totalPaginas}
                onClick={() => cambiarPagina(pagina + 1)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}