import { cuentaCorriente } from "@/rutas/cxc";
import axios from 'axios';

const cxc = {
  namespaced: true,
  state: {
    cuentaCorrienteItems: [],
  },
  getters: {
    cuentaCorrienteItems: state => state.cuentaCorrienteItems,
  },
  mutations: {
    setCuentaCorrienteItems(state, p) {
      state.cuentaCorrienteItems = p;
    },
  },
  actions: {
    async cuentaCorriente(context, p) {      
      let ruta = this.$app.appConfig.apiUrl + cuentaCorriente(p);
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
    }
  }
}

export default cxc;
