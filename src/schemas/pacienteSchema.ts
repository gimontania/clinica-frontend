import { z } from 'zod';


export const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string(),
  email: z.string().trim().email('Ingresá un email válido'),
  estado: z.enum(['activo', 'inactivo', 'en_espera']),
});


export type PacienteFormData = z.infer<typeof pacienteSchema>;
