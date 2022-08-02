<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          :titulo="$t('vista.clinica.medicos.lista-titulo')"
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
            ref="custom-table"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="medicos"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <table-busy :mensaje="$t('vista.busqueda.ejecutandoq') + '...'" />
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
                title="Modificar"
              />
              <span v-if="row.item.estado == 0"
                class="span-comando mdi mdi-trash-can-outline mdi-18px" 
                @click="eliminar(row)"
                v-b-tooltip.hover
                title="Eliminar"
              />
              <span v-if="row.item.estado == 2"
                class="span-comando mdi mdi-restore mdi-18px" 
                @click="restaurar(row)"
                v-b-tooltip.hover
                title="Restaurar"
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
    "encabezado-tabla": EncabezadoTablas,
  },
  data() {
    return {
      orden: "nombres",
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
          label: this.$t("vista.ventas.clientes.campos.nombres"), 
          key: "nombres",
          sortable: true
        },
        { 
          label: this.$t("vista.ventas.clientes.campos.cedula"), 
          key: "identificacion",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.medicos.campos.registro"), 
          key: "registro_profesional", 
          sortable: true },
        {
          label: this.$t("vista.clinica.medicos.campos.usuario"),
          key: "relUsuario.codigo",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          name: "estado",
          sortable: true
        }
      ],
      medicos: [],
      busquedaAtributos: [
        this.$t("vista.ventas.clientes.campos.nombres"),
        this.$t("vista.ventas.clientes.campos.cedula"),
        this.$t("vista.ventas.clientes.campos.codigo")
      ],
      busquedaEjecutando: false
    }
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.medicos.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina)
    },
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
      this.medicos = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("clinica/buscarMedicos")
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.medicos = r.respuesta.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.medicos.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.comandos.buscar") + " " + this.$t("vista.clinica.medicos.denominacionp"), 
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
            this.$t("vista.comandos.buscar") + " " + this.$t("vista.clinica.medicos.denominacionp"), 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor("medicos-modificar", p.item.id, p.item);
    },
    crear() {
      this.abrirEditor("medicos-crear", 0, null);
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
      this.modificarEstado(p.item.id, 0, this.$t("vista.comandos.restaurar"));
    },
    eliminar(p) {
      this.modificarEstado(p.item.id, 2, this.$t("vista.comandos.eliminar"));
    },
    modificarEstado(pid, pest, cmd) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("clinica/medicoModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.buscar();
          this.$notify("success", cmd + " " + this.$t("vista.clinica.consultas.campos.medico"), 
            r.data, 
            { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          if (cmd == undefined || cmd == null)
            cmd = "Operacion"
          this.$notify("warning", cmd + " " + this.$t("vista.clinica.consultas.campos.medico"), 
            this.$t("vista.comandos.fallo") + " " + cmd.toLowerCase() + " este item.", 
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false; 
    },
  },
  mounted() {
    if (this.$store.state.clinica.medicosBuscadorCache.lista.length > 0) {
      this.medicos = this.$store.state.clinica.medicosBuscadorCache.lista;
      this.$store.commit('clinica/setCacheBusquedaMedicosLista', []);
    }
    if (this.$store.state.clinica.medicosBuscadorCache.texto.length > 0) {
      this.$store.commit('clinica/setBuscaTablasTexto', this.$store.state.clinica.medicosBuscadorCache.texto);
      this.$store.commit('clinica/setCacheBusquedaMedicosTexto', '');
    }
    if (this.$store.state.clinica.medicosBuscadorCache.atributo.length > 0) {
      this.$store.commit('clinica/setBusquedaAtributo', this.$store.state.clinica.medicosBuscadorCache.atributo);
      this.$store.commit('clinica/setCacheBusquedaMedicosAtributo', '');
    } else {
      this.$store.commit("clinica/setBusquedaAtributo", "Nombres");
    }
    if (this.$store.state.clinica.medicosBuscadorCache.atributoIdx > 0) {
      this.$store.commit('clinica/setBusquedaAtributoIdx', this.$store.state.clinica.medicosBuscadorCache.atributoIdx);
      this.$store.commit('clinica/setCacheBusquedaMedicosAtributoIdx', 0);
    }
    if (this.$store.state.clinica.medicosBuscadorCache.extendida) {
      this.$store.commit('clinica/setBuscaTablasExtendida', this.$store.state.clinica.medicosBuscadorCache.extendida);
      this.$store.commit('clinica/setCacheBusquedaMedicosExtendida', false);
    }
    if (this.$store.state.clinica.medicosBuscadorCache.eliminados) {
      this.$store.commit('clinica/setBuscaTablasExtendida', this.$store.state.clinica.medicosBuscadorCache.eliminados);
      this.$store.commit('clinica/setCacheBusquedaMedicosEliminados', false);
    }
  },
  beforeDestroy() {
    this.$store.commit('clinica/setCacheBusquedaMedicosLista', this.medicos);
    if (this.$store.state.clinica.tablasBuscador.texto.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaMedicosTexto', this.$store.state.clinica.tablasBuscador.texto);
      this.$store.commit('clinica/setBuscaTablasTexto', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributo.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaMedicosAtributo', this.$store.state.clinica.tablasBuscador.atributo);
      this.$store.commit('clinica/setBusquedaAtributo', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributoIdx > 0) {
      this.$store.commit('clinica/setCacheBusquedaMedicosAtributoIdx', this.$store.state.clinica.tablasBuscador.atributoIdx);
      this.$store.commit('clinica/setBusquedaAtributoIdx', 0);
    }
    if (this.$store.state.clinica.tablasBuscador.extendida) {
      this.$store.commit('clinica/setCacheBusquedaMedicosExtendida', this.$store.state.clinica.tablasBuscador.extendida);
      this.$store.commit('clinica/setBuscaTablasExtendida', false);
    }
    if (this.$store.state.clinica.tablasBuscador.eliminados) {
      this.$store.commit('clinica/setCacheBusquedaMedicosEliminados', this.$store.state.clinica.tablasBuscador.eliminados);
      this.$store.commit('clinica/setBuscaTablasEliminados', false);
    }
  }
}
</script>
