import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import type { Paciente } from '../../types/paciente';
import { usePacientesStore } from '../../stores/pacientesStore';
import { useFiltrosStore } from '../../stores/filtrosStore';
import { useDebounce } from '../../hooks/useDebounce';
import {
  pacienteSchema,
  type PacienteFormData,
} from '../../schemas/pacienteSchema';
import { extraerMensajeError } from '../../lib/errores';
import BuscadorPacientes from './BuscadorPacientes';
import PacienteRow from './PacienteRow';
import ModalConfirmacion from '../ModalConfirmacion';

//página principal de pacientes
function PaginaPacientes() {
  //obtenemos los datos de pacientes desde Zustand
  const pacientes = usePacientesStore((state) => state.pacientes);
  const cargando = usePacientesStore((state) => state.cargando);
  const error = usePacientesStore((state) => state.error);
  const cargar = usePacientesStore((state) => state.cargar);
  const crear = usePacientesStore((state) => state.crear);
  const actualizar = usePacientesStore((state) => state.actualizar);
  const eliminar = usePacientesStore((state) => state.eliminar);

  //obtenemos los filtros desde Zustand
  const busqueda = useFiltrosStore((state) => state.queryPacientes);
  const setBusqueda = useFiltrosStore((state) => state.setQueryPacientes);
  const resetFiltros = useFiltrosStore((state) => state.resetFiltros);
  const estadoFiltro = useFiltrosStore(
    (state) => state.estadoPacienteFiltro,
  );
  const setEstadoFiltro = useFiltrosStore(
    (state) => state.setEstadoPaciente,
  );

  //esperamos 350 ms antes de buscar
  const busquedaDebounced = useDebounce(busqueda, 350);

  //guardamos el paciente que queremos eliminar
  const [pacienteAEliminar, setPacienteAEliminar] =
    useState<Paciente | null>(null);

  //guardamos el id del paciente que se está eliminando
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  //configuramos el formulario con sus validaciones
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      estado: 'activo',
    },
  });

  //consultamos los pacientes al cambiar la búsqueda
  useEffect(() => {
    void cargar(busquedaDebounced.trim() || undefined);
  }, [cargar, busquedaDebounced]);

  //filtramos los pacientes por estado
  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      estadoFiltro === 'Todos' || paciente.estado === estadoFiltro,
  );

  //registramos un paciente
  async function agregarPaciente(datos: PacienteFormData) {
    try {
      await crear({
        ...datos,
        telefono: '',
        especialidadAsignada: '',
        ultimaCita: '',
      });

      //limpiamos el formulario
      reset();

      toast.success('Paciente registrado');
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  }

  //actualizamos el estado del paciente
  async function cambiarEstado(
    id: Paciente['id'],
    nuevoEstado: Paciente['estado'],
  ) {
    try {
      await actualizar(id, { estado: nuevoEstado });
      toast.success('Estado actualizado');
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  }

  //eliminamos el paciente confirmado
  async function eliminarPaciente() {
    if (!pacienteAEliminar) return;

    const id = pacienteAEliminar.id;

    try {
      setEliminandoId(id);
      await eliminar(id);
      setPacienteAEliminar(null);
      toast.success('Paciente eliminado');
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/*encabezado de la página*/}
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">
          Gestión de clínica
        </p>
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <p className="mt-2 text-gray-500">
          Consulta la información de tus pacientes.
        </p>
      </header>

      {/*mostramos la carga y los errores*/}
      {cargando && (
        <p className="mb-4 text-gray-600" role="status">
          Cargando pacientes...
        </p>
      )}

      {error && (
        <div
          className="mb-4 rounded-lg bg-red-100 p-4 text-red-700"
          role="alert"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void cargar(busquedaDebounced.trim() || undefined)}
            className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {/*buscador y filtros*/}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-4">
          <BuscadorPacientes
            value={busqueda}
            onChange={setBusqueda}
            cargando={cargando || busqueda !== busquedaDebounced}
          />
        </div>

        {/*filtramos por estado*/}
        <div className="mb-4">
          <label
            htmlFor="filtroEstado"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filtrar por estado
          </label>
          <select
            id="filtroEstado"
            value={estadoFiltro}
            onChange={(e) => {
              const estado = e.target.value;
              if (
                estado === 'Todos' ||
                estado === 'activo' ||
                estado === 'inactivo' ||
                estado === 'en_espera'
              ) {
                setEstadoFiltro(estado);
              }
            }}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            <option value="Todos">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </div>

        {/*limpiamos los filtros guardados en Zustand*/}
        <button
          type="button"
          onClick={resetFiltros}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Limpiar filtros
        </button>

        <p className="mt-4 text-sm text-gray-500">
          {pacientes.length} paciente(s) registrado(s)
        </p>
      </section>

      {/*formulario para agregar pacientes*/}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Agregar paciente
        </h2>
        <form
          onSubmit={handleSubmit(agregarPaciente)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          noValidate
        >
          {/*nombre*/}
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              {...register('nombre')}
              aria-invalid={!!errors.nombre}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/*apellido*/}
          <div>
            <label htmlFor="apellido" className="mb-1 block text-sm">
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              {...register('apellido')}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          {/*email*/}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm">
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
            {errors.email && (
              <p className="text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/*estado inicial*/}
          <div>
            <label htmlFor="estado" className="mb-1 block text-sm">
              Estado
            </label>
            <select
              id="estado"
              {...register('estado')}
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_espera">En espera</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:col-span-2"
          >
            {isSubmitting ? 'Registrando...' : 'Agregar paciente'}
          </button>
        </form>
      </section>

      {/*lista de pacientes*/}
      {!cargando && !error && (
        <section className="flex flex-col gap-4">
          {pacientesFiltrados.map((paciente) => (
            <div key={paciente.id}>
              <PacienteRow paciente={paciente} />

              {/*enlace al detalle del paciente*/}
              <div className="mt-2 rounded-lg bg-white p-3">
                <Link
                  to={`/pacientes/${paciente.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver detalle →
                </Link>
              </div>

              {/*controles del paciente*/}
              <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg bg-white p-3">
                <label
                  htmlFor={`estado-${paciente.id}`}
                  className="text-sm text-gray-700"
                >
                  Cambiar estado:
                </label>
                <select
                  id={`estado-${paciente.id}`}
                  value={paciente.estado}
                  onChange={(e) =>
                    cambiarEstado(
                      paciente.id,
                      e.target.value as Paciente['estado'],
                    )
                  }
                  className="rounded-lg border border-gray-300 p-2"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="en_espera">En espera</option>
                </select>

                <button
                  type="button"
                  onClick={() => setPacienteAEliminar(paciente)}
                  disabled={eliminandoId === paciente.id}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {eliminandoId === paciente.id
                    ? 'Eliminando...'
                    : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/*confirmamos antes de eliminar*/}
      <ModalConfirmacion
        abierto={pacienteAEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={`¿Confirmás que deseas eliminar a ${pacienteAEliminar?.nombre ?? 'este paciente'}?`}
        cargando={eliminandoId !== null}
        onConfirmar={eliminarPaciente}
        onCancelar={() => setPacienteAEliminar(null)}
      />
    </main>
  );
}

export default PaginaPacientes;
