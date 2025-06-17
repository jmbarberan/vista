import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir";
import { tipoCompra, tipoNotasIngreso, tipoBodegaIngreso, tipoBodegaEgreso } from "@/constants/tipos";

export default function inventariosRutas() {
  return [
    {
      path: `${traducir("rutas.compras")}`,
      component: () =>
      import(/* webpackChunkName: "compra" */ "@/views/inventarios/Compras.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoCompra, titulo: 'Compras', rutaNuevo: 'compras-crear', rutaModificar: 'compras-modificar' },
    },
    {
      name: "compras-modificar",
      path: `${traducir("rutas.compras")}/${traducir("rutas.compras-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "compras-modificar" */ "@/views/inventarios/ComprasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoCompra, titulo: 'Compras', accion: "Modificar", impuestos: true },
    },
    {
      name: "compras-crear",
      path: `${traducir("rutas.compras")}/${traducir("rutas.compras-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "compras-crear" */ "@/views/inventarios/ComprasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoCompra, titulo: 'Compras', accion: "Nuevo", impuestos: true },
    },
    {
      path: `${traducir("rutas.notas-ingreso")}`,
      component: () =>
      import(/* webpackChunkName: "notaingreso" */ "@/views/inventarios/Compras.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoNotasIngreso, titulo: 'Notas de ingreso', rutaNuevo: 'notas-ingreso-crear', rutaModificar: 'notas-ingreso-modificar' },
    },
    {
      name: "notas-ingreso-modificar",
      path: `${traducir("rutas.notas-ingreso")}/${traducir("rutas.notas-ingreso-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "notaingreso-modificar" */ "@/views/inventarios/ComprasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoNotasIngreso, titulo: 'Notas de ingreso', impuestos: false },
    },
    {
      name: "notas-ingreso-crear",
      path: `${traducir("rutas.notas-ingreso")}/${traducir("rutas.notas-ingreso-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "notaingreso-crear" */ "@/views/inventarios/ComprasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoNotasIngreso, titulo: 'Notas de ingreso', impuestos: false },
    },
    {
      path: `${traducir("rutas.bingresos")}`,
      component: () =>
      import(/* webpackChunkName: "bingresos" */ "@/views/inventarios/Movimientos.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoBodegaIngreso, titulo: 'Ingresos a bodega', rutaNuevo: 'ingresos-crear', rutaModificar: 'ingresos-modificar'},
    },
    {
      name: "ingresos-modificar",
      path: `${traducir("rutas.bingresos")}/${traducir("rutas.bingresos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "bingresos-modificar" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoBodegaIngreso, titulo: 'Ingresos a Bodega' },
    },
    {
      name: "ingresos-crear",
      path: `${traducir("rutas.bingresos")}/${traducir("rutas.bingresos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "bingresos-crear" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoBodegaIngreso, titulo: 'Ingresos a Bodega' },
    },
    {
      path: `${traducir("rutas.begresos")}`,
      component: () =>
      import(/* webpackChunkName: "begresos" */ "@/views/inventarios/Movimientos.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoBodegaEgreso, titulo: 'Egresos de Bodega', rutaNuevo: 'egresos-crear', rutaModificar: 'egresos-modificar'},
    },
    {
      name: "egresos-modificar",
      path: `${traducir("rutas.begresos")}/${traducir("rutas.begresos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "begresos-modificar" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: tipoBodegaEgreso, titulo: 'Egresos de Bodega' },
    },
    {
      name: "egresos-crear",
      path: `${traducir("rutas.begresos")}/${traducir("rutas.begresos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "begresos-crear" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo : tipoBodegaEgreso, titulo: 'Egresos de Bodega' },
    },
    {
      path: `${traducir("rutas.fisico")}`,
      component: () =>
      import(/* webpackChunkName: "ifisico" */ "@/views/inventarios/Movimientos.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: 8, titulo: 'Inventario fisico', rutaNuevo: 'fisico-crear', rutaModificar: 'fisico-modificar' },
    },
    {
      name: "fisico-modificar",
      path: `${traducir("rutas.fisico")}/${traducir("rutas.fisico-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "fisico-modificar" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: 8, titulo: 'Inventario fisico' },
    },
    {
      name: "fisico-crear",
      path: `${traducir("rutas.fisico")}/${traducir("rutas.fisico-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "fisico-crear" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega], tipo: 8, titulo: 'Inventario fisico' },
    },
    {
      name: "fisico-comparativo",
      path: `${traducir("rutas.fisico")}/:id/comparativo`,
      component: () =>
        import(/* webpackChunkName: "fisico-ccomparativo" */ "@/views/inventarios/FisicoComparativo.vue")
    },
    {
      path: "productos",
      component: () =>
        import(/* webpackChunkName: "productos" */ "@/views/inventarios/Productos.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "productos-modificar",
      path: `${traducir("rutas.productos")}/${traducir("rutas.productos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "productos-modificar" */ "@/views/inventarios/ProductosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "productos-crear",
      path: `${traducir("rutas.productos")}/${traducir("rutas.productos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "productos-crear" */ "@/views/inventarios/ProductosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: "existencias",
      component: () =>
        import(/* webpackChunkName: "existencias" */ "@/views/inventarios/Existencias.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: "movimientospro",
      component: () =>
        import(/* webpackChunkName: "movimientospro" */ "@/views/inventarios/Movimientospro.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    }
  ];
}