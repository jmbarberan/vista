<template>
  <div>
    <b-modal v-model="selPacienteVer" :title="$t('vista.busqueda.sel') + ' ' + $t('vista.pacientes.denominacion')" v-on:ok="seleccionadoPaciente()">
      <paciente-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="ok()" :disabled="pacienteNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          :titulo="$t('vista.clinica.pacientes.lista-titulo')"
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
            :items="pacientes"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <table-busy :mensaje="$t('vista.busqueda.ejecutandoq') + '...'" />
            </template>
            <template #cell(acciones)="row">
              <span
                class="span-comando mdi mdi-pen mdi-18px mr-2" 
                @click="modificar(row)"
                v-b-tooltip.hover 
                :title="$t('vista.comandos.modificar')"
              />
              <span
                class="span-comando mdi mdi-paperclip mdi-18px" 
                @click="acUnificar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.unificar')"
              />
              <span
                class="span-comando mdi mdi-trash-can-outline mdi-18px" 
                @click="eliminar(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.eliminar')"
              />
            </template>
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.estados.colores.' + parseInt(fila.item.estado))">
                {{ $t('vista.estados.' + parseInt(fila.item.estado)) }}
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
import EncabezadoTablas from "@/containers/views/EncabezadoTablas";
import PacienteSeleccionar from "@/components/Clinica/PacienteSeleccionar";
import { mapGetters } from "vuex"
export default {
  components: {
    "encabezado-tabla": EncabezadoTablas,
    "paciente-seleccionar": PacienteSeleccionar
  },
  data() {
    return {
      orden: "relCliente.nombres",
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
          key: "relCliente.nombres",
          sortable: true
        },
        { 
          label: this.$t("vista.ventas.clientes.campos.cedula"), 
          key: "relCliente.identificacion",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.pacientes.campos.nacimiento"), 
          key: "fecha_nacimiento", 
          sortable: true },
        {
          label: this.$t("vista.clinica.pacientes.campos.ecivil"),
          key: "relEstadoCivil.denominacion",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          sortable: false
        }
      ],
      pacientes: [],
      busquedaAtributos: [
        this.$t("vista.ventas.clientes.campos.nombres"),
        this.$t("vista.ventas.clientes.campos.cedula"),
        this.$t("vista.ventas.clientes.campos.codigo")
      ],
      busquedaEjecutando: false,
      unificar: {
        mantenido: 0,
        removido: 0
      },
      selPacienteVer: false
    }
  },
  computed: {
    ...mapGetters("clinica", [
      "selPaciente",
      'selPacienteTexto'
    ]),
    total() {
      if (!this.busquedaEjecutando) {
        return this.pacientes.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina)
    },
    pacienteNoSeleccionado() {
      return this.selPaciente == null;
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
      this.pacientes = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("clinica/buscarPacientes")
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.pacientes = r.respuesta.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.pacientes.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.comandos.buscar") + " " + this.$t("vista.clinica.pacientes.denominacion"), 
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
            this.$t("vista.comandos.buscar") + " " + this.$t("vista.clinica.pacientes.denominacion"), 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor("pacientes-modificar", p.item.id, p.item);
    },
    crear() {
      this.abrirEditor("pacientes-crear", 0, null);
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
    acUnificar(p) {
      this.unificar.mantenido = p.item.id;
      this.selPacienteVer = true;
    },
    eliminar(p) {
      this.modificarEstado(p.item.id, 2, this.$t("vista.comandos.eliminar"));
    },
    restaurar(p) {
      this.modificarEstado(p.item.id, 0, this.$t("vista.comandos.restaurar"));
    },
    modificarEstado(pid, pest, cmd) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("clinica/pacienteModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.buscar();
          this.$notify("success", cmd + " " + this.$t("vista.clinica.consultas.campos.paciente"),
            r.data,
            { duration: 3000, permanent: false });
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning", cmd + " " + this.$t("vista.clinica.consultas.campos.paciente"),
            this.$t("vista.comandos.fallo") + " " + cmd.toLowerCase() + " este item.",
            { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false;
    },
    seleccionadoPaciente() {
      this.unificar.removido = this.selPaciente.id;
      if (this.unificar.mantenido > 0 && this.unificar.removido > 0) {
        let lotros = [];
        //TODO se debe añadir la posibilidad de seleccionar multiples paciente removidos
        lotros.push(this.unificar.removido);
        this.busquedaEjecutando = true;
        this.$store
          .dispatch("clinica/pacientesUnificar", {
            id: this.unificar.mantenido,
            otros: lotros
          })
          .then(function(r) {
            this.buscar();
            this.$notify("success", 
              this.$t("vista.comandos.unificar") + " " + this.$t("vista.clinica.pacientes.denominacionp"), 
                r.data, 
                { duration: 3000, permanent: false });
          }.bind(this))
          .catch(function(e) {
            console.log("Error");
            console.log(e);
            this.$notify("warning", 
              this.$t("vista.comandos.unificar") + " " + this.$t("vista.clinica.pacientes.denominacionp"), 
              this.$t("vista.comandos.fallo") + " " + this.$t("vista.comandos.unificar") + " " + this.$t("vista.clinica.pacientes.denominacionp") + ".", 
              { duration: 3000, permanent: false });
          }.bind(this));
        this.busquedaEjecutando = false;
      }
    },
  },
  mounted() {
    if (this.$store.state.clinica.pacientesBuscadorCache.lista.length > 0) {
      this.pacientes = this.$store.state.clinica.pacientesBuscadorCache.lista;
      this.$store.commit('clinica/setCacheBusquedaPacientesLista', []);
    }
    if (this.$store.state.clinica.pacientesBuscadorCache.texto.length > 0) {
      this.$store.commit('clinica/setBuscaTablasTexto', this.$store.state.clinica.pacientesBuscadorCache.texto);
      this.$store.commit('clinica/setCacheBusquedaPacientesTexto', '');
    }
    if (this.$store.state.clinica.pacientesBuscadorCache.atributo.length > 0) {
      this.$store.commit('clinica/setBusquedaAtributo', this.$store.state.clinica.pacientesBuscadorCache.atributo);
      this.$store.commit('clinica/setCacheBusquedaPacientesAtributo', '');
    } else {
      this.$store.commit("clinica/setBusquedaAtributo", "Nombres");
    }
    if (this.$store.state.clinica.pacientesBuscadorCache.atributoIdx > 0) {
      this.$store.commit('clinica/setBusquedaAtributoIdx', this.$store.state.clinica.pacientesBuscadorCache.atributoIdx);
      this.$store.commit('clinica/setCacheBusquedaPacientesAtributoIdx', 0);
    }
    if (this.$store.state.clinica.pacientesBuscadorCache.extendida) {
      this.$store.commit('clinica/setBuscaTablasExtendida', this.$store.state.clinica.pacientesBuscadorCache.extendida);
      this.$store.commit('clinica/setCacheBusquedaPacientesExtendida', false);
    }
    if (this.$store.state.clinica.pacientesBuscadorCache.eliminados) {
      this.$store.commit('clinica/setBuscaTablasEliminados', this.$store.state.clinica.pacientesBuscadorCache.eliminados);
      this.$store.commit('clinica/setCacheBusquedaPacientesEliminados', false);
    }
  },
  beforeDestroy() {
    this.$store.commit('clinica/setCacheBusquedaPacientesLista', this.pacientes);
    if (this.$store.state.clinica.tablasBuscador.texto.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaPacientesTexto', this.$store.state.clinica.tablasBuscador.texto);
      this.$store.commit('clinica/setBuscaTablasTexto', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributo.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaPacientesAtributo', this.$store.state.clinica.tablasBuscador.atributo);
      this.$store.commit('clinica/setBusquedaAtributo', '');
    }
    if (this.$store.state.clinica.tablasBuscador.atributoIdx > 0) {
      this.$store.commit('clinica/setCacheBusquedaPacientesAtributoIdx', this.$store.state.clinica.tablasBuscador.atributoIdx);
      this.$store.commit('clinica/setBusquedaAtributoIdx', 0);
    }
    if (this.$store.state.clinica.tablasBuscador.extendida) {
      this.$store.commit('clinica/setCacheBusquedaPacientesExtendida', this.$store.state.clinica.tablasBuscador.extendida);
      this.$store.commit('clinica/setBuscaTablasExtendida', false);
    }
    if (this.$store.state.clinica.tablasBuscador.eliminados) {
      this.$store.commit('clinica/setCacheBusquedaPacientesEliminados', this.$store.state.clinica.tablasBuscador.eliminados);
      this.$store.commit('clinica/setBuscaTablasEliminados', false);
    }
  }
}
</script>