import { codigoValidar, codigoReseteoSolicitar, codigoReseteoValidar, codigoResetear } from "@/rutas/subscripciones";
import axios from 'axios';

const subscripciones = {
  namespaced: true,
  actions: {
    async codigoValidar(p) {
      // no requiere codigo de subscripcion
      let config = {
        url: this.$app.appConfig.apiUrl + codigoValidar(),
        data: JSON.stringify({ "codigo": p }),
        method: 'post',
        crossorigin: true
      };
      return await axios(config);
    },
    async codigoReseteoSolicitar({ commit }, p) {
      // no requiere codigo de subscripcion
      let config = {
        url: this.$app.appConfig.apiUrl + codigoReseteoSolicitar(),
        data: JSON.stringify({ "codigo": p }),
        method: 'post',
        crossorigin: true
      };
      return await axios(config);
    },
    async codigoReseteoValidar({ commit }, p) {
      let ruta = this.$app.appConfig.apiUrl + codigoReseteoValidar(p);
      return await axios.get(ruta);
    },
    async codigoResetear({ commit }, p) {
      // no requiere codigo de subscripcion
      let config = {
        url: this.$app.appConfig.apiUrl + codigoResetear(),
        data: JSON.stringify({ "token": p.token, "clave": p.clave }),
        method: 'post',
        crossorigin: true
      };
      return await axios(config);
    }
  }
}

export default subscripciones;