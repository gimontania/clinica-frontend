import { useEffect, useState } from 'react';

//definimos los datos de cada médico
type Medico = {
  id: string;
  nombre: string;
  especialidad: string;
};

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    //simulamos la carga de médicos
    const timer = setTimeout(() => {
      //guardamos los médicos
      setMedicos([
        { id: '1', nombre: 'Joshua Kessler', especialidad: 'Clínica médica' },
        { id: '2', nombre: 'Mariana Torres', especialidad: 'Cardiología' },
        { id: '3', nombre: 'Cristian Eisbruch', especialidad: 'Pediatría' },
      ]);

      //indicamos que terminó la carga
      setCargando(false);
    }, 800);

    //cancelamos el timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
