import { useState } from 'react';
import { pacientes } from '../../data/pacientes';
import type { Paciente } from '../../types/paciente';
import BuscadorPacientes from './BuscadorPacientes';
import PacienteRow from './PacienteRow';

 
//página principal de pacientes
function PaginaPacientes() {
  //estado local para guardar lo que se escribe en el buscador
  const [busqueda, setBusqueda] = useState('');

  //lista tipada de pacientes
  const listaPacientes: Paciente[] = pacientes;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/*encabezado de la página*/}
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">
          Gestión de clínica
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Pacientes
        </h1>

        <p className="mt-2 text-gray-500">
          Consulta la información de tus pacientes.
        </p>
      </header>

      {/*buscador y cantidad de pacientes*/}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="mb-5">
          <BuscadorPacientes
            value={busqueda}
            onChange={setBusqueda}
          />
        </div>

        <p className="text-sm text-gray-500">
          Total de pacientes: {listaPacientes.length}
        </p>
      </section>

      {/*lista de tarjetas de pacientes*/}
      <section className="flex flex-col gap-4">
        {listaPacientes.map((paciente) => (
          <PacienteRow key={paciente.id} paciente={paciente} />
        ))}
      </section>
    </main>
  );
}

export default PaginaPacientes;
