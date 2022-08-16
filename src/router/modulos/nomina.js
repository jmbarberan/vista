import { UserRole } from "@/utils/auth.roles";

export default function nominaRutas() {
  return [
    {
      path: 'empleados',
      component: () =>
      import(/* webpackChunkName: "empleados" */ "@/views/nomina/Empleados.vue"),
      meta: { roles: [UserRole.Admin] }
    },
    {
      name: "empleados-modificar",
      path: "empleados/modificar",
      component: () =>
        import(/* webpackChunkName: "empleados-modificar" */ "@/views/nomina/EmpleadosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "empleados-crear",
      path: "empleados/nuevo",
      component: () =>
        import(/* webpackChunkName: "empleados-crear" */ "@/views/nomina/EmpleadosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: 'cargos',
      component: () =>
      import(/* webpackChunkName: "empleados" */ "@/views/nomina/Cargos.vue"),
      meta: { roles: [UserRole.Admin] }
    },
    {
      path: 'movimientos',
      component: () =>
      import(/* webpackChunkName: "movimientos" */ "@/views/nomina/Movimientos.vue"),
      meta: { roles: [UserRole.Admin], rutaNuevo: 'nomina-movimiento-nuevo', rutaModificar: 'nomina-movimiento-modificar' }
    },
    {
      name: 'nomina-movimiento-nuevo',
      path: 'movimientos/nuevo',
      component: () =>
      import(/* webpackChunkName: "movimientosNuevo" */ "@/views/nomina/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Nuevo" }
    },
    {
      name: 'nomina-movimiento-modificar',
      path: 'movimientos/modificar',
      component: () =>
      import(/* webpackChunkName: "movimientosModificar" */ "@/views/nomina/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Modificar" }
    }
  ]

}

