<template>
  <div>
    <persona-seleccionar ref="perSeleccionador" v-bind="modeloEmpleadoSel" v-on:seleccionado-persona="personaSeleccionada()">
      <template #titulo>Seleccionar empleado</template>
    </persona-seleccionar>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Transacciones"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.transacciones.datos-generales') }}</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4">
                <b-form-group :label="$t('vista.transacciones.campos.numero')" class="has-float-label">
                  <b-form-input type="text" v-model="movimiento.numero" readonly/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group :label='$t("vista.transacciones.campos.fecha")' class="has-float-label zindex8">
                  <datepicker
                    class="fecha-md"
                    :bootstrap-styling="true"
                    v-model="fechaMov"
                    :language="es"
                    :disabled="lectura"
                  ></datepicker>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Tipo" class="has-float-label">
                  <b-form-select
                    v-model="movimiento.tipo"
                    :options="tipos"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                    :disabled="lectura"
                    :state="!$v.movimiento.tipo.$error" 
                  />
                  <b-form-invalid-feedback>Debe seleccionar el tipo</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="4" lg="4">
                <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')" class="has-float-label">
                  <div>
                    <b-overlay :show="ocupadoCedula" rounded="lg" opacity="0.6">
                      <template #overlay>
                        <div class="d-flex align-items-center">
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <b-spinner type="grow" variant="dark"></b-spinner>
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <!-- SR para lectores de pantallas -->
                          <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') + '...' }}</span>
                        </div>
                      </template>
                      <b-input-group>
                        <b-form-input type="text" 
                          v-model="movimiento.relEmpleado.cedula" 
                          @keyup.enter="validarCedula()" 
                          :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.cedula')"
                          :readonly="lectura"/>
                        <b-input-group-append v-show="!lectura">
                          <b-button variant="outline-primary" class="borde-recto" @click="validarCedula()" title="Ejecutar busqueda">
                            <i class="mdi mdi-magnify"/>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-overlay>
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="8" md="8" lg="8">
                <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')" class="has-float-label">
                  <b-input-group>
                    <b-form-input type="text" 
                      v-model="movimiento.relEmpleado.nombres" 
                      :state="!$v.movimiento.empleado_id.$error" 
                      :readonly="lectura" 
                      @keyup.enter="buscarEmpleado()" 
                      @keyup.ctrl.stop.prevent="pulsaControl"
                      :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.nombres')"
                    />
                    <b-form-invalid-feedback>Debe seleccionar el empleado</b-form-invalid-feedback>  
                    <b-input-group-append is-text v-show="!lectura">
                      <input size="sm" type="checkbox" v-model="busquedaAvanzada" title="Busqueda extendida"/>
                    </b-input-group-append>
                    <b-input-group-append v-show="!lectura">
                      <b-button variant="outline-primary" class="borde-recto" @click="buscarEmpleado()">
                        <i class="mdi mdi-magnify"/>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>                  
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" lg="12">
                <b-form-group :label="$t('vista.transacciones.campos.concepto')" class="has-float-label">
                  <b-form-input type="text" v-model.trim="movimiento.descripcion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Valor" class="has-float-label mb-4">
                  <!--b-input-group-prepend is-text>$</!--b-input-group-prepend-->
                  <b-form-input ref="txValor" 
                    size="sm" 
                    v-model.number="movimiento.valor" 
                    pattern="^\d*(\.\d{0,2})?$" 
                    :readonly="lectura"
                    :state="!$v.movimiento.valor.$error" />
                  <b-form-invalid-feedback>Debe especificar el valor</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Cuotas" class="has-float-label">
                  <b-form-input type="text" v-model="movimiento.cuotas_numero" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Fecha de inicio" class="has-float-label zindex7">
                  <datepicker
                    class="fecha-md"
                    :bootstrap-styling="true"
                    v-model="fechaInicio"
                    :language="es"
                    :disabled="lectura"
                  ></datepicker>
                </b-form-group>
              </b-colxx>
            </b-row>
          </b-form>
          <div class="mt-4">
            <b-overlay
              :show="procesando" 
              opacity=0.6
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
              @hidden="ocultaOverlay"
            >
              <b-button v-if="!lectura" ref="btGuardar" :disabled="procesando" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
            </b-overlay>  
            <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
          </div>
        </b-card>
      </b-colxx>
    </b-row>  
  </div>  
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import { getCurrentSubscriber, mayorQueCero } from "../../utils/index"
import PersonaSeleccionar from '../../components/Common/PersonaSeleccionar.vue'
const { required, maxValue } = require("vuelidate/lib/validators");
export default {
  components: {
    Datepicker,
    "persona-seleccionar": PersonaSeleccionar
  },
  data: function () {
    return {
      es: es,
      movimiento: {
        id: 0,
        subscripcion_id: 0,
        empresa_id: 0,
        tipo: 0,
        numero: 0,
        fecha: null,
        descripcion: '',	
        origen: 0,
        valor: 0,
        cuotas_numero: 1,
        cuotas_ejecutadas: 0,	
        cuotas_inicio: null,
        referencia: 0,
        estado: 0,
        empleado_id: 0,
        relEmpleado: {
          id: 0,
          cedula: '',
          nombres: ''
        }
      },
      tipos: [],
      procesando: false,
      lectura: false,
      ocupadoCedula: false,
      busquedaAvanzada: false,
      modeloEmpleadoSel: {
        campos: [
          { key: "nombres", label: this.$t('vista.ventas.clientes.campos.nombres'), sortable: false },
          { key: "cedula", label: this.$t('vista.ventas.clientes.campos.cedula'), sortable:false }
        ],
        buscador: "nomina/empleadosBuscarMin",
        params: {
          sub: getCurrentSubscriber().id,
          emp: this.$store.state.empresaAccedida.id,
          tipo: 0,
          atributo: "nombres",
          estado: 0
        }
      },
    }
  },
  validations: {
    movimiento: {
      empleado_id: {
        required,
        maxValue: mayorQueCero
      },
      tipo: {
        required,
        maxValue: mayorQueCero
      },
      valor: {
        required, 
        maxValue: mayorQueCero
      }
    }
  },
  computed: {
    tituloAccion() {
      return this.lectura ? "Solo lectura" : this.$route.meta.accion ? this.$route.meta.accion : 'Nuevo'
    },
    fechaMov: {
      get: function() {
        if (this.movimiento.fecha != null)
          return this.$moment(this.movimiento.fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.movimiento.fecha = v;
      }
    },
    fechaInicio: {
      get: function() {
        if (this.movimiento.cuotas_inicio != null)
          return this.$moment(this.movimiento.cuotas_inicio).toDate();
        else
          return null;
      },
      set: function(v) {
        this.movimiento.cuotas_inicio = v;
      }
    },
  },
  methods: {    
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning",
          this.$t("vista.comandos.fallo") + " " + (this.$t("vista.comandos.guardar")).toLowerCase(),
          this.$t("vista.transacciones.guardar-error"),
          { duration: 3000, permanent: false });
      } else {
        if (this.movimiento.tipo == null || this.movimiento.tipo <= 0) {
          this.$notify("danger",
            this.$t("vista.comandos.guardar"),
            "Debe seleccionar el tipo",
            { duration: 3000, permanent: false });
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
      this.lectura = true;
      this.$router.back();
    },
    procesarGuardado() {
      if (this.movimiento.id == 0) {
        this.movimiento.subscripcion_id = this.modeloEmpleadoSel.params.sub,
        this.movimiento.empresa_id = this.modeloEmpleadoSel.params.emp
      }
      this.$store
        .dispatch("nomina/movimientoGuardar", JSON.stringify(this.movimiento))
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify("success",
              this.$t("vista.transacciones.guardando-reg"),
              res.data.msj,
              { duration: 3000, permanent: false });
            this.lectura = true;
            this.$router.back();
          } else {
            this.$notify("warning",
              this.$t("vista.transacciones.guardar-reg"),
              res.data.msj,
              { duration: 3000, permanent: false });
            this.procesando = false;  
          }
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = this.$t("vista.transacciones.guardar-error");
          if (e.response.data.msj != undefined) {
            msj = e.response.data.msj;
          } else {
            if (e.message) msj = e.message;
          }
          this.$notify("danger",
            this.$t("vista.comandos.guardar"),
            msj,
            { duration: 3000, permanent: false });  
        }.bind(this)
      );
    },
    validarCedula() {
      if (!this.lectura) {
        this.ocupadoCedula = true;
        this.$store
          .dispatch("nomina/empleadoPorCedula", {
            sub: this.modeloEmpleadoSel.params.sub,
            emp: this.modeloEmpleadoSel.params.emp,
            cedula: this.movimiento.relEmpleado.cedula
          })
          .then(function(r) {
            if (r.status == 200) {
              // presentar lista para elegir si hay mas de un resultado
              if (r.data.length == 1) {
                this.movimiento.empleado_id = r.data[0].id;
                this.movimiento.relEmpleado = r.data[0];
              } else {
                if (r.data.length > 0) {
                  this.$refs.perSeleccionador.cargarPersonas(r.data, true);
                }
              }
            }
            this.ocupadoCedula = false;
          }.bind(this))
          .catch(function(e) {
            this.$notify(
              "warning",
              this.$t("vista.transacciones.atencion"),
              "La cédula no se encuentra registrada",
              { duration: 3000, permanent: false }
            );
            this.ocupadoCedula = false;
          }.bind(this));
      }
    },
    buscarEmpleado() {
      if (!this.lectura && this.movimiento.relEmpleado.nombres.length > 0) {
        this.$refs.perSeleccionador.cargarBusqueda(this.movimiento.relEmpleado.nombres, 
        this.busquedaAvanzada);
      }
    },
    personaSeleccionada() {
      if (this.$refs.perSeleccionador.seleccionado) {
        this.movimiento.relEmpleado = this.$refs.perSeleccionador.seleccionado;
        this.movimiento.empleado_id = this.movimiento.relEmpleado.id;
      }
    },
    pulsaControl(ev) {
      if(ev.keyCode == 114) {
        this.busquedaAvanzada = !this.busquedaAvanzada;
      }
    },
    prevenirSalida(e) {
      if (this.lectura) return
      e.preventDefault();
      e.returnValue = "";
    }
  },
  created() {
    this.$store
      .dispatch("nomina/registrosPorTabla", {
        tabla: 4,
        sub: 0,
        emp: 0
      })
      .then(function(r) {
        if (r) {
          this.tipos = r.data; 
          if (this.tipos.length > 0) {
            if (this.movimiento.tipo == 0)
              this.movimiento.tipo = this.tipos[0].id;
          }
        }
      }.bind(this))
      .catch(function(ex) {
        console.log("Error => MovimientosEditor => ");
        console.log({ex});
        this.lectura = true;
      }.bind(this));
  },
  mounted() {
    if (this.$route.params.id > 0) {
      this.movimiento = {
        id: this.$route.params.dato.id,
        subscripcion_id: this.$route.params.dato.subscripcion_id,
        empresa_id: this.$route.params.dato.empresa_id,
        tipo: this.$route.params.dato.tipo,
        numero: this.$route.params.dato.numero,
        descripcion: this.$route.params.dato.descripcion,	
        origen: this.$route.params.dato.origen,
        valor: parseFloat(this.$route.params.dato.valor),
        cuotas_numero: this.$route.params.dato.cuotas_numero,
        cuotas_ejecutadas: this.$route.params.dato.cuotas_ejecutadas,	
        cuotas_inicio: this.$route.params.dato.cuotas_inicio,
        refencia: this.$route.params.dato.refencia,
        estado: this.$route.params.dato.estado,
        empleado_id: this.$route.params.dato.empleado_id,
        relEmpleado: this.$route.params.dato.relEmpleado
      };
      if (this.$route.params.dato.fecha != undefined) {
        try {
          this.fechaMov = this.$moment(this.$route.params.dato.fecha).toDate();
        } catch(e) {
          this.fechaMov = new moment.utc(this.$route.params.dato.fecha).toDate();
        }
      } else {
        this.movimiento.fecha = null;
      }
      if (this.$route.params.dato.cuotas_inicio != undefined) {
        try {
          this.fechaInicio = this.$moment(this.$route.params.dato.cuotas_inicio).toDate();
        } catch(e) {
          this.fechaInicio = new moment.utc(this.$route.params.dato.cuotas_inicio).toDate();
        }
      } else {
        this.movimiento.cuotas_inicio = null;
      }
    } else {
      this.fechaMov = this.$moment(new Date()).format('YYYY-MM-DD');
      this.fechaInicio = this.$moment(new Date()).format('YYYY-MM-DD');
    }
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.prevenirSalida)
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.prevenirSalida)
    })
  },
  beforeRouteLeave (to, from, next) {
    if (!this.lectura) {
      if (!window.confirm("Desea salir sin guardar?")) {
        return
      }
    }
    next();
  }
}
</script>
