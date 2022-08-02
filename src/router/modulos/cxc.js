import { UserRole } from "@/utils/auth.roles";

export default function cxcRutas() {
  return [
    {
      path: 'cuenta-corriente',
      component: () =>
      import(/* webpackChunkName: "cuenta-corriente" */ "@/views/cxc/CuentaCorriente.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Agente] }
    }
  ]
}

