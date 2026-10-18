import { useNavigate, useParams } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PaginaNotFound from './PaginaNotFound';
import { pacientes } from '../data/pacientes';

export default function PaginaDetallePaciente() {
  //obtenemos el id de la URL
  const { id } = useParams();

  //buscamos al paciente seleccionado
  const paciente = pacientes.find((p) => p.id === id);

  //volvemos a la página anterior
  const navegar = useNavigate();

  //mostramos un error si no existe el paciente
  if (!paciente) {
    return <PaginaNotFound />;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <button
        onClick={() => navegar(-1)}
        className="mb-6 rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
      >
        ← Volver
      </button>

      <section className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">
          Detalle del paciente
        </h1>

        <div className="space-y-4 text-slate-700">
          <p>
            <strong>Nombre:</strong> {paciente.nombre} {paciente.apellido}
          </p>

          <p>
            <strong>ID:</strong> {paciente.id}
          </p>

          <p>
            <strong>Email:</strong> {paciente.email}
          </p>

          <p>
            <strong>Teléfono:</strong> {paciente.telefono || 'Sin datos'}
          </p>

          <p>
            <strong>Especialidad:</strong>{' '}
            {paciente.especialidadAsignada || 'Sin asignar'}
          </p>

          <p>
            <strong>Última cita:</strong> {paciente.ultimaCita || 'Sin datos'}
          </p>

          <div className="flex items-center gap-2">
            <strong>Estado:</strong>
            <StatusBadge activo={paciente.estado === 'activo'} />
            {paciente.estado !== 'activo' && (
              <span>
                {paciente.estado === 'inactivo' ? 'Inactivo' : 'En espera'}
              </span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
