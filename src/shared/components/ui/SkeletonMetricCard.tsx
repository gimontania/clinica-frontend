export default function SkeletonMetricCard() {
  return (
    <div
      className="animate-pulse rounded-xl bg-white p-6 shadow-sm"
      role="status"
      aria-label="Cargando métrica"
    >
      <div className="mb-4 h-4 w-28 rounded bg-slate-200" />
      <div className="mb-3 h-8 w-20 rounded bg-slate-200" />
      <div className="h-3 w-36 rounded bg-slate-200" />
    </div>
  );
}
