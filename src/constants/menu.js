import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "ventas",
    icon: "iconsminds-management",
    label: "menu.ventas.titulo",
    to: `/ventas`,
    subs: [
      {
        icon: "iconsminds-receipt-4",
        label: "menu.ventas.facturas.titulo",
        to: `/ventas/facturas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
        crear: '/ventas/facturas/nuevo'
      },
      {
        icon: "iconsminds-letter-open",
        label: "menu.ventas.notas-venta.titulo",
        to: `/ventas/notas-venta`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
        crear: '/ventas/notas-venta/nuevo'
      },
      {
        icon: "iconsminds-business-man-woman",
        label: "menu.ventas.clientes.titulo",
        to: `/ventas/clientes`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      },
      {
        icon: "iconsminds-files",
        label: "menu.ventas.diario",
        to: `/ventas/diario`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      },
      {
        icon: "iconsminds-files",
        label: "menu.ventas.ventascostos",
        to: `/ventas/ventascostos`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      },
    ]
  },
  {
    id: "inventarios",
    icon: "iconsminds-box-full",
    label: "menu.inventarios.titulo",
    to: `/inventarios`,
    subs: [
      {
        icon: "iconsminds-shopping-cart",
        label: "menu.inventarios.compras.titulo",
        to: `/inventarios/compras`,
        roles: [UserRole.Admin, UserRole.Bodega], 
        crear: '/inventarios/compras/nuevo'
      },
      {
        icon: "iconsminds-shopping-bag",
        label: "menu.inventarios.notas-ingreso.titulo",
        to: "/inventarios/notas-ingreso",
        roles: [UserRole.Admin, UserRole.Bodega], 
        crear: '/inventarios/notas-ingreso/nuevo'
      },
      {
        icon: "iconsminds-tag",
        label: "menu.inventarios.productos.titulo",
        to: `/inventarios/productos`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-administrator",
        label: "menu.inventarios.proveedores.titulo",
        to: `/inventarios/movimientospro`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-arrow-inside",
        label: "menu.inventarios.ingresos.titulo",
        to: "/inventarios/ingresos",
        roles: [UserRole.Admin, UserRole.Bodega], 
        crear: '/inventarios/ingresos/nuevo'
      },
      {
        icon: "iconsminds-arrow-outside",
        label: "menu.inventarios.egresos.titulo",
        to: `/inventarios/egresos`,
        roles: [UserRole.Admin, UserRole.Bodega], 
        crear: '/inventarios/egresos/nuevo'
      },
      {
        icon: "iconsminds-notepad",
        label: "menu.inventarios.fisico.titulo",
        to: `/inventarios/fisico`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-box-with-folders",
        label: "menu.inventarios.existencias",
        to: `/inventarios/existencias`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-receipt-4",
        label: "menu.inventarios.movimientospro",
        to: `/inventarios/movimientospro`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
    ]
  },
  {
    id: "cxc",
    icon: "iconsminds-safe-box",
    label: "menu.cxc.titulo",
    to: `/cxc`,
    subs: [
      {
        icon: "iconsminds-financial",
        label: "menu.cxc.cobros.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
      {
        icon: "iconsminds-file-edit",
        label: "menu.cxc.notascredito.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
      {
        icon: "iconsminds-file-edit",
        label: "menu.cxc.notasdebito.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
      {
        icon: "iconsminds-profile",
        label: "menu.cxc.cuenta-corriente.titulo",
        to: `/cxc/cuenta-corriente`,
        roles: [UserRole.Admin, UserRole.Agente], 
      },
    ]
  },
  {
    id: "nomina",
    icon: "iconsminds-address-book-2",
    label: "menu.nomina.titulo",
    to: `/nomina`,
    subs: [
      {
        icon: "iconsminds-business-mens",
        label: "menu.nomina.empleados.titulo",
        to: `/nomina/empleados`,
        roles: [UserRole.Admin], 
      },
    ]
  },
  {
    id: "cajas",
    icon: "iconsminds-cash-register-2",
    label: "menu.cajas.titulo",
    to: `/cajas`,
    subs: [
      {
        icon: "iconsminds-money-bag",
        label: "menu.cajas.cajas.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
      {
        icon: "iconsminds-user",
        label: "menu.cajas.cajeros.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
      {
        icon: "iconsminds-dollar",
        label: "menu.cajas.vales.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
      {
        icon: "iconsminds-book",
        label: "menu.cajas.cuadre.titulo",
        to: `/ajustes/empresas`,
        roles: [UserRole.Admin, UserRole.Ventas, UserRole.Cajero], 
      },
    ]
  },
  {
    id: "seguridad",
    icon: "iconsminds-police",
    label: "menu.seguridad.titulo",
    to: `/seguridad`,
    subs: [
      {
        icon: "iconsminds-profile",
        label: "menu.seguridad.usuarios.titulo",
        to: `/seguridad/usuarios`,
        roles: [UserRole.Admin]
      },
      {
        icon: "iconsminds-key",
        label: "menu.seguridad.miclave",
        to: `/seguridad/miclave`,
        roles: [UserRole.Admin]
      },
      {
        icon: "iconsminds-police",
        label: "menu.seguridad.roles",
        to: `/seguridad/roles`,
        roles: [UserRole.Admin]
      }
    ]
  },
  {    
    id: "ajustes",
    icon: "iconsminds-gear",
    label: "menu.ajustes.titulo",
    to: `/ajustes`,
    subs: [
      {
        icon: "iconsminds-equalizer",
        label: "menu.ajustes.parametros",
        to: `/ajustes/parametros`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-check",
        label: "menu.ajustes.tablas",
        to: `/ajustes/tablas`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-project",
        label: "menu.ajustes.reportes",
        to: `/ajustes/reportes`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-file",
        label: "menu.ajustes.plantillas",
        to: `/ajustes/plantillas`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-building",
        label: "menu.ajustes.empresa",
        to: `/ajustes/empresa`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-calculator",
        label: "menu.ajustes.impuestos",
        to: `/ajustes/impuestos`,
        roles: [UserRole.Admin], 
      }
    ]
  },
];

export default data;