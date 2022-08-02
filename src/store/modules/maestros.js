
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
      const response = await axios.get(ruta)
        .catch(e => {
          return {
            id: -1,
            respuesta: e
          };
        });
      return {
        id: 1,
        respuesta: response
      };
    },
    async clientesPorNombre(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + clientesPorNombre(p.estado, p.texto, context.rootState.empresaAccedida.id));
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