<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          :titulo="titulo"
          :crear="crear"
          :buscar="buscar"
          :actualizar="buscar"
          :desde="desde"
          :hasta="hasta"
          :total="total"
          :xPagina="porPagina"
          :lPaginas="lPaginas"
          :cambiarPagina="cambiarPagina"
        ></encabezado-tabla>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table
            ref="tablaRoles"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="items"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
            responsive
            foot-clone
            no-footer-sorting
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
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
                class="span-comando mdi mdi-calculator mdi-18px mr-2"
                @click="liquidar(row)"
                v-b-tooltip.hover
                :title="$t('vista.nomina.roles.comandos.liquidar')"
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
                title="$t('vista.comandos.restaurar')"
              />
            </template>
            <template #foot(acciones)>
              <div style="display: none"/>
            </template>
            <template #cell(fecha)="fila">
              {{ formatearFecha(fila.item.fecha) }}
            </template>
            <template #foot(fecha)>
              <div style="display: none"/>
            </template>
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.nomina.roles.estados.colores.' + fila.item.estado)">
                {{ $t('vista.nomina.roles.estados.' + fila.item.estado) }}
              </b-badge>
            </template>
            <template #foot(estado)>
              <div style="display: none"/>
            </template>
            <template #cell(pagado)="fila">
              <div style="text-align: right;">
                {{ parseFloat(fila.item.pagado) | dinero }}
              </div>
            </template>
            <template #head(pagado)="fila">
              <div style="text-align: right;">
                {{ fila.label }}
              </div>
            </template>
            <template #foot(pagado)>
              <div style="text-align: right;">
                {{ totalPagado | dinero }}
              </div>
            </template>
            <template #foot(anio)>
              <div style="display: none"/>
            </template>
            <template #foot(mes)>
              <div style="display: none"/>
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
import EncabezadoDocs from "@/containers/views/EncabezadoDocumentos";
import { getCurrentSubscriber, getEmpresa } from "../../utils/index";
import moment from "moment";
export default {
  components: {
    "encabezado-tabla": EncabezadoDocs
  },
  data() {
    return {
      titulo: "",
      orden: "Fecha",
      ordenDesc: true,
      porPagina: 10,
      paginaActual: 1,
      lPaginas: [ 5, 10, 15, 20 ],
      desde: 0,
      hasta: 0,
      sucursales: [],
      columnas: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: this.$t("vista.transacciones.campos.anio"), 
          key: "anio",
          sortable: true
        },
        { 
          label: this.$t("vista.transacciones.campos.mes"), 
          key: "mes",
          sortable: true
        },
        { 
          label: this.$t("vista.transacciones.campos.fecha"), 
          key: "fecha",
          sortable: true,
        },
        {
          label: this.$t("vista.nomina.roles.campos.pagado"), 
          key: "pagado", 
          sortable: true 
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          sortable: true
        }
      ],
      items: [],
      busquedaEjecutando: false
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
    totalPagado() {
      return this.items.reduce(
        (acc, item) => acc + parseFloat(item.pagado), 0
      );
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
    buscar() {
      this.busquedaEjecutando = true;
      this.items = [];
      this.paginaActual = 1;

      let txt = "_";
      if (this.$store.state.movimientoBuscador.texto.length > 0) {
        txt = this.$store.state.movimientoBuscador.texto;
      }
      this.$store
        .dispatch("nomina/rolesBuscar", {
          sub: getCurrentSubscriber().id,
          emp: getEmpresa().id,
          tipo: this.$store.state.movimientoBuscador.extendida ? 1 : 0,
          filtro: txt,
          estado: this.$store.state.movimientoBuscador.eliminados ? 9 : 0,
          desde: moment(this.$store.state.movimientoBuscador.desde).format("YYYY-MM-DD"),
          hasta: moment(this.$store.state.movimientoBuscador.hasta).format("YYYY-MM-DD"),
          clase: this.$store.state.movimientoBuscador.tipo
        })
        .then(function(r) {
          if (r.data != undefined) {
            this.items = r.data;
          }
          this.busquedaEjecutando = false;
        }.bind(this))
        .catch(function(e) {
          let msj = this.$t("vista.busqueda.no-encontrado");
          if (e.response && e.response.statusText) {
            msj = e.response.statusText;
          } else {
            if (e.message) {
              msj = e.message;
            }
          }
          this.busquedaEjecutando = false;
          this.$notify("warning",
            this.$t("vista.comandos.buscar") + " transacciones",
            msj,
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor(this.$route.meta.rutaModificar, p.item.id, p.item, false);
    },
    crear() {
      this.abrirEditor(this.$route.meta.rutaNuevo, 0, null, false);
    },
    ver(p) {
      this.abrirEditor(this.$route.meta.rutaModificar, p.item.id, p.item, true);
    },
    abrirEditor(ruta, pid, psel, lec){
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: psel,
          lectura: lec
        }
      });
    },
    restaurar(p) {
      this.modificarEstado(p.item.id, 0);
    },
    eliminar(p) {
      this.modificarEstado(p.item.id, 2);
    },
    modificarEstado(pid, pestado) {
      let comando = "Eliminar";
      if (pestado == 0)
        comando = "Restaurar";
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("nomina/rolesModificarEstado", {
          id: pid,
          estado: pestado
         })
        .then(function(r) {
          this.buscar();
          this.$notify("success",
            comando + " " + this.$t('menu.nomina.roles.titulo').toLowerCase(),
            r.data,
            { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning",
            comando + " " + this.titulo,
            this.$t("vista.comandos.fallo") + " " + comando.toLowerCase() + " " + this.$t('menu.nomina.roles.titulo').toLowerCase(),
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false;
    },
    liquidar(p) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("nomina/rolesLiquidar", p.item.id)
        .then(function(r) {
          this.buscar();
          this.$notify("success",
            "Liquidar " + this.$t('menu.nomina.roles.titulo').toLowerCase(),
            r.data.msj,
            { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning",
            "Liquidar " + this.titulo.toLowerCase(),
            this.$t("vista.comandos.fallo") + " " + this.$t('vista.nomina.roles.comandos.liquidar').toLowerCase() + " " + this.$t('menu.nomina.roles.titulo').toLowerCase(),
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false;
    },
    formatearFecha(f) {
      return this.$moment(f).format('YYYY-MM-DD');
    },
    cargarCache() {
      this.items = [];
      if (this.$store.state.nomina.rolesBuscadorCache.lista.length > 0) {
        this.items = this.$store.state.nomina.rolesBuscadorCache.lista;
        this.$store.commit('nomina/setCacheBuscaRolesLista', []);
      }
      if (this.$store.state.nomina.rolesBuscadorCache.texto.length > 0) {
        this.$store.commit('setBuscaMovimientosTexto', this.$store.state.nomina.rolesBuscadorCache.texto);
        this.$store.commit('nomina/setCacheBuscaRolesTexto', '');
      }
      if (this.$store.state.nomina.rolesBuscadorCache.desde != null) {
        this.$store.commit('setBuscaMovimientosDesde', this.$moment(this.$store.state.nomina.rolesBuscadorCache.desde).toDate());
        this.$store.commit('nomina/setCacheBuscaRolesDesde', this.$moment().format('YYYY-MM-DD'));
      } else {
        this.$store.commit('setBuscaMovimientosDesde', new Date());
      }
      if (this.$store.state.nomina.rolesBuscadorCache.hasta != null) {
        this.$store.commit('setBuscaMovimientosHasta', this.$moment(this.$store.state.nomina.rolesBuscadorCache.hasta).toDate());
        this.$store.commit('nomina/setCacheBuscaRolesHasta', this.$moment().format('YYYY-MM-DD'));
      } else {
        this.$store.commit('setBuscaMovimientosHasta', new Date());
      }
      if (this.$store.state.nomina.rolesBuscadorCache.atributo != null) {
        this.$store.commit('setBuscaMovimientosAtributo', this.$store.state.nomina.rolesBuscadorCache.atributo);
        this.$store.commit('nomina/setCacheBuscaRolesAtributo', null);
      }
      if (this.$store.state.nomina.rolesBuscadorCache.extendida) {
        this.$store.commit('setBuscaMovimientosExtendida', this.$store.state.nomina.rolesBuscadorCache.extendida);
        this.$store.commit('nomina/setCacheBuscaRolesExtendida', false);
      }
      if (this.$store.state.nomina.rolesBuscadorCache.eliminados) {
        this.$store.commit('setBuscaMovimientosEliminados', this.$store.state.nomina.rolesBuscadorCache.eliminados);
        this.$store.commit('nomina/setCacheBuscaRolesEliminados', false);
      }
      if (this.$store.state.nomina.rolesBuscadorCache.tipo != null) {
        this.$store.commit('setBuscaMovimientosTipo', this.$store.state.nomina.rolesBuscadorCache.tipo);
        this.$store.commit('nomina/setCacheBuscaRolesTipo', null);
      }
    },
    respaldarCache() {
      this.$store.commit('nomina/setCacheBuscaRolesLista',  this.items );
      if (this.$store.state.movimientoBuscador.texto.length > 0) {
        this.$store.commit('nomina/setCacheBuscaRolesTexto',  this.$store.state.movimientoBuscador.texto);
        this.$store.commit('setBuscaMovimientosTexto', '');
      }
      if (this.$store.state.movimientoBuscador.tipo > 0) {
        this.$store.commit('nomina/setCacheBuscaRolesTipo', this.$store.state.movimientoBuscador.tipo);
        this.$store.commit('setBuscaMovimientosTipo', '');
      }
      if (this.$store.state.movimientoBuscador.desde != null) {
        this.$store.commit('nomina/setCacheBuscaRolesDesde', this.$store.state.movimientoBuscador.desde);
        this.$store.commit('setBuscaMovimientosDesde', null);
      }
      if (this.$store.state.movimientoBuscador.hasta != null) {
        this.$store.commit('nomina/setCacheBuscaRolesHasta', this.$store.state.movimientoBuscador.hasta);
        this.$store.commit('setBuscaMovimientosHasta', null);
      }
      if (this.$store.state.movimientoBuscador.atributo != null) {
        this.$store.commit('nomina/setCacheBuscaRolesAtributo', this.$store.state.movimientoBuscador.atributo);
        this.$store.commit('setBuscaMovimientosAtributo', '');
      }    
      if (this.$store.state.movimientoBuscador.extendida) {
        this.$store.commit('nomina/setCacheBuscaRolesExtendida', this.$store.state.movimientoBuscador.extendida);
        this.$store.commit('setBuscaMovimientosExtendida', false);
      }
      if (this.$store.state.movimientoBuscador.eliminados) {
        this.$store.commit('nomina/setCacheBuscaRolesEliminados', this.$store.state.movimientoBuscador.eliminados);
        this.$store.commit('setBuscaMovimientosEliminados', false);
      }
    },
  },
  created() {
    this.$store.commit('setBuscaMovimientosDesde', new Date());
    this.$store.commit('setBuscaMovimientosHasta', new Date());
  },
  mounted() {
    this.cargarCache();
  },
  beforeDestroy() {
    this.respaldarCache();
  }
}
</script>
