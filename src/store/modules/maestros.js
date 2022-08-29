
import { clientePorCedula, clientesPorNombre, proveedorPorCedula, proveedoresPorNombre, clientesBuscar } from "@/rutas/maestros";
import axios from 'axios';

const maestros = {
  namespaced: true,
  state: {
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
    async clientesBuscar(context, p) {
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
    async proveedorPorCedula(context, ced) {
      return await axios.get(this.$app.appConfig.apiUrl + proveedorPorCedula(ced));
    },
    async proveedoresPorNombre(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + proveedoresPorNombre(p.estado, p.texto, context.rootState.empresaAccedida.id));
    },
  }
}

export default maestros;