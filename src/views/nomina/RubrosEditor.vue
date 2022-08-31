<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Editor de rubros" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion">
          <h6 class="mb-4">Datos del rubro</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="8">
                <b-form-group label="Denominacion">
                  <b-form-input
                    type="text"
                    v-model="rubro.denominacion"
                    :state="!$v.rubro.denominacion.$error"
                    :readonly="lectura"
                  />
                  <b-form-invalid-feedback
                    >Digitar el nombre del rubro</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Origen">
                  <b-form-select
                    v-model="rubro.origen"
                    :options="origenes"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                    :state="!$v.rubro.origen.$error"
                    :disabled="lectura"
                  />
                  <b-form-invalid-feedback
                    >Seleccione el origen del rubro</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
            </b-row>
            <b-row>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Frecuencia que aplica" v-slot="{ ariaDescribedby }">
                  <b-form-select
                    v-model="rubro.periodo"
                    :options="periodos"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                    :state="!$v.rubro.periodo.$error"
                    :disabled="lectura"
                  />
                  <b-form-invalid-feedback
                    >Seleccione el periodo que aplica</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Mes que aplica" v-slot="{ ariaDescribedby }">
                  <b-form-select
                    v-model="rubro.referencia"
                    :options="meses"
                    value-field="value"
                    text-field="text"
                    size="sm"
                    :disabled="aplicaTodosMeses || lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Duracion de frecuencia">
                  <b-form-input
                    type="number"
                    v-model.number="rubro.base_valor"
                    :readonly="aplicaTodosMeses || lectura"
                    :state="!$v.rubro.base_valor.$error"
                  />
                  <b-form-invalid-feedback
                    >Digite una duración válida</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
            </b-row>
            <hr />
            <b-row>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Formula de calculo" v-slot="{ ariaDescribedby }">
                  <b-form-select
                    v-model="rubro.formula"
                    :options="formulas"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                    :state="!$v.rubro.formula.$error"
                    :disabled="lectura"
                  />
                  <b-form-invalid-feedback
                    >Seleccione la formula de calculo</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Rubro base" v-slot="{ ariaDescribedby }">
                  <b-form-select
                    v-model="rubro.base_indice"
                    :options="bases"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                    :disabled="desactivadoBase || lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group :label="etiquetaValor">
                  <b-form-input
                    type="number"
                    pattern="^\d*(\.\d{0,2})?$"
                    v-model.number="rubro.valor"
                    :state="!$v.rubro.valor.$error"
                    :readonly="lectura"
                  />
                  <b-form-invalid-feedback
                    >Digite el valor del rubro</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
            </b-row>
            <hr />
            <b-row>
              <b-colxx xxs="12" sm="6">
                <b-form-group label="Marcar si aplica">
                  <b-checkbox switch v-model="divisible" :disabled="lectura"
                    >Calculo proporcional de dias cumplidos</b-checkbox
                  >
                </b-form-group>
              </b-colxx>
            </b-row>
            <div class="mt-4">
              <b-button
                ref="btNuevo"
                v-show="lectura"
                @click="nuevo()"
                variant="primary"
                class="mr-4"
                >{{ $t("vista.comandos.nuevo") }}</b-button
              >
              <b-button
                ref="btModificar"
                v-show="lectura"
                @click="modificar()"
                variant="primary"
                class="mr-4"
                >{{ $t("vista.comandos.modificar") }}</b-button
              >
              <b-overlay
                :show="guardando"
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
                @hidden="ocultarGuardando"
              >
                <b-button
                  ref="btGuardar"
                  v-show="!lectura"
                  :disabled="guardando"
                  @click="guardar()"
                  variant="success"
                  >{{ $t("vista.comandos.guardar") }}</b-button
                >
              </b-overlay>
              <b-button
                ref="btCancelar"
                v-show="!lectura"
                :disabled="guardando"
                @click="cancelar()"
                variant="primary"
                class="ml-4"
                >{{ $t("vista.comandos.cancelar") }}</b-button
              >
            </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import {
  mesesAnio,
  sueldosLista,
  mayorQueCero,
  getCurrentSubscriber,
} from "../../utils/index";
const {
  required,
  numeric /*, minLength, maxLength*/,
} = require("vuelidate/lib/validators");
export default {
  data() {
    return {
      mesesSeleccionados: [],
      meses: mesesAnio(),
      rubro: {
        id: 0,
        denominacion: "",
        origen: 0,
        periodo: 0,
        fecha: null,
        formula: 0,
        valor: 0,
        base_indice: 0,
        base_valor: 0,
        referencia: 0,
        estado: 0,
        subscripcion_id: 0,
        empresa_id: 0,
        divisible: 1,
        meses_aplica: "",
      },
      guardando: false,
      origenes: [],
      periodos: [],
      formulas: [],
      bases: sueldosLista(),
      lectura: false,
      customAccion: "",
    };
  },
  validations: {
    rubro: {
      denominacion: { required },
      base_valor: { numeric },
      origen: { maxValue: mayorQueCero },
      periodo: { maxValue: mayorQueCero },
      formula: { maxValue: mayorQueCero },
      valor: {
        numeric,
        maxValue: mayorQueCero,
      },
    },
  },
  methods: {
    nuevo() {
      this.rubro = {
        id: 0,
        denominacion: "",
        origen: 0,
        periodo: 0,
        fecha: null,
        formula: 0,
        valor: 0,
        base_indice: 0,
        base_valor: 0,
        referencia: 0,
        estado: 0,
        subscripcion_id: 0,
        empresa_id: 0,
        divisible: 1,
        meses_aplica: "",
      };
      this.customAccion = "Nuevo";
      this.lectura = false;
    },
    modificar() {
      this.lectura = false;
    },
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify(
          "warning",
          this.$t("vista.transacciones.guardar-canot"),
          this.$t("vista.transacciones.guardar-invalido"),
          { duration: 3000, permanent: false }
        );
      } else {
        if (this.rubro.id <= 0) {
          this.rubro.subscripcion_id = getCurrentSubscriber().id;
          this.rubro.empresa_id = this.$store.state.empresaAccedida.id;
        }
        this.$store
          .dispatch("nomina/rubroGuardar", JSON.stringify(this.rubro))
          .then(
            function (res) {
              if (res.status <= 201) {
                this.$notify(
                  "success",
                  this.$t("vista.transacciones.guardando-reg"),
                  res.data.msj,
                  { duration: 3000, permanent: false }
                );
                /*if (res.data.obj != undefined && res.data.obj != null)  {
                this.rubro = res.data.obj;
              }*/
                this.customAccion = "";
                this.lectura = true;
                this.$router.back();
              } else {
                this.$notify(
                  "warning",
                  this.$t("vista.transacciones.guardar-reg"),
                  res.data.msj,
                  { duration: 3000, permanent: false }
                );
                this.procesando = false;
              }
            }.bind(this)
          )
          .catch(
            function (e) {
              this.procesando = false;
              let msj = this.$t("vista.transacciones.guardar-error");
              if (e.response.data.msj != undefined) {
                msj = e.response.data.msj;
              } else {
                if (e.message) msj = e.message;
              }
              this.$notify("danger", this.$t("vista.comandos.guardar"), msj, {
                duration: 3000,
                permanent: false,
              });
            }.bind(this)
          );
      }
    },
    cancelar() {
      this.$router.back();
    },
    ocultarGuardando() {
      this.$refs.btGuardar.focus();
    },
  },
  computed: {
    aplicaTodosMeses() {
      return this.rubro.periodo == 14;
    },
    etiquetaValor() {
      return this.rubro.formula == 17 ? "Porcentaje" : "Valor";
    },
    desactivadoBase() {
      return this.rubro.formula != 17;
    },
    tituloAccion() {
      return this.customAccion.length > 0 ? this.customAccion : this.$route.meta.accion;
    },
    divisible: {
      get() {
        return this.rubro.divisible == 1;
      },
      set(v) {
        this.rubro.divisible = v ? 1 : 0;
      },
    },
  },
  created() {
    this.$store
      .dispatch("nomina/registrosPorTabla", {
        tabla: 5,
        sub: 0,
        emp: 0,
      })
      .then(
        function (r) {
          if (r) {
            this.origenes = r.data;
          }
        }.bind(this)
      )
      .catch(
        function (ex) {
          console.log("Error => RubroEditor => ");
          console.log({ ex });
          this.lectura = true;
        }.bind(this)
      );
    this.$store
      .dispatch("nomina/registrosPorTabla", {
        tabla: 6,
        sub: 0,
        emp: 0,
      })
      .then(
        function (r) {
          if (r) {
            this.periodos = r.data;
          }
        }.bind(this)
      )
      .catch(
        function (ex) {
          console.log("Error => RubroEditor => ");
          console.log({ ex });
          this.lectura = true;
        }.bind(this)
      );

    this.$store
      .dispatch("nomina/registrosPorTabla", {
        tabla: 7,
        sub: 0,
        emp: 0,
      })
      .then(
        function (r) {
          if (r) {
            this.formulas = r.data;
          }
        }.bind(this)
      )
      .catch(
        function (ex) {
          console.log("Error => RubroEditor => ");
          console.log({ ex });
          this.lectura = true;
        }.bind(this)
      );
  },
  mounted() {
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }
    if (this.$route.params.id > 0) {
      this.rubro = {
        id: this.$route.params.dato.id,
        subscripcion_id: this.$route.params.dato.subscripcion_id,
        empresa_id: this.$route.params.dato.empresa_id,
        denominacion: this.$route.params.dato.denominacion,
        origen: this.$route.params.dato.origen,
        periodo: this.$route.params.dato.periodo,
        formula: this.$route.params.dato.formula,
        valor: this.$route.params.dato.valor,
        base_indice: this.$route.params.dato.base_indice,
        base_valor: this.$route.params.dato.base_valor,
        referencia: this.$route.params.dato.referencia,
        divisible: this.$route.params.dato.divisible,
        meses_aplica: this.$route.params.dato.meses_aplica,
        estado: this.$route.params.dato.estado,
      };
      if (this.$route.params.dato.fecha != undefined) {
        try {
          this.rubro.fecha = this.$moment(this.$route.params.dato.fecha).toDate();
        } catch (e) {
          this.rubro.fecha = null;
        }
      } else {
        this.rubro.fecha = null;
      }
    }
  },
};
</script>
