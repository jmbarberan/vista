<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Editor de roles" />
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion">
          <h6 class="mb-4">Datos del rol de pagos</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Año">
                  <b-form-input
                    type="number"
                    v-model.number="rol.anio"
                    :readonly="lectura"
                    :state="!$v.rol.anio.$error"
                  />
                  <b-form-invalid-feedback
                    >Digite una duración válida</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group label="Mes">
                  <b-form-select
                    v-model="rol.mes"
                    :options="meses"
                    value-field="value"
                    text-field="text"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group :label='$t("vista.transacciones.campos.fecha")' class="zindex8">
                  <datepicker
                    class="fecha-md"
                    :bootstrap-styling="true"
                    v-model="fechaRol"
                    :language="es"
                    :disabled="lectura"
                  ></datepicker>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12">
                <b-form-group :label="$t('vista.transacciones.campos.descripcion')">
                  <b-form-input type="text" v-model.trim="rol.descripcion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
            </b-row>
            <b-button
              ref="btAgregar"
              v-show="!lectura"
              @click="agregar()"
              variant="primary"
              class="mb-3"
            >{{ $t("vista.comandos.agregar") + " " + $t('vista.nomina.roles.campos.empleados') }}</b-button>
            <b-table 
              responsive 
              :items="rol.relEmpleados" 
              :fields="empleadosColumnas"
              foot-clone
              no-footer-sorting
              :busy="procesando"
            >
              <template #table-busy>
                <div class="loading-with-text">
                  <span class="loader"/>
                </div>
              </template>
              <template #row-details="data">
                <b-table
                  small
                  borderless
                  :fields="rubrosColumnas"
                  :items="data.item.rubros"
                >
                  <template #head(acciones)>
                    <div v-show="lectura" class="invisible"/>
                  </template>
                  <template #cell(acciones)="fila">
                    <span
                      v-if="!lectura"
                      class="span-comando pt-1"
                      @click="eliminarRubro(fila)"
                      v-b-tooltip.hover
                      :title="$t('vista.transacciones.eliminar-item')"
                    >
                      <i class="mdi mdi-trash-can mdi-18px"/>
                    </span>
                  </template>
                  <template #foot(acciones)>
                    <div style="display: none"/>
                  </template>
                  <template #foot(denominacion)>
                    <div style="text-align: right; font-weight: bold;">
                      {{ $t('vista.ventas.facturas.campos.total') + " " + $t('vista.nomina.roles.campos.empleado')}}
                    </div>
                  </template>
                  <template #head(ingreso)="fila">
                    <div style="text-align: right;">
                      {{ fila.label }}
                    </div>
                  </template>
                  <template #cell(ingreso)="fila">
                    <div style="text-align: right;">
                      {{ parseFloat(fila.item.ingreso) | dinero }}
                    </div>
                  </template>
                  <template #foot(ingreso)>
                    <div style="text-align: right;">
                      {{ totalIngreso | dinero }}
                    </div>
                  </template>
                  <template #head(egreso)="fila">
                    <div style="text-align: right;">
                      {{ fila.label }}
                    </div>
                  </template>
                  <template #cell(egreso)="fila">
                    <div style="text-align: right;">
                      {{ parseFloat(fila.item.egreso) | dinero }}
                    </div>
                  </template>
                  <template #foot(egreso)>
                    <div style="text-align: right;">
                      {{ totalEgreso | dinero }}
                    </div>
                  </template>
                </b-table>
              </template>
              <template #cell(acciones)="fila">
                <span
                  class="span-comando"
                  @click="fila.toggleDetails"
                  v-b-tooltip.hover
                  :title="fila.detailsShowing ? $t('vista.comandos.ocultar') + ' ' + $t('vista.nomina.roles.campos.rubros').toLowerCase() : $t('vista.comandos.mostrar') + ' ' + $t('vista.nomina.roles.campos.rubros').toLowerCase()"
                >
                  <i :class="fila.detailsShowing ? 'mdi mdi-chevron-double-up mdi-18px' : 'mdi mdi-chevron-double-down mdi-18px'"/>
                </span>
                <span
                  v-if="!lectura"
                  class="span-comando pt-1"
                  @click="eliminarItem(fila)"
                  v-b-tooltip.hover
                  :title="$t('vista.transacciones.eliminar-item')"
                >
                  <i class="mdi mdi-trash-can mdi-18px"/>
                </span>
                <span
                  v-else
                  class="span-comando pt-1"
                  @click="imprimirItem(fila)"
                  v-b-tooltip.hover
                  :title="$t('vista.comandos.imprimir') + ' rol personal'"
                >
                  <i class="mdi mdi-printer mdi-18px"/>
                </span>
              </template>
              <template #foot(acciones)>
                <div style="display: none"/>
              </template>
              <template #foot(relEmpleado.nombres)>
                <div style="text-align: right; font-weight: bold;">
                  {{ $t('vista.nomina.roles.campos.totales').toUpperCase() }}
                </div>
              </template>
              <template #head(ingresos)="fila">
                <div style="text-align: right;">
                  {{ fila.label }}
                </div>
              </template>
              <template #cell(ingresos)="fila">
                <div style="text-align: right;">
                  {{ parseFloat(fila.item.ingresos) | dinero }}
                </div>
              </template>
              <template #foot(ingresos)>
                <div style="text-align: right;">
                  {{ totalIngresos | dinero }}
                </div>
              </template>
              <template #head(egresos)="fila">
                <div style="text-align: right;">
                  {{ fila.label }}
                </div>
              </template>
              <template #cell(egresos)="fila">
                <div style="text-align: right;">
                  {{ parseFloat(fila.item.egresos) | dinero }}
                </div>
              </template>
              <template #foot(egresos)>
                <div style="text-align: right;">
                  {{ totalEgresos | dinero }}
                </div>
              </template>
              <template #head(pagado)="fila">
                <div style="text-align: right;">
                  {{ fila.label }}
                </div>
              </template>
              <template #cell(pagado)="fila">
                <div style="text-align: right;">
                  {{ (parseFloat(fila.item.ingresos) - parseFloat(fila.item.egresos)) | dinero }}
                </div>
              </template>
              <template #foot(pagado)>
                <div style="text-align: right;">
                  {{ totalPagado | dinero }}
                </div>
              </template>
            </b-table>
            <b-button
              class="flex-inicio mt-4"
              size="xs"
              variant="outline-secondary"
              @click="vaciarItems()" 
              :disabled="lectura || rol.relEmpleados.length <= 0"
            ><i class="mdi mdi-delete-sweep"/> {{ $t('vista.transacciones.eliminar-todo') }}</b-button>
            <div class="mt-4">
              <b-button
                ref="btNuevo"
                v-show="lectura"
                @click="nuevo()"
                variant="primary"
                class="mr-4"
              >{{ $t("vista.comandos.nuevo") }}</b-button>
              <b-button
                ref="btModificar"
                v-show="lectura"
                @click="modificar()"
                variant="primary"
                class="mr-4"
              >{{ $t("vista.comandos.modificar") }}</b-button>
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
                >{{ $t("vista.comandos.guardar") }}</b-button>
              </b-overlay>
              <b-button
                ref="btCancelar"
                v-show="!lectura"
                :disabled="guardando"
                @click="cancelar()"
                variant="primary"
                class="ml-4"
              >{{ $t("vista.comandos.cancelar") }}</b-button>
            </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>            
  </div>
</template>
<script>
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import {
  mesesAnio,
  getCurrentSubscriber,
  mayorQueCero
} from "../../utils/index";
const {
  maxValue,
  /*numeric , minLength, maxLength*/
} = require("vuelidate/lib/validators");
export default {
  components: {
    Datepicker
  },
  data() {
    return {
      es: es,
      meses: mesesAnio(),
      rol: {
        id: 0,
        subscripcion_id: 0,
        empresa_id: 0,
        anio: this.$moment().year(),
        mes: this.$moment().month() + 1,
        desde: null,
        hasta: null,
        cuenta: 0,
        referencia: 0,
        fecha: new Date(),
        contabilizar: null,
        estado: 0,
        pagado: 0,
        descripcion: '',
        relEmpleados: [],
        relRubros: []
      },
      empleadosColumnas: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: this.$t("vista.nomina.roles.campos.empleado"), 
          key: "relEmpleado.nombres",
          sortable: true
        },
        { 
          label: this.$t("vista.nomina.roles.campos.ingresos"), 
          key: "ingresos",
          sortable: true
        },
        { 
          label: this.$t("vista.nomina.roles.campos.egresos"), 
          key: "egresos",
          sortable: true,
        },
        { 
          label: this.$t("vista.nomina.roles.campos.pagado"), 
          key: "pagado",
          sortable: true,
        },
      ],
      rubrosColumnas: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: this.$t("vista.nomina.rubros.campos.denominacion"), 
          key: "denominacion",
          sortable: true
        },
        { 
          label: this.$t("vista.nomina.roles.campos.ingresos"), 
          key: "ingreso",
          sortable: true
        },
        { 
          label: this.$t("vista.nomina.roles.campos.egresos"), 
          key: "egreso",
          sortable: true,
        }
      ],
      procesando: false,
      customAccion: '',
      lectura: false,
      guardando: false
    }
  },
  filters: {
    dinero(val) {
      if (!val) {
        return '0.00';
      }

      try {
        return val.toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
      } catch {
        return val;
      }
    }
  },
  validations: {
    rol: {
      anio: { maxValue: mayorQueCero },
      mes: { maxValue: mayorQueCero }
    }
  },  
  computed: {
    tituloAccion() {
      return this.lectura ? this.$t('vista.lectura') : this.customAccion.length > 0 ? this.customAccion : this.$route.meta.accion;
    },
    fechaRol: {
      get: function() {
        if (this.rol.fecha != null)
          return this.$moment(this.rol.fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.rol.fecha = v;
      }
    },
    totalIngresos: function() {
      return this.rol.relEmpleados.reduce(
        (acc, item) => acc + parseFloat(item.ingresos), 0
      );
    },
    totalEgresos: function() {
      return this.rol.relEmpleados.reduce(
        (acc, item) => acc + parseFloat(item.egresos), 0
      );
    },
    totalPagado: function() {
      return this.rol.relEmpleados.reduce(
        (acc, item) => acc + (parseFloat(item.ingresos) - parseFloat(item.egresos)), 0
      );
    },
    totalIngreso: function() {
      return 0;
    },
    totalEgreso: function() {
      return 0;
    }
  },  
  methods: {
    eliminarItem(p) {

    },
    eliminarRubro(p) {
      
    },
    guardar() {

    },
    cancelar() {
      this.$router.back();
    },
    nuevo() {

    },
    modificar() {

    },
    agregar() {
      // traer datos
      this.procesando = true;
      this.rol.relEmpleados = [];
      this.rol.relRubros = [];
      this.$store
        .dispatch("nomina/rolesRubros", {
          sub: getCurrentSubscriber().id,
          emp: this.$store.state.empresaAccedida.id,
          mes: this.rol.mes,
          anio: this.rol.anio
        })
        .then(function(r) {
          if (r.data != undefined) {
            this.rol.relEmpleados = r.data.empleados;
            this.rol.relRubros = r.data.rubros;
            this.indexarItems();
            this.procesando = false;
          }          
        }.bind(this))
        .catch(function(e) {
          let msj = this.$t("vista.busqueda.no-encontrado");
          if (e.response) {
            msj = e.response;
          } else {
            if (e.message) {
              msj = e.message;
            }
          }
          this.procesando = false;
          this.$notify("warning",
            this.$t("vista.comandos.buscar") + " transacciones",
            msj,
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    ocultarGuardando() {
      this.$refs.btGuardar.focus();
    },
    prevenirSalida(e) {
      if (this.lectura) return
      e.preventDefault();
      e.returnValue = "";
    },
    indexarItems() {
      let idx = 1;
      let idr = 1;
      let itemsRol = this.rol.relEmpleados.map(item => {
        item.index = idx;
        idx++;
        return item;
      });
      let rubrosRol = this.rol.relRubros.map(rub => {
        rub.index = idr;
        idr++;
        return rub;
      });
      this.rol.relRubros = rubrosRol;

      itemsRol.forEach((emp, index) => {
        var rubsEmp = rubrosRol.filter(function (rub) {
          return rub.empleado_id == emp.empleado_id;
        });
        if (rubsEmp.length > 0 && this.rol.id == 0) {
          const ings = rubsEmp.reduce((acc, o) => acc + parseFloat(o.ingreso), 0);
          const egrs = rubsEmp.reduce((acc, o) => acc + parseFloat(o.egreso), 0);
          itemsRol[index].ingresos = ings;
          itemsRol[index].egresos = egrs;
        }
        itemsRol[index].rubros = rubsEmp;
      });
      this.rol.relEmpleados = itemsRol;
    }
  },
  mounted() {
    if (this.$route.params.id > 0) {
      this.rol = {
        id: this.$route.params.dato.id,
        subscripcion_id: this.$route.params.dato.subscripcion_id,
        empresa_id: this.$route.params.dato.empresa_id,
        descripcion: this.$route.params.dato.descripcion,	
        anio: this.$route.params.dato.anio,
        mes: this.$route.params.dato.mes,
        desde: this.$route.params.dato.desde,
        hasta: this.$route.params.dato.hasta,
        cuenta: this.$route.params.dato.cuenta,
        referencia: this.$route.params.dato.referencia,
        estado: this.$route.params.dato.estado,
        pagado: this.$route.params.dato.pagado,
        relEmpleados: this.$route.params.dato.relEmpleados,
        relRubros: this.$route.params.dato.relRubros
      };
      if (this.$route.params.dato.fecha != undefined) {
        try {
          this.fechaRol = this.$moment(this.$route.params.dato.fecha).toDate();
        } catch(e) {
          this.fechaRol = new moment.utc(this.$route.params.dato.fecha).toDate();
        }
      } else {
        this.rol.fecha = null;
      }
      /*if (this.$route.params.dato.contabilizar != undefined) {
        try {
          this.fechaMov = this.$moment(this.$route.params.dato.fecha).toDate();
        } catch(e) {
          this.fechaMov = new moment.utc(this.$route.params.dato.fecha).toDate();
        }
      } else {
        this.movimiento.contabilizar = null;
      }*/
      if (this.$route.params.lectura != undefined) {
        this.lectura = this.$route.params.lectura;
      }
      this.indexarItems();      
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