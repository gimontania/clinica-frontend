export default function SkeletonCitaRow() {
  return (
    <div
      className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"
      role="status"
      aria-label="Cargando cita"
    >
      <div className="mb-3 h-4 w-40 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-56 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-44 rounded bg-slate-200" />
      <div className="h-3 w-28 rounded bg-slate-200" />
    </div>
  );
}
