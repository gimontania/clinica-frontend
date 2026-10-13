import type { Metrica } from '../types';

//definimos las propiedades que recibirá nuestro componente
interface MetricCardProps {
  metrica: Metrica; //recibimos una métrica con su información
}

//creamos el componente que mostrará una tarjeta del Dashboard
function MetricCard( { metrica } : MetricCardProps) {
  //elegimos el color según la tendencia de la métrica
  const colores: Record<Metrica['tendencia'], string> = {
    positiva: 'text-emerald-600',
    negativa: 'text-rose-600',
    neutra: 'text-slate-500',
  };

  return (
    //tarjeta con rounded bordes=redondeados y shadow=sombra
    <article className="rounded-2xl bg-white p-6 shadow-lg">
      {/*mostramos el título y el icono de la métrica*/}
      <div className="flex items-center justify-between"> {/*flex coloca los elementos en una fila por defecto, items center los alinea verticalmente y justify-between separa los elementos de un contenedor flex, colocando espacio entre ellos */}
        <h2 className="text-sm font-medium text-slate-600"> {/*text-slate cambia el color del texto*/}
          {metrica.titulo}
        </h2>

        <span className="text-2xl" aria-hidden="true">
          {metrica.icono}
        </span>
      </div>

      {/*mostramos el valor principal*/}
      <p className="mt-4 text-3xl font-bold text-slate-800">
        {metrica.valor}
      </p>

      {/*mostramos la descripción con el color de su tendencia*/}
      <p className={`mt-2 text-sm ${colores[metrica.tendencia]}`}>
        {metrica.descripcion}
      </p>
    </article>
  );
}

 
export default MetricCard;