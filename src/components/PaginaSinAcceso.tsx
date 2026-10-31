import { Link } from 'react-router-dom';

export default function PaginaSinAcceso() {
return (
<main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
<section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
<div className="mb-4 text-5xl">🔒</div>



    <h1 className="mb-3 text-2xl font-bold text-slate-800">
      Sin acceso
    </h1>

    <p className="mb-6 text-slate-600">
      No tenés permisos para acceder a esta sección.
    </p>

    <Link
      to="/"
      className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      Volver al inicio
    </Link>
  </section>
</main>
);
}
