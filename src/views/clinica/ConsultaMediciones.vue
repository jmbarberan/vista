<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('vista.clinica.consultas.mediciones')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4">
          <h6 class="mb-4">{{ $t('vista.clinica.consultas.datos-paciente') }}</h6>
            <b-form class="av-tooltip mb-5 tooltip-label-right">
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                    <b-form-input type="text" v-model="consulta.relPaciente.relCliente.nombres" readonly/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                    <b-form-input type="text" v-model="consulta.relPaciente.relCliente.identificacion" readonly/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.medico')">
                    <b-form-input type="text" v-model.trim="consulta.relMedico.nombres" readonly/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.fecha')">
                    <b-form-input type="text" v-model="consulta.fecha" readonly/>
                  </b-form-group>
                </b-colxx>                
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.especialidad')">
                    <b-form-input type="text" v-model="especialidadDescripcion" readonly/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.servicio')">
                    <b-form-input type="text" v-model="consulta.relServicio.descripcion" readonly/>
                  </b-form-group>
                </b-colxx>
              </b-row>
              <b-row>
                <b-colxx xxs="12" sm="12">
                  <h6 class="mb-4">{{ $t('vista.clinica.consultas.mediciones') }}</h6>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.peso')">
                    <b-input-group append=" kg ">
                      <b-form-input type="text" v-model="mediciones.peso"/>
                    </b-input-group>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.estatura')">
                    <b-input-group append=" cm ">
                      <b-form-input type="text" v-model="mediciones.estatura"/>
                    </b-input-group>  
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.temperatura')">
                    <b-input-group append=" °C ">
                      <b-form-input type="text" v-model="mediciones.temperatura"/>
                    </b-input-group>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.presion')">
                    <b-input-group append="mm Hg">
                      <b-form-input type="text" v-model="mediciones.presion"/>
                    </b-input-group>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.critmo')">
                    <b-input-group append="x Min">
                      <b-form-input type="text" v-model="mediciones.critmo"/>
                    </b-input-group>  
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.rritmo')">
                    <b-input-group append="x Min">
                      <b-form-input type="text" v-model="mediciones.rritmo"/>
                    </b-input-group>  
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.oxigeno')">
                    <b-input-group append=" % ">
                      <b-form-input type="text" v-model="mediciones.oxigeno"/>
                    </b-input-group>  
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.imc')">
                    <b-input-group append=" IMC ">
                      <b-form-input type="text" v-model="mediciones.imc"/>
                    </b-input-group>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="3">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.mediciones.saturaciono2')">
                    <b-input-group append=" 02 ">
                      <b-form-input type="text" v-model="mediciones.saturaciono2"/>
                    </b-input-group>
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
export default {
  data: function () {
    return {
      consulta: {
        id: 0,
        paciente_id: 0,
        medico_id: 0,
        fecha: null,
        servicio_id: 0,
        hora: "",
        motivo: "",
        estado: 0,
        relMedico: {
          id: 0,
          nombres: ""
        },
        relServicio: {
          id: 0,
          descripcion: ""
        },
        relPaciente: {
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
            empresa_id: 0,
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
          }
        }  
      },
      mediciones: {
        peso: 0,
        estatura: 0,
        temperatura: 0,
        presion: "",
        critmo: 0,
        rritmo: 0,
        oxigeno: 0,
        imc: 0.00,
        saturaciono2: 0
      },
      medicionesAnt: "",
      procesando: false,
      alerta: {
        ver: false,
        tipo: "info",
        mensaje: ""
      }
    }
  },
  computed: {
    especialidadDescripcion: {
      get: function() {
        return this.consulta.relServicio.relEspecialidad != null ? this.consulta.relServicio.relEspecialidad.descripcion : "";
      }
    }
  },
  methods: {
    calcularIMC: function() {
      if(this.mediciones.peso > 0 && this.mediciones.estatura > 0) {
        this.mediciones.imc = parseFloat(this.mediciones.peso / ((this.mediciones.estatura/100) * (this.mediciones.estatura/100))).toFixed(2);
      }
    },
    guardar() {
      this.procesando = true;
      this.$store
        .dispatch("clinica/consultaGuardarMediciones", {
          id: this.consulta.id,
          data: this.mediciones
        })
        .then(function(res) {
          if (res.estatus <= 201) {
            this.$notify("success", "Guardar Mediciones", res.data.msj, { duration: 3000, permanent: false });
          } else {
            this.$notify("warning", "Guardar Mediciones", res.data.msj, { duration: 3000, permanent: false });
          }
          this.procesando = false;
          this.$router.go(-1);
        }.bind(this))
        .catch(function(e) {
          console.log(e);
          this.procesando = false;
          let msj = this.$t('vista.transacciones.guardar-error');
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.$notify("danger", 
            this.$t('vista.transacciones.guardando') + ' ' + this.$t('vista.clinica.consultas.campos.mediciones-med'), 
            msj, 
            { duration: 3000, permanent: false });
        }.bind(this)
      );
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.go(-1);
    },
  },
  watch: {
    'mediciones.peso'() {
      this.calcularIMC();
    },
    'mediciones.estatura'() {
      this.calcularIMC();
    }
  },
  mounted() {
    if (this.$route.params.id > 0) {
      this.consulta = {
        id: this.$route.params.dato.id,
        paciente_id: this.$route.params.dato.paciente_id,
        medico_id: this.$route.params.dato.medico_id,
        fecha: this.$route.params.dato.fecha,
        servicio_id: this.$route.params.dato.servicio_id,
        relPaciente: this.$route.params.dato.relPaciente,
        relMedico: this.$route.params.dato.relMedico,
        relServicio: this.$route.params.dato.relServicio,
        mediciones: this.$route.params.dato.relServicio
      };
      if (this.$route.params.dato.mediciones.length > 10) {
        try {
          this.mediciones = JSON.parse(this.$route.params.dato.mediciones);
        } catch(e) {
          this.medicionesAnt = this.$route.params.dato.mediciones;
        }
      }
    }  
  }
}
</script>