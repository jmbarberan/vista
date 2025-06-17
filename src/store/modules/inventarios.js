import moment from 'moment'
import axios from 'axios';
import { getEmpresa } from '../../utils/index';
import { 
  productoPorId,
  productosBuscar, 
  productoSeleccionar,
  movimientosBuscar, 
  movimientosGuardar, 
  movimientoModificarEstado,
  bodegasPorEstado ,
  productoExistencias,
  existenciasTodos,
  productoGuardar,
  productoModificarEstado,
  productoRegistrado,
  comprasBuscar, 
  comprasGuardar, 
  compraModificarEstado,
  existenciasCeroTodos,
  imagenProductoPorId,
  fisicoAjustar,
  fisicoComparativo
} from "@/rutas/inventarios";

const inventarios = {
  namespaced: true,
  state: {
    productosBuscadorCache: {
      texto: "",
      atributo: "",
      atributoIdx: 0,
      extendida: false,
      eliminados: false,
      lista: [],
    },
    productoBuscador: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0
    },
    productoSeleccionador: {
      texto: "",
      seleccionado: null,
      extendida: false,
      lista: [],
    },
    comprasBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
    notasIngresoBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
    movimientoEditorData:  null,
    ingresosBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
    egresosBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    },
    fisicosBuscadorCache: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      lista: [],
    }
  },
  getters: {
    buscaProductoTexto: state => state.productoBuscador.texto,
    buscaProductoExtendida: state => state.productoBuscador.extendida,
    buscaProductoEliminados: state => state.productoBuscador.eliminados,
    buscaProductoAtributo: state => state.productoBuscador.atributo,
    buscaProductoAtributoIdx: state => state.productoBuscador.atributoIdx,
    selProductoTexto: state => state.productoSeleccionador.texto,
    selProducto: state => state.productoSeleccionador.seleccionado,
    selProductoExtendida: state => state.productoSeleccionador.extendida,
    selProductoLista: state => state.productoSeleccionador.lista,
  },
  mutations: {
    setBuscaProductoTexto(state, p) {
      state.productoBuscador.texto = p;
    },
    setBuscaProductoExtendida(state, p) {
      state.productoBuscador.extendida = p;
    },
    setBuscaProductoEliminados(state, p) {
      state.productoBuscador.eliminados = p;
    },
    setBuscaProductoAtributo(state, p) {
      state.productoBuscador.atributo = p;
    },
    setBuscaProductoAtributoIdx(state, p) {
      state.productoBuscador.atributoIdx = p;
    },
    setSelProductoTexto(state, p) {
      state.productoSeleccionador.texto = p;
    },
    setSelProducto(state, p) {
      state.productoSeleccionador.seleccionado = p;
    },
    setSelProductoExtendida(state, p) {
      state.productoSeleccionador.extendida = p;
    },
    setSelProductoLista(state, p) {
      state.productoSeleccionador.lista = p;
    },
    // Cache de busqueda de productos
    setCacheBusquedaProductosLista(state, l) {
      state.productosBuscadorCache.lista = l;
    },
    setCacheBusquedaProductosTexto(state, t) {
      state.productosBuscadorCache.texto = t;
    },
    setCacheBusquedaProductosExtendida(state, x) {
      state.productosBuscadorCache.extendida = x;
    },
    setCacheBusquedaProductosEliminados(state, e) {
      state.productosBuscadorCache.eliminados = e;
    },
    setCacheBusquedaProductosAtributo(state, a) {
      state.productosBuscadorCache.atributo = a;
    },
    setCacheBusquedaProductosAtributoIdx(state, i) {
      state.productosBuscadorCache.atributoIdx = i;
    },

    // Cache de Movimientos bodega
    setBuscacheMovimientosDesde(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.desde = p.valor; break; }
        case 7: { state.egresosBuscadorCache.desde = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.desde = p.valor; break; }
        case 19: { state.comprasBuscadorCache.desde = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.desde = p.valor; break; }
      }
    },
    setBuscacheMovimientosHasta(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.hasta = p.valor; break; }
        case 7: { state.egresosBuscadorCache.hasta = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.hasta = p.valor; break; }
        case 19: { state.comprasBuscadorCache.hasta = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.hasta = p.valor; break; }
      }
    },
    setBuscacheMovimientosTipo(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.tipo = p.valor; break; }
        case 7: { state.egresosBuscadorCache.tipo = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.tipo = p.valor; break; }
        case 19: { state.comprasBuscadorCache.tipo = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.tipo = p.valor; break; }
      }
    },
    setBuscacheMovimientosAtributo(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.atributo = p.valor; break; }
        case 7: { state.egresosBuscadorCache.atributo = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.atributo = p.valor; break; }
        case 19: { state.comprasBuscadorCache.atributo = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.atributo = p.valor; break; }
      }
    },
    setBuscacheMovimientosTexto(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.texto = p.valor; break; }
        case 7: { state.egresosBuscadorCache.texto = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.texto = p.valor; break; }
        case 19: { state.comprasBuscadorCache.texto = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.texto = p.valor; break; }
      }
    },
    setBuscacheMovimientosExtendida(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.extendida = p.valor; break; }
        case 7: { state.egresosBuscadorCache.extendida = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.extendida = p.valor; break; }
        case 19: { state.comprasBuscadorCache.extendida = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.extendida = p.valor; break; }
      }
    },
    setBuscacheMovimientosEliminados(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.eliminados = p.valor; break; }
        case 7: { state.egresosBuscadorCache.eliminados = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.eliminados = p.valor; break; }
        case 19: { state.comprasBuscadorCache.eliminados = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.eliminados = p.valor; break; }
      }
    },
    setBuscacheMovimientosLista(state, p) {
      switch (p.tipo) {
        case 6: { state.ingresosBuscadorCache.lista = p.valor; break; }
        case 7: { state.egresosBuscadorCache.lista = p.valor; break; }
        case 8: { state.fisicosBuscadorCache.lista = p.valor; break; }
        case 19: { state.comprasBuscadorCache.lista = p.valor; break; }
        case 20: { state.notasIngresoBuscadorCache.lista = p.valor; break; }
      }
    },
    setMovimientoEditorData(state, p) {
      state.movimientoEditorData = p;
    }
  },
  actions: {
    cacheBuscadorTipo({state}, ptipo) {
      let ret = null;
      switch (ptipo) {
        case 6: {ret = state.ingresosBuscadorCache; break;}
        case 7: {ret = state.egresosBuscadorCache; break;}
        case 8: {ret = state.fisicosBuscadorCache; break;}
        case 19: {ret = state.comprasBuscadorCache; break;}
        case 20: {ret = state.notasIngresoBuscadorCache; break;}
      }
      return ret;
    },

    // #region Producto
    async productosBuscar(context) {
      let tipo = context.rootState.clinica.tablasBuscador.extendida ? 1 : 0;
      let estado = context.rootState.clinica.tablasBuscador.eliminados ? 9 : 0;
      let p = {
        tipo: tipo,
        atributo: context.rootState.clinica.tablasBuscador.atributoIdx,
        estado: estado,
        texto: context.rootState.clinica.tablasBuscador.texto
      };
      return await context.dispatch("productosBuscarMin", p);
    },
    async productoSeleccionar(context, p) {
      if (p.emp == null || p.emp <= 0) {
        let emp = getEmpresa().id;
        p.emp = emp;
      }
      let ruta = this.$app.appConfig.apiUrl + productoSeleccionar(p);
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
    async productoPorId(context, id) {
      return await axios.get(this.$app.appConfig.apiUrl + productoPorId(id));
    },
    async productosBuscarMin(context, p) {
      let emp = getEmpresa().id; 
      let ruta = this.$app.appConfig.apiUrl + productosBuscar(
        emp,
        p.tipo,
        p.atributo,
        p.estado,
        p.texto
      );
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
    async productoExistencias(context, p) {
      let ruta = this.$app.appConfig.apiUrl + productoExistencias(p.id, p.bodega);
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
    async productoRegistrado(context, p) {
      let cod = p.codigo.length <= 0 ? '000' : p.codigo;
      return await axios.get(this.$app.appConfig.apiUrl + productoRegistrado(p.id, cod, p.nombre));
    },
    async productoGuardar(context, p) {
      let config = {
        headers: context.rootState.remotoConfig.headers,
        url: this.$app.appConfig.apiUrl + productoGuardar(),
        data: JSON.stringify(p),
        method: 'post',
        crossorigin: true
      };
      return await axios(config);
    },
    async productoModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + productoModificarEstado(p.id, p.estado));
    },
    async imagenProductoPorId(context, id) {
      return await axios.get(this.$app.appConfig.apiUrl + imagenProductoPorId(id), { responseType: 'blob' });
    },
    // #endregion   

    // #region Movimientos
    async movimientosBuscar(context) {
      // tipo, filtro, estado, desde, hasta, clase, bodega,
      let des = moment(context.rootState.movimientoBuscador.desde).format("YYYY-MM-DD");
      let has = moment(context.rootState.movimientoBuscador.hasta).format("YYYY-MM-DD");
      let txt = "_";
      if (context.rootState.movimientoBuscador.texto.length > 0) {
        txt = context.rootState.movimientoBuscador.texto;
      }
      let bod = context.rootState.movimientoBuscador.atributo != null ? context.rootState.movimientoBuscador.atributo.id : 0;
      let estado = context.rootState.movimientoBuscador.eliminados ? 9 : 0;
      let tipobusca = context.rootState.movimientoBuscador.extendida ? 1 : 0;
      let ruta = this.$app.appConfig.apiUrl + movimientosBuscar(
        tipobusca,
        txt,
        estado,
        des,
        has,
        context.rootState.movimientoBuscador.tipo,
        bod,
        context.rootState.movimientoBuscador.tipomov
      );
      const response = await axios.get(ruta)
        .catch(e => {
          console.log(e)
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
    async movimientoGuardar(context, p) {
      let ent = JSON.stringify(p);
      let config = {
        headers: context.rootState.remotoConfig.headers,
        url: this.$app.appConfig.apiUrl + movimientosGuardar(),
        data: ent,
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async movimientoModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + movimientoModificarEstado(p.id, p.estado));
    },
    async inventarioFisicoAjustar(context, p) {
      return await axios.post(this.$app.appConfig.apiUrl + fisicoAjustar(p.id));
    },
    async inventarioFisicoComparativo(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + fisicoComparativo(p.id));
    },
    // #endregion

    // #region Compras
    async comprasBuscar(context) {
      // tipo, filtro, estado, desde, hasta, clase, bodega,
      let des = moment(context.rootState.movimientoBuscador.desde).format("YYYY-MM-DD");
      let has = moment(context.rootState.movimientoBuscador.hasta).format("YYYY-MM-DD");
      let txt = "_";
      if (context.rootState.movimientoBuscador.texto.length > 0) {
        txt = context.rootState.movimientoBuscador.texto;
      }
      let bod = context.rootState.movimientoBuscador.atributo != null ? context.rootState.movimientoBuscador.atributo.id : 0;
      let estado = context.rootState.movimientoBuscador.eliminados ? 9 : 0;
      let tipobusca = context.rootState.movimientoBuscador.extendida ? 1 : 0;
      let ruta = this.$app.appConfig.apiUrl + comprasBuscar(
        tipobusca,
        txt,
        estado,
        des,
        has,
        context.rootState.movimientoBuscador.tipo,
        bod,
        context.rootState.movimientoBuscador.tipomov
      );
      const response = await axios.get(ruta)
        .catch(e => {
          console.log(e)
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
    async compraGuardar(context, p) {
      let ent = JSON.stringify(p);
      let config = {
        headers: context.rootState.remotoConfig.headers,
        url: this.$app.appConfig.apiUrl + comprasGuardar(),
        data: ent,
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async compraModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + compraModificarEstado(p.id, p.estado));
    },
    // #endregion

    async existenciasTodos(context, p) {
      let ruta = this.$app.appConfig.apiUrl + existenciasTodos(p);
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
    async existenciasCeros(context, p) {
      let ruta = this.$app.appConfig.apiUrl + existenciasCeroTodos(p.bodega, p.zeros);
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
    async bodegasPorEstado(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + bodegasPorEstado(p.estado, p.empresa));
    },
  }
}

export default inventarios;