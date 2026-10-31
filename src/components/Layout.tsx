import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Layout() {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="w-full bg-slate-900 p-6 text-white md:min-h-screen md:w-64 md:shrink-0">
        <h2 className="mb-8 text-xl font-bold">
          Clínica Salud Integral
        </h2>

        <div className="mb-6 rounded-lg bg-slate-800 p-4">
          <NavLink
            to="/perfil"
            className="font-semibold transition hover:text-blue-300"
          >
            {usuario?.nombre ?? 'Usuario'}
          </NavLink>
          <p className="mt-1 text-sm text-slate-300">
            Rol: {usuario?.rol ?? 'Sin rol'}
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 ${
                isActive ? 'bg-blue-600' : 'hover:bg-slate-700'
              }`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/pacientes"
            end
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 ${
                isActive ? 'bg-blue-600' : 'hover:bg-slate-700'
              }`
            }
          >
            👥 Pacientes
          </NavLink>

          <NavLink
            to="/citas/nueva"
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 ${
                isActive ? 'bg-blue-600' : 'hover:bg-slate-700'
              }`
            }
          >
            📅 Nueva cita
          </NavLink>

          <NavLink
            to="/reportes"
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 ${
                isActive ? 'bg-blue-600' : 'hover:bg-slate-700'
              }`
            }
          >
            📈 Reportes
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
