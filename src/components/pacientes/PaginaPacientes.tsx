import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Paciente } from '../../types/paciente';
import { api } from '../../lib/axios';
import BuscadorPacientes from './BuscadorPacientes';
import PacienteRow from './PacienteRow';

//definimos la respuesta del backend
interface RespuestaPacientes {
  data: Paciente[];
  total: number;
}

//página principal de pacientes
function PaginaPacientes() {
  //guardamos los pacientes en el estado
  const [pacientesEstado, setPacientesEstado] = useState<Paciente[]>([]);

  //guardamos la cantidad real de pacientes
  const [totalPacientes, setTotalPacientes] = useState(0);

  //guardamos el estado de carga
  const [cargando, setCargando] = useState(true);

  //guardamos los valores de los filtros
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');

  //guardamos los datos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Paciente['estado']>('activo');

  //guardamos los mensajes de error
  const [error, setError] = useState('');

  //consultamos los pacientes al abrir la página
  async function cargarPacientes() {
    try {
      setCargando(true);
      setError('');

      const respuesta = await api.get<RespuestaPacientes>('/pacientes');

      setPacientesEstado(respuesta.data.data);
      setTotalPacientes(respuesta.data.total);
    } catch {
      setError('No se pudieron cargar los pacientes. Intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
  }, []);

  //filtramos por nombre y estado al mismo tiempo
  const pacientesFiltrados = pacientesEstado.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (estadoFiltro === 'Todos' || paciente.estado === estadoFiltro)
  );

  //agregamos un paciente nuevo a la lista local
  function agregarPaciente() {
    //validamos los campos obligatorios
    if (!nombre.trim() || !email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    //creamos el nuevo paciente
    const nuevoPaciente: Paciente = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono: '',
      especialidadAsignada: '',
      ultimaCita: '',
      estado,
    };

    //agregamos el paciente a la lista
    setPacientesEstado((prev) => [...prev, nuevoPaciente]);
    setTotalPacientes((prev) => prev + 1);

    //limpiamos el formulario
    setNombre('');
    setApellido('');
    setEmail('');
    setEstado('activo');
    setError('');
  }

  //cambiamos el estado de un paciente en la lista local
  function cambiarEstado(id: Paciente['id'], nuevoEstado: Paciente['estado']) {
    setPacientesEstado((prev) =>
      prev.map((paciente) =>
        paciente.id === id
          ? { ...paciente, estado: nuevoEstado }
          : paciente
      )
    );
  }

  //eliminamos un paciente de la lista local
  function eliminarPaciente(id: Paciente['id']) {
    const confirmar = window.confirm(
      '¿Confirmas que deseas eliminar este paciente?'
    );

    if (confirmar) {
      setPacientesEstado((prev) =>
        prev.filter((paciente) => paciente.id !== id)
      );
      setTotalPacientes((prev) => Math.max(0, prev - 1));
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
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={cargarPacientes}
            className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      {/*buscador y filtros*/}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-4">
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
        </div>

        {/*filtro por estado*/}
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
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            <option value="Todos">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="en_espera">En espera</option>
          </select>
        </div>

        {/*limpiamos ambos filtros*/}
        <button
          type="button"
          onClick={() => {
            setBusqueda('');
            setEstadoFiltro('Todos');
          }}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Limpiar filtros
        </button>

        <p className="mt-4 text-sm text-gray-500">
          {totalPacientes} paciente(s) registrado(s)
        </p>
      </section>

      {/*formulario para agregar pacientes*/}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Agregar paciente
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            agregarPaciente();
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {/*nombre*/}
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          {/*apellido*/}
          <div>
            <label htmlFor="apellido" className="mb-1 block text-sm">
              Apellido
            </label>
            <input
              id="apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>

          {/*estado inicial*/}
          <div>
            <label htmlFor="estado" className="mb-1 block text-sm">
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as Paciente['estado'])
              }
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="en_espera">En espera</option>
            </select>
          </div>

          {/*mensaje de error del formulario*/}
          {error && (
            <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
          )}

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 sm:col-span-2"
          >
            Agregar paciente
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

              {/*controles para modificar el paciente*/}
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
                      e.target.value as Paciente['estado']
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
                  onClick={() => eliminarPaciente(paciente.id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export default PaginaPacientes;
