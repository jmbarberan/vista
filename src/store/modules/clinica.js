import datosCIE from "@/assets/data/cie10-2012.json";
import {
  pacientesBuscar, 
  pacientePorCedula,
  pacienteRegistrado, 
  pacienteGuardar, 
  pacienteModificarEstado,
  cedulaRegistrada, 
  registrosPorTabla, 
  consultasPorPaciente, 
  consultasPorFecha,
  medicosBuscar, 
  medicosPorEstado,
  medicosPorEspecialidadEstado,
  medicoPorCedula,
  medicoRegistrado, 
  medicoGuardar, 
  medicoCedulaRegistrada,
  medicoModificarEstado, 
  especialidadesTodas,
  serviciosEspecialidad,
  consultasGuardarMedidas,
  consultaGuardar,
  examenesLista,
  consultasPacienteLimite,
  plantillasPorEstado,
  serviciosBuscar,
  servicioRegistrado,
  serviciosGuardar,
  servicioModificarEstado,
  medicoPorUsuario,
  consultasMedicoFecha,
  consultasGuardarEstado,
  pacientesUnificar
} from "@/rutas/clinica";
import * as moment from 'moment';
import axios from 'axios';
import { getEmpresa } from "../../utils";

const clinica = {
  namespaced: true,
  state: {
    medicoUsuario: 0,
    tablasBuscador: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0,
      cacheAtributo: '',
      cacheAtributoIdx: 0
    },
    consultaBuscador: {
      desde: null,
      hasta: null,
      tipo: 4,
      extendida: false,
      eliminados: false,
      pacienteId: 0,
      atributo: "",
      atributoIdx: 0,
      medicoId: 0,
      listaCache: [],
      cacheAtributo: '',
      cacheAtributoIdx: 0,
    },
    pacienteSeleccionador: {
      texto: "",
      seleccionado: null,
      extendida: false
    },
    diagnosticoSeleccionador: {
      texto: "",
      seleccionado: null
    },
    medicoSeleccionador: {
      texto: "",
      seleccionado: null,
      extendida: false
    },
    pacientesBuscadorCache: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0,
      lista: []
    },
    serviciosBuscadorCache: {
      texto: '',
      atributo: '',
      extendida: false,
      eliminados: false,
      lista: [],
    },
    medicosBuscadorCache: {
      texto: "",
      atributo: "",
      atributoIdx: 0,
      extendida: false,
      eliminados: false,
      lista: [],
    },
    examenesBase: [],
    examenesCache: []
  },
  getters: {
    buscaPacienteTexto: state => state.tablasBuscador.texto,
    buscaPacienteExtendida: state => state.tablasBuscador.extendida,
    buscaPacienteEliminados: state => state.tablasBuscador.eliminados,
    busquedaAtributo: state => state.tablasBuscador.atributo,
    buscaConsultaAtributo: state => state.consultaBuscador.atributo,
    buscaConsultaDesde: state => state.consultaBuscador.desde,
    buscaConsultaHasta: state => state.consultaBuscador.hasta,
    buscaConsultaTipo: state => state.consultaBuscador.tipo,
    buscaConsultaExtendida: state => state.consultaBuscador.extendida,
    buscaConsultaEliminados: state => state.consultaBuscador.eliminados,
    selPacienteTexto: state => state.pacienteSeleccionador.texto,
    selPaciente: state => state.pacienteSeleccionador.seleccionado,
    selDiagnostico: state => state.diagnosticoSeleccionador.seleccionado,
    selDiagnosticoTexto: state => state.diagnosticoSeleccionador.texto,
    selMedicoTexto: state => state.medicoSeleccionador.texto,
    selMedico: state => state.medicoSeleccionador.seleccionado,
  },
  mutations: {
    setMedicoUsuario(state, p) {
      state.medicoUsuario = p;
    },
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

    setCacheBusquedaConsultasAtributo(state, p) {
      state.consultaBuscador.cacheAtributo = p;
    },
    setCacheBusquedaConsultasAtributoIdx(state, p) {
      state.consultaBuscador.cacheAtributoIdx = p;
    },
    
    setCacheBusquedaPacientesLista(state, l) {
      state.pacientesBuscadorCache.lista = l;
    },
    setCacheBusquedaPacientesTexto(state, t) {
      state.pacientesBuscadorCache.texto = t;
    },
    setCacheBusquedaPacientesExtendida(state, x) {
      state.pacientesBuscadorCache.extendida = x;
    },
    setCacheBusquedaPacientesEliminados(state, e) {
      state.pacientesBuscadorCache.eliminados = e;
    },
    setCacheBusquedaPacientesAtributo(state, a) {
      state.pacientesBuscadorCache.atributo = a;
    },
    setCacheBusquedaPacientesAtributoIdx(state, i) {
      state.pacientesBuscadorCache.atributoIdx = i;
    },

    setCacheBusquedaMedicosLista(state, l) {
      state.medicosBuscadorCache.lista = l;
    },
    setCacheBusquedaMedicosTexto(state, t) {
      state.medicosBuscadorCache.texto = t;
    },
    setCacheBusquedaMedicosExtendida(state, x) {
      state.medicosBuscadorCache.extendida = x;
    },
    setCacheBusquedaMedicosEliminados(state, e) {
      state.medicosBuscadorCache.eliminados = e;
    },
    setCacheBusquedaMedicosAtributo(state, a) {
      state.medicosBuscadorCache.atributo = a;
    },
    setCacheBusquedaMedicosAtributoIdx(state, i) {
      state.medicosBuscadorCache.atributoIdx = i;
    },

    setCacheBusquedaServiciosLista(state, l) {
      state.serviciosBuscadorCache.lista = l;
    },
    setCacheBusquedaServiciosTexto(state, t) {
      state.serviciosBuscadorCache.texto = t;
    },
    setCacheBusquedaServiciosExtendida(state, x) {
      state.serviciosBuscadorCache.extendida = x;
    },
    setCacheBusquedaServiciosEliminados(state, e) {
      state.serviciosBuscadorCache.eliminados = e;
    },
    setCacheBusquedaServiciosAtributo(state, a) {
      state.serviciosBuscadorCache.atributo = a;
    },
    setCacheBusquedaServiciosAtributoIdx(state, i) {
      state.serviciosBuscadorCache.atributoIdx = i;
    },

    setBuscaConsultaDesde(state, p) {
      state.consultaBuscador.desde = p;
    },
    setBuscaConsultaHasta(state, p) {
      state.consultaBuscador.hasta = p;
    },
    setBuscaConsultaTipo(state, p) {
      state.consultaBuscador.tipo = p;
    },
    setBuscaConsultaExtendida(state, p) {
      state.consultaBuscador.extendida = p;
    },
    setBuscaConsultaEliminados(state, p) {
      state.consultaBuscador.eliminados = p;
    },
    setBuscaConsultaListaCache(state, p) {
      state.consultaBuscador.listaCache = p;
    },
    setBuscaConsultaPaciente(state, p) {
      state.consultaBuscador.pacienteId = p;
    },
    setBuscaConsultaAtributo(state, p) {
      state.consultaBuscador.atributo = p;
    },
    setBuscaConsultaAtributoIdx(state, p) {
      state.consultaBuscador.atributoIdx = p;
    },
    setBuscaConsultaMedico(state, p) {
      state.consultaBuscador.medicoId = p;
    },
    setBuscaConsultaMedico(state, p) {
      state.consultaBuscador.medicoId = p;
    },

    setSelPacienteTexto(state, p) {
      state.pacienteSeleccionador.texto = p;
    },
    setSelPaciente(state, p) {
      state.pacienteSeleccionador.seleccionado = p;
    },

    setSelMedicoTexto(state, p) {
      state.medicoSeleccionador.texto = p;
    },
    setSelMedico(state, p) {
      state.medicoSeleccionador.seleccionado = p;
    },
    setSelDiagnosticoTexto(state, p) {
      state.diagnosticoSeleccionador.texto = p;
    },
    setSelDiagnostico(state, p) {
      state.diagnosticoSeleccionador.seleccionado = p;
    },
  },
  actions: {
    // PACIENTES
    async buscarPacientes({state, dispatch}) {
      let tipo = state.tablasBuscador.extendida ? 1 : 0;
      let estado = state.tablasBuscador.eliminados ? 9 : 0;
      let p = {
        tipo: tipo,
        atributo: state.tablasBuscador.atributoIdx,
        estado: estado,
        texto: state.tablasBuscador.texto
      };
      return await dispatch("buscarPacienteMin", p);
    },
    async buscarPacienteMin(context, p) {
      let emp = getEmpresa().id;
      let ruta = this.$app.appConfig.apiUrl + pacientesBuscar(
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
    async cedulaRegistrada(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + cedulaRegistrada(p.id, p.cedula));
    },
    async pacienteGuardar(context, p) {
      let ent = JSON.parse(JSON.stringify(p));
      ent.fecha_nacimiento = moment(p.fecha_nacimiento).format("YYYY-MM-DD HH:mm:ss");
      ent = JSON.stringify(ent);
      if (p.relCliente.id <= 0) {
        p.relCliente.empresa_id = context.rootState.empresaAccedida.id;
      }
      let config = {
        /*headers: {
          Authorization: ""
        },*/
        url: this.$app.appConfig.apiUrl + pacienteGuardar(),
        data: ent,
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async pacientePorCedula(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + pacientePorCedula(p));
    },
    async pacienteRegistrado(context, p) {
      let ced = p.cedula.length <= 0 ? '000' : p.cedula;
      return await axios.get(this.$app.appConfig.apiUrl + pacienteRegistrado(p.id, ced, p.nombres));
    },
    async pacienteModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + pacienteModificarEstado(p.id, p.estado));
    },
    
    // MEDICOS
    async medicosPorEstado(context, p) {
      let ruta = this.$app.appConfig.apiUrl + medicosPorEstado(p);
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
    async medicosPorEspecialidadEstado(context, p) {
      let ruta = this.$app.appConfig.apiUrl + medicosPorEspecialidadEstado(p.especialidad, p.estado);
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
    async medicoPorUsuario(context, p) {
      let ruta = this.$app.appConfig.apiUrl + medicoPorUsuario(p); 
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
    async buscarMedicos({state, dispatch}) {
      let tipo = state.tablasBuscador.extendida ? 1 : 0;
      let estado = state.tablasBuscador.eliminados ? 9 : 0;
      let p = {
        tipo: tipo,
        atributo: state.tablasBuscador.atributoIdx,
        estado: estado,
        texto: state.tablasBuscador.texto
      };
      return await dispatch("buscarMedicoMin", p);
    },
    async buscarMedicoMin(context, p) {
      let emp = context.rootState.empresaAccedida.id;
      let ruta = this.$app.appConfig.apiUrl + medicosBuscar(
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
    async medicoCedulaRegistrada(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + medicoCedulaRegistrada(p.id, p.cedula));
    },
    async medicoGuardar(context, p) {
      let config = {
        /*headers: {
          Authorization: ""
        },*/
        url: this.$app.appConfig.apiUrl + medicoGuardar(),
        data: JSON.stringify(p),
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async medicoPorCedula(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + medicoPorCedula(p));
    },
    async medicoRegistrado(context, p) {
      let ced = p.cedula.length <= 0 ? '000' : p.cedula;
      return await axios.get(this.$app.appConfig.apiUrl + medicoRegistrado(p.id, ced, p.nombres));
    },
    async medicoModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + medicoModificarEstado(p.id, p.estado));
    },
    // CONSULTAS
    async diagnosticoBuscar(context, pb) {
      var regex = new RegExp(
        "(.*)" + pb.replace(" ", ".*") + "(.*)",
        "i"
      );
      return await datosCIE
        .filter(function(el) {
          return regex.test(el.descripcion) && el.nivel == 2;
        });
    },
    async buscarConsultasPersona(context, p) {
      let estado = context.state.consultaBuscador.eliminados ? 9 : 0;
      let ruta = this.$app.appConfig.apiUrl + consultasPorPaciente(
        context.state.consultaBuscador.pacienteId,
        estado
      );
      if (p.tipo != 0) {
        ruta = consultasPorMedico(
          context.state.consultaBuscador.medicoId,
          estado
        );
      }
      const resp = await axios.get(ruta)
        .catch(e => {
          return { 
            id: -1, 
            respuesta: e
          };
        });
      return {
        id: 1,
        respuesta: resp
      };
    },
    async buscarConsultasFecha(context) {
      let estado = context.state.consultaBuscador.eliminados ? 9 : 0;
      let ruta = this.$app.appConfig.apiUrl + consultasPorFecha(
        context.state.consultaBuscador.desde.toISOString().substring(0,10),
        context.state.consultaBuscador.hasta.toISOString().substring(0,10),
        estado
      );
      const resp = await axios.get(ruta)
        .catch(e => {
          return { 
            id: -1, 
            respuesta: e
          };
        });
      return {
        id: 1,
        respuesta: resp
      };
    },
    async consultaGuardarMediciones(context, p) {
      let config = {
        /*headers: {
          Authorization: ""
        },*/
        url: this.$app.appConfig.apiUrl + consultasGuardarMedidas(p.id),
        data: JSON.stringify(p.data),
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async consultaGuardar(context, p) {
      let ent = JSON.parse(JSON.stringify(p));
      ent.fecha = moment(p.fecha).format("YYYY-MM-DD");
      if (ent.proxima != null) {
        ent.proxima = moment(p.proxima).format("YYYY-MM-DD");
      }
      ent = JSON.stringify(ent);
      let config = {
        /*headers: {
          Authorization: ""
        },*/
        url: this.$app.appConfig.apiUrl + consultaGuardar(),
        data: ent,
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async consultasGuardarEstado(context, p) {
      return await axios.post(this.$app.appConfig.apiUrl + consultasGuardarEstado(p.id, p.estado));
    },
    async consultasPacienteLimite(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + consultasPacienteLimite(p.id, p.limite, p.consultaId));
    },
    async buscarConsultasMedicoFecha({state}, p) {
      let estado = state.consultaBuscador.eliminados ? 9 : 0;
      let ruta = this.$app.appConfig.apiUrl + consultasMedicoFecha(
        p,
        state.consultaBuscador.desde.toISOString().substring(0,10),
        state.consultaBuscador.hasta.toISOString().substring(0,10),
        estado
      );
      return await axios.get(ruta)
        .then(function(r) {
          return {
            id: 1,
            respuesta: r.data
          };
        })
        .catch(e => {
          return { 
            id: -1, 
            respuesta: e
          };
        });
    },
    async consultasMedicoFechaEstado({state}, p) {
      let ruta = this.$app.appConfig.apiUrl + consultasMedicoFecha(
        p.id,
        p.desde.toISOString().substring(0,10),
        p.hasta.toISOString().substring(0,10),
        p.estado
      );
      return await axios.get(ruta)
        .then(function(r) {
          return {
            id: 1,
            respuesta: r.data
          };
        })
        .catch(e => {
          return { 
            id: -1, 
            respuesta: e
          };
        });
    },
    async pacientesUnificar(context, p) {
      let config = {
        /*headers: {
          Authorization: ""
        },*/
        url: this.$app.appConfig.apiUrl + pacientesUnificar(p.id),
        data: JSON.stringify(p.otros),
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    // SERVICIOS
    async especialidadesTodas(context) {
      const response = await axios.get(this.$app.appConfig.apiUrl + especialidadesTodas())
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
    async serviciosEspecialidad(context, p) {
      let ruta = this.$app.appConfig.apiUrl + serviciosEspecialidad(p);
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
    async serviciosBuscar({state}) {
      let estado = state.tablasBuscador.eliminados ? 9 : 0;
      let tipo = state.tablasBuscador.extendida ? 1 : 0;
      let ruta = this.$app.appConfig.apiUrl + serviciosBuscar(
        tipo,
        state.tablasBuscador.texto,
        estado
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
    async servicioRegistrado(context, p) {
      if (p.codigo.length <= 0)
        p.codigo = '0';
      return await axios.get(this.$app.appConfig.apiUrl + servicioRegistrado(p.id, p.codigo, p.descripcion));
    },
    async servicioGuardar(context, p) {
      let config = {
        /*headers: {
          Authorization: ""
        },*/
        url: this.$app.appConfig.apiUrl + serviciosGuardar(),
        data: JSON.stringify(p),
        method: 'post',
        //withCredentials: true,
        crossorigin: true
      };
      return await axios(config);
    },
    async servicioModificarEstado(context, p) {
      return await axios.put(this.$app.appConfig.apiUrl + servicioModificarEstado(p.id, p.estado));
    },
    // TABLAS
    async examenesLista(context) {
      if (context.state.examenesBase.length <= 0) {
        const response = await axios.get(this.$app.appConfig.apiUrl + examenesLista())
          .catch(e => {
            return { 
              id: -1, 
              respuesta: e
            };
          });
        context.state.examenesBase = response.data
      }
      return {
        id: 1,
        respuesta: context.state.examenesBase
      };
    },
    async registrosPorTabla(context, p) {
      const response = await axios.get(this.$app.appConfig.apiUrl + registrosPorTabla(p.id))
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
    async plantillasPorEstado(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + plantillasPorEstado(p));
    },
    examenesCargarCache({state, dispatch}) {
      dispatch("registrosPorTabla", {
        id: 12 // Tipos de identificacion
      }).then(function(r) {
        state.examenesCache = r.respuesta.data
      })
    }
  }
}

export default clinica;