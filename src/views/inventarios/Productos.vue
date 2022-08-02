<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          :titulo="$t('vista.inventarios.productos.lista-titulo')"
          :busquedaAtributos ="busquedaAtributos"
          :crear="crear"
          :buscar="buscar"
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
        <b-card class="mb-4 mt-2">
          <b-table
            responsive
            ref="custom-table"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="productos"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
            </template>
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.estados.colores.' + fila.item.Estado)">
                {{ $t('vista.estados.' + fila.item.Estado) }}
              </b-badge>
            </template>
            <template #cell(acciones)="row">
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
import EncabezadoTablas from "@/containers/views/EncabezadoTablas";
export default {
  components: {
    "encabezado-tabla": EncabezadoTablas
  },
  data() {
    return {
      orden: "nombre",
      ordenDesc: false,
      porPagina: 10,
      paginaActual: 1,
      lPaginas: [ 5, 10, 15, 20 ],
      desde: 0,
      hasta: 0,
      columnas: [
        {
          label: "Acciones", 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: "Codigo", 
          key: "Codigo",
          sortable: true
        },
        { 
          label: "Nombre", 
          key: "Nombre",
          sortable: true
        },
        {
          label: "Presentacion", 
          key: "Medida",
          sortable: false },
        {
          label: "Categoria",
          key: "relCategoria.Denominacion",
          sortable: true
        },
        {
          label: "Estado",
          key: "Estado",
          name: "estado",
          sortable: true
        }
      ],
      productos: [],
      busquedaAtributos: [
        this.$t("vista.inventarios.productos.campos.nombre"),
        this.$t("vista.inventarios.productos.campos.codigo")
      ],
      busquedaEjecutando: false
    }
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.productos.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina)
    },
  },
  filters: {
    dinero(val) {
      return val.toFixed(2);
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
      this.productos = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("inventarios/productosBuscar")
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.productos = r.respuesta.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.productos.length <= 0) {
            this.$notify(
              "warning", 
              this.$t("vista.comandos.buscar") + " " + this.$t("vista.inventarios.productos.denominacionp"), 
              this.$t("vista.busqueda.no-encontrado"), 
              { duration: 3000, permanent: false }
            );
          } else {
            this.paginaActual = 1;
            this.cambiarPaginaActual(1);
          }
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.busquedaEjecutando = false;
          this.$notify(
            "warning", 
            this.$t("vista.comandos.buscar") + " " + this.$t("vista.inventarios.productos.denominacionp"), 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false }
          );
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor("productos-modificar", p.item.Id, p.item);
    },
    crear() {
      this.abrirEditor("productos-crear", 0, null);
    },
    abrirEditor(ruta, pid, psel) {
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: psel
        }
      });
    },
    restaurar(p) {
      this.modificarEstado(p.item.Id, 0, this.$t("vista.comandos.restaurar"));
    },
    eliminar(p) {
      this.modificarEstado(p.item.Id, 2, this.$t("vista.comandos.eliminar"));
    },
    modificarEstado(pid, pest, cmd) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("inventarios/productoModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.buscar();
          this.$notify(
            "success", 
            cmd + " " + this.$t("vista.inventarios.productos.denominacion"), 
            r.data, 
            { duration: 3000, permanent: false }
          );
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          if (cmd == undefined || cmd == null)
            cmd = "Operacion"
          this.$notify(
            "warning", 
            cmd + " " + this.$t("vista.inventarios.productos.denominacion"), 
            this.$t("vista.comandos.fallo") + " " + cmd.toLowerCase() + " " + this.$t("vista.inventarios.productos.denominacion"), 
            { duration: 3000, permanent: false }
          );
        }.bind(this));
      this.busquedaEjecutando = false; 
    },
  },
  mounted() {
    if (this.$store.state.inventarios.productosBuscadorCache.lista.length > 0) {
      this.productos = this.$store.state.inventarios.productosBuscadorCache.lista;
      this.$store.commit('inventarios/setCacheBusquedaProductosLista', []);
    }
    if (this.$store.state.inventarios.productosBuscadorCache.texto.length > 0) {
      this.$store.commit('clinica/setBuscaTablasTexto', this.$store.state.inventarios.productosBuscadorCache.texto);
      this.$store.commit('inventarios/setCacheBusquedaProductosTexto', '');
    }
    if (this.$store.state.inventarios.productosBuscadorCache.atributo.length > 0) {
      this.$store.commit('clinica/setBusquedaAtributo', this.$store.state.inventarios.productosBuscadorCache.atributo);
      this.$store.commit('inventarios/setCacheBusquedaProductosAtributo', '');
    } else {
      this.$store.commit("clinica/setBusquedaAtributo", "Nombre");
    }
    if (this.$store.state.inventarios.productosBuscadorCache.atributoIdx > 0) {
      this.$store.commit('clinica/setBusquedaAtributoIdx', this.$store.state.inventarios.productosBuscadorCache.atributoIdx);
      this.$store.commit('inventarios/setCacheBusquedaProductosAtributoIdx', 0);
    }
    if (this.$store.state.inventarios.productosBuscadorCache.extendida) {
      this.$store.commit('clinica/setBuscaTablasExtendida', this.$store.state.inventarios.productosBuscadorCache.extendida);
      this.$store.commit('inventarios/setCacheBusquedaProductosExtendida', false);
    }
    if (this.$store.state.inventarios.productosBuscadorCache.eliminados) {
      this.$store.commit('clinica/setBuscaTablasExtendida', this.$store.state.inventarios.productosBuscadorCache.eliminados);
      this.$store.commit('inventarios/setCacheBusquedaProductosEliminados', false);
    }
  },
  beforeDestroy() {
    this.$store.commit('inventarios/setCacheBusquedaProductosLista', this.productos);
    if (this.$store.state.clinica.tablasBuscador.texto.length > 0) {
      this.$store.commit('inventarios/setCacheBusquedaProductosTexto', this.$store.state.clinica.tablasBuscador.texto);
      this.$store.commit('clinica/setBuscaTablasTexto', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributo.length > 0) {
      this.$store.commit('inventarios/setCacheBusquedaProductosAtributo', this.$store.state.clinica.tablasBuscador.atributo);
      this.$store.commit('clinica/setBusquedaAtributo', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributoIdx > 0) {
      this.$store.commit('inventarios/setCacheBusquedaProductosAtributoIdx', this.$store.state.clinica.tablasBuscador.atributoIdx);
      this.$store.commit('clinica/setBusquedaAtributoIdx', 0);
    }
    if (this.$store.state.clinica.tablasBuscador.extendida) {
      this.$store.commit('inventarios/setCacheBusquedaProductosExtendida', this.$store.state.clinica.tablasBuscador.extendida);
      this.$store.commit('clinica/setBuscaTablasExtendida', false);
    }
    if (this.$store.state.clinica.tablasBuscador.eliminados) {
      this.$store.commit('inventarios/setCacheBusquedaProductosEliminados', this.$store.state.clinica.tablasBuscador.eliminados);
      this.$store.commit('clinica/setBuscaTablasEliminados', false);
    }
  }
}
</script>
