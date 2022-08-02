<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('vista.clinica.pacientes.editor-titulo')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.ventas.clientes.datos-personales') }}</h6>
            <b-form class="av-tooltip mb-5 tooltip-label-right">
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.tipo-identificacion')">
                    <b-form-select v-model="paciente.relCliente.identificacion_tipo"
                      :options="tiposIdentificacion"
                      value-field="id"
                      text-field="denominacion"
                      size="xs"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                    <div>
                      <b-overlay :show="ocupadoCedula" rounded="lg" opacity="0.6">
                        <template #overlay>
                          <div class="d-flex align-items-center">
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <b-spinner type="grow" variant="dark"></b-spinner>
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <!-- We add an SR only text for screen readers -->
                            <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') }}...</span>
                          </div>
                        </template>
                        <b-form-input 
                          type="text" v-model.trim="paciente.relCliente.identificacion" 
                          @keyup.enter="validarCedula()" class="fondo-transparente-min" 
                          :state="!$v.paciente.relCliente.identificacion.$error"
                          :placeholder="$t('vista.busqueda.digitar-enter')"/>
                        <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.cedula') }}</b-form-invalid-feedback>
                      </b-overlay>
                    </div>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                    <b-form-input type="text" v-model="paciente.relCliente.nombres" :state="!$v.paciente.relCliente.nombres.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.nombres') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                    <b-form-input type="text" v-model.trim="paciente.relCliente.direccion" :state="!$v.paciente.relCliente.direccion.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.direccion') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                    <b-form-input type="text" v-model.trim="paciente.relCliente.telefonos" :state="!$v.paciente.relCliente.telefonos.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.telefonos') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                    <b-form-input type="text" v-model.trim="paciente.relCliente.email"  :state="!$v.paciente.relCliente.email.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.email') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.representante-nom')">
                    <b-form-input type="text" v-model.trim="paciente.relCliente.representante_nom"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.representante-ref')">
                    <b-form-input type="text" v-model.trim="paciente.relCliente.representante_ced"/>
                  </b-form-group>
                </b-colxx>
                <!--b-colxx xxs="12" sm="6">
                  <b-form-group label="Cupo credito">
                    <b-form-input type="text" v-model.trim="paciente.relCliente.cupo"/>
                  </b-form-group>
                </!--b-colxx-->
              </b-row>
              <h6 class="mb-4">{{ $t('vista.clinica.pacientes.datos-medicos') }}</h6>
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.pacientes.campos.gsanguineo')">
                    <b-form-select
                      v-model="paciente.grupo_sanguineo" 
                      :options="gruposSanguineos"
                      value-field="id"
                      text-field="denominacion"
                      size="sm"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.pacientes.campos.sexo')">
                    <b-form-select
                      v-model="paciente.sexo"
                      :options="sexos"
                      value-field="id"
                      text-field="denominacion"
                      size="sm"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.pacientes.campos.ecivil')">
                    <b-form-select 
                      v-model="paciente.estado_civil" 
                      :options="estadosCiviles"
                      value-field="id"
                      text-field="denominacion"
                      size="sm"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label='$t("vista.clinica.pacientes.campos.nacimiento")'>
                    <datepicker
                      class="fecha-md"
                      :bootstrap-styling="true"
                      v-model="nacimiento"
                      :language="es"
                    ></datepicker>
                    <b-form-invalid-feedback :state="!$v.paciente.fecha_nacimiento.$error">{{ $t('vista.clinica.consultas.validacion.fecha') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
              </b-row>
              <div class="mt-4">
                <b-overlay 
                  :show="procesando" 
                  opacity=0.6
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                  @hidden="ocultaOverlay"
                >
                  <b-button ref="btGuardar" :disabled="procesando" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
                </b-overlay>  
                <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
              </div>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { cedulaValida } from '../../utils'
import Datepicker from "vuejs-datepicker";
import {es} from 'vuejs-datepicker/dist/locale';
import moment from 'moment';
const { required, minLength, maxLength, email, numeric, maxValue } = require("vuelidate/lib/validators");
export default {
  components: {
    Datepicker
  },
  data: function () {
    return {
      es: es,
      paciente: {
        id: 0,
        cliente_id: 0,
        fecha_nacimiento: null,
        sexo: 0,
        estado_civil: 0,
        instruccion: 0,
        grupo_sanguineo: 0,
        foto: "",
        alergias: "",
        antecedentes_familiares: "",
        antecedentes_personales: "",
        estado: 0,
        relCliente: {
          id: 0,
          empresa_id: 1,
          codigo: "",
          identificacion: "",
          identificacion_tipo: 0,
          nombres: "",
          direccion: "",
          telefonos: "",
          representante_nom: "",
          representante_ced: "",
          email: "",
          cupo: 0,
          estado: 0,
          relIdentificaTipo: null
        },
        relEstadoCivil: null,
        relSexo: null,
        relGrupoSanguineo: null
      },
      sexos: [],
      tiposIdentificacion: [],
      gruposSanguineos: [],
      estadosCiviles: [],
      procesando: false,
      ocupadoCedula: false,
    }
  },
  validations: {
    paciente: {
      relCliente: {
        nombres: {
          required
        },
        identificacion: {
          minLength: minLength(10),
          maxLength: maxLength(13),
          valido(val) {
            return val.length <= 10 ? cedulaValida(val) : (val.length == 13 ? true : false);
          }
        },
        telefonos: { numeric, maxLength: maxLength(15) },
        direccion: { required },
        email: { email }
      },
      fecha_nacimiento: {
        maxValue(val) {
          return new Date(val) <= new Date();
        },
      }
    }
  },
  computed: {
    tituloAccion: function() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.paciente.id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    nacimiento: {
      get: function() {
        if (this.paciente.fecha_nacimiento != null)
          return this.$moment(this.paciente.fecha_nacimiento).toDate();
        else
          return null;  
      },
      set: function(v) {
        this.paciente.fecha_nacimiento = v;
      }
    }
  },
  methods: {
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning", 
          this.$t("vista.transacciones.guardar-canot"),
          this.$t("vista.transacciones.guardar-invalido"),
          { duration: 3000, permanent: false });
      } else {
        this.procesando = true;
        if (this.paciente.id == 0) {
          // Validar paciente existe
          this.$store
            .dispatch("clinica/pacienteRegistrado", { 
              id: this.paciente.id,
              cedula: this.paciente.relCliente.identificacion,
              nombres: this.paciente.relCliente.nombres })
            .then(function(res) {
              if (res.status == 200) {  
                this.procesarGuardado();
              } else {
                this.$notify("warning", 
                  this.$t("vista.transacciones.guardar-canot"),
                  res.data,
                  { duration: 3000, permanent: false });
              }
              this.procesando = false;
            }.bind(this))
            .catch(function(e) {
              let msg = this.$t("vista.transacciones.guardar-error");
              if (e.response.data != undefined)
                msg = e.response.data;
              this.procesando = false;
              this.$notify("danger", 
                this.$t("vista.transacciones.guardar-canot"),
                msg,
                { duration: 3000, permanent: false });
            }.bind(this));
          this.procesando = false;  
        } else {
          this.procesarGuardado();
          this.procesando = false;
        }
      }
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.back();
    },
    validarCedula() {
      this.ocupadoCedula = true;
      this.$store
        .dispatch("clinica/cedulaRegistrada", { 
          id: this.paciente.relCliente.id,
          cedula: this.paciente.relCliente.identificacion })
        .then(function(res) {
          if (res.status == 200) {
            this.$notify("success", 
              "Cédula registrada",
              res.data.msj,
              { duration: 3000, permanent: false });
            if (res.data.data != undefined) {
              this.paciente.relCliente = res.data.data;
            }
          }
          this.ocupadoCedula = false;  
        }.bind(this))
        .catch(function(e) {
          this.ocupadoCedula = false;
        }.bind(this));
      //this.ocupadoCedula = false;  
    },
    procesarGuardado() {
      this.procesando = true;
      this.$store
        .dispatch("clinica/pacienteGuardar", this.paciente)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify("success", 
              this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.pacientes.denominacion"),
              res.data.msj,
              { duration: 3000, permanent: false });
            this.$router.back();
          } else {
            this.$notify("warning", 
              this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.pacientes.denominacion"),
              res.data.msj,
              { duration: 3000, permanent: false });
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = this.$t('vista.transacciones.guardar-error');
          console.log(e);
          /*if (e.response.data.msj != undefined);
            msj = e.response.data.msj;*/
          this.$notify("danger", 
            this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.pacientes.denominacion"),
            msj,
            { duration: 3000, permanent: false });  
        }.bind(this)
      );
    }
  },
  mounted() {
    this.$store
      .dispatch("clinica/registrosPorTabla", {
        id: 1 // Sexos biologicos
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.sexos = r.respuesta.data;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("clinica/registrosPorTabla", {
        id: 2 // Estados civiles
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.estadosCiviles = r.respuesta.data;
          }
        }
      }.bind(this));  
    this.$store
      .dispatch("clinica/registrosPorTabla", {
        id: 3 // Grupos sanguineos
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.gruposSanguineos = r.respuesta.data;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 12 // Tipos de identificacion
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.tiposIdentificacion = r.respuesta.data;
          }
        }
      }.bind(this));
    if (this.$route.params.id > 0) {
      this.paciente = {
        id: this.$route.params.dato.id,
        cliente_id: this.$route.params.dato.cliente_id,
        fecha_nacimiento: this.$route.params.dato.fecha_nacimiento,
        sexo: this.$route.params.dato.sexo,
        estado_civil: this.$route.params.dato.estado_civil,
        grupo_sanguineo: this.$route.params.dato.grupo_sanguineo,
        foto: this.$route.params.dato.foto,
        alergias: this.$route.params.dato.alergias,
        antecedentes_familiares: this.$route.params.dato.antecedentes_familiares,
        antecedentes_personales: this.$route.params.dato.antecedentes_personales,
        estado: this.$route.params.dato.estado,
        relCliente: this.$route.params.dato.relCliente,
        relEstadoCivil: this.$route.params.dato.relEstadoCivil,
        relSexo: this.$route.params.dato.relSexo,
        relGrupoSanguineo: this.$route.params.dato.relGrupoSanguineo
      };
      if (this.paciente.fecha_nacimiento != undefined) {
        try {
          const f = this.paciente.fecha_nacimiento.split();
          this.paciente.fecha_nacimiento = new moment(f[0], f[1], f[2]).toDate();
        } catch(e) {
          this.paciente.fecha_nacimiento = new moment.utc(this.paciente.fecha_nacimiento);
        }
      } else {
        this.paciente.fecha_nacimiento = null;
      }
    }
  }
}
</script>
