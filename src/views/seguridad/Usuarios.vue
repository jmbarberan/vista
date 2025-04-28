<template>
  <div>
    <b-modal v-model="verEditor" title="Datos del usuario" v-on:ok.prevent="usuarioGuardado();" 
        v-on:cancel="cancelar()" v-on:close="cancelar()">
      <b-form class="av-tooltip mb-5 tooltip-label-right">
        <b-row>
          <b-colxx xxs="12" sm="6">
            <b-form-group :label="$t('vista.ventas.clientes.campos.codigo')">
              <b-form-input type="text" v-model="seleccionado.codigo" :state="!$v.seleccionado.codigo.$error"/>
              <b-form-invalid-feedback>{{ $t('vista.seguridad.usuarios.req-codigo') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-colxx>
          <b-colxx xxs="12" sm="6">
            <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
              <b-form-input type="text" v-model="seleccionado.nombres" :state="!$v.seleccionado.nombres.$error"/>
              <b-form-invalid-feedback>{{ $t('vista.seguridad.usuarios.req-nombre') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-colxx>
          <b-colxx xxs="12" sm="6">
            <b-form-group :label="$t('vista.seguridad.usuarios.campos.clave')">
              <b-input-group>
                <b-form-input v-bind:type="verClave ? 'text' : 'password'" class="form-control" v-model="clave" :state="!$v.clave.$error"/>
                <b-input-group-append>
                  <b-button variant="primary" class="borde-recto" @click="verClave = !verClave">
                    <i :class="verClave ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"/>
                  </b-button>
                </b-input-group-append>
              </b-input-group>  
              <b-form-invalid-feedback>{{ $t('vista.seguridad.usuarios.req-clave') }}</b-form-invalid-feedback>
            </b-form-group>
          </b-colxx>
          <b-colxx xxs="12" sm="6">
            <b-form-group :label="$t('vista.seguridad.usuarios.campos.rol')">
              <b-form-select
                v-model="seleccionado.rol_id"
                :options="roles"
                value-field="id"
                text-field="denominacion"
                size="sm"
              />
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
        <h1>Usuarios</h1>
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
            :items="usuarios"
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
              <span v-if="row.item.estado == 0 && row.item.id > 1"
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
const md5 = require("md5");

export default {
  data() {
    return {
      consultando: false,
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
          label: this.$t("vista.ventas.clientes.campos.codigo"), 
          key: "codigo",
          sortable: true
        },
        { 
          label: this.$t("vista.ventas.clientes.campos.nombres"), 
          key: "nombres",
          sortable: true
        },
        {
          label: this.$t("vista.seguridad.usuarios.campos.rol"), 
          key: "relRol.denominacion", 
          sortable: true 
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          name: "estado",
          sortable: true
        }
      ],
      usuarios: [],
      seleccionado: {
        id: 0,
        codigo: '',
        nombres: '',
        clave: '',
        rol_id: 0,
        estado: 0
      },
      clave: '',
      verEditor: false,
      verClave: false,
      roles: [],
      verEliminados: false
    }
  },
  validations: {
    seleccionado: {
      nombres: {
        required
      },
      codigo: {
        required
      },
      rol_id: {
        required
      },
    },
    clave: {
      required
    }
  },
  computed: {
    total() {
      if (!this.busquedaEjecutando) {
        return this.usuarios.length;
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
      const estado = this.verEliminados ? 9 : 0;
      this.consultando = true;
      this.usuarios = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("seguridad/usuariosPorEstado", estado)
        .then(function(r) {
          if (r) {
            if (r.data != undefined) {
              this.usuarios = r.data;
            }
          }
          if (this.usuarios.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.busqueda.consultando") + this.$t("vista.seguridad.usuarios.denominacionp"), e, 
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
            this.$t("vista.busqueda.consultando") + " " + this.$t("vista.seguridad.usuarios.denominacionp"), 
            this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false });
          this.consultando = false;
        }.bind(this));
    },
    modificar(p) {
      this.seleccionado = JSON.parse(JSON.stringify(p.item));
      this.verEditor = true;
    },
    crear() {
      this.verEditor = true;
    },
    usuarioGuardado() {
      if (this.clave.length > 0) {
        this.seleccionado.clave = md5(this.clave);
      } else {
        if (this.seleccionado.id > 0) {
          this.clave = this.seleccionado.clave;
        }
      }
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning", 
          this.$t("vista.transacciones.guardar-canot"), 
          this.$t("vista.transacciones.guardar-invalido"), 
          { duration: 3000, permanent: false });
      } else {
        // Validar que no este reistrado el nuevo codio id == 0
        this.$store
          .dispatch("seguridad/usuarioGuardar", this.seleccionado)
          .then(function(res) {
            if (res.status <= 201) {
              this.$notify("success", 
                this.$t("vista.comandos.guardar") + " " + this.$t("vista.seguridad.usuarios.denominacion"), 
                res.data, 
                { duration: 3000, permanent: false });
              this.vaciarSeleccionado();
              this.verEditor = false;
              this.clave = '';
              this.listar();
            } else {
              this.$notify("warning", 
                this.$t("vista.comandos.guardar") + " " + this.$t("vista.seguridad.usuarios.denominacion"), 
                res.data, 
                { duration: 3000, permanent: false });
            }
          }.bind(this))
          .catch(function(e) {
            console.log(e);
            let msj = this.$t("vista.transacciones.guardar-error");
            if (e.response.data != undefined);
              msj = e.response.data;
            this.$notify("error", 
              this.$t("vista.comandos.guardar") + this.$t("vista.seguridad.usuarios.denominacion"), 
              msj, 
              { duration: 3000, permanent: false });
          }.bind(this)
        );
      } 
    },
    cancelar() {
      this.clave = '';
      this.vaciarSeleccionado();
    },
    vaciarSeleccionado() {
      this.seleccionado = {
        id: 0,
        codigo: '',
        nombres: '',
        clave: '',
        rol_id: 0,
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
        .dispatch("seguridad/usuarioModificarEstado", { 
          id: pid,
          estado: pest
         })
        .then(function(r) {
          this.$notify("success", cmd + " " + this.$t("vista.seguridad.usuarios.denominacion"), r.data, {
						duration: 3000,
						permanent: false
					});
          this.listar();
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("error", this.$t("vista.error"), e, {
						duration: 3000,
						permanent: false
					});
        }.bind(this));
      this.busquedaEjecutando = false; 
    },
  },
  mounted() {
    this.consultando = true;
    this.$store
      .dispatch("seguridad/rolesTodos")
      .then(function(r) {
        if (r) {
          if (r.data != undefined) {
            this.roles = r.data;
          }
        }
      }.bind(this));
    this.listar();
  }
}
</script>

<style>

</style>