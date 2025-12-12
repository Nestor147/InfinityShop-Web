export interface Respuesta <T = any> {
  datos?: T;
  mensajes?: string[];
}

export interface Mensaje{
  tipo: string;
  descripcion: string
}

export interface Respuesta{
  proceso: string,
  filasAfectadas: number
}

export interface Paginacion{
  totalRegistros: number;
  tamanoDePagina: number;
  paginaActual: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}
export interface ResponseAuthentication<T>{
  datos?: T,
  respuestas?: Respuesta,
  mensajes?: Mensaje[],
  paginacion?: Paginacion
}

export interface ApiResponse<T> {
  data: T;
	messages?: any;
  statusCode: number;
    success?: boolean;
  message?: string;
}
