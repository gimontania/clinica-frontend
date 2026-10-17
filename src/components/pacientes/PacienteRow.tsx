import type { Paciente } from '../../types/paciente';
import BadgeEstado from './BadgeEstado';

//props que recibe el componente
interface PacienteRowProps {
  paciente: Paciente;
}

//muestra los datos de un paciente
function PacienteRow({ paciente }: PacienteRowProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid md:grid-cols-2 lg:grid-cols-4">
      {/*nombre y apellido*/}
      <div>
        <p className="font-semibold text-gray-800">
          {paciente.nombre} {paciente.apellido}
        </p>
        <p className="text-sm text-gray-500">{paciente.email}</p>
      </div>

      {/*teléfono y especialidad*/}
      <div>
        <p className="text-sm text-gray-600">{paciente.telefono}</p>
        <p className="text-sm text-gray-500">
          {paciente.especialidadAsignada}
        </p>
      </div>

      {/*última cita*/}
      <div>
        <p className="text-xs text-gray-500">Última cita</p>
        <p className="text-sm text-gray-700">{paciente.ultimaCita}</p>
      </div>

      {/*estado del paciente*/}
      <div className="flex items-center">
        <BadgeEstado estado={paciente.estado} />
      </div>
    </article>
  );
}

export default PacienteRow;
