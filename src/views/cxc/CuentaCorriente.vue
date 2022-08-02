<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>Cuenta corriente</h1>
        <piaf-breadcrumb />
        <cliente-seleccionar ref="cliSeleccionador" v-on:buscadorCli-seleccionado="clienteSeleccionado"/>
        <div class="mb-2">
          <div class="d-block d-md-inline-block">
            <b-dropdown
            id="ddTipoBusca"
            :text="`${$t('vista.busqueda.etiqueta')} ${tipoBusca}`"
            variant="outline-primary"
            class="mr-2 float-md-left btn-group mt-1 inline-vertical-middle"
            size="xs"
          >
            <b-dropdown-item v-for="(atrib, index) in busquedaAtributos" :key="index" @click="busquedaCambiarAtributo(atrib)">
              {{ atrib }}
            </b-dropdown-item>
          </b-dropdown>
          <div class="search-sm d-inline-block float-md-left mr-1 mt-1 inline-vertical-middle">
            <b-overlay :show="clienteBuscando" rounded="lg" opacity="0.6">
              <template #overlay>
                <div class="d-flex align-items-center">
                  <b-spinner small type="grow" variant="secondary"></b-spinner>
                  <b-spinner type="grow" variant="dark"></b-spinner>
                  <b-spinner small type="grow" variant="secondary"></b-spinner>
                  <!-- SR para lectores de pantallas -->
                  <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') + '...' }}</span>
                </div>
              </template>
              <b-form-input v-model="busquedaTexto" placeholder="Seleccionar cliente" @keyup.enter="buscarCliente()"/>
            </b-overlay>
          </div>
            <a v-if="cliente != null"
              class="d-inline-block float-md-left ml-3 view-icon boton-comando inline-vertical-middle"
              @click="limpiarCliente()"
              v-b-tooltip.hover 
              title="Quitar cliente seleccionado"
            >
              <i class="mdi mdi-24px mdi-account-remove-outline"/>
            </a>
            <a v-else
              class="d-inline-block float-md-left ml-3 view-icon boton-comando inline-vertical-middle"
              @click="buscarCliente()"
              v-b-tooltip.hover 
              title="Buscar cliente"
            >
              <i class="mdi mdi-24px mdi-account-search-outline"/>
            </a>
            <a 
              class="d-inline-block float-md-left ml-3 view-icon boton-comando inline-vertical-middle"
              @click="buscar()"
              v-b-tooltip.hover 
              :title="$t('vista.comandos.actualizar') + ' ' + $t('vista.busqueda.resultados')"
            >
              <i class="mdi mdi-24px mdi-find-replace"/>
            </a>
            <a 
              class="d-inline-block float-md-left ml-3 view-icon boton-comando inline-vertical-middle"
              @click="imprimir()"
              v-b-tooltip.hover 
              :title="$t('vista.comandos.imprimir')"
            >
              <i class="mdi mdi-24px mdi-printer"/>
            </a>
            <b-dropdown
              id="ddSucursal"
              :text="sucursalSel.nombre"
              variant="outline-primary"
              class="d-md-inline-block align-middle btn-group inline-vertical-middle ml-4"
              size="xs"
            >
              <b-dropdown-item v-for="item in sucursales" :key="item.Id" @click="seleccionarSucursal(item)">
                {{ item.Nombre }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>    
      </b-colxx>
    </b-row>
    <b-row id="prnDiario">
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <h5>Cuenta corriente de clientes</h5>
          <b-table
            responsive
            ref="custom-table"
            class="vuetable"
            :fields="columnas"
            :items="deudas"
            :busy="busquedaEjecutando"
            foot-clone
            no-footer-sorting
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
            </template>
            <template #row-details="data">
              <b-table
                small
                borderless
                :fields="columnasDetails"
                :items="data.item.details"
                foot-clone
                no-footer-sorting
              >
                <template #head(Tipo)="detail">
                  <div>
                    <span>{{ detail.label }}</span>
                  </div>
                </template>
                <template #cell(Tipo)="detail">
                  <div style="text-align: left;">
                    {{ detail.item.Tipo | tipo }}
                  </div>
                </template>
                <template #foot(Tipo)>
                  <div style="display: none"/>
                </template>
                <template #cell(Numero)="detail">
                  <div style="text-align: left; cursor: pointer;">
                    <a @click="abrirTransaccion(detail.item)">{{ detail.item.Numero }}</a>
                  </div>
                </template>
                <template #foot(Numero)>
                  <div style="display: none"/>
                </template>
                <template #head(Fecha)="detail">
                  <div style="text-align: center;">
                    {{ detail.label }}
                  </div>
                </template>
                <template #cell(Fecha)="detail">
                  <div style="text-align: center;">
                    {{ $moment(detail.item.Fecha).format('YYYY-MM-DD') }}
                  </div>
                </template>
                <template #foot(Fecha)>
                  <div style="text-align: right; font-weight: bold;">
                    TOTAL
                  </div>
                </template>
                <template #head(Total)="detail">
                  <div style="text-align: right;">
                    {{ detail.label }}
                  </div>
                </template>
                <template #cell(Total)="detail">
                  <div style="text-align: right;">
                    {{ parseFloat(detail.item.Total) | dinero }}
                  </div>
                </template>
                <template #foot(Total)>
                  <div style="text-align: right;">
                    {{ parseFloat(data.item.Total) | dinero }}
                  </div>
                </template>
                <template #head(Cobros)="detail">
                  <div style="text-align: right;">
                    {{ detail.label }}
                  </div>
                </template>
                <template #cell(Cobros)="detail">
                  <div style="text-align: right;">
                    {{ parseFloat(detail.item.Cobros) | dinero }}
                  </div>
                </template>
                <template #foot(Cobros)>
                  <div style="text-align: right;">
                    {{ parseFloat(data.item.Cobros) | dinero }}
                  </div>
                </template>
                <template #head(Saldo)="detail">
                  <div style="text-align: right;">
                    {{ detail.label }}
                  </div>
                </template>
                <template #cell(Saldo)="detail">
                  <div style="text-align: right;">
                    {{ parseFloat(detail.item.Total) - parseFloat(detail.item.Cobros) | dinero }}
                  </div>
                </template>                
                <template #foot(Saldo)>
                  <div style="text-align: right; font-weight: bold;">
                    {{ parseFloat(data.item.Total) - parseFloat(data.item.Cobros) | dinero }}
                  </div>
                </template>
              </b-table>
            </template>
            <template #cell(Acciones)="data">
              <span
                class="span-comando"
                @click="data.toggleDetails"
                v-b-tooltip.hover
                :title="data.detailsShowing ? 'Ocultar transacciones' : 'Mostrar transacciones'"
              >
                <i :class="data.detailsShowing ? 'mdi mdi-chevron-double-up mdi-18px' : 'mdi mdi-chevron-double-down mdi-18px'"/>
              </span>
            </template>
            <template #foot(Acciones)>
              <div style="display: none"/>
            </template>
            <template #foot(relCliente.Nombres)>
              <div style="text-align: right; font-weight: bold;">
                TOTALES
              </div>
            </template>
            <template #head(Total)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #cell(Total)="data">
              <div style="text-align: right;">
                {{ parseFloat(data.item.Total) | dinero }}
              </div>
            </template>
            <template #foot(Total)>
              <div style="text-align: right;">
                {{ totalDeuda | dinero }}
              </div>
            </template>
            <template #head(Cobros)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #cell(Cobros)="data">
              <div style="text-align: right;">
                {{ parseFloat(data.item.Cobros) | dinero }}
              </div>
            </template>
            <template #foot(Cobros)>
              <div style="text-align: right;">
                {{ totalCobros | dinero }}
              </div>
            </template>
            <template #head(Saldo)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #cell(Saldo)="data">
              <div style="text-align: right;">
                {{ parseFloat(data.item.Total) - parseFloat(data.item.Cobros) | dinero }}
              </div>
            </template>
            <template #foot(Saldo)>
              <div style="text-align: right; font-weight: bold;">
                {{ totalSaldo | dinero }}
              </div>
            </template>
          </b-table>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import {es} from 'vuejs-datepicker/dist/locale'
import { tipoDenominacion } from "@/constants/tipos";
import ClienteSeleccionar from "@/components/Maestros/ClienteSeleccionar";
import { mapGetters } from 'vuex';
import { tipoFactura } from '../../constants/tipos';

export default {
  components: {
    'cliente-seleccionar': ClienteSeleccionar
  },
  data() {
    return {
      es: es,
      busquedaEjecutando: false,
      busquedaAtributos: [
        "Nombres",
        "Cedula",
        "Codigo"
      ],
      tipoBusca: "Nombres",
      busquedaTexto: "",
      deudas: [],
      cliente: null,
      clienteBuscando: false,
      columnas: [
        {
          label: "Acciones", 
          key: "Acciones", 
          sortable: true,
        },        
        {
          label: this.$t("vista.ventas.facturas.campos.cliente"), 
          key: "relCliente.Nombres", 
          sortable: true 
        },
        {
          label: this.$t("vista.ventas.facturas.campos.total"), 
          key: "Total", 
          sortable: true,
        },
        {
          label: "Cobros", 
          key: "Cobros", 
          sortable: true,
        },
        {
          label: "Saldo", 
          key: "Saldo", 
          sortable: true,
        }
      ],
      columnasDetails: [
        {
          label: "Tipo", 
          key: "Tipo",
          sortable: true
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
          label: this.$t("vista.ventas.facturas.campos.total"), 
          key: "Total", 
          sortable: true,
        },
        {
          label: "Cobros", 
          key: "Cobros", 
          sortable: true,
        },
        {
          label: "Saldo", 
          key: "Saldo", 
          sortable: true,
        }
      ],
      sucursales: [],
      sucursalSel: {
        id: 0,
        nombre: "Seleccionar"
      }
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
    },
    tipo(t) {
      return tipoDenominacion(t);
    }
  },
  computed: {
    ...mapGetters("cxc", [  
      "cuentaCorrienteItems"
    ]),
    totalDeuda: function() {
      return this.deudas.reduce(
        (acc, item) => acc + parseFloat(item.Total), 0
      );
    },
    totalCobros: function() {
      return this.deudas.reduce(
        (acc, item) => acc + parseFloat(item.Cobros), 0
      );
    },
    totalSaldo: function() {
      return this.deudas.reduce(
        (acc, item) => acc + (parseFloat(item.Total) - parseFloat(item.Cobros)), 0
      );
    }
  },
  methods: {
    buscar() {
      if (this.sucursalSel != null) {
        this.busquedaEjecutando = true;
        this.deudas = [];
        let cli = this.cliente != null ? this.cliente.Id : 0;
        this.$store
          .dispatch("cxc/cuentaCorriente", { sucursal: this.sucursalSel.id, cliente: cli })
          .then(function(r) {
            if (r.id == 1) {
              if (r.respuesta.data != undefined) {
                // Arreglo de deuda total por cliente como cabeza de grupo
                let deudasClientes = [];
                r.respuesta.data.reduce(function(res, value) {
                  if (!res[value.ClienteId]) {
                    res[value.ClienteId] = { 
                      ClienteId: value.ClienteId, 
                      relCliente: value.relCliente,
                      Total: 0,
                      Cobros: 0,
                      details: []
                    };
                    deudasClientes.push(res[value.ClienteId])
                  }
                  res[value.ClienteId].Total += value.Total != null ? parseFloat(value.Total) : 0;
                  res[value.ClienteId].Cobros += value.Cobros != null ? parseFloat(value.Cobros) : 0;
                  return res;
                }, {});
                // Traer el detalle de transcciones adeudadas y agregar como details
                deudasClientes.forEach((cli, index) => {
                  var dets = r.respuesta.data.filter(function (trn) {
                    return trn.ClienteId == cli.ClienteId;
                  });
                  deudasClientes[index].details = dets;
                });
                this.deudas = deudasClientes;
              }
            }
            this.busquedaEjecutando = false;
            if (this.deudas.length <= 0) {
              this.$notify("warning",
                "Cuenta corriente",
                this.$t("vista.busqueda.no-encontrado"),
                { duration: 3000, permanent: false });
            }
          }.bind(this))
          .catch(function(e) {
            this.busquedaEjecutando = false;
            let msj = "No se pudo ejecutar la consulta";
            if (e.respuesta != undefined && e.respuesta.message != undefined) {
              msj = e.respuesta.message;
            }
            this.$notify("warning",
              "Cuenta corriente",
              msj,
              { duration: 3000, permanent: false }); 
          }.bind(this));
      }
    },
    imprimir() {
      this.$htmlToPaper("prnDiario");
    },
    seleccionarSucursal(suc) {
      this.sucursalSel.id = suc.Id
      this.sucursalSel.nombre = suc.Nombre
    },
    busquedaCambiarAtributo(tipo) {
      this.tipoBusca = tipo;
    },
    buscarCliente() {
      if (this.busquedaTexto.length > 0) {
        this.clienteBuscando = false;
        let atrib = this.tipoBusca;
        atrib = atrib.replace("Cedula", "Identificacion");
        let p = {
          emp: this.$store.state.empresaAccedida.id,
          atrib: atrib,
          estado: 0,
          filtro: this.busquedaTexto
        }
        this.$store
          .dispatch("maestros/clientesBuscar", p)
          .then(function(r) {
            if (r.respuesta.data != undefined) {
              if (r.respuesta.data.length > 0) {
                if (r.respuesta.data.length == 1) {
                  this.cliente = r.respuesta.data[0];
                  this.busquedaTexto = r.respuesta.data[0].Nombres;
                } else {
                  this.$refs.cliSeleccionador.cargarClientes(r.respuesta.data, true);
                }
              }
            }
            this.clienteBuscando = false;
          }.bind(this))
          .catch(function() {
            this.clienteBuscando = false;
          }.bind(this));
      }
    },
    clienteSeleccionado(cli) {
      this.cliente = cli;
      this.busquedaTexto = cli.Nombres;
    },
    limpiarCliente() {
      this.cliente = null;
      this.busquedaTexto = ""; 
    },
    abrirTransaccion(p) {
      let ruta = p.Tipo == tipoFactura ? "facturas-modificar" : "notas-venta-modificar";
      this.$store.commit("cxc/setCuentaCorrienteItems", this.deudas);
      this.$router.push({
        name: ruta,
        params: {
          id: p.Id,
          dato: null,
          tipoId: 0,
          lectura: true,
          retornable: true
        }
      });
    }
  },
  mounted() {
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", this.$store.state.empresaAccedida.id)
      .then(function(r) {
        this.sucursales = r.data
        this.sucursalSel.id = r.data[0].Id
        this.sucursalSel.nombre = r.data[0].Nombre
      }.bind(this));
    if (this.cuentaCorrienteItems.length > 0) {
      this.deudas = this.cuentaCorrienteItems;
    }
  },
}
</script>
