//import { isAuthGuardActive } from '../../constants/config'
import { setCurrentUser, getCurrentUser, setCurrentSubscriber } from '../../utils'
import { codigoReseteoSolicitar, codigoReseteoValidar, codigoResetear } from "@/rutas/subscripciones";
import { apiSeguridad } from "@/rutas/seguridad";
//import { UserRole } from "@/utils/auth.roles";
import axios from 'axios';
const md5 = require("md5");

export default {
  state: {
    currentUser: getCurrentUser(), //isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess = true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess = true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    async login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true);
      commit("setEmpresaAccedida", {
        id: 0,
        nombre: "",
        sesion: false
      });
      
      var params = JSON.stringify({
        "usr": payload.usuario,
        "cla": md5(payload.clave)
      });
      return await axios.post(this.$app.appConfig.apiUrl + apiSeguridad.usuariosAcceso(), params)
        .then(function(r) {
          setCurrentUser(r.data);
          r.data['Clave'] = "";
          commit('setUser', r.data);
          payload.empresa.sesion = true;
          commit("setEmpresaAccedida", payload.empresa);
        })
        .catch(function(e) {
          setCurrentUser(null);
            commit('setError', e.response)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
        });
    },
    async forgotPassword({ commit }, payload) { // forgot password
      commit('clearError');
      commit('setProcessing', true);      
      return await axios.post(this.$app.appConfig.apiUrl + codigoReseteoSolicitar(), JSON.stringify({ codigo: window.btoa(payload.email) }));
    },
    async resetCodigoValidar({ commit }, p) {
      let ruta = this.$app.appConfig.apiUrl + codigoReseteoValidar(p);
      return await axios.get(ruta);
    },
    async resetPassword({ commit }, p) {
      commit('clearError');
      commit('setProcessing', true);
      let config = {
        url: this.$app.appConfig.apiUrl + codigoResetear(),
        data: JSON.stringify({ "token": p.token, "clave": md5(p.clave) }),
        method: 'post',
        crossorigin: true
      };
      return await axios(config);
    },
    signOut({ commit }) {
      setCurrentUser(null);
      commit('clinica/setBuscaConsultaListaCache', []);
      commit("setEmpresaAccedida", {
        id: 0,
        nombre: "",
        sesion: false
      });
      commit('setLogout');
    },
    exitSubscriberAccount({ commit, dispatch }) {
      setCurrentUser(null);
      commit('clinica/setBuscaConsultaListaCache', []);
      commit("setEmpresaAccedida", {
        id: 0,
        nombre: "",
        sesion: false
      });
      commit('setLogout');
      setCurrentSubscriber(null);
      dispatch("removeAxiosAuthor");
    },
    removeAxiosAuthor() {
      axios.defaults.headers.common['Authorization'] = "";
    }
  }
}
