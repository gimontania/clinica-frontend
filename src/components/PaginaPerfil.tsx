import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import InputFotoPerfil from './InputFotoPerfil';
import { perfilSchema, type PerfilFormData } from '../schemas/perfilSchema';
import { actualizarPerfil } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import { extraerMensajeError } from '../lib/errores';

export default function PaginaPerfil() {
  const usuario = useAuthStore((state) => state.usuario);
  const actualizarUsuario = useAuthStore((state) => state.actualizarUsuario);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [versionFoto, setVersionFoto] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario?.nombre ?? '',
      email: usuario?.email ?? '',
      telefono: usuario?.telefono ?? '',
    },
  });

  const onSubmit = async (datos: PerfilFormData) => {
    const formData = new FormData();

    formData.append('nombre', datos.nombre);
    formData.append('email', datos.email);

    if (datos.telefono) {
      formData.append('telefono', datos.telefono);
    }

    if (archivoFoto) {
      formData.append('foto', archivoFoto);
    }

    try {
      const usuarioActualizado = await actualizarPerfil(formData);
      actualizarUsuario(usuarioActualizado);
      setArchivoFoto(null);
      setVersionFoto((version) => version + 1);
      toast.success('Perfil actualizado');
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <main className="p-6 md:p-10">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">
          Mi perfil
        </h1>

        <p className="mb-8 text-slate-500">
          Actualizá tus datos personales y tu foto de perfil.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputFotoPerfil
            key={versionFoto}
            fotoActual={usuario?.foto ?? undefined}
            onChange={setArchivoFoto}
          />

          <div>
            <label
              htmlFor="nombre"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              {...register('nombre')}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

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
              {...register('email')}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Teléfono (opcional)
            </label>

            <input
              id="telefono"
              type="tel"
              {...register('telefono')}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {errors.telefono && (
              <p className="mt-1 text-sm text-red-600">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </section>
    </main>
  );
}
