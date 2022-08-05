<template>
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
                <h6 class="mb-4">{{ $t('user.login-title')}}</h6>
                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group :label="$t('menu.ajustes.empresa')">
                        <model-list-select 
                            :list="empresas"
                            v-model="empresaSeleccionado"
                            option-value="Id"
                            option-text="Nombre"
                            placeholder="Seleccionar empresa">
                        </model-list-select>
                    </b-form-group>

                    <b-form-group label="Usuario" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.crendencial.usuario.$model" :state="!$v.crendencial.usuario.$error" />
                        <b-form-invalid-feedback v-if="!$v.crendencial.usuario.required">Digite su código de usuario</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group label="Contraseña" class="has-float-label mb-4">
                        <b-form-input type="password" v-model="$v.crendencial.clave.$model" :state="!$v.crendencial.clave.$error" />
                        <b-form-invalid-feedback v-if="!$v.crendencial.clave.required">Digite su contraseña</b-form-invalid-feedback>
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
                            <span class="label">{{ $t('user.login-button') }}</span>
                        </b-button>
                    </div>
                </b-form>
            </div>
        </b-card>
    </b-colxx>
</b-row>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

import {
    validationMixin
} from "vuelidate";

import { 
    ModelListSelect 
} from 'vue-search-select';

import { getEmpresa } from "../../utils";

const {
    required
} = require("vuelidate/lib/validators");

export default {
    components: {
        ModelListSelect
    },
    data() {
			return {
				crendencial: {
					usuario: "",
					clave: ""
				},
                empresas: [],
                empresaSeleccionado: null
			};
    },
    mixins: [validationMixin],
    validations: {
			crendencial: {
				clave: {
					required,
				},
				usuario: {
					required,
				}
			}
    },
    computed: {
      ...mapGetters([
            "currentUser", 
            "processing", 
            "loginError"
        ])
    },
    methods: {
			...mapActions(["login"]),
			formSubmit() {
				this.$v.$touch();
				this.$v.crendencial.$touch();
				if (!this.$v.crendencial.$anyError && this.empresaSeleccionado.Id > 0) {
					this.login({
						usuario: this.crendencial.usuario,
						clave: this.crendencial.clave
					});
				}
			}
    },
    watch: {
        currentUser(val) {
            if (val && val.Id && val.Nombres.length > 0) {
                setTimeout(() => {
                    this.$router.push("/inicio");
                    this.$store.commit("setEmpresaAccedida", {
                        id: this.empresaSeleccionado.Id,
                        nombre: this.empresaSeleccionado.Nombre,
                        sesion: true
                    });
                }, 200);
            }
        },
        loginError(val) {
            if (val != null) {
                let msj = "Usuario o contraseña invalidos"            
                if (val != undefined && val.data != undefined) {
                    msj = val.data;
                }
                this.$notify("error", "No se puede acceder", msj, {
                    duration: 3000,
                    permanent: false
                });
            }
        }
    },
    mounted() {
        this.$store
            .dispatch("ajustes/empresasPorEstado", 0)
            .then(function(r) {
                this.empresas = r.data;
                if (this.empresas.length > 0) {
                    let emp = getEmpresa();
                    if (emp && parseInt(emp.id) > 0) {                        
                        let res = this.empresas.filter(e => e.Id == emp.id)
                        if (res.length > 0) {
                            this.empresaSeleccionado = res[0]
                        }
                    } else {
                        this.empresaSeleccionado = this.empresas[0];
                    }
                }
            }.bind(this))
            .catch(function(ex) {
                console.log(ex);
            });
    },
};
</script>
