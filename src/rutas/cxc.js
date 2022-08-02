let rutaBase = "/cxc";

export const cuentaCorriente = function(p) {
  return `${rutaBase}/comprobantes/sucursal/${p.sucursal}/cliente/${p.cliente}/cuentacorriente`;
};
