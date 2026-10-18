import { Link } from 'react-router-dom';

export default function PaginaNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center">
      <span className="text-7xl">🔎</span>

      <h1 className="mt-4 text-5xl font-bold text-slate-800">
        Error 404
      </h1>

      <p className="mt-3 text-lg text-slate-600">
        La página no existe.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
