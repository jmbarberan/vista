<template>
  <user-layout>
    <b-row class="h-100">
      <b-colxx xxs="12" md="10" class="mx-auto my-auto">
        <b-card class="auth-card" no-body>
          <div class="position-relative image-side">
            <div class="d-flex align-items-center">
              <span class="logo-login flex-inicio mr-2 mt-3" />
              <div class="flex-grow-1">
                <p class="text-white h2">Viniapro</p>
                <p class="white mb-0">
                  Sistema administrativo integrado
                </p>
              </div>
            </div>
          </div>
          <div class="form-side">
            <h6 class="mb-4">Por favor digite su email para recibir un link
              <br />de reseteo de su codigo de acceso.</h6>
            <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
              <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
                <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error" />
                <b-form-invalid-feedback v-if="!$v.form.email.required">Por favor ingrese su correo electrónico</b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.form.email.email">Por favor ingrese un correo válido</b-form-invalid-feedback>
                <b-form-invalid-feedback v-else-if="!$v.form.email.minLength">El correo debe contener al menos 4 caracteres</b-form-invalid-feedback>
              </b-form-group>
              <div class="d-flex justify-content-between align-items-center">
                <!--router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link-->
                <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                  'show-spinner': processing,
                  'show-success': !processing && loginError===false,
                  'show-fail': !processing && loginError }">
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
                  <span class="label">Enviar</span>
                </b-button>
              </div>
            </b-form>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </user-layout>
</template>

<script>
import UserLayout from "../../layouts/UserLayout.vue";
import {
    mapGetters,
    mapActions
} from "vuex";
import {
    validationMixin
} from "vuelidate";
const {
    required,
    maxLength,
    minLength,
    email
} = require("vuelidate/lib/validators");

export default {
    components: {
      "user-layout": UserLayout
    },
    data() {
        return {
            form: {
                email: ""
            }
        };
    },
    mixins: [validationMixin],
    validations: {
        form: {
            email: {
                required,
                email,
                minLength: minLength(4)
            }
        }
    },
    computed: {
        ...mapGetters(["processing", "loginError", "forgotMailSuccess"])
    },
    methods: {
        ...mapActions(["forgotPassword"]),
        formSubmit() {
            this.$v.form.$touch();
            if (!this.$v.form.$anyError) {
                this.forgotPassword({
                    email: this.form.email
                }).then(function(r) {
                  this.$store.commit('setProcessing', false);
                  this.$notify("success",
                    "Acceder",
                    r.data.msj,
                    { duration: 3000, permanent: false }
                  );
                  this.$router.push("/");
                }.bind(this))
                .catch(function(e) {
                  let msj = "El correo digitado no se encuentra registrado"
                  if (e.response != undefined && e.response.data != undefined) {
                    msj = e.response.data.msj;
                  }
                  this.$store.commit('setProcessing', false);
                  this.$notify("warning",
                    "Acceder",
                    msj,
                    { duration: 3000, permanent: false }
                  );
                }.bind(this));
            }
        }
    },
    watch: {
        loginError(val) {
            if (val != null) {
                this.$notify("error", "Error al solicitar reseteo de codigo", val, {
                    duration: 3000,
                    permanent: false
                });
            }
        },
        forgotMailSuccess(val) {
            if (val) {
                this.$notify(
                    "success",
                    "Solicitud de reseteo enviada",
                    "Por favor revise su correo electrónico.", {
                        duration: 3000,
                        permanent: false
                    }
                );
            }
        }
    }
};
</script>
