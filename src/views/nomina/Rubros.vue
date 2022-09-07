<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>Rubros de Nomina</h1>
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
            :items="items"
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
              <span
                class="span-comando mdi mdi-eye mdi-18px mr-2"
                @click="ver(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.ver')"
              />
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
            <!--template #cell(remuneracion_valor)="fila">
              <div style="text-align: right;">
                {{ parseFloat(fila.item.remuneracion_valor) | dinero }}
              </div>
            </!--template-->
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
import { getCurrentSubscriber, getEmpresa } from "../../utils/index";

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
          label: "Origen", 
          key: "relOrigen.denominacion",
          sortable: true
        },
        {
          label: "Periodo", 
          key: "relPeriodo.denominacion", 
          sortable: false 
        },
        {
          label: "Formula", 
          key: "relFormula.denominacion", 
          sortable: false 
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          name: "estado",
          sortable: true
        }
      ],
      items: [],
      verEliminados: false
    }
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.items.length;
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
        .dispatch("nomina/rubrosPorEstado", {
          sub: getCurrentSubscriber().id,
          emp: getEmpresa().id,
          estado: est
        })
        .then(function(r) {
          if (r) {
            if (r.data != undefined) {
              this.items = r.data;
            }
          }
          if (this.items.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.busqueda.consultando") + " rubros", e, 
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
            this.$t("vista.busqueda.consultando") + " rubros", 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false });
          this.consultando = false;
        }.bind(this));
    },
    ver(p) {
      this.abrirEditor(this.$route.meta.rutaModificar, p.item.id, p.item, true);
    },
    modificar(p) {
      this.abrirEditor(this.$route.meta.rutaModificar, p.item.id, p.item, false);
    },
    crear() {
      this.abrirEditor(this.$route.meta.rutaNuevo, 0, null, false);
    },
    abrirEditor(ruta, pid, psel, plec) {
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: JSON.parse(JSON.stringify(psel)),
          lectura: plec
        }
      });
    },
    rubroGuardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning", 
          this.$t("vista.transacciones.guardar-canot"), 
          this.$t("vista.transacciones.guardar-invalido"), 
          { duration: 3000, permanent: false });
      } else {
        this.editable.subscripcion_id = getCurrentSubscriber().id;
        this.editable.empresa_id = parseInt(getEmpresa().id);
        this.editable.remuneracion_valor = parseFloat(this.editable.remuneracion_valor);
        this.$store
          .dispatch("nomina/rubroGuardar", JSON.stringify(this.editable))
          .then(function(res) {
            if (res.status <= 201) {
              this.$notify("success",
                this.$t("vista.comandos.guardar") + " rubro",
                res.data.msj,
                { duration: 3000, permanent: false });
              this.editable = this.inicializarEditable();
              this.listar();
            } else {
              this.$notify("warning", 
                this.$t("vista.comandos.guardar") + " rubros", 
                res.data.msj,
                { duration: 3000, permanent: false });
            }
          }.bind(this))
          .catch(function(e) {
            let msj = e.response.data ? 
              e.response.data != undefined : 
              e.message ? 
                e.message : 
                this.$t("vista.transacciones.guardar-error");
            this.$notify("danger",
              this.$t("vista.comandos.guardar") + " rubro",
              msj,
              { duration: 3000, permanent: false });
          }.bind(this)
        );
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
        .dispatch("nomina/rubroModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.$notify("success", cmd + " rubro", r.data, {
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