<template>
  <user-layout>
    <b-row class="h-100">
      <b-colxx xxs="12" md="10" class="mx-auto my-auto">
        <b-card class="auth-card" no-body v-if="!caducado">
          <div class="position-relative image-side">
            <div class="d-flex align-items-center">
              <router-link tag="a" to="/">
                <span class="logo-login flex-inicio mr-2 mt-3" />
              </router-link>
              <div class="flex-grow-1">
                <p class="text-white h2">Viniapro</p>
                <p class="white mb-0">
                  Por favor digite su nuevo codigo de acceso.
                  <br />Si ud. no esta suscrito, por favor
                  <router-link tag="a" to="/" class="white">registrarse</router-link>.
                </p>
              </div>
            </div>
          </div>
          <div class="form-side">
            <h6 class="mb-4">Crear nuevo codigo de acceso</h6>
            <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
              <b-form-group label="Codigo nuevo" class="has-float-label mb-4">
                <b-form-input
                  type="password"
                  v-model="$v.form.password.$model"
                  :state="!$v.form.password.$error"
                />
                <b-form-invalid-feedback 
                  v-if="!$v.form.password.required"
                >Por favor ingrese su codigo</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="registrado"
                >Este codigo ya esta registrado</b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label="Repetir codigo" class="has-float-label mb-4">
                <b-form-input
                  type="password"
                  v-model="$v.form.passwordAgain.$model"
                  :state="!$v.form.passwordAgain.$error"
                />
                <b-form-invalid-feedback
                  v-if="!$v.form.passwordAgain.required"
                >Por favor ingrese nuevamente su codigo</b-form-invalid-feedback>
                <b-form-invalid-feedback
                  v-else-if="!$v.form.passwordAgain.sameAsPassword"
                >Los codigos no coinciden</b-form-invalid-feedback>
              </b-form-group>

              <div class="d-flex justify-content-between align-items-center">
                <router-link
                  tag="a"
                  to="/subscripciones/codigo-olvidado"
                >Olvido su codigo?</router-link>
                <b-button
                  type="submit"
                  variant="primary"
                  size="lg"
                  :disabled="processing"
                  :class="{'btn-multiple-state btn-shadow': true,
                      'show-spinner': processing,
                      'show-success': !processing && loginError===false,
                      'show-fail': !processing && loginError }"
                >
                  <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                  </span>
                  <span class="icon success">
                    <i class="simple-icon-check"></i>
                  </span>
                  <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                  </span>
                  <span class="label">Aceptar</span>
                </b-button>
              </div>
            </b-form>
          </div>
        </b-card>
        <b-card v-else class="auth-card" no-body>
          <div class="position-relative image-side">
            <div class="d-flex align-items-center">
              <router-link tag="a" to="/">
                <span class="logo-login flex-inicio mr-2 mt-3" />
              </router-link>
              <div class="flex-grow-1">
                <p class="text-white h2">Viniapro</p>
                <p class="white mb-0">{{ $t("pages.error-title") }}</p>
              </div>
            </div>    
          </div>
          <div class="form-side">
            <h6 class="mb-4">El link de reseteo no es valido o ha caducado</h6>
            <p class="mb-0 text-muted text-small mb-0">{{ $t("pages.error-code") }}</p>
            <p class="display-1 font-weight-bold mb-5">404</p>
            <b-button
              type="submit"
              variant="primary"
              size="lg"
              class="btn-shadow"
              @click="salir"
            >Salir</b-button>
          </div>
        </b-card>
      </b-colxx>  
    </b-row>  
  </user-layout>
</template>

<script>
import { setCurrentSubscriber } from '../../utils';
import UserLayout from "../../layouts/UserLayout";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
const {
  required,
  maxLength,
  minLength,
  email,
  sameAs
} = require("vuelidate/lib/validators");

export default {
  components: {
    "user-layout": UserLayout
  },
  data() {
    return {
      form: {
        password: "",
        passwordAgain: ""
      },
      registrado: false,
      caducado: false,
      consultando: false
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      password: {
        required,
        maxLength: maxLength(16),
        minLength: minLength(4)
      },
      passwordAgain: {
        required,
        sameAsPassword: sameAs("password")
      }
    }
  },
  computed: {
    ...mapGetters([
      "currentUser",
      "processing",
      "loginError",
      "resetPasswordSuccess"
    ])
  },
  methods: {
    ...mapActions(["resetPassword", "resetCodigoValidar", "removeAxiosAuthor"]),
    formSubmit() {
      this.$v.form.$touch();
      if (!this.$v.form.$anyError) {
        this.resetPassword({          
          token: this.$route.params.token || "",
          clave: this.form.password,
        }).then(function(resp) {
          this.$notify(
            "success",
            "Codigo actualizado",
            resp.data.msj,
            { duration: 3000,
              permanent: false }              
          );
          setCurrentSubscriber(false);
          this.removeAxiosAuthor();
          this.$store.commit("setProcessing", false);
          this.$router.push("/bienvenido");
        }.bind(this))
        .catch(function(error) {
          this.$notify("error", "Error al resetear codigo", error, {
            duration: 3000,
            permanent: false
          });
        }.bind(this));
      }
    },
    salir() {
      this.$router.push("/");
    }
  },
  watch: {
    loginError(val) {
      if (val != null) {
        this.$notify("error", "Error al resetear codigo", val, {
          duration: 3000,
          permanent: false
        });
      }
    },
    resetPasswordSuccess(val) {
      if (val) {
        this.$notify(
          "success",
          "Codigo actualizado",
          "El codigo de acceso ha sido actualizado exitosamente",
          {
            duration: 3000,
            permanent: false
          }
        );
      }
    }
  },
  mounted() {
    this.resetCodigoValidar(this.$route.params.token).then(function(resp) {      
      this.caducado = !resp.data.res;
    }.bind(this))
    .catch(function(error) {
      this.caducado = true;
    }.bind(this))
  }
};
</script>
