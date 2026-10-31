import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as iniciarSesion } from '../services/auth';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useAuthStore } from '../stores/authStore';
import { extraerMensajeError } from '../lib/errores';

export default function PaginaLogin() {
  const navigate = useNavigate();
  const guardarSesion = useAuthStore((state) => state.login);

   
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

   
  const onSubmit = async (datos: LoginFormData) => {
    try {
      const respuesta = await iniciarSesion(datos);

      guardarSesion(respuesta.token, respuesta.usuario);
      toast.success('¡Bienvenido!');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="text-5xl">🏥</span>

          <h1 className="mt-3 text-3xl font-bold text-slate-800">
            Clínica
          </h1>

          <p className="mt-2 text-slate-500">
            Ingresá a tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="admin@clinica.com"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Ingresá tu contraseña"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  );
}
