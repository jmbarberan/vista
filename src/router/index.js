import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from "@/utils/auth.guard";
import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir.js";
//import clinicaRutas from "@/router/modulos/clinica";
import ventasRutas from "@/router/modulos/ventas";
import inventariosRutas from "@/router/modulos/inventarios";
import ajustesRutas from "@/router/modulos/ajustes";
import seguridadRutas from "@/router/modulos/seguridad"; 
import cxcRutas from "@/router/modulos/cxc"; 

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "root" */ "@/views/vista"),
    redirect: `bienvenido`,
    meta: { loginRequired: true },
    children: [ 
      {
        path: "/inicio",
        component: () =>
          import(/* webpackChunkName: "inicio" */ "@/views/vista/index.vue"),
      },
      {
        path: traducir("rutas.ventas"),
        component: () =>
          import(/* webpackChunkName: "ventas" */ "@/views/ventas"),
        redirect: `${traducir("rutas.ventas")}/${traducir("rutas.facturas")}`,
        meta: { roles: [UserRole.Admin, UserRole.Ventas] },
        children: ventasRutas()
      },
      {
        path: traducir("rutas.inventarios"),
        component: () =>
        import(/* webpackChunkName: "inventarios" */ "@/views/inventarios"),
        redirect: `${traducir("rutas.inventarios")}/existencias`,
        meta: { roles: [UserRole.Admin, UserRole.Bodega] },
        children: inventariosRutas()
      },
      {
        path: "cxc",
        component: () =>
        import(/* webpackChunkName: "cxc" */ "@/views/cxc"),
        redirect: `cxc/cuenta-corriente`,
        meta: { roles: [UserRole.Admin, UserRole.Agente] },
        children: cxcRutas()
      },
      {
        path: traducir("rutas.ajustes"),
        component: () =>
          import(/* webpackChunkName: "ajustes" */ "@/views/ajustes"),
        redirect: `${traducir("rutas.ajustes")}/parametros`,
        meta: { roles: [UserRole.Admin] },
        children: ajustesRutas()
      },
      {
        path: traducir("rutas.seguridad"),
        component: () =>
          import(/* webpackChunkName: "seguridad" */ "@/views/seguridad"),
        redirect: `${traducir("rutas.seguridad")}/usuarios`,
        meta: { roles: [UserRole.Admin, UserRole.Editor] },
        children: seguridadRutas()
      }
    ],
  },
  {
    name: "bienvenido",
    path: "/bienvenido",
    component: () => import(/* webpackChunkName: "bienvenido" */ "@/views/Bienvenido")
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "@/views/Error")
  },
  {
    path: "/unauthorized",
    component: () => import(/* webpackChunkName: "unauthorized" */ "@/views/Unauthorized")
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "@/views/Error")
  },
  {
    path: `/${traducir("rutas.usuario")}`,
    component: () => import(/* webpackChunkName: "user" */ "@/views/user"),
    redirect: `/${traducir("rutas.usuario")}/${traducir("rutas.acceder")}`,
    children: [ // seguridadRutas.frontend()
      {
        path: traducir("rutas.acceder"),
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/Login")
      },
      /*{
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" *---/ "@/views/user/Register")
      },*/
      {
        path: "/subscripciones/codigo-olvidado",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/ForgotPassword")
      },
      {
        path: "/subscripciones/codigo/resetear/:token",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/ResetPassword")
      },
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history",
});

router.beforeEach(AuthGuard);

export default router
