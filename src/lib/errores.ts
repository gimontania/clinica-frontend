import axios from 'axios';

export function extraerMensajeError(err: unknown): string {
  //comprobamos si el error viene de Axios
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? 'Error del servidor';
  }

  //comprobamos si es un error normal de JavaScript
  if (err instanceof Error) {
    return err.message;
  }

  return 'Error inesperado';
}
