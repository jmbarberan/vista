<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado-tabla
          titulo="Lista de empleados"
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
            :items="empleados"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
            </template>
            <template #cell(acciones)="row">
              <span
                class="span-comando mdi mdi-pen mdi-18px mr-2" 
                @click="modificar(row)"
                v-b-tooltip.hover 
                :title="$t('vista.comandos.modificar')"
              />
              <!--span
                class="span-comando mdi mdi-paperclip mdi-18px" 
                @click="verCuentas(row)"
                v-b-tooltip.hover
                :title="$t('vista.comandos.unificar')"
              /-->
              <span
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
          label: "Cedula", 
          key: "cedula",
          sortable: true
        },
        { 
          label: "Nombres", 
          key: "nombres",
          sortable: true
        },
        {
          label: "Cargo",
          key: "relCargo.denominacion",
          sortable: true
        },
        {
          label: "Sueldo", 
          key: "sueldo",
          sortable: true },
        
        {
          label: "Estado",
          key: "Estado",
          name: "estado",
          sortable: true
        }
      ],
      empleados: [],
      busquedaAtributos: [
        this.$t("vista.inventarios.productos.campos.nombre"),
        this.$t("vista.ventas.clientes.campos.cedula")
      ],
      busquedaEjecutando: false
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
      this.empleados = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("nomina/empleadosBuscar")
        .then(function(r) {
          if (r.data != undefined) {
            this.empleados = r.data;
          }
          this.busquedaEjecutando = false;
          if (this.empleados.length <= 0) {
            this.$notify(
              "warning", 
              this.$t("vista.comandos.buscar") + " empleados", 
              this.$t("vista.busqueda.no-encontrado"), 
              { duration: 3000, permanent: false }
            );
          } else {
            this.paginaActual = 1;
            this.cambiarPaginaActual(1);
          }
        }.bind(this))
        .catch(function(e) {
          this.busquedaEjecutando = false;
          this.$notify(
            "warning", 
            this.$t("vista.comandos.buscar") + " empleados", 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false }
          );
        }.bind(this));
    },
    modificar(p) {
      this.abrirEditor("empleados-modificar", p.item.Id, p.item);
    },
    crear() {
      this.abrirEditor("empleados-crear", 0, null);
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
        .dispatch("nominac/productoModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.buscar();
          this.$notify(
            "success", 
            cmd + " empleado", 
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
            cmd + " empleado", 
            this.$t("vista.comandos.fallo") + " " + cmd.toLowerCase() + " empleado", 
            { duration: 3000, permanent: false }
          );
        }.bind(this));
      this.busquedaEjecutando = false; 
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
  mounted() {
    
  },
  beforeDestroy() {
    
  },
}
</script>