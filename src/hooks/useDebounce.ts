import { useEffect, useState } from "react";

export function useDebounce<T>(valor: T, delay: number = 350): T {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    //esperamos antes de actualizar el valor
    const timeout = setTimeout(() => {
      setDebounced(valor);
    }, delay);

    //cancelamos el timeout anterior si cambia el valor
    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return debounced;
}
