<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          :titulo="$t('vista.clinica.servicios.lista-titulo')"
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
        <b-card class="mb-4">
          <b-table
            ref="tablaServicios"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="servicios"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <table-busy :mensaje="$('vista.busqueda.ejecutandoq') + '...'" />
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
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.estados.colores.' + fila.item.estado)">
                {{ $t('vista.estados.' + fila.item.estado) }}
              </b-badge>
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
var colEstado = {
  key: "estado",
  name: "estado",
  sortable: true
};
import EncabezadoTablas from "@/containers/views/EncabezadoTablas";
export default {
  components: {
    "encabezado-tabla": EncabezadoTablas
  },
  data() {
    return {
      orden: "descripcion",
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
          label: this.$t("vista.clinica.servicios.campos.descripcion"), 
          key: "descripcion",
          sortable: true
        },
        { 
          label: this.$t("vista.clinica.consultas.campos.especialidad"), 
          key: "relEspecialidad.descripcion",
          sortable: true
        },
        {
          label: this.$t("vista.inventarios.productos.campos.producto"), 
          key: "relProducto.nombre", 
          sortable: true },
        {
          label: this.$t("vista.ventas.clientes.campos.codigo"),
          key: "codigo",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          name: "estado",
          sortable: true
        }
      ],
      servicios: [],
      busquedaAtributos: [
        this.$t("vista.clinica.servicios.campos.descripcion"),
      ],
      busquedaEjecutando: false
    }
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.servicios.length;
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
      this.servicios = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("clinica/serviciosBuscar")
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.servicios = r.respuesta.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.servicios.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.comandos.buscar") + " " + this.$t('vista.clinica.servicios.denominacion'),
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
            this.$t("vista.comandos.buscar") + " " + this.$t('vista.clinica.servicios.denominacion'),
            this.$t("vista.busqueda.no-encontrado"),
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor("servicios-modificar", p.item.id, p.item);
    },
    crear() {
      this.abrirEditor("servicios-crear", 0, null);
    },
    abrirEditor(ruta, pid, psel){
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: psel
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
        .dispatch("clinica/servicioModificarEstado", {
          id: pid,
          estado: pestado
         })
        .then(function(r) {
          this.buscar();
          this.$notify("success", 
            comando + " " + this.$t('vista.clinica.servicios.denominacion'),
            r.data,
            { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning", 
            comando + " " + this.$t('vista.clinica.servicios.denominacion'),
            this.$t("vista.comandos.fallo") + " " + comando.toLowerCase() + " este item.",
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false;
    },
    mensaje(contenido, titulo, variante) {
      this.counter++
      this.$bvToast.toast(contenido, {
        title: titulo,
        variant: variante,
        toaster: 'b-toaster-bottom-right',
        solid: true,
        appendToast: false
      })
    }
  },
  mounted() {
    if (this.$store.state.clinica.serviciosBuscadorCache.lista.length > 0) {
      this.servicios = this.$store.state.clinica.serviciosBuscadorCache.lista;
      this.$store.commit('clinica/setCacheBusquedaServiciosLista', []);
    }
    if (this.$store.state.clinica.serviciosBuscadorCache.texto.length > 0) {
      this.$store.commit('clinica/setBuscaTablasTexto', this.$store.state.clinica.serviciosBuscadorCache.texto);
      this.$store.commit('clinica/setCacheBusquedaServiciosTexto', '');
    }
    if (this.$store.state.clinica.serviciosBuscadorCache.atributo.length > 0) {
      this.$store.commit('clinica/setBusquedaAtributo', this.$store.state.clinica.serviciosBuscadorCache.atributo);
      this.$store.commit('clinica/setCacheBusquedaServiciosAtributo', '');
    } else {
      this.$store.commit("clinica/setBusquedaAtributo", "Descripcion");
    }
    if (this.$store.state.clinica.serviciosBuscadorCache.atributoIdx > 0) {
      this.$store.commit('clinica/setBusquedaAtributoIdx', this.$store.state.clinica.serviciosBuscadorCache.atributoIdx);
      this.$store.commit('clinica/setCacheBusquedaServiciosAtributoIdx', 0);
    }
    if (this.$store.state.clinica.serviciosBuscadorCache.extendida) {
      this.$store.commit('clinica/setBuscaTablasExtendida', this.$store.state.clinica.serviciosBuscadorCache.extendida);
      this.$store.commit('clinica/setCacheBusquedaServiciosExtendida', false);
    }
    if (this.$store.state.clinica.serviciosBuscadorCache.eliminados) {
      this.$store.commit('clinica/setBuscaTablasEliminados', this.$store.state.clinica.serviciosBuscadorCache.eliminados);
      this.$store.commit('clinica/setCacheBusquedaServiciosEliminados', false);
    }
  },
  destroyed() {
    this.$store.commit('clinica/setCacheBusquedaServiciosLista', this.servicios);
    if (this.$store.state.clinica.tablasBuscador.texto.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaServiciosTexto', this.$store.state.clinica.tablasBuscador.texto);
      this.$store.commit('clinica/setBuscaTablasTexto', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributo.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaServiciosAtributo', this.$store.state.clinica.tablasBuscador.atributo);
      this.$store.commit('clinica/setBusquedaAtributo', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributoIdx > 0) {
      this.$store.commit('clinica/setCacheBusquedaServiciosAtributoIdx', this.$store.state.clinica.tablasBuscador.atributoIdx);
      this.$store.commit('clinica/setBusquedaAtributoIdx', 0);
    }
    if (this.$store.state.clinica.tablasBuscador.extendida) {
      this.$store.commit('clinica/setCacheBusquedaServiciosExtendida', this.$store.state.clinica.tablasBuscador.extendida);
      this.$store.commit('clinica/setBuscaTablasExtendida', false);
    }
    if (this.$store.state.clinica.tablasBuscador.eliminados) {
      this.$store.commit('clinica/setCacheBusquedaServiciosEliminados', this.$store.state.clinica.tablasBuscador.eliminados);
      this.$store.commit('clinica/setBuscaTablasEliminados', false);
    }
  }
}
</script>
