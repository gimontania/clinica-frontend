//definimos qué información recibirá el componente
interface StatusBadgeProps {
  activo: boolean; //indica si el sistema está funcionando
}

//creamos el componente que muestra el estado del sistema
function StatusBadge({ activo }: StatusBadgeProps) {
  return (
    <span
      className={
        activo
          ? 'rounded-full bg-emerald-100 px-3 py-1 text-emerald-700'
          : 'rounded-full bg-rose-100 px-3 py-1 text-rose-700'
      }
    >
      {/*mostramos un mensaje según el estado*/}
      { activo ? 'Sistema Operativo' : 'Modo Mantenimiento' }
    </span>
  );
}


export default StatusBadge;