<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('vista.clinica.medicos.editor-titulo')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.clinica.medicos.datos-personales') }}</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.codigo')">
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      <input type="checkbox" v-model="codigoGenerar"/>
                    </b-input-group-prepend>
                    <b-form-input type="text" v-model.trim="medico.codigo"/>
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                  <b-form-input type="text" v-model.trim="medico.identificacion" class="fondo-transparente-min"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.clinica.medicos.campos.titulo')">
                  <b-form-input type="text" v-model.trim="medico.titulo" class="fondo-transparente-min"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                  <b-form-input type="text" v-model="medico.nombres" :state="!$v.medico.nombres.$error"/>
                  <b-form-invalid-feedback>{{ $t('vista.clinica.medicos.validacion.nombres') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12">
                <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                  <b-form-input type="text" v-model.trim="medico.direccion"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                  <b-form-input type="text" v-model.trim="medico.telefonos"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                  <b-form-input type="text" v-model.trim="medico.email"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.clinica.medicos.campos.registro')">
                  <b-form-input type="text" v-model.trim="medico.registro_profesional"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.clinica.medicos.campos.usuario')">
                  <b-form-select 
                    v-model="medico.usuario_id" 
                    :options="usuarios"
                    value-field="id"
                    text-field="codigo"
                    size="sm"
                  />
                  <b-form-invalid-feedback>{{ $t('vista.clinica.medicos.validacion.usuario') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group class="w-100" label="Seleccionar especialidades">
                  <div class="input-grupo">
                    <model-list-select
                      :list="especialidades"
                      v-model="especialidadSeleccionado"
                      option-value="id"
                      option-text="descripcion"
                      placeholder="Seleccionar para agregar"
                      class="input-grupo-select">
                    </model-list-select>  
                    <b-button :disabled="especialidadNoSel" class="borde-recto input-grupo-boton" @click="agregarEspecialidad()" tooltip="Agregar especialidad seleccionada">
                      <i class="mdi mdi-plus"/>
                    </b-button>
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group class="w-100" label="Especialidades asignadas">
                  <div class="w-100 badges-container">
                    <b-badge v-for="(item, index) in vistaEspecialidades" :key="index" pill class="mr-1 mb-1">
                      <span>{{ item.relEspecialidad.descripcion }}</span>
                      <a @click.prevent.stop="eliminarEspecialidad(index)" class="ml-2 vue-tagsinput-remove"></a>
                    </b-badge>
                  </div>
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
import {es} from 'vuejs-datepicker/dist/locale';
import { ModelListSelect } from 'vue-search-select'
const { required, minValue } = require("vuelidate/lib/validators");
const mayorQueCero = (value) => value > 0
export default {
  components: {
    ModelListSelect
  },
  data() {
    return {
      es: es,
      medico: {
        id: 0,
        codigo: '',
        identificacion: '',
        titulo: '',
        nombres: '',
        registro_profesional: '',
        direccion: '',
        telefonos: '',
        email: '',
        empresa_id: 1,
        usuario_id: 0,
        estado: 0,
        relUsuario: {
          id: 0,
          nombre: ''
        },
        relEspecialidades: []
      },
      usuarios: [],
      especialidades: [],
      especialidadSeleccionado: {
        id: 0,
        codigo: '',
        descripcion: '',
        estado: 0
      },
      procesando: false,
      codigoGenerar: true,
      vistaEspecialidades: []
    }
  },
  validations: {
    medico: {
      nombres: {
        required
      },
    }
  },
  methods: {
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning", 
          this.$t('vista.transaccion.guardar-canot'), 
          this.$t('vista.transaccion.guardar-invalido'), 
          { duration: 3000, permanent: false });
      } else {
        if (this.medico.usuario_id > 0) {
          this.procesando = true;
          if (this.medico.id == 0) {
            // Validar medico existe
            this.$store
              .dispatch("clinica/medicoRegistrado", { 
                id: this.medico.id,
                cedula: this.medico.identificacion, 
                nombres: this.medico.nombres })
              .then(function(res) {
                if (res.status == 200) {
                  this.procesarGuardado();
                } else {
                  this.$notify("warning", 
                    this.$t('vista.transaccion.guardar-canot'), 
                    res.data, 
                    { duration: 3000, permanent: false });
                }
                this.procesando = false;
              }.bind(this))
              .catch(function(e) {
                let msg = "No se puede guardar por error relacionado al servidor";
                if (e.response.data != undefined)
                  msg = e.response.data;
                this.procesando = false;
                this.$notify("danger", 
                    this.$t('vista.transaccion.guardar-canot'), 
                    msg, 
                    { duration: 3000, permanent: false });
              }.bind(this));
            this.procesando = false;
          } else {
            this.procesarGuardado();
            this.procesando = false;
          }
        } else {
          this.$notify("warning", 
            this.$t('vista.transaccion.guardar-canot'), 
            this.$t('vista.clinica.medicos.error-seluser'), 
            { duration: 3000, permanent: false });
        }
      }
    },
    procesarGuardado() {
      this.medico.relEspecialidades = this.vistaEspecialidades;
      this.$store
        .dispatch("clinica/medicoGuardar", this.medico)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify("success", 
              this.$t('vista.transacciones.guardando') + " " + this.$t('vista.clinica.consultas.campos.medico'), 
              res.data.msj, 
              { duration: 3000, permanent: false });
            this.$router.back();
          } else {
            this.$notify("warning", 
              this.$t('vista.transacciones.guardando') + " " + this.$t('vista.clinica.consultas.campos.medico'), 
              res.data.msj, 
              { duration: 3000, permanent: false });
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          console.log("Datos del error:")
          console.log(e);
          this.procesando = false;
          let msj = "No se puede guardar por error en el servidor";
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.$notify("danger", 
            this.$t('vista.comandos.guardar') + " " + this.$t('vista.clinica.consultas.campos.medico'), 
            msj, 
            { duration: 3000, permanent: false });
        }.bind(this)
      );
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.back();
    },
    agregarEspecialidad() {
      if (this.vistaEspecialidades == undefined && this.vistaEspecialidades == null) {
        this.vistaEspecialidades = [];
      }
      this.vistaEspecialidades.push({
        id: 0,
        descripcion: "",
        medico_id: this.medico.id,
        especialidad_id: this.especialidadSeleccionado.id,
        relEspecialidad: this.especialidadSeleccionado
      });
      this.especialidadSeleccionado = {
        id: 0,
        codigo: '',
        descripcion: '',
        estado: 0
      };
    },
    eliminarEspecialidad(index) {
      if (this.vistaEspecialidades.length == 1) {
        this.vistaEspecialidades = [];
      } else {
        if (this.vistaEspecialidades.length > 0) {
          this.vistaEspecialidades.splice(index, 1);
        }
      }
    }
  },
  computed: {
    tituloAccion: function() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.medico.id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    especialidadNoSel: function() {
      return this.procesando == true || this.especialidadSeleccionado.id <= 0 
    }
  },
  created() {
    this.$store
      .dispatch("seguridad/usuariosPorEstado", 0)
      .then(function(r) {
        if (r.data != undefined) {
          this.usuarios = r.data;
        }
      }.bind(this));
    this.$store
      .dispatch("clinica/especialidadesTodas")
      .then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.especialidades = r.respuesta.data;
          }
        }
      }.bind(this));
    if (this.$route.params.id > 0) {
      if (this.$route.params.dato.codigo.length > 0) {
        this.codigoGenerar = false;
      }
      this.medico = {
        id: this.$route.params.dato.id,
        codigo: this.$route.params.dato.codigo,
        identificacion: this.$route.params.dato.identificacion,
        titulo: this.$route.params.dato.titulo,
        nombres: this.$route.params.dato.nombres,
        registro_profesional: this.$route.params.dato.registro_profesional,
        direccion: this.$route.params.dato.direccion,
        telefonos: this.$route.params.dato.telefonos,
        email: this.$route.params.dato.email,
        empresa_id: this.$route.params.dato.empresa_id,
        usuario_id: this.$route.params.dato.usuario_id,
        estado: this.$route.params.dato.estado        
      };
      if (this.$route.params.dato.relEspecialidades != undefined && this.$route.params.dato.relEspecialidades != null) {
        this.medico.relEspecialidades = this.$route.params.dato.relEspecialidades;
        this.vistaEspecialidades = this.medico.relEspecialidades;
      } else {
        this.medico.relEspecialidades = [];
      }
      if (this.$route.params.dato.relUsuario != undefined && this.$route.params.dato.relUsuario != null) {
        this.medico.relUsuario = this.$route.params.dato.relUsuario;
      }
    } 
  }
}
</script>
