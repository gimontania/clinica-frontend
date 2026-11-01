interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  cargando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  cargando,
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h2
          id="titulo-modal"
          className="mb-3 text-xl font-semibold text-gray-900"
        >
          {titulo}
        </h2>

        <p className="mb-6 text-gray-600">{mensaje}</p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {cargando ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </section>
    </div>
  );
}

