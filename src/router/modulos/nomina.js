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
      path: 'rubros',
      component: () =>
      import(/* webpackChunkName: "movimientos" */ "@/views/nomina/Rubros.vue"),
      meta: { roles: [UserRole.Admin], rutaNuevo: 'nomina-rubro-nuevo', rutaModificar: 'nomina-rubro-modificar' }
    },
    {
      name: 'nomina-rubro-nuevo',
      path: 'rubros/nuevo',
      component: () =>
      import(/* webpackChunkName: "rubrosNuevo" */ "@/views/nomina/RubrosEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Nuevo" }
    },
    {
      name: 'nomina-rubro-modificar',
      path: 'rubros/modificar',
      component: () =>
      import(/* webpackChunkName: "rubrosModificar" */ "@/views/nomina/RubrosEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Modificar" }
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
    },
    {
      path: 'roles',
      component: () =>
      import(/* webpackChunkName: "roles" */ "@/views/nomina/Roles.vue"),
      meta: { roles: [UserRole.Admin], rutaNuevo: 'nomina-rol-nuevo', rutaModificar: 'nomina-rol-modificar' }
    },
    {
      name: 'nomina-rol-nuevo',
      path: 'roles/nuevo',
      component: () =>
      import(/* webpackChunkName: "rolesNuevo" */ "@/views/nomina/RolesEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Nuevo" }
    },
    {
      name: 'nomina-rol-modificar',
      path: 'roles/modificar',
      component: () =>
      import(/* webpackChunkName: "rolesModificar" */ "@/views/nomina/RolesEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Modificar" }
    },
    {
      path: 'liquidaciones',
      component: () =>
      import(/* webpackChunkName: "liquidaciones" */ "@/views/nomina/Liquidaciones.vue"),
      meta: { roles: [UserRole.Admin], rutaNuevo: 'nomina-liq-nuevo', rutaModificar: 'nomina-liq-modificar' }
    },
    {
      name: 'nomina-liq-nuevo',
      path: 'liquidaciones/nuevo',
      component: () =>
      import(/* webpackChunkName: "liquidacionesNuevo" */ "@/views/nomina/LiquidacionesEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Nuevo" }
    },
    {
      name: 'nomina-liq-modificar',
      path: 'liquidaciones/modificar',
      component: () =>
      import(/* webpackChunkName: "liquidacionesModificar" */ "@/views/nomina/LiquidacionesEditor.vue"),
      meta: { roles: [UserRole.Admin], accion: "Modificar" }
    }
  ]

}

