import Vue from 'vue';
import Vuex from 'vuex';
import app from '../main';
import menu from './modules/menu';
import user from './modules/user';
import modClinica from "./modules/clinica";
import modAjustes from "./modules/ajustes";
import modInventarios from "./modules/inventarios";
import modSeguridad from "./modules/seguridad";
import modVentas from "./modules/ventas";
import modMaestros from "./modules/maestros";
import modSubscripciones from "./modules/subscripciones";
import modCxc from "./modules/cxc";
import { setCurrentLanguage, setEmpresa, getCurrentSubscriber } from '../utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    empresaAccedida: {
      id: 1,
      nombre: "ViniaPro",
    },
    subscripcion: {
      id: 0,
      tipo: 0,
      nombre: ""
    },
    remotoConfig: {
      headers : {
        Authorization: getCurrentSubscriber() != undefined ? getCurrentSubscriber().codigo : ""
      }
    },
    movimientoBuscador: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      controlItems: [],
      tipomov: 0
    },
  },
  getters: {
    buscaMovimientosTexto: state => state.movimientoBuscador.texto,
    buscaMovimientosDesde: state => state.movimientoBuscador.desde,
    buscaMovimientosHasta: state => state.movimientoBuscador.hasta,
    buscaMovimientosTipo: state => state.movimientoBuscador.tipo,
    buscaMovimientosAtributo: state => state.movimientoBuscador.atributo,
    buscaMovimientosExtendida: state => state.movimientoBuscador.extendida,
    buscaMovimientosEliminados: state => state.movimientoBuscador.eliminados,
    buscaMovimientosControlItems: state => state.movimientoBuscador.controlItems,
    buscaMovimientosTipomov: state => state.movimientoBuscador.tipomov,
    remotoConfiguracion: state => state.remotoConfig,
    subscriptor: state => state.subscripcion
  },
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    },
    setRemotoConfigToken(state, t) {
      state.remotoConfig.headers.Authorization = t;
    },
    setSubscripcionId(state, id) {
      state.subscripcion.id = id;
    },
    setSubscripcionTipo(state, tipo) {
      state.subscripcion.tipo = tipo;
    },
    setSubscripcionNombre(state, nom) {
      state.subscripcion.nombre = nom;
    },
    setEmpresaAccedida(state, p) {
      state.empresaAccedida = {
        id: p.id,
        nombre: p.nombre
      }
      if (p.sesion) {
        setEmpresa(p);
      }
    },
    setBuscaMovimientosDesde(state, p) {
      state.movimientoBuscador.desde = p;
    },
    setBuscaMovimientosHasta(state, p) {
      state.movimientoBuscador.hasta = p;
    },
    setBuscaMovimientosTipo(state, p) {
      state.movimientoBuscador.tipo = p;
    },
    setBuscaMovimientosAtributo(state, p) {
      state.movimientoBuscador.atributo = p;
    },
    setBuscaMovimientosTexto(state, p) {
      state.movimientoBuscador.texto = p;
    },
    setBuscaMovimientosTipomov(state, p) {
      state.movimientoBuscador.tipomov = p;
    },
    setBuscaMovimientosExtendida(state, p) {
      state.movimientoBuscador.extendida = p;
    },
    setBuscaMovimientosEliminados(state, p) {
      state.movimientoBuscador.eliminados = p;
    },
    setBuscaMovimientosControItems(state, p) {
      state.movimientoBuscador.controlItems = p;
    },
  },
  actions: {
    setLang({ commit }, payload) {
      commit('changeLang', payload)
    }
  },
  modules: {
    menu,
    user,
    clinica: modClinica,
    ajustes: modAjustes,
    inventarios: modInventarios,
    seguridad: modSeguridad,
    ventas: modVentas,
    maestros: modMaestros,
    subscripciones: modSubscripciones,
    cxc: modCxc
  }
})
