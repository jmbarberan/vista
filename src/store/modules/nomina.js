import { empleadosBuscar, empleadoRegistrado, empleadoGuardar, 
  empleadoPorCedula, empleadoModificarEstado, cargosPorEstado
} from "@/rutas/nomina";
import { getRequestConfig } from "../../utils/index";
import axios from 'axios';

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
  },
  actions: {
    async empleadosBuscar(context, p) {
      return await axios(getRequestConfig(empleadosBuscar(p)))
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
    }
  }
}

export default nomina;