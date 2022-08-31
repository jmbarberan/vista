<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          titulo="Transacciones"
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
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="items"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
            responsive
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
            <template #cell(fecha)="fila">
              {{ formatearFecha(fila.item.fecha) }}
            </template>
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.nomina.movimientos.estados.colores.' + fila.item.estado)">
                {{ $t('vista.nomina.movimientos.estados.' + fila.item.estado) }}
              </b-badge>
            </template>
            <template #cell(valor)="fila">
              <div style="text-align: right;">
                {{ parseFloat(fila.item.valor) | dinero }}
              </div>
            </template>            
            <template #head(valor)="data">
              <div style="text-align: right;">
                {{ data.label }}
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
import EncabezadoDocs from "@/containers/views/EncabezadoDocumentos";
import { tipoDenominacion } from "@/constants/tipos";
import { getCurrentSubscriber } from "../../utils";
import moment from "moment";
export default {
  components: {
    "encabezado-tabla": EncabezadoDocs
  },
  data() {
    return {
      tipoId: 0,
      orden: "numero",
      ordenDesc: false,
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
          label: this.$t("vista.transacciones.campos.numero"), 
          key: "numero",
          sortable: true
        },
        { 
          label: this.$t("vista.transacciones.campos.fecha"), 
          key: "fecha",
          sortable: true,
        },
        {
          label: "Empleado", 
          key: "relEmpleado.nombres", 
          sortable: true 
        },
        {
          label: this.$t("vista.transacciones.campos.valor"), 
          key: "valor", 
          sortable: true,
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          sortable: true
        }
      ],
      items: [],
      busquedaEjecutando: false,
      titulo: ""
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
        .dispatch("nomina/movimientosBuscar", {
          sub: getCurrentSubscriber().id,
          emp: this.$store.state.empresaAccedida.id,
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
      this.abrirEditor('nomina-movimiento-modificar', p.item.id, p.item, false);
    },
    crear() {
      this.abrirEditor('nomina-movimiento-nuevo', 0, null, false);
    },
    ver(p) {
      this.abrirEditor('nomina-movimiento-modificar', p.item.id, p.item, true);
    },
    abrirEditor(ruta, pid, psel, lec){
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: JSON.parse(JSON.stringify(psel)),
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
      let comando = this.$t("vista.comandos.eliminar");
      if (pestado == 0)
        comando = this.$t("vista.comandos.restaurar");
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("nomina/movimientoModificarEstado", {
          id: pid,
          estado: pestado
         })
        .then(function(r) {
          this.buscar();
          this.$notify("success",
            comando + " " + this.$t('vista.ventas.facturas.denominacion'),
            r.data,
            { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning",
            comando + " " + this.$t('vista.ventas.facturas.denominacion'),
            this.$t('vista.comandos.fallo') + " " + comando + " " + this.$t('vista.ventas.facturas.denominacion'),
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false;
    },
    formatearFecha(f) {
      return this.$moment(f).format('YYYY-MM-DD');
    },
    cargarCache() {
      this.items = [];
      if (this.$store.state.nomina.movimientosBuscadorCache.lista.length > 0) {
        this.items = this.$store.state.nomina.movimientosBuscadorCache.lista;
        this.$store.commit('nomina/setCacheBuscaMovimientosLista', []);
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.texto.length > 0) {
        this.$store.commit('setBuscaMovimientosTexto', this.$store.state.nomina.movimientosBuscadorCache.texto);
        this.$store.commit('nomina/setCacheBuscaMovimientosTexto', '');
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.desde != null) {
        this.$store.commit('setBuscaMovimientosDesde', this.$moment(this.$store.state.nomina.movimientosBuscadorCache.desde).toDate());
        this.$store.commit('nomina/setCacheBuscaMovimientosDesde', this.$moment().format('YYYY-MM-DD'));
      } else {
        this.$store.commit('setBuscaMovimientosDesde', new Date());
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.hasta != null) {
        this.$store.commit('setBuscaMovimientosHasta', this.$moment(this.$store.state.nomina.movimientosBuscadorCache.hasta).toDate());
        this.$store.commit('nomina/setCacheBuscaMovimientosHasta', this.$moment().format('YYYY-MM-DD'));
      } else {
        this.$store.commit('setBuscaMovimientosHasta', new Date());
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.atributo != null) {
        this.$store.commit('setBuscaMovimientosAtributo', this.$store.state.nomina.movimientosBuscadorCache.atributo);
        this.$store.commit('nomina/setCacheBuscaMovimientosAtributo', null);
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.extendida) {
        this.$store.commit('setBuscaMovimientosExtendida', this.$store.state.nomina.movimientosBuscadorCache.extendida);
        this.$store.commit('nomina/setCacheBuscaMovimientosExtendida', false);
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.eliminados) {
        this.$store.commit('setBuscaMovimientosEliminados', this.$store.state.nomina.movimientosBuscadorCache.eliminados);
        this.$store.commit('nomina/setCacheBuscaMovimientosEliminados', false);
      }
      if (this.$store.state.nomina.movimientosBuscadorCache.tipo != null) {
        this.$store.commit('setBuscaMovimientosTipo', this.$store.state.nomina.movimientosBuscadorCache.tipo);
        this.$store.commit('nomina/setCacheBuscaMovimientosTipo', null);
      }
    },
    respaldarCache() {
      this.$store.commit('nomina/setCacheBuscaMovimientosLista',  this.items );
      if (this.$store.state.movimientoBuscador.texto.length > 0) {
        this.$store.commit('nomina/setCacheBuscaMovimientosTexto',  this.$store.state.movimientoBuscador.texto);
        this.$store.commit('setBuscaMovimientosTexto', '');
      }
      if (this.$store.state.movimientoBuscador.tipo > 0) {
        this.$store.commit('nomina/setCacheBuscaMovimientosTipo', this.$store.state.movimientoBuscador.tipo);
        this.$store.commit('setBuscaMovimientosTipo', '');
      }
      if (this.$store.state.movimientoBuscador.desde != null) {
        this.$store.commit('nomina/setCacheBuscaMovimientosDesde', this.$store.state.movimientoBuscador.desde);
        this.$store.commit('setBuscaMovimientosDesde', null);
      }
      if (this.$store.state.movimientoBuscador.hasta != null) {
        this.$store.commit('nomina/setCacheBuscaMovimientosHasta', this.$store.state.movimientoBuscador.hasta);
        this.$store.commit('setBuscaMovimientosHasta', null);
      }
      if (this.$store.state.movimientoBuscador.atributo != null) {
        this.$store.commit('nomina/setCacheBuscaMovimientosAtributo', this.$store.state.movimientoBuscador.atributo);
        this.$store.commit('setBuscaMovimientosAtributo', '');
      }    
      if (this.$store.state.movimientoBuscador.extendida) {
        this.$store.commit('nomina/setCacheBuscaMovimientosExtendida', this.$store.state.movimientoBuscador.extendida);
        this.$store.commit('setBuscaMovimientosExtendida', false);
      }
      if (this.$store.state.movimientoBuscador.eliminados) {
        this.$store.commit('nomina/setCacheBuscaMovimientosEliminados', this.$store.state.movimientoBuscador.eliminados);
        this.$store.commit('setBuscaMovimientosEliminados', false);
      }
    },
    cargarSucursalesBusqueda() {
      /*let sucs = []
      this.sucursales.forEach(suc => {
        sucs.push({
          id: suc.Id,
          nombre: suc.Nombre
        })
      });
      this.$store.commit('setBuscaMovimientosControItems', sucs);
      this.$store.commit("setBuscaMovimientosAtributo", sucs[0]);*/
    }
  },
  filters: {
    dinero(val) {
      return val.toFixed(2);
    },
    tipo(t) {
      return tipoDenominacion(t);
    }
  },
  created() {
    this.$store.commit('setBuscaMovimientosDesde', new Date());
    this.$store.commit('setBuscaMovimientosHasta', new Date());
  },
  mounted() {
    /*this.tipoId = this.$route.meta.tipo*/
    /*this.titulo = this.$route.meta.titulo*/
    this.cargarCache();
  },
  beforeDestroy() {
    this.respaldarCache();
  }
}
</script>
