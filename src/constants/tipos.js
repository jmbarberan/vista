const tipos = [
  "Cero",
  "Cliente",
  "Producto",
  "Impuesto",
  "Empresa",
  "Proveedor",
  "Ingreso a Bodega",
  "Egreso de Bodega",
  "Inventario fisico",
  "Ingreso por ajuste de inventario",
  "Egreso por ajuste de inventario",
  "Factura",
  "Nota de venta",
  "Devolucion",
  "Nota de credito",
  "Nota de debito",
  "Cobro",
  "Usuario",
  "Privilegio",
  "Compra",
  "Nota de ingreso",
  "Nota de devolucion",
  "Cuenta Bancaria",
  "Cheque",
  "Deposito",
  "Retiro",
  "Nota de credito",
  "Nota de debito",
  "Retencion en la fuente",
  "Retencion recibida",
  "Caja",
  "Vale de caja",
  "Ajuste de caja faltante",
  "Ajuste de caja subrante",
  "Pago",
  "Cobro en efectivo",
  "Cobro en cheque",
  "Cobro con tarjeta",
  "Cobro con otros medios",
  "Asiento contable regular",
  "Asiento de cierre de ejercicio",
  "Asiento de apertura",
  "Asiento de partida",
  "Guia de remision",
  "Devolucion de compra",
  "Cuadre de caja",
  "Comprobante de egreso",
  "Pedido",
  "Proforma"
]

export function tipoDenominacion(t) {
  return tipos[t]
}

export const tipoFactura = 11;
export const tipoNotaVenta = 12;
export const tipoDevolucion = 13;
export const tipoNotaCredito = 14;
export const tipoBodegaIngreso = 6;
export const tipoBodegaEgreso = 7;
export const tipoCompra = 19;
export const tipoNotasIngreso = 20;
