import { registrosPorTabla, sucursalesEmpresa, plantillaPorTipo, empresasPorEstado, registroPorTablaIndice } from "@/rutas/ajustes";
import axios from 'axios';

const ajustes = {
  namespaced: true,
  actions: {
    async registroPorTablaIndice(context, p) {
      let ruta = this.$app.appConfig.apiUrl + registroPorTablaIndice(p.id, p.indice);
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
    async registrosPorTabla(context, p) {
      let ruta = this.$app.appConfig.apiUrl + registrosPorTabla(p.id);
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
    async sucursalesEmpresa(context, p) {
      let ruta = this.$app.appConfig.apiUrl + sucursalesEmpresa(p);
      return await axios.get(ruta);
    },
    async empresasPorEstado(context, p) {
      let ruta = this.$app.appConfig.apiUrl + empresasPorEstado(p);
      return await axios.get(ruta);
    },
    async plantillaPorTipo(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + plantillaPorTipo(p));
    },
    async encabezados(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + "/ajustes/encabezados", p);
    }
  }
}

export default ajustes;