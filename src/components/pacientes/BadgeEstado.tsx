import type { EstadoPaciente } from '../../types/paciente';

//props que recibe el componente
interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

//muestra el estado con un color diferente
function BadgeEstado({ estado }: BadgeEstadoProps) {
  //colores según el estado del paciente
  const colores = {
    activo: 'bg-green-100 text-green-700',
    inactivo: 'bg-red-100 text-red-700',
    en_espera: 'bg-yellow-100 text-yellow-700',
  };

  //texto que verá el usuario
  const textos = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    en_espera: 'En espera',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${colores[estado]}`}
    >
      {textos[estado]}
    </span>
  );
}

export default BadgeEstado;
