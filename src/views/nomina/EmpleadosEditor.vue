<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Datos del empleado"/>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.ventas.clientes.datos-personales') }}</h6>
            <b-form class="av-tooltip mb-5 tooltip-label-right">
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                    <div>
                      <b-overlay :show="consultandoCedula" rounded="lg" opacity="0.6">
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
                          type="text" v-model.trim="empleado.cedula" 
                          @keyup.enter="consultarCedula()" class="fondo-transparente-min"
                          :state="!$v.empleado.cedula.$error"
                          :placeholder="$t('vista.busqueda.digitar-enter')"/>
                        <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.cedula') }}</b-form-invalid-feedback>
                      </b-overlay>
                    </div>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                    <b-form-input type="text" v-model="empleado.nombres" :state="!$v.empleado.nombres.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.nombres') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="12">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                    <b-form-input type="text" v-model.trim="empleado.direccion" :state="!$v.empleado.direccion.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.direccion') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                    <b-form-input type="text" v-model.trim="empleado.telefonos" :state="!$v.empleado.telefonos.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.telefonos') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                    <b-form-input type="text" v-model.trim="empleado.email"  :state="!$v.empleado.email.$error"/>
                    <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.email') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
              </b-row>
              <h6 class="mb-4">Datos de nomina</h6>
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group label="Cargo">
                    <b-form-select
                      v-model="empleado.cargo_id" 
                      :options="cargos"
                      value-field="id"
                      text-field="denominacion"
                      size="sm"
                      @change="cargoCambiado()"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group label="Sueldo">
                    <b-form-input type="number" pattern="^\d*(\.\d{0,2})?$" v-model.number="empleado.sueldo"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group label='Fecha de ingreso' class="zindex8">
                    <datepicker
                      class="fecha-md"
                      :bootstrap-styling="true"
                      v-model="entrada"
                      :language="es"
                    ></datepicker>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group label='Registro en el ministerio' class='zindex6'>
                    <datepicker
                      class="fecha-md"
                      :bootstrap-styling="true"
                      v-model="registro"
                      :language="es"
                    ></datepicker>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group label='Entrada al seguro social' class='zindex7'>
                    <datepicker
                      class="fecha-md"
                      :bootstrap-styling="true"
                      v-model="asegurado"
                      :language="es"
                    ></datepicker>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group label="Sueldo seguro">
                    <b-form-input type="number" pattern="^\d*(\.\d{0,2})?$" v-model.number="empleado.sueldo_seguro"/>
                  </b-form-group>
                </b-colxx>
              </b-row>
              <div class="mt-4">
                <b-overlay 
                  :show="guardando" 
                  opacity=0.6
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                  @hidden="ocultarGuardando"
                >
                  <b-button ref="btGuardar" :disabled="guardando" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
                </b-overlay>  
                <b-button ref="btCancelar" :disabled="guardando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
              </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row>
      <!-- Agregar administrador de cuentas bancarias -->
    </b-row>
  </div>
</template>
<script>
//import { setTimeout } from 'timers'
import { getCurrentSubscriber, getEmpresa } from "../../utils/index";
import { cedulaValida } from '../../utils'
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import moment from 'moment';
const { required, minLength, maxLength, email, numeric } = require("vuelidate/lib/validators");
export default {
  components: {
    Datepicker
  },
  data() {
    return {
      es: es,
      empleado: {
        id: 0,
        subscripcion_id: 0,
        empresa_id: getEmpresa().id,
        cedula: "",
        nombres: "",
        direccion: "",
        telefonos: "",
        email: "",
        cargo_id: "",
        cargo: "",
        sueldo: 0,
        entrada_fecha: null,
        aseguramiento_fecha: null,
        ministerio_fecha: null,
        departamento_id: 0,
        referencia: 0,
        estado: 0,
        sueldo_seguro: 0,
        relCargo: null,
        relCuentas: [],
        cuentasEliminadas: []
      },
      cargos: [],
      guardando: false,
      consultandoCedula: false,
      esperandoBuscarCedula: false,
      montando: false
    }
  },
  validations: {
    empleado: {
      nombres: {
        required
      },
      cedula: {
        minLength: minLength(10),
        maxLength: maxLength(13),
        valido(val) {
          return val.length <= 10 ? cedulaValida(val) : (val.length == 13 ? true : false);
        }
      },
      telefonos: { numeric, maxLength: maxLength(15) },
      direccion: { required },
      email: { email }
    }
  },
  computed: {
    entrada: {
      get: function() {
        if (this.empleado.entrada_fecha != null)
          return this.$moment(this.empleado.entrada_fecha).toDate();
        else
          return null;  
      },
      set: function(v) {
        this.empleado.entrada_fecha = v;
      }
    },
    asegurado: {
      get: function() {
        if (this.empleado.aseguramiento_fecha != null)
          return this.$moment(this.empleado.aseguramiento_fecha).toDate();
        else
          return null;  
      },
      set: function(v) {
        this.empleado.aseguramiento_fecha = v;
      }
    },
    registro: {
      get: function() {
        if (this.empleado.ministerio_fecha != null)
          return this.$moment(this.empleado.ministerio_fecha).toDate();
        else
          return null;  
      },
      set: function(v) {
        this.empleado.ministerio_fecha = v;
      }
    },
    tituloAccion: function() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.empleado.Id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    }
  },
  watch: {
    'empleado.cedula': function() {
      if (!this.montando) {
        if (this.empleado.cedula.length >= 10) {
          if (!this.esperandoBuscarCedula) {
            setTimeout(() => {
              this.esperandoBuscarCedula = false;
              this.consultarCedula();
            }, 2000);
            this.esperandoBuscarCedula = true;
          }
        }
      }
    }
  },
  methods: {
    guardar() {
      let continuar = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        continuar = false;
        this.$notify(
          "warning", 
          this.$t("vista.transacciones.guardar-canot"), 
          this.$t("vista.transacciones.guardar-invalido"), 
          { duration: 3000, permanent: false }
        ); 
      } else {
        this.$store
          .dispatch("nomina/empleadoRegistrado", { 
            sub: getCurrentSubscriber().id, 
            emp: getEmpresa().id, 
            id: this.empleado.id, 
            cedula: this.empleado.cedula, 
            nombres: this.empleado.nombres 
          })
          .then(function(res) {
            this.empleado.subscripcion_id = getCurrentSubscriber().id;
            this.empleado.empresa_id = getEmpresa().id;
            if (this.empleado.entrada_fecha != null) {
              this.empleado.entrada_fecha = moment(this.empleado.entrada_fecha).format("YYYY-MM-DD");
            }
            if (this.empleado.aseguramiento_fecha != null) {
              this.empleado.aseguramiento_fecha = moment(this.empleado.aseguramiento_fecha).format("YYYY-MM-DD");
            }
            if (this.empleado.ministerio_fecha != null) {
              this.empleado.ministerio_fecha = moment(this.empleado.ministerio_fecha).format("YYYY-MM-DD");
            }        
            this.$store
              .dispatch("nomina/empleadoGuardar", JSON.stringify(this.empleado))
              .then(function(res) {
                if (res.status <= 201) {
                  this.$notify(
                    "success", 
                    this.$t("vista.comandos.guardar") + " empleado", 
                    res.data.msj, 
                    { duration: 3000, permanent: false }
                  );
                  this.$router.back();
                } else {
                  this.$notify(
                    "warning", 
                    this.$t("vista.comandos.guardar") + " empleado", 
                    res.data.msj, 
                    { duration: 3000, permanent: false }
                  );
                }
                this.procesando = false;
              }.bind(this))
              .catch(function(e) {
                this.procesando = false;
                let msj = this.$t("vista.transacciones.guardar-error");
                if (e.response.data.msj != undefined);
                  msj = e.response.data.msj;
                this.$notify(
                  "warnnig", 
                  this.$t("vista.comandos.guardar") + " empleado", 
                  msj,
                  { duration: 3000, permanent: false }
                );
              }.bind(this)
            );
          }.bind(this))
          .catch(function(e) {
            this.$notify("warning", 
              "Guardar empleado",
              e.response.data,
              { duration: 3000, permanent: false });
          }.bind(this));
      }
    },
    cancelar() {
      this.$router.back();
    },
    ocultarGuardando() {
      this.$refs.btGuardar.focus();
    },
    consultarCedula() {
      if (this.empleado.cedula.length > 0) {
        this.consultandoCedula = true;
        this.$store
          .dispatch("nomina/empleadoRegistrado", { 
            id: this.empleado.id,
            cedula: this.empleado.cedula,
            nombres: this.empleado.nombres,
            sub: getCurrentSubscriber().id,
            emp: getEmpresa().id,
          })
          .then(function(res) {
            this.consultandoCedula = false;  
          }.bind(this))
          .catch(function(e) {
            this.$notify("warning", 
                "Cédula registrada",
                e.response.data,
                { duration: 3000, permanent: false });
            this.consultandoCedula = false;
          }.bind(this));
      }
    },
    cargoCambiado() {
      let c = this.cargos.filter(function(o) {
        return o.id == this.empleado.cargo_id;
      }.bind(this));
      if (c != undefined && c != null && c.length > 0) {
        this.empleado.sueldo = c[0].remuneracion_valor;
      }
    }
  },
  created() {
    // traer cargos
    this.$store
      .dispatch("nomina/cargosPorEstado", {
        sub: getCurrentSubscriber().id,
        emp: getEmpresa().id,
        estado: 0
      }).then(function(r) {
        if (r.data != null) {
          this.cargos = r.data;
        }
      }.bind(this));
  },
  mounted() {
    this.montando = true;
    if (this.$route.params.id > 0) {                
      if (this.$route.params.dato.relCuentas.length > 0) {
        this.secuenciaPrecio = this.$route.params.dato.relCuentas.length;
      }
      this.empleado.id = this.$route.params.dato.id;
      this.empleado.subscripcion_id = this.$route.params.dato.subscripcion_id;
      this.empleado.empresa_id = this.$route.params.dato.empresa_id;
      this.empleado.cedula = this.$route.params.dato.cedula;
      this.empleado.nombres = this.$route.params.dato.nombres;
      this.empleado.direccion = this.$route.params.dato.direccion;
      this.empleado.telefonos = this.$route.params.dato.telefonos;
      this.empleado.email = this.$route.params.dato.email;
      this.empleado.cargo_id = this.$route.params.dato.cargo_id;
      this.empleado.sueldo = this.$route.params.dato.sueldo;
      this.empleado.entrada_fecha = this.$route.params.dato.entrada_fecha;
      this.empleado.aseguramiento_fecha = this.$route.params.dato.aseguramiento_fecha;
      this.empleado.ministerio_fecha = this.$route.params.dato.ministerio_fecha;
      this.empleado.departamento_id = this.$route.params.dato.departamento_id;
      this.empleado.referencia = this.$route.params.dato.referencia;
      this.empleado.estado = this.$route.params.dato.estado;
      this.empleado.sueldo_seguro = this.$route.params.dato.sueldo_seguro;
      this.empleado.relCargo = this.$route.params.dato.relCargo;
      this.empleado.relCuentas = this.$route.params.dato.relCuentas;
      this.empleado.cuentasEliminadas = [];
    }
    this.$nextTick(() => {
      this.montando = false;
    });
  }
 }
</script>