import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';

interface InputFotoPerfilProps {
  fotoActual?: string;
  onChange: (archivo: File | null) => void;
}

export default function InputFotoPerfil({
  fotoActual,
  onChange,
}: InputFotoPerfilProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSeleccion = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      e.target.value = '';
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      e.target.value = '';
      return;
    }

    setPreview(URL.createObjectURL(archivo));
    onChange(archivo);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview || fotoActual ? (
        <img
          src={preview ?? fotoActual}
          alt="Foto de perfil"
          className="h-32 w-32 rounded-full border-4 border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-200 text-4xl text-slate-500">
          👤
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSeleccion}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
      >
        Cambiar foto
      </button>
    </div>
  );
}
