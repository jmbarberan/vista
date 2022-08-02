import { UserRole } from "@/utils/auth.roles";

export default function ajustesRutas() {
  return [
    {
      path: "parametros",
      component: () =>
        import(/* webpackChunkName: "parametros" */ "@/views/ajustes/Parametros.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "tablas",
      component: () =>
        import(/* webpackChunkName: "atablas" */ "@/views/ajustes/Tablas.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "reportes",
      component: () =>
        import(/* webpackChunkName: "areportes" */ "@/views/ajustes/Reportes.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "plantillas",
      component: () =>
        import(/* webpackChunkName: "plantillas" */ "@/views/ajustes/Plantillas.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "impuestos",
      component: () =>
        import(/* webpackChunkName: "impuestos" */ "@/views/ajustes/Impuestos.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "empresa",
      component: () =>
        import(/* webpackChunkName: "empresa" */ "@/views/ajustes/Empresa.vue"),
      meta: { roles: [UserRole.Admin] },
    }
  ];
}