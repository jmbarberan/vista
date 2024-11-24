import { app } from "@/main";
let rutaBase = "/inventarios";

export const productoPorId = function(id) {
  return `${rutaBase}/productos/${id}`;
};

export const productosBuscar = function(emp, tipo, atrib, estado, filtro) {
  return `${rutaBase}/productos/emp/${emp}/tipo/${tipo}/estado/${estado}/atributo/${atrib}/filtro/${filtro}/buscar`;                    
};
export const productoSeleccionar = function(p) {
  return `${rutaBase}/productos/emp/${p.emp}/estado/${p.estado}/filtro/${p.filtro}/extendida/${p.ext}/seleccionar`;
};
export const productoExistencias = function(id, bodega) {
  return `${rutaBase}/productos/${id}/bodega/${bodega}/existencia`;
};
export const productoRegistrado = function(id, cod, nom) {
  return `${rutaBase}/productos/${id}/existe/${cod}/nombre/${nom}`;
};
export const productoGuardar = function() {
  return `${rutaBase}/productos/guardar`;
}
export const productoModificarEstado = function(id, estado) {
  return `${rutaBase}/productos/${id}/modificar/estado/${estado}`
}
export const imagenProductoPorId = function(id) {
  return `${rutaBase}/productos/imagen/${id}`
}

export const existenciasTodos = function(bodega) {
  return `${rutaBase}/productos/bodega/${bodega}/existencia`;
};

export const existenciasCeroTodos = function(bodega, zeros) {
  return `${rutaBase}/productos/bodega/${bodega}/existencia/ceros/${zeros}`;
};

// #region Movimientos de inventarios
export const  movimientoPorId = function(id) {
  return `${rutaBase}/movimientos/${id}`;
};

export const movimientosBuscar = function(tipobusca, filtro, estado, desde, hasta, clase, bodega, tipo) {
  return `${rutaBase}/movimientos/bodega/${bodega}/clase/${clase}/estado/${estado}/desde/${desde}/hasta/${hasta}/tipobusca/${tipobusca}/tipo/${tipo}/filtro/${filtro}/buscar`;
}

export const movimientoModificarEstado = function(id, estado) {
  return `${rutaBase}/movimientos/${id}/modificar/estado/${estado}`;
}

export const movimientosGuardar = function() {
  return `${rutaBase}/movimientos/guardar`;
}
// #endregion

// #region Compras
export const  compraPorId = function(id) {
  return `${rutaBase}/compras/${id}`;
}

export const comprasBuscar = function(tipobusca, filtro, estado, desde, hasta, clase, sucursal, tipo) {
  return `${rutaBase}/compras/sucursal/${sucursal}/clase/${clase}/estado/${estado}/desde/${desde}/hasta/${hasta}/tipobusca/${tipobusca}/tipo/${tipo}/filtro/${filtro}/buscar`;
}

export const compraModificarEstado = function(id, estado) {
  return `${rutaBase}/compras/${id}/modificar/estado/${estado}`;
}

export const comprasGuardar = function() {
  return `${rutaBase}/compras/guardar`;
}
// #endregion

// Bodegas
export const bodegasPorEstado = function(est, emp) {
  return `${rutaBase}/bodegas/empresa/${emp}/estado/${est}`;
};
