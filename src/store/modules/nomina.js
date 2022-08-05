import { empleadosBuscar, empleadoRegistrado, empleadoGuardar, 
  empleadoPorCedula, empleadoModificarEstado } from "@/rutas/nomina";
import { getCurrentSubscriber } from "../../utils/index";
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
      let bkend = empleadosBuscar(p)
      let config = {
        url: bkend.ruta,
        method: bkend.metodo,
        crossorigin: true
      };
      return await axios(config)
    },
    async empleadoRegistrado(context, p) {
      let bkend = empleadoRegistrado(p)
      let config = {
        url: bkend.ruta,
        method: bkend.metodo,
        crossorigin: true
      }
      return await axios(config);
    },
    async empleadoGuardar(context, p) {
      let bkend = empleadoGuardar();
      let config = {
        url: bkend.ruta,
        data: JSON.stringify(p),
        method: bkend.metodo,
        crossorigin: true
      };
      return await axios(config);
    },
    async empleadoPorCedula(context, p) {
      let bkend = empleadoPorCedula(p)
      let config = {
        url: bkend.ruta,
        method: bkend.metodo,
        crossorigin: true
      }
      return await axios(config);
    },
    async empleadoModificarEstado(context, p) {
      let bkend = empleadoModificarEstado(p)
      let config = {
        url: bkend.ruta,
        method: bkend.metodo,
        crossorigin: true
      }
      return await axios(config);
    },
  }
}

export default nomina;