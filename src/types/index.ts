//definimos las tendencias posibles de una métrica
export type Tendencia = 'positiva' | 'negativa' | 'neutra';

//definimos qué información tendrá cada métrica  
export interface Metrica {
  id: string; 
  titulo: string; //nombre que verá el usuario
  valor: number | string;  
  descripcion: string; //información adicional
  tendencia: Tendencia; //estado de la tendencia
  icono: string;  
}