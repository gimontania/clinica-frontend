import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PaginaDashboard from './components/PaginaDashboard';
import PaginaPacientes from './components/pacientes/PaginaPacientes';
import PaginaDetallePaciente from './components/PaginaDetallePaciente';
import FormularioCita from './components/citas/FormularioCita';
import PaginaNotFound from './components/PaginaNotFound';
import PaginaReportes from './components/PaginaReportes';
import PaginaLogin from './components/PaginaLogin';
import RutaProtegida from './components/RutaProtegida';
import PaginaSinAcceso from './components/PaginaSinAcceso';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RutaProtegida />}>
        <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route
            path="/pacientes/:id"
            element={<PaginaDetallePaciente />}
          />
          <Route path="/citas/nueva" element={<FormularioCita />} />

          <Route
            element={
              <RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />
            }
          >
            <Route path="/reportes" element={<PaginaReportes />} />
          </Route>
        </Route>

        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
