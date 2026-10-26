import { useCallback, useEffect, useState } from 'react';

//definimos el hook para reutilizar peticiones
export function useApi<T>(peticion: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  //ejecutamos la petición y controlamos su resultado
  const recargar = useCallback(() => {
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let activo = true;

    async function obtenerDatos() {
      setCargando(true);
      setError(null);

      try {
        const resultado = await peticion();

        if (activo) {
          setData(resultado);
        }
      } catch {
        if (activo) {
          setError('No se pudieron cargar los datos');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void obtenerDatos();

    //evitamos actualizar el estado al desmontar el componente
    return () => {
      activo = false;
    };
  }, [peticion, intento]);

  return { data, cargando, error, recargar };
}
