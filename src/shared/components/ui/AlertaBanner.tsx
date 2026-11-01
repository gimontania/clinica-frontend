type TipoAlerta = 'info' | 'success' | 'warning' | 'error';

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  onCerrar?: () => void;
}

const estilos: Record<TipoAlerta, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-800',
};

export default function AlertaBanner({
  tipo,
  mensaje,
  onCerrar,
}: AlertaBannerProps) {
  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`flex items-center justify-between gap-3 rounded-lg border p-4 ${estilos[tipo]}`}
    >
      <p>{mensaje}</p>

      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar alerta"
          className="font-semibold"
        >
          ×
        </button>
      )}
    </div>
  );
}
