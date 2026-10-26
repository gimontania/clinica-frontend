//definimos las propiedades del buscador
interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
  cargando: boolean;
}

//campo de búsqueda de pacientes
function BuscadorPacientes({
  value,
  onChange,
  cargando,
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

      {/*campo de búsqueda y spinner*/}
      <div className="relative">
        <input
          id="buscar-paciente"
          type="text"
          value={value}
          onChange={(evento) => onChange(evento.target.value)}
          placeholder="Buscar por nombre, apellido o email..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {/*mostramos el spinner mientras carga*/}
        {cargando && (
          <span
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
            role="status"
            aria-label="Buscando pacientes"
          />
        )}
      </div>
    </div>
  );
}

export default BuscadorPacientes;
