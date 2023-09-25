let rutaBase = "/maestros";

export const clientePorCedula = function(ced) {
  return `${rutaBase}/clientes/cedula/${ced}`;
};

export const clientesPorNombre = function(estado, filtro, emp) {
  return `${rutaBase}/clientes/estado/${estado}/filtro/${filtro}/emp/${emp}/buscar`;
};

export const clientesBuscar = function(p) {
  
  return `${rutaBase}/clientes/estado/${p.estado}/atrib/${p.atributo}/filtro/${p.texto}/emp/${p.empresa}/buscar`;
};

export const proveedorPorCedula = function(ced) {
  return `${rutaBase}/proveedores/cedula/${ced}`;
};

export const proveedoresPorNombre = function(estado, filtro, emp) {
  return `${rutaBase}/proveedores/estado/${estado}/filtro/${filtro}/emp/${emp}/buscar`;
};