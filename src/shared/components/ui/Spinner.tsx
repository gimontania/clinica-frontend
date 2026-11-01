interface SpinnerProps {
  pantallaCompleta?: boolean;
  mensaje?: string;
}

export default function Spinner({
  pantallaCompleta = false,
  mensaje = 'Cargando...',
}: SpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        pantallaCompleta ? 'min-h-screen' : 'p-4'
      }`}
      role="status"
      aria-label={mensaje}
    >
      <span className="h-6 w-6 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <span className="text-sm text-slate-600">{mensaje}</span>
    </div>
  );
}
