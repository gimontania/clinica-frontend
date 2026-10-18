import { z } from 'zod';

export const citaSchema = z.object({
  pacienteNombre: z.string().min(3, 'El nombre debe tener mínimo 3 caracteres'),

  medicoId: z.string().min(1, 'Debes seleccionar un médico'),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD')
    .refine((fecha) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return new Date(`${fecha}T00:00:00`) >= hoy;
    }, 'La fecha no puede ser pasada'),

  hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'La hora debe estar entre 00:00 y 23:59'),

  motivo: z
    .string()
    .min(10, 'Debe introducir un mínimo de 10 caracteres')
    .max(500, 'El motivo no puede superar los 500 caracteres'),

  urgencia: z.enum(['baja', 'media', 'alta', 'critica']),
});

export type CitaFormData = z.infer<typeof citaSchema>;
