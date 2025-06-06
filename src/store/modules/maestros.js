
import { clientePorCedula, clientesPorNombre, clientesBuscar, clienteGuardar,
  proveedorPorCedula, proveedoresPorNombre 
} from "@/rutas/maestros";
import axios from 'axios';

const maestros = {
  namespaced: true,
  state: {
    clientesBuscadorCache: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0,
      lista: []
    },
    clienteSeleccionador: {
      texto: "",
      seleccionado: null,
      extendida: false
    }
  },
  getters: {
    selClienteTexto: state => state.clienteSeleccionador.texto,
    selCliente: state => state.clienteSeleccionador.seleccionado,
  },
  mutations: {
    // Busqueda de productos
    setCacheBusquedaClientesLista(state, l) {
      state.clientesBuscadorCache.lista = l;
    },
    setCacheBusquedaClientesTexto(state, t) {
      state.clientesBuscadorCache.texto = t;
    },
    setCacheBusquedaClientesExtendida(state, x) {
      state.clientesBuscadorCache.extendida = x;
    },
    setCacheBusquedaClientesEliminados(state, e) {
      state.clientesBuscadorCache.eliminados = e;
    },
    setCacheBusquedaClientesAtributo(state, a) {
      state.clientesBuscadorCache.atributo = a;
    },
    setCacheBusquedaClientesAtributoIdx(state, i) {
      state.clientesBuscadorCache.atributoIdx = i;
    },

    setSelClienteTexto(state, p) {
      state.clienteSeleccionador.texto = p;
    },
    setSelCliente(state, p) {
      state.clienteSeleccionador.seleccionado = p;
    },
  },
  actions: {
    async clientePorCedula(context, ced) {
      return await axios.get(this.$app.appConfig.apiUrl + clientePorCedula(ced));
    },
    async clientesBuscar(context) {
      let tipo = context.rootState.clinica.tablasBuscador.extendida ? 1 : 0;
      let estado = context.rootState.clinica.tablasBuscador.eliminados ? 9 : 0;
      let p = {
        tipo: tipo,
        atributo: context.rootState.clinica.tablasBuscador.atributoIdx,
        estado: estado,
        texto: context.rootState.clinica.tablasBuscador.texto,
        empresa: context.rootGetters.empresaAccedida.id
      };
      let ruta = this.$app.appConfig.apiUrl + clientesBuscar(p);
      return await axios.get(ruta);
    },
    async clientesPorNombre(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + clientesPorNombre(p.estado, p.texto, context.rootState.empresaAccedida.id));
    },
    async clientesBuscarCtx(context) {
      let tipo = context.rootState.clinica.tablasBuscador.extendida ? 1 : 0;
      let estado = context.rootState.clinica.tablasBuscador.eliminados ? 9 : 0;
      let p = {
        tipo: tipo,
        atrib: context.rootState.clinica.tablasBuscador.atributo,
        estado: estado,
        filtro: context.rootState.clinica.tablasBuscador.texto,
        emp: context.rootState.empresaAccedida.id
      };
      return await axios.get(this.$app.appConfig.apiUrl + clientesBuscar(p));
    },
    async clienteGuardar(context, p) {
      let config = {
        headers: context.rootState.remotoConfig.headers,
        url: this.$app.appConfig.apiUrl + clienteGuardar(),
        data: JSON.stringify(p),
        method: 'post',
        crossorigin: true
      };
      return await axios(config);
    },
    async proveedorPorCedula(context, ced) {
      return await axios.get(this.$app.appConfig.apiUrl + proveedorPorCedula(ced));
    },
    async proveedoresPorNombre(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + proveedoresPorNombre(p.estado, p.texto, context.rootState.empresaAccedida.id));
    },
  }
}

export default maestros;