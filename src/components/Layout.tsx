import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/*mostramos el menú lateral*/}
      <aside className="w-full bg-slate-900 p-6 text-white md:min-h-screen md:w-64 md:shrink-0">
        <h2 className="mb-8 text-xl font-bold">
          Clínica Salud Integral
        </h2>

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
      </aside>

      {/*mostramos la página seleccionada*/}
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
