let rutaBase = "/ajustes";

export const registrosPorTabla = function(id) {
  return `${rutaBase}/tablas/${id}/registros`;
};

export const registroPorTablaIndice = function(id, indice) {
  return `${rutaBase}/tablas/${id}/registro/${indice}`;
};

export const registroPorId = function(id) {
  return `${rutaBase}/tablas/registros/${id}`;
};

export const sucursalesEmpresa = function(p) {
  return `${rutaBase}/sucursales/empresa/${p}`;
};

export const empresasPorEstado = function(p) {
  return `${rutaBase}/empresas/estado/${p}`;
};

export const plantillaPorTipo = function(p) {
  return `${rutaBase}/plantillas/tipo/${p}`;
};
