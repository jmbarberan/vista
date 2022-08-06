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
    }
  ]

}

