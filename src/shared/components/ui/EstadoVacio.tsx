interface EstadoVacioProps {
  titulo: string;
  mensaje: string;
  textoAccion?: string;
  onAccion?: () => void;
}

export default function EstadoVacio({
  titulo,
  mensaje,
  textoAccion,
  onAccion,
}: EstadoVacioProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
      <p className="mt-2 text-slate-500">{mensaje}</p>

      {textoAccion && onAccion && (
        <button
          type="button"
          onClick={onAccion}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          {textoAccion}
        </button>
      )}
    </div>
  );
}
