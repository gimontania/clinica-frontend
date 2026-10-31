import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PaginaDashboard from './components/PaginaDashboard';
import PaginaPacientes from './components/pacientes/PaginaPacientes';
import PaginaDetallePaciente from './components/PaginaDetallePaciente';
import FormularioCita from './components/citas/FormularioCita';
import PaginaNotFound from './components/PaginaNotFound';
import PaginaReportes from './components/PaginaReportes';
import PaginaLogin from './components/PaginaLogin';

function App() {
  return (
    <Routes>
      {/*mostramos la pantalla de inicio de sesión*/}
      <Route path="/login" element={<PaginaLogin />} />

      {/*mostramos las páginas con el menú lateral*/}
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes />} />
        <Route
          path="/pacientes/:id"
          element={<PaginaDetallePaciente />}
        />
        <Route path="/citas/nueva" element={<FormularioCita />} />
        <Route path="/reportes" element={<PaginaReportes />} />
      </Route>

      {/*mostramos un error si la ruta no existe*/}
      <Route path="*" element={<PaginaNotFound />} />
    </Routes>
  );
}

export default App;
