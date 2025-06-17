import { app } from "@/main";
let rutaBase = "/ventas";

export const ventaPorId = function(id) {
  return `${rutaBase}/comprobantes/${id}`;
};

export const ventaPorNumero = function(tipo, num) {
  return `${rutaBase}/comprobantes/tipo/${tipo}/numero/${num}`;
};

export const ventasBuscar = function(sucursal, clase, estado, desde, hasta, tipo, filtro, doctype) {
  return `${rutaBase}/comprobantes/sucursal/${sucursal}/clase/${clase}/estado/${estado}/desde/${desde}/hasta/${hasta}/tipo/${tipo}/filtro/${filtro}/buscar?doctype=${doctype}`;
};

export const ventasDiario = function(sucursal, estado, desde, hasta) {
  return `${rutaBase}/comprobantes/sucursal/${sucursal}/estado/${estado}/desde/${desde}/hasta/${hasta}/diario`;
};

export const ventasDiarioCE = function(sucursal, estado, desde, hasta) {
  return `${rutaBase}/comprobantes/sucursal/${sucursal}/estado/${estado}/desde/${desde}/hasta/${hasta}/electronicos`;
};

export const ventaGuardar = function() {
  return `${rutaBase}/comprobantes/guardar`;
};

export const ventaModificarEstado = function(id, estado) {
  return `${rutaBase}/comprobantes/${id}/estado/${estado}/modificar`;
};

export const ventaEnviarCorreo = function(id) {
  return `${rutaBase}/comprobantes/${id}/enviar-correo`;
}

export const ventaAutorizar = function(id) {
  return `${rutaBase}/comprobantes/${id}/autorizar`;
}

export const ventaVerificar = function(id) {
  return `${rutaBase}/comprobantes/${id}/verificar`;
}

export const cajasPorUsuario = function(params) {
  return `${rutaBase}/cajas/empresa/${params.empresa}/usuario/${params.usuario}`;
}