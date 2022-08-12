<template>
  <div>
    <b-modal v-model="verEditor" title="Datos del cargo" v-on:ok.prevent="cargoGuardar();" 
        v-on:cancel="cancelar()" v-on:close="cancelar()">
      <b-form class="av-tooltip mb-5 tooltip-label-right">
        <b-row>
          <b-colxx xxs="12" sm="6">
            <b-form-group label="Denominacion" class="has-float-label">
              <b-form-input type="text" v-model="editable.denominacion" :state="!$v.editable.denominacion.$error"/>
              <b-form-invalid-feedback>Debe asignar la denominacion del cargo</b-form-invalid-feedback>
            </b-form-group>
          </b-colxx>
          <b-colxx xxs="12" sm="6">
            <b-form-group label="Sueldo" class="has-float-label">
              <b-form-input type="number" pattern="^\d*(\.\d{0,2})?$" v-model="editable.remuneracion_valor" :state="!$v.editable.remuneracion_valor.$error"/>
              <b-form-invalid-feedback>Debe asignar el sueldo del cargo</b-form-invalid-feedback>
            </b-form-group>
          </b-colxx>
          <b-colxx xxs="12" sm="12">
            <b-form-group label="Descripcion" class="has-float-label">
              <b-form-input type="text" v-model="editable.descripcion"/>
            </b-form-group>
          </b-colxx>
        </b-row>
      </b-form>
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="success" size="sm" @click="ok()">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row>
      <b-colxx xxs="12">
        <h1>Cargos</h1>
        <div class="top-right-button-container">
          <b-checkbox switch 
              v-model="verEliminados" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle mr-3"
            >{{ $t("vista.busqueda.eliminados") }}</b-checkbox>
          <b-button
            @click="crear()"
            variant="primary"
            size="sm"
            class="top-right-button"
          >{{ $t('vista.comandos.nuevo') }}</b-button>
        </div>
        <piaf-breadcrumb />
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table
            responsive
            :busy="consultando"
            ref="custom-table"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="cargos"
            :current-page="paginaActual"
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
            </template>
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.estados.colores.' + fila.item.estado)">
                {{ $t('vista.estados.' + fila.item.estado) }}
              </b-badge>
            </template>
            <template #cell(acciones)="row">
              <span v-if="row.item.estado == 0"
                class="span-comando mdi mdi-pen mdi-18px mr-2" 
                @click="modificar(row)"
                v-b-tooltip.hover 
                :title="$t('vista.comandos.modificar')"
              />
              <span v-if="row.item.estado == 0"
                class="span-comando mdi mdi-trash-can-outline mdi-18px" 
                @click="eliminar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.eliminar')"
              />
              <span v-if="row.item.estado == 2"
                class="span-comando mdi mdi-restore mdi-18px" 
                @click="restaurar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.restaurar')"
              />
            </template>
            <template #cell(remuneracion_valor)="fila">
              <div style="text-align: right;">
                {{ parseFloat(fila.item.remuneracion_valor) | dinero }}
              </div>
            </template>
          </b-table>
          <b-pagination
            size="sm"
            align="center"
            :total-rows="total"
            :per-page="porPagina"
            :value="paginaActual"
            v-on:change="cambiarPaginaActual($event)"
            :sort-by.sync="orden"
            :sort-desc.sync="ordenDesc"
            sort-icon-left
          >
            <template v-slot:next-text>
              <i class="simple-icon-arrow-right"/>
            </template>
            <template v-slot:prev-text>
              <i class="simple-icon-arrow-left"/>
            </template>
            <template v-slot:first-text>
              <i class="simple-icon-control-start"/>
            </template>
            <template v-slot:last-text>
              <i class="simple-icon-control-end"/>
            </template>
          </b-pagination>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
const { required } = require("vuelidate/lib/validators");
import { getCurrentSubscriber } from "../../utils/index";

export default {
  data() {
    return {
      consultando: false,
      orden: "denominacion",
      ordenDesc: false,
      porPagina: 10,
      paginaActual: 1,
      lPaginas: [ 5, 10, 15, 20 ],
      desde: 0,
      hasta: 0,
      columnas: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: "Denominacion", 
          key: "denominacion",
          sortable: true
        },
        { 
          label: "Sueldo", 
          key: "remuneracion_valor",
          sortable: true
        },
        {
          label: "Descripcion", 
          key: "descripcion", 
          sortable: false 
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          name: "estado",
          sortable: true
        }
      ],
      cargos: [],
      editable: this.inicializarEditable(),
      verEditor: false,
      verEliminados: false
    }
  },
  validations: {
    editable: {
      denominacion: {
        required
      },
      remuneracion_valor: {
        required
      }
    }
  },
  filters: {
    dinero(val) {
      return val.toFixed(2);
    },
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.cargos.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina)
    },
  },
  watch: {
    verEliminados() {
      this.listar();
    }
  },
  methods: {
    cambiarPagina(p) {
      this.porPagina = p;
    },
    cambiarPaginaActual(e) {
      if (this.total == 0) {
        this.desde = 0;
      } else {
        if (e == 1) {
          this.desde = e;
        } else {
          this.desde = ((e - 1) * this.porPagina) + 1;
        };
      }
      if (this.total == 0) {
        this.hasta = 0;
      } else {
        if (e == this.paginas) {
          this.hasta = this.total;
        } else {
          this.hasta = (this.desde - 1) + this.porPagina;
        }
      }
      this.paginaActual = e;
    },
    listar() {
      const est = this.verEliminados ? 9 : 0;
      this.consultando = true;
      this.paginaActual = 1;
      this.$store
        .dispatch("nomina/cargosPorEstado", {
          sub: getCurrentSubscriber().id,
          emp: this.$store.state.empresaAccedida.id,
          estado: est
        })
        .then(function(r) {
          if (r) {
            if (r.data != undefined) {
              this.cargos = r.data;
            }
          }
          if (this.cargos.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.busqueda.consultando") + " cargos", e, 
              {
                duration: 3000,
                permanent: false
              });
          } else {
            this.paginaActual = 1;
            this.cambiarPaginaActual(1);
          }
          this.consultando = false;
        }.bind(this))
        .catch(function(e) {
          this.busquedaEjecutando = false;
          this.$notify("warning", 
            this.$t("vista.busqueda.consultando") + " cargos", 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false });
          this.consultando = false;
        }.bind(this));
    },
    modificar(p) {
      this.editable = JSON.parse(JSON.stringify(p.item));
      this.verEditor = true;
    },
    crear() {
      this.verEditor = true;
    },
    cargoGuardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning", 
          this.$t("vista.transacciones.guardar-canot"), 
          this.$t("vista.transacciones.guardar-invalido"), 
          { duration: 3000, permanent: false });
      } else {
        this.editable.subscripcion_id = getCurrentSubscriber().id;
        this.editable.empresa_id = this.$store.state.empresaAccedida.id;
        this.editable.remuneracion_valor = parseFloat(this.editable.remuneracion_valor);
        this.$store
          .dispatch("nomina/cargoGuardar", JSON.stringify(this.editable))
          .then(function(res) {
            if (res.status <= 201) {
              this.$notify("success",
                this.$t("vista.comandos.guardar") + " cargo",
                res.data.msj,
                { duration: 3000, permanent: false });
              this.editable = this.inicializarEditable();
              this.verEditor = false;
              this.listar();
            } else {
              this.$notify("warning", 
                this.$t("vista.comandos.guardar") + " cargos", 
                res.data.msj,
                { duration: 3000, permanent: false });
            }
          }.bind(this))
          .catch(function(e) {
            let msj = e.response.data ? 
              e.response.data : 
              e.message ? 
                e.message : 
                this.$t("vista.transacciones.guardar-error");
            this.$notify("danger",
              this.$t("vista.comandos.guardar") + " cargo",
              msj,
              { duration: 3000, permanent: false });
          }.bind(this)
        );
      } 
    },
    cancelar() {
      this.editable = this.inicializarEditable();
    },
    inicializarEditable() {
      return {
        id: 0,
        subscripcion_id: 0,
        empresa_id: 0,
        denominacion: "",
        departamento_id: 0,
        descripcion: "",
        remuneracion_tipo: 0,
        remuneracion_valor: 0,
        referencia: 0,
        actualizacion: null,
        estado: 0
      }
    },
    restaurar(p) {
      this.modificarEstado(p.item.id, 0, this.$t("vista.comandos.restaurar"));
    },
    eliminar(p) {
      this.modificarEstado(p.item.id, 2, this.$t("vista.comandos.eliminar"));
    },
    modificarEstado(pid, pest, cmd) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("nomina/cargoModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.$notify("success", cmd + " cargo", r.data, {
						duration: 3000,
						permanent: false
					});
          this.listar();
        }.bind(this))
        .catch(function(e) {
          let msj = e.response ? e.response : e;
          this.$notify("error", this.$t("vista.error"), msj, {
						duration: 3000,
						permanent: false
					});
        }.bind(this));
      this.busquedaEjecutando = false; 
    },
  },
  mounted() {
    this.listar();
  }
}
</script>

<style>

</style>