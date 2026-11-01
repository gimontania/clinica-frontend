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
import PaginaPerfil from './components/PaginaPerfil';
import PaginaHistorialCitas from './components/PaginaHistorialCitas';
import ErrorBoundary from './shared/components/ui/ErrorBoundary';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RutaProtegida />}>
        <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <PaginaDashboard />
              </ErrorBoundary>
            }
          />
          <Route
            path="/perfil"
            element={
              <ErrorBoundary>
                <PaginaPerfil />
              </ErrorBoundary>
            }
          />
          <Route
            path="/pacientes"
            element={
              <ErrorBoundary>
                <PaginaPacientes />
              </ErrorBoundary>
            }
          />
          <Route
            path="/pacientes/:id"
            element={
              <ErrorBoundary>
                <PaginaDetallePaciente />
              </ErrorBoundary>
            }
          />
          <Route
            path="/citas/nueva"
            element={
              <ErrorBoundary>
                <FormularioCita />
              </ErrorBoundary>
            }
          />
          <Route
            path="/historial"
            element={
              <ErrorBoundary>
                <PaginaHistorialCitas />
              </ErrorBoundary>
            }
          />

          <Route
            element={
              <RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />
            }
          >
            <Route
              path="/reportes"
              element={
                <ErrorBoundary>
                  <PaginaReportes />
                </ErrorBoundary>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
