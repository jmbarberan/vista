<template>
  <user-layout>
    <b-row class="h-100">
      <b-colxx xxs="12" md="10" class="mx-auto my-auto">
        <b-card class="auth-card" no-body>
          <div class="position-relative image-side">
            <div class="d-flex align-items-center">
              <span class="logo-login flex-inicio mr-2 mt-3" />
              <div class="flex-grow-1">
                <p class="login-text h2">Viniapro</p>
                <h4 class="login-text">Sistema de gestión</h4>
              </div>
            </div>
          </div>
          <div class="form-side">
            <b-form @submit.prevent="acceder" class="av-tooltip tooltip-label-bottom">
              <b-form-group v-if="!accedido" label="Codigo de acceso" class="has-float-label mb-4">
                <b-form-input type="password" ref="txCodigo" size="sm" v-model="codigo" placeholder="Digite su codigo para acceder al sistema" @keyup.enter="acceder()"/>
              </b-form-group>
              <p class="lead mb-0">
                <!--b-button variant="primary" class="mr-4" size="lg">{{$t('jumbotron.learn-more')}}</!--b-button-->
                <b-button @click="acceder()" class="mt-2 mb-2" variant="primary" size="lg">{{ accedidoLabel }}</b-button>
              </p>
              <router-link v-if="!accedido" tag="a" to="/subscripciones/codigo-olvidado">Olvido su codigo?</router-link>
              <b-button v-else variant="link" @click="limpiarCodigo()">Acceder con otro codigo</b-button>
            </b-form>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </user-layout>
</template>

<script>
import UserLayout from "../layouts/UserLayout";
import { mapGetters, mapActions } from 'vuex';
import { setCurrentSubscriber, getCurrentSubscriber } from '../utils'
import axios from 'axios';
const md5 = require("md5");

export default {
  components: {
    "user-layout": UserLayout
  },
  data() {
    return {
      codigo: "",
      accedido: false,
      accedidoLabel: "Acceder al sistema"
    }
  }, 
  computed: {
    ...mapGetters([
      "subscriptor"
    ]),
    nombre: {
      get() {
        let ret = "";
        if (this.subscriptor.nombre.lenght > 0) {
          this.accedidoLabel = "Accedido como: ";
          ret = this.subscriptor.nombre;
        }
        return ret;
      }
    }
  },
  methods: {
    ...mapActions(["removeAxiosAuthor"]),
    acceder() {
      if (this.accedido) {
        this.$router.push({
          path: "/usuario/acceder"
        });
      } else {
        let encoded = md5(this.codigo);
        this.$store.dispatch("subscripciones/codigoValidar", window.btoa(encodeURIComponent(encoded))).then(function(r) {
          this.$store.commit('setSubscripcionId', r.data.cid);
          this.$store.commit('setSubscripcionTipo', r.data.tipo);
          this.$store.commit('setSubscripcionNombre', r.data.nom);
          this.$store.commit('setRemotoConfigToken', window.btoa(encodeURIComponent(encoded)));
          axios.defaults.headers.common['Authorization'] = window.btoa(encodeURIComponent(encoded));
          setCurrentSubscriber({
            id: r.data.cid,
            nombre: r.data.nom,
            tipo: r.data.tipo,
            codigo: window.btoa(encodeURIComponent(encoded))
          });
          this.$router.push({
            path: "/usuario/acceder"
          });
        }.bind(this))
        .catch(function(e) {
          let msj = "El codigo digitado es invalido";
          if (e.response != undefined && e.response.data != undefined && e.response.data.msj != undefined)
            msj = e.response.data.msj;
          else {
            if (e.message != undefined) {
              msj = e.message;
            }
          }
          this.$notify("warning",
            "Acceder",
            msj,
            { duration: 3000, permanent: false });
        }.bind(this));
      }
    },
    limpiarCodigo() {
      this.$store.commit("setEmpresaAccedida", {
        id: 0,
        nombre: "",
        sesion: false
      });
      setCurrentSubscriber(false);
      this.removeAxiosAuthor();
      this.accedido = false;
      this.accedidoLabel = "Acceder al sistema";
    }
  },
  mounted() {
    let sub = getCurrentSubscriber();
    let cod = axios.defaults.headers.common['Authorization'];
    if (cod != undefined && cod.length > 0) {
      this.accedido = true;
      this.$store.commit('setRemotoConfigToken', cod);
      axios.defaults.headers.common['Authorization'] = cod;
    } else {
      if (sub != null && sub.codigo != undefined && sub.codigo.length > 0) {
        this.accedido = true;
        this.$store.commit('setRemotoConfigToken', sub.codigo);
        axios.defaults.headers.common['Authorization'] = sub.codigo;
      }
    }
    
    if (sub != undefined) {
      if (sub.id != undefined && sub.id > 0 && sub.tipo != undefined) {
        this.$store.commit('setSubscripcionId', sub.id);
        this.$store.commit('setSubscripcionTipo', sub.tipo);
        this.$store.commit('setSubscripcionNombre', sub.nombre);
        this.accedidoLabel = "Acceder como " + sub.nombre;
      }
    }
  },
}
</script>