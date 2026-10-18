import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { citaSchema, type CitaFormData } from '../../schemas/citaSchema';
import { useMedicos } from '../../hooks/useMedicos';

export default function FormularioCita() {
  const { medicos, cargando } = useMedicos();
  const [citaAgendada, setCitaAgendada] = useState<CitaFormData | null>(null);

  //navegamos a la página anterior
  const navegar = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      pacienteNombre: '',
      medicoId: '',
      fecha: '',
      hora: '',
      motivo: '',
      urgencia: 'media',
    },
  });

  //simulamos el envío de la cita
  const agendarCita = async (datos: CitaFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCitaAgendada(datos);
  };

  //limpiamos el formulario para agendar otra cita
  const agendarOtraCita = () => {
    reset();
    setCitaAgendada(null);
  };

  //definimos la fecha mínima permitida
  const fechaMinima = new Date().toISOString().split('T')[0];

  //mostramos la confirmación de la cita
  if (citaAgendada) {
    const medicoSeleccionado = medicos.find(
      (medico) => medico.id === citaAgendada.medicoId,
    );

    return (
      <section>
        <h2>¡Cita agendada correctamente!</h2>

        <div>
          <p>
            <strong>Paciente:</strong> {citaAgendada.pacienteNombre}
          </p>
          <p>
            <strong>Médico:</strong> {medicoSeleccionado?.nombre}
          </p>
          <p>
            <strong>Fecha:</strong> {citaAgendada.fecha}
          </p>
          <p>
            <strong>Hora:</strong> {citaAgendada.hora}
          </p>
          <p>
            <strong>Motivo:</strong> {citaAgendada.motivo}
          </p>
          <p>
            <strong>Urgencia:</strong> {citaAgendada.urgencia}
          </p>
        </div>

        <button type="button" onClick={agendarOtraCita}>
          Agendar otra cita
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>Nueva cita</h1>

      <form onSubmit={handleSubmit(agendarCita)} noValidate>
        <div>
          <label htmlFor="pacienteNombre">Nombre del paciente</label>
          <input
            id="pacienteNombre"
            {...register('pacienteNombre')}
            aria-invalid={!!errors.pacienteNombre}
            className={errors.pacienteNombre ? 'borde-error' : ''}
          />
          {errors.pacienteNombre && (
            <p className="error">{errors.pacienteNombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="medicoId">Médico</label>
          <select
            id="medicoId"
            {...register('medicoId')}
            disabled={cargando}
            aria-invalid={!!errors.medicoId}
            className={errors.medicoId ? 'borde-error' : ''}
          >
            <option value="">
              {cargando ? 'Cargando médicos...' : 'Selecciona un médico'}
            </option>

            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nombre} - {medico.especialidad}
              </option>
            ))}
          </select>
          {errors.medicoId && (
            <p className="error">{errors.medicoId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fecha">Fecha de la cita</label>
          <input
            id="fecha"
            type="date"
            min={fechaMinima}
            {...register('fecha')}
            aria-invalid={!!errors.fecha}
            className={errors.fecha ? 'borde-error' : ''}
          />
          {errors.fecha && <p className="error">{errors.fecha.message}</p>}
        </div>

        <div>
          <label htmlFor="hora">Hora de la cita</label>
          <input
            id="hora"
            type="time"
            {...register('hora')}
            aria-invalid={!!errors.hora}
            className={errors.hora ? 'borde-error' : ''}
          />
          {errors.hora && <p className="error">{errors.hora.message}</p>}
        </div>

        <div>
          <label htmlFor="motivo">Motivo de la consulta</label>
          <textarea
            id="motivo"
            {...register('motivo')}
            rows={4}
            aria-invalid={!!errors.motivo}
            className={errors.motivo ? 'borde-error' : ''}
          />
          {errors.motivo && <p className="error">{errors.motivo.message}</p>}
        </div>

        <div>
          <label htmlFor="urgencia">Nivel de urgencia</label>
          <select
            id="urgencia"
            {...register('urgencia')}
            aria-invalid={!!errors.urgencia}
            className={errors.urgencia ? 'borde-error' : ''}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          {errors.urgencia && (
            <p className="error">{errors.urgencia.message}</p>
          )}
        </div>

        {/*botones del formulario*/}
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Agendando...' : 'Agendar cita'}
          </button>

          <button type="button" onClick={() => navegar(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}