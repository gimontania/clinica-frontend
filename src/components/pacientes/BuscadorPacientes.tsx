//propiedades que recibe el buscador
interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

//campo de búsqueda de pacientes
function BuscadorPacientes({
  value,
  onChange,
}: BuscadorPacientesProps) {
  return (
    <div className="w-full">
      {/*etiqueta del campo*/}
      <label
        htmlFor="buscar-paciente"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Buscar paciente
      </label>

      {/*el componente informa cada cambio al componente padre*/}
      <input
        id="buscar-paciente"
        type="text"
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        placeholder="Buscar por nombre, apellido o email..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default BuscadorPacientes;
