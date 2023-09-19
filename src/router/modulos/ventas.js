import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir";
import { tipoFactura, tipoNotaVenta } from "@/constants/tipos";

export default function ventasRutas() {
  return [
    {
      path: traducir("rutas.facturas"),
      component: () =>
      import(/* webpackChunkName: "facturas" */ "@/views/ventas/Facturas"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas], tipo: tipoFactura, titulo: 'Facturas', rutaNuevo: 'facturas-crear', rutaModificar: 'facturas-modificar' }
    },
    {
      name: "facturas-modificar",
      path: `${traducir("rutas.facturas")}/${traducir("rutas.facturas-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "factura-modificar" */ "@/views/ventas/FacturasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas], tipo: tipoFactura, titulo: 'Facturas', accion: "Modificar", impuestos: true },
    },
    {
      name: "facturas-crear",
      path: `${traducir("rutas.facturas")}/${traducir("rutas.facturas-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "factura-nuevo" */ "@/views/ventas/FacturasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas], tipo: tipoFactura, titulo: 'Facturas', accion: "Nuevo", impuestos: true },
    },
    {
      path: traducir("rutas.notas-venta"),
      component: () =>
      import(/* webpackChunkName: "notasventa" */ "@/views/ventas/Facturas"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas], tipo: tipoNotaVenta, titulo: 'Notas de venta', rutaNuevo: 'notas-venta-crear', rutaModificar: 'notas-venta-modificar' }
    },
    {
      name: "notas-venta-modificar",
      path: `${traducir("rutas.notas-venta")}/${traducir("rutas.notas-venta-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "factura-modificar" */ "@/views/ventas/FacturasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas], tipo: tipoNotaVenta, titulo: 'Notas de venta', accion: "Modificar", impuestos: false },
    },
    {
      name: "notas-venta-crear",
      path: `${traducir("rutas.notas-venta")}/${traducir("rutas.notas-venta-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "factura-nuevo" */ "@/views/ventas/FacturasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas], tipo: tipoNotaVenta, titulo: 'Notas de venta', accion: "Nuevo", impuestos: false },
    },
    {
      path: traducir("rutas.clientes"),
      component: () =>
        import(/* webpackChunkName: "clientes" */ "@/views/ventas/Clientes.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      name: "clientes-modificar",
      path: `${traducir("rutas.clientes")}/${traducir("rutas.clientes-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "clientes-modificar" */ "@/views/ventas/ClientesEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      name: "clientes-crear",
      path: `${traducir("rutas.clientes")}/${traducir("rutas.clientes-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "clientes-crear" */ "@/views/ventas/ClientesEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      path: "diario",
      component: () =>
        import(/* webpackChunkName: "vdiario" */ "@/views/ventas/Diario.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "ventascosto",
      component: () =>
        import(/* webpackChunkName: "ventascostos" */ "@/views/ventas/VentasCostos.vue"),
      meta: { roles: [UserRole.Admin] },
    }
  ]
} 