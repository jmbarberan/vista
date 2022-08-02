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
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="compras"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
            responsive
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
            </template>
            <template #cell(Acciones)="row">
              <span
                class="span-comando mdi mdi-eye mdi-18px mr-2"
                @click="ver(row)"
                v-b-tooltip.hover
                title="Ver"
              />
              <span v-if="row.item.Estado == 0"
                class="span-comando mdi mdi-pen mdi-18px mr-2"
                @click="modificar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.modificar')"
              />
              <span v-if="row.item.Estado == 0"
                class="span-comando mdi mdi-trash-can-outline mdi-18px" 
                @click="eliminar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.eliminar')"
              />
              <span v-if="row.item.Estado == 2"
                class="span-comando mdi mdi-restore mdi-18px" 
                @click="restaurar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.restaurar')"
              />
            </template>
            <template #cell(Fecha)="fila">
              {{ formatearFecha(fila.item.Fecha) }}
            </template>
            <template #cell(Subtotal)="fila">
              <div style="text-align: right;">
                ${{ (parseFloat(fila.item.Subtotal) + parseFloat(fila.item.SubtotalEx)) | dinero }}
              </div>
            </template>
            <template #cell(Impuestos)="fila">
              <div style="text-align: right;">
                ${{ parseFloat(fila.item.Impuestos) | dinero }}
              </div>
            </template>
            <template #cell(Valor)="fila">
              <div style="text-align: right;">
                ${{ (parseFloat(fila.item.Subtotal) + parseFloat(fila.item.SubtotalEx) + parseFloat(fila.item.Impuestos)) 
                  - parseFloat(fila.item.Descuento) | dinero }}
              </div>
            </template>
            <template #cell(Estado)="fila">
              <b-badge :variant="$t('vista.inventarios.compras.estados.colores.' + fila.item.Estado)">
                {{ $t('vista.inventarios.compras.estados.' + fila.item.Estado) }}
              </b-badge>
            </template>
            <template #head(Subtotal)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #head(Impuestos)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #head(Valor)="data">
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
export default {
  components: {
    "encabezado-tabla": EncabezadoDocs
  },
  data() {
    return {
      tipoId: 0,
      orden: "Numero",
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
          key: "Acciones", 
          sortable: false,
        },
        { 
          label: this.$t("vista.transacciones.campos.numero"), 
          key: "Numero",
          sortable: true
        },
        { 
          label: this.$t("vista.transacciones.campos.fecha"), 
          key: "Fecha",
          sortable: true,
        },
        {
          label: this.$t("vista.ventas.facturas.campos.cliente"), 
          key: "relProveedor.Nombre", 
          sortable: true 
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.subtotal"), 
          key: "Subtotal", 
          sortable: true,
        },
        {
          label: this.$t("vista.inventarios.compras.campos.impuestos"), 
          key: "Impuestos", 
          sortable: true,
        },
        {
          label: this.$t("vista.transacciones.campos.valor"), 
          key: "Valor", 
          sortable: true,
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "Estado",
          sortable: false
        }
      ],
      compras: [],
      busquedaEjecutando: false,
      titulo: ""
    }
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.compras.length;
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
      this.compras = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("inventarios/comprasBuscar")
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.compras = r.respuesta.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.compras.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.comandos.buscar") + " " + this.titulo, 
              this.$t("vista.busqueda.no-encontrado"), 
              { duration: 3000, permanent: false });
            this.cambiarPaginaActual(1);
          } else {
            this.paginaActual = 1;
            this.cambiarPaginaActual(1);
          }
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.busquedaEjecutando = false;
          this.$notify("warning", 
            this.$t("vista.comandos.buscar") + " " + this.titulo,
            this.$t("vista.busqueda.no-encontrado"),
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor(this.$route.meta.rutaModificar, p.item.Id, p.item, false);
    },
    crear() {
      this.abrirEditor(this.$route.meta.rutaNuevo, 0, null, false);
    },
    ver(p) {
      this.abrirEditor(this.$route.meta.rutaModificar, p.item.Id, p.item, true);
    },
    abrirEditor(ruta, pid, psel, lec){
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: JSON.parse(JSON.stringify(psel)),
          tipoId: this.tipoId,
          lectura: lec
        }
      });
    },
    restaurar(p) {
      this.modificarEstado(p.item.Id, 0);
    },
    eliminar(p) {
      this.modificarEstado(p.item.Id, 2);
    },
    modificarEstado(pid, pestado) {
      let comando = this.$t("vista.comandos.eliminar");
      if (pestado == 0)
        comando = this.$t("vista.comandos.restaurar");
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("inventarios/compraModificarEstado", {
          id: pid,
          estado: pestado
         })
        .then(function(r) {
          this.buscar();
          this.$notify("success", 
            comando + " " + this.titulo, 
            r.data, { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning", 
            comando + " " + this.titulo,
            this.$t('vista.comandos.fallo') + " " + comando.toLowerCase() + " este item.", 
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false;
    },
    formatearFecha(f) {
      return this.$moment(f).format('YYYY-MM-DD');
    },
    cargarTipo(p) {
      this.compras = [];
      this.$store
        .dispatch("inventarios/cacheBuscadorTipo", p)
        .then(function(ccbusca) {
          this.$store.commit('setBuscaMovimientosTipo', ccbusca.tipo);
          this.$store.commit('inventarios/setBuscacheMovimientosTipo', { tipo: p, valor: 0 });
          this.$store.commit('setBuscaMovimientosTipomov', p);
          if (ccbusca != undefined && ccbusca.lista.length > 0) {
            this.compras = ccbusca.lista;
            this.$store.commit('inventarios/setBuscacheMovimientosLista', { tipo: p, valor: [] });
          }
          if (ccbusca.texto.length > 0) {
            this.$store.commit('setBuscaMovimientosTexto', ccbusca.texto);
            this.$store.commit('inventarios/setBuscacheMovimientosTexto', { tipo: p, valor: ''});
          }
          if (ccbusca.desde != null) {
            this.$store.commit('setBuscaMovimientosDesde', this.$moment(ccbusca.desde).toDate());
            this.$store.commit('inventarios/setBuscacheMovimientosDesde', { tipo: p, valor: null });
          } else {
            this.$store.commit('setBuscaMovimientosDesde', new Date());
          }
          if (ccbusca.hasta != null) {
            this.$store.commit('setBuscaMovimientosHasta', this.$moment(ccbusca.hasta).toDate());
            this.$store.commit('inventarios/setBuscacheMovimientosHasta', { tipo: p, valor: null });
          } else {
            this.$store.commit('setBuscaMovimientosHasta', new Date());
          }
          if (ccbusca.atributo != null) {
            this.$store.commit('setBuscaMovimientosAtributo', ccbusca.atributo);
            this.$store.commit('inventarios/setBuscacheMovimientosAtributo', { tipo: p, valor: null });
          }
          if (ccbusca.extendida) {
            this.$store.commit('setBuscaMovimientosExtendida', ccbusca.extendida);
            this.$store.commit('inventarios/setBuscacheMovimientosExtendida', { tipo: p, valor: false });
          }
          if (ccbusca.eliminados) {
            this.$store.commit('setBuscaMovimientosEliminados', ccbusca.eliminados);
            this.$store.commit('inventarios/setBuscacheMovimientosEliminados', { tipo: p, valor: false });
          }
        }.bind(this));
    },
    respaldarTipo(p) {
      this.$store.commit('inventarios/setBuscacheMovimientosLista',  { tipo: p, valor: this.compras });
      if (this.$store.state.movimientoBuscador.texto.length > 0) {
        this.$store.commit('inventarios/setBuscacheMovimientosTexto',  { tipo: p, valor: this.$store.state.movimientoBuscador.texto });
        this.$store.commit('setBuscaMovimientosTexto', '');
      }
      if (this.$store.state.movimientoBuscador.tipo > 0) {
        this.$store.commit('inventarios/setBuscacheMovimientosTipo',  { tipo: p, valor: this.$store.state.movimientoBuscador.tipo });
        this.$store.commit('setBuscaMovimientosTipo', '');
      }
      if (this.$store.state.movimientoBuscador.desde != null) {
        this.$store.commit('inventarios/setBuscacheMovimientosDesde',  { tipo: p, valor: this.$store.state.movimientoBuscador.desde });
        this.$store.commit('setBuscaMovimientosDesde', '');
      }
      if (this.$store.state.movimientoBuscador.hasta != null) {
        this.$store.commit('inventarios/setBuscacheMovimientosHasta',  { tipo: p, valor: this.$store.state.movimientoBuscador.hasta });
        this.$store.commit('setBuscaMovimientosHasta', '');
      }
      if (this.$store.state.movimientoBuscador.atributo != null) {
        this.$store.commit('inventarios/setBuscacheMovimientosAtributo',  { tipo: p, valor: this.$store.state.movimientoBuscador.atributo });
        this.$store.commit('setBuscaMovimientosAtributo', '');
      }    
      if (this.$store.state.movimientoBuscador.extendida) {
        this.$store.commit('inventarios/setBuscacheMovimientosExtendida',  { tipo: p, valor: this.$store.state.movimientoBuscador.extendida });
        this.$store.commit('setBuscaMovimientosExtendida', false);
      }
      if (this.$store.state.movimientoBuscador.eliminados) {
        this.$store.commit('inventarios/setBuscacheMovimientosEliminados',  { tipo: p, valor: this.$store.state.movimientoBuscador.eliminados });
        this.$store.commit('setBuscaMovimientosEliminados', false);
      }
    },
    cargarSucursalesBusqueda() {
      let sucs = []
      this.sucursales.forEach(suc => {
        sucs.push({
          id: suc.Id,
          nombre: suc.Nombre
        })
      });
      this.$store.commit('setBuscaMovimientosControItems', sucs);
      this.$store.commit("setBuscaMovimientosAtributo", sucs[0]);
    }
  },
  filters: {
    dinero(val) {
      if (val != null) {
        return val.toFixed(2);
      } else {
        return val;
      }
    }
  },
  watch: {
    $route(to, from) {
      this.respaldarTipo(from.matched[2].meta.tipo);
      this.cargarTipo(to.matched[2].meta.tipo);
      this.tipoId = to.matched[2].meta.tipo
      this.titulo = to.matched[2].meta.titulo
      this.cargarSucursalesBusqueda();
    }
  },
  created() {
    this.$store.commit('setBuscaMovimientosDesde', new Date());
    this.$store.commit('setBuscaMovimientosHasta', new Date());
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", this.$store.state.empresaAccedida.id)
      .then(function(r) {
        this.sucursales = r.data;
        this.cargarSucursalesBusqueda();
      }.bind(this));  
  },
  mounted() {
    this.tipoId = this.$route.meta.tipo
    this.titulo = this.$route.meta.titulo
    this.cargarTipo(this.tipoId);
  },
  beforeDestroy() {
    this.respaldarTipo(this.tipoId);
  }
}
</script>
