import { UserRole } from "@/utils/auth.roles";

export default function seguridadRutas() {
  return [
    {
      path: "usuarios",
      component: () =>
        import(/* webpackChunkName: "usuarios" */ "@/views/seguridad/Usuarios.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "roles",
      component: () =>
        import(/* webpackChunkName: "roles" */ "@/views/seguridad/Roles.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "miclave",
      component: () =>
        import(/* webpackChunkName: "cambiarclave" */ "@/views/seguridad/CambiarClave.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega, UserRole.Ventas, UserRole.Medico, UserRole.Enfermeria] },
    }
  ];
}