import { empleadosBuscar, empleadoRegistrado, empleadoGuardar, 
  empleadoPorCedula, empleadoModificarEstado, cargosPorEstado,
  cargoGuardar, empleadosBuscarMin, registrosPorTabla, 
  movimientosBuscar, movimientoGuardar, 
  rubrosPorEstado, rubroModificarEstado, rubroGuardar,
  rolesBuscar, rolesGuardar, rolesModificarEstado, rolesLiquidar, rolesRubros
} from "@/rutas/nomina";
import { getRequestConfig, getRequestwDataConfig, getRequestwParamsConfig } from "../../utils/index";
import axios from 'axios';
import moment from 'moment'

const nomina = {
  namespaced: true,
  state: {
    tablasBuscador: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0,
      cacheAtributo: '',
      cacheAtributoIdx: 0
    },
    empleadosBuscadorCache: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0,
      lista: []
    },
    movimientoEditorData:  null,
    movimientosBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
    rolesBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
    liquidacionesBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
  },
  mutations: {
    setBuscaTablasTexto(state, p) {
      state.tablasBuscador.texto = p;
    },
    setBuscaTablasExtendida(state, p) {
      state.tablasBuscador.extendida = p;
    },
    setBuscaTablasEliminados(state, p) {
      state.tablasBuscador.eliminados = p;
    },
    setBusquedaAtributo(state, p) {
      state.tablasBuscador.atributo = p;
    },
    setBusquedaAtributoIdx(state, p) {
      state.tablasBuscador.atributoIdx = p;
    },
    setCacheBusquedaTablasAtributo(state, p) {
      state.tablasBuscador.cacheAtributo = p;
    },
    setCacheBusquedaTablasAtributoIdx(state, p) {
      state.tablasBuscador.cacheAtributoIdx = p;
    },

    setCacheBusquedaEmpleadosLista(state, l) {
      state.empleadosBuscadorCache.lista = l;
    },
    setCacheBusquedaEmpleadosTexto(state, t) {
      state.empleadosBuscadorCache.texto = t;
    },
    setCacheBusquedaEmpleadosExtendida(state, x) {
      state.empleadosBuscadorCache.extendida = x;
    },
    setCacheBusquedaEmpleadosEliminados(state, e) {
      state.empleadosBuscadorCache.eliminados = e;
    },
    setCacheBusquedaEmpleadosAtributo(state, a) {
      state.empleadosBuscadorCache.atributo = a;
    },
    setCacheBusquedaEmpleadosAtributoIdx(state, i) {
      state.empleadosBuscadorCache.atributoIdx = i;
    },

    setCacheBuscaMovimientosLista(state, l) {
      state.movimientosBuscadorCache.lista = l;
    },
    setCacheBuscaMovimientosTexto(state, p) {
      state.movimientosBuscadorCache.texto = p;
    },
    setCacheBuscaMovimientosDesde(state, p) {
      state.movimientosBuscadorCache.desde = p;
    },
    setCacheBuscaMovimientosHasta(state, p) {
      state.movimientosBuscadorCache.hasta = p;
    },
    setCacheBuscaMovimientosTipo(state, p) {
      state.movimientosBuscadorCache.tipo = p;
    },
    setCacheBuscaMovimientosExtendida(state, p) {
      state.movimientosBuscadorCache.extendida = p;
    },
    setCacheBuscaMovimientosEliminados(state, p) {
      state.movimientosBuscadorCache.eliminados = p;
    },
    setCacheBuscaMovimientosAtributo(state, p) {
      state.movimientosBuscadorCache.atributo = p;
    },

    setCacheBuscaRolesLista(state, l) {
      state.rolesBuscadorCache.lista = l;
    },
    setCacheBuscaRolesTexto(state, p) {
      state.rolesBuscadorCache.texto = p;
    },
    setCacheBuscaRolesDesde(state, p) {
      state.rolesBuscadorCache.desde = p;
    },
    setCacheBuscaRolesHasta(state, p) {
      state.rolesBuscadorCache.hasta = p;
    },
    setCacheBuscaRolesTipo(state, p) {
      state.rolesBuscadorCache.tipo = p;
    },
    setCacheBuscaRolesExtendida(state, p) {
      state.rolesBuscadorCache.extendida = p;
    },
    setCacheBuscaRolesEliminados(state, p) {
      state.rolesBuscadorCache.eliminados = p;
    },
    setCacheBuscaRolesAtributo(state, p) {
      state.rolesBuscadorCache.atributo = p;
    },

    setCacheBuscaLiquidacionesLista(state, l) {
      state.liquidacionesBuscadorCache.lista = l;
    },
    setCacheBuscaLiquidacionesTexto(state, p) {
      state.liquidacionesBuscadorCache.texto = p;
    },
    setCacheBuscaLiquidacionesDesde(state, p) {
      state.liquidacionesBuscadorCache.desde = p;
    },
    setCacheBuscaLiquidacionesHasta(state, p) {
      state.liquidacionesBuscadorCache.hasta = p;
    },
    setCacheBuscaLiquidacionesTipo(state, p) {
      state.liquidacionesBuscadorCache.tipo = p;
    },
    setCacheBuscaLiquidacionesExtendida(state, p) {
      state.liquidacionesBuscadorCache.extendida = p;
    },
    setCacheBuscaLiquidacionesEliminados(state, p) {
      state.liquidacionesBuscadorCache.eliminados = p;
    },
    setCacheBuscaLiquidacionesAtributo(state, p) {
      state.liquidacionesBuscadorCache.atributo = p;
    }
  },
  actions: {
    async registrosPorTabla(context, p) {
      return await axios(getRequestConfig(registrosPorTabla(p)));
    },
    async empleadosBuscar(context, p) {
      return await axios(getRequestConfig(empleadosBuscar(p)))
    },
    async empleadosBuscarMin(context, p) {
      return await axios(getRequestwParamsConfig(empleadosBuscarMin(p.filtro), p.params))
    },
    async empleadoRegistrado(context, p) {
      return await axios(getRequestConfig(empleadoRegistrado(p)));
    },
    async empleadoGuardar(context, p) {
      return await axios(getRequestwDataConfig(empleadoGuardar(), p));
    },
    async empleadoPorCedula(context, p) {
      return await axios(getRequestConfig(empleadoPorCedula(p)));
    },
    async empleadoModificarEstado(context, p) {
      return await axios(getRequestConfig(empleadoModificarEstado(p)));
    },
    
    async cargosPorEstado(context, p) {      
      return await axios(getRequestConfig(cargosPorEstado(p)));
    },
    async cargoGuardar(context, p) {      
      return await axios(getRequestwDataConfig(cargoGuardar(), p));
    },

    async rubrosPorEstado(context, p) {      
      return await axios(getRequestConfig(rubrosPorEstado(p)));
    },
    async rubroGuardar(context, p) {      
      return await axios(getRequestwDataConfig(rubroGuardar(), p));
    },
    async rubroModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + rubroModificarEstado({
        ...p
      }));
    },

    // #region Movimientos
    async movimientosBuscar(context, p) {
      return await axios(getRequestConfig(movimientosBuscar(p)));
    },
    async movimientoGuardar(context, p) {
      return await axios(getRequestwDataConfig(movimientoGuardar(), p));
    },
    async movimientoModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + movimientoModificarEstado(p.id, p.estado));
    },
    // #endregion

    // #region Roles
    async rolesBuscar(context, p) {
      return await axios(getRequestConfig(rolesBuscar(p)));
    },
    async rolesGuardar(context, p) {
      return await axios(getRequestwDataConfig(rolesGuardar(), p));
    },
    async rolesRubros(context, p) {
      return await axios(getRequestConfig(rolesRubros(p)));
    },
    async rolesModificarEstado(context, p) {
      return await axios(getRequestConfig(rolesModificarEstado(p)));
    },
    async rolesLiquidar(context, p) {
      return await axios(getRequestConfig(rolesLiquidar(p)));
    }
    // #endregion
  }
}

export default nomina;