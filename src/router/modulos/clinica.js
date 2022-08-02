import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir";

export default function clinicaRutas() {
  return [
    {
      path: `${traducir("rutas.consultas")}`,
      component: () =>
        import(/* webpackChunkName: "cliconsultas" */ "@/views/clinica/Consultas"),
      meta: { roles: [ UserRole.Admin, UserRole.Medico, UserRole.Enfermeria ] },
    },
    {
      name: "consultas-modificar",
      path: `${traducir("rutas.consultas")}/${traducir("rutas.consultas-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "consultasedit" */ "@/views/clinica/ConsultaEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      name: "consultas-atender",
      path: `${traducir("rutas.consultas")}/${traducir("rutas.consultas-atencion")}`,
      component: () =>
        import(/* webpackChunkName: "consultaatencion" */ "@/views/clinica/ConsultaAtencion.vue"),
      meta: { roles: [UserRole.Medico] },
    },
    {
      name: "consultas-mediciones",
      path: `${traducir("rutas.consultas")}/${traducir("rutas.consultas-mediciones")}`,
      component: () =>
        import(/* webpackChunkName: "consultamediciones" */ "@/views/clinica/ConsultaMediciones.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Medico, UserRole.Enfermeria] },
    },
    {
      name: "consultas-crear",
      path: `${traducir("rutas.consultas")}/${traducir("rutas.consultas-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "consultascreate" */ "@/views/clinica/ConsultaEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      path: `${traducir("rutas.pacientes")}`,
      component: () =>
        import(/* webpackChunkName: "pacientes" */ "@/views/clinica/Pacientes.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "pacientes-modificar",
      path: `${traducir("rutas.pacientes")}/${traducir("rutas.pacientes-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "pacientes-modificar" */ "@/views/clinica/PacientesEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "pacientes-crear",
      path: `${traducir("rutas.pacientes")}/${traducir("rutas.pacientes-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "pacientes-crear" */ "@/views/clinica/PacientesEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: `${traducir("rutas.medicos")}`,
      component: () =>
        import(/* webpackChunkName: "medicos" */ "@/views/clinica/Medicos.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "medicos-modificar",
      path: `${traducir("rutas.medicos")}/${traducir("rutas.medicos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "medicos-modificar" */ "@/views/clinica/MedicosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "medicos-crear",
      path: `${traducir("rutas.medicos")}/${traducir("rutas.medicos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "medicos-crear" */ "@/views/clinica/MedicosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: `${traducir("rutas.servicios")}`,
      component: () =>
        import(/* webpackChunkName: "citas" */ "@/views/clinica/Servicios.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "servicios-modificar",
      path: `${traducir("rutas.servicios")}/${traducir("rutas.servicios-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "pacientes" */ "@/views/clinica/ServiciosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      name: "servicios-crear",
      path: `${traducir("rutas.servicios")}/${traducir("rutas.servicios-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "pacientes" */ "@/views/clinica/ServiciosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    }
  ];
}