<template>
  <div>
    <producto-seleccionar ref="prdSeleccionador" v-on:buscadorProd-seleccionado="productoSeleccionado()"/>
    <cliente-seleccionar  ref="cliSeleccionador" v-on:buscadorCli-seleccionado="clienteSeleccionado"/>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="this.$route.meta.titulo"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <b-form class="av-tooltip mb-2 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.transacciones.campos.numero')" class="has-float-label">
                  <b-input-group>
                    <b-form-input type="text" v-model="venta.Numero" readonly/>
                    <b-form-input v-show="esSecuencial" type="text" v-model="venta.CERespuestaTipo" readonly/>
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label='$t("vista.transacciones.campos.fecha")' class="has-float-label zindex8">
                  <datepicker
                    class="fecha-md"
                    :bootstrap-styling="true"
                    v-model="fechaProp"
                    :language="es"
                    :disabled="lectura"
                  ></datepicker>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.inventarios.movimientos.campos.bodega')" class="has-float-label">
                  <b-form-select
                    v-model="venta.BodegaId"
                    :options="bodegas"
                    value-field="Id"
                    text-field="Denominacion"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.ventas.facturas.campos.sucursal')" class="has-float-label">
                  <b-form-select
                    v-model="venta.SucursalId"
                    :options="sucursales"
                    value-field="Id"
                    text-field="Nombre"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="8" md="12">
                <b-form-group :label="$t('vista.transacciones.campos.concepto')" class="has-float-label">
                  <b-form-input type="text" v-model.trim="venta.Notas" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="4" lg="4">
                <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')" class="has-float-label">
                  <div>
                    <b-overlay :show="ocupadoCedula" rounded="lg" opacity="0.6">
                      <template #overlay>
                        <div class="d-flex align-items-center">
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <b-spinner type="grow" variant="dark"></b-spinner>
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <!-- SR para lectores de pantallas -->
                          <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') + '...' }}</span>
                        </div>
                      </template>
                      <b-input-group>
                        <b-form-input type="text" 
                          v-model="venta.relCliente.Identificacion" 
                          @keyup.enter="validarCedula()" 
                          :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.cedula')"
                          :readonly="lectura"/>
                        <b-input-group-append v-show="!lectura">
                          <b-button variant="outline-primary" class="borde-recto" @click="validarCedula()" title="Ejecutar busqueda">
                            <i class="mdi mdi-magnify"/>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-overlay>
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="8" md="8" lg="8">
                <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')" class="has-float-label">
                  <b-input-group>
                    <b-form-input type="text" 
                      v-model="venta.relCliente.Nombres" 
                      :state="!$v.venta.relCliente.Nombres.$error" 
                      :readonly="lectura" 
                      @keyup.enter="buscarCliente()" 
                      @keyup.ctrl.stop.prevent="pulsaControl"
                      :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.nombres')"/>
                    <b-input-group-append is-text v-show="!lectura">
                      <input size="sm" type="checkbox" v-model="busquedaClienteAvz" title="Busqueda extendida"/>
                    </b-input-group-append>
                    <b-input-group-append v-show="!lectura">
                      <b-button variant="outline-primary" class="borde-recto" @click="buscarCliente()">
                        <i class="mdi mdi-magnify"/>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                  <b-form-invalid-feedback>{{ $t('vista.ventas.facturas.validacion.cliente') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" md="12">
                <h6 v-if="verDatosCliente" class="mb-2">Datos adicionales del cliente</h6>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group v-if="verDatosCliente" :label="$t('vista.ventas.clientes.campos.tipo-identificacion')" class="has-float-label">
                  <b-form-select v-model="venta.relCliente.IdentificacionTipo"
                    :options="tiposIdentificacion"
                    value-field="Id"
                    text-field="Denominacion"
                    size="xs"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="8">
                <b-form-group v-if="verDatosCliente" :label="$t('vista.ventas.clientes.campos.correo')" class="has-float-label">
                  <b-form-input type="text" v-model="venta.relCliente.Email" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group v-if="verDatosCliente" :label="$t('vista.ventas.clientes.campos.telefonos')" class="has-float-label">
                  <b-form-input type="text" v-model="venta.relCliente.Telefonos" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group v-if="verDatosCliente" :label="$t('vista.ventas.clientes.campos.direccion')" class="has-float-label">
                  <b-form-input type="text" v-model="venta.relCliente.Direccion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
            </b-row>  
            <h6 v-if="!lectura">Agregar productos</h6>
            <div v-if="!lectura">
              <b-row>
                <b-colxx xxs="12" sm="8" md="5" lg="5">
                  <b-form-group label="Buscar producto" class="has-float-label mb-4">
                    <producto-buscar ref="buscadorPrd" 
                      v-on:buscarProducto-encontrado="productoEncontrado()" 
                      v-on:buscarProducto-saltar="enfocarCantidad()"
                      v-on:buscarProductos-encontrados="productosEncontrados()"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="4" md="2" lg="2">
                  <b-form-group :label="$t('vista.inventarios.movimientos.campos.cantidad')" class="has-float-label mb-4">
                    <b-input-group class="w-100">
                      <b-form-input ref="txCantidad" size="sm" 
                        pattern="^\d*(\.\d{0,0})?$" 
                        v-model.number="productoSeleccion.cantidad" 
                        @keyup.enter="pasarFocoDescuento()"
                        @blur="cargarPrecio($event)"
                      />
                      <b-input-group-append is-text>
                        {{ productoSeleccion.existencia }}
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="6" sm="4" md="2" lg="2">
                  <b-form-group :label="$t('vista.ventas.facturas.campos.descuento_porcentaje_min')" class="has-float-label mb-4">
                    <b-form-input ref="txDescuento" size="sm" v-model.number="productoSeleccion.descuento" @keyup.enter="pasarFocoPrecio()"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="8" md="3" lg="3">
                  <div class="d-flex">
                    <b-form-group label="Precio" class="has-float-label mb-4">
                      <b-input-group>
                        <b-form-input ref="txPrecio" 
                          type="number" size="sm" 
                          pattern="^\d*(\.\d{0,2})?$" 
                          v-model.number="productoSeleccion.precio" 
                          @keyup.enter="agregarItem()"
                        />
                        <b-input-group-append>
                          <b-dropdown right size="sm" variant="outline-primary"  class="borde-recto" toggle-class="text-decoration-none" no-caret>
                            <template #button-content>
                                <i class="span-comando mdi mdi-chevron-down"/>
                            </template>
                            <b-dropdown-item v-for="(item, index) in productoSeleccion.precios" :key="index"  @click="seleccionarPrecio(item.Precio)">
                              <div style="text-align: right;">{{ item.Precio | dinero }}</div>
                            </b-dropdown-item>
                          </b-dropdown>
                        </b-input-group-append>
                        <b-input-group-append>
                          <b-button variant="outline-primary" class="borde-recto" @click="agregarItem()" title="Agregar item seleccionado" :disabled="itemIncompleto">
                            <i class="mdi mdi-plus"/>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </div>  
                </b-colxx>
              </b-row>
            </div>
          </b-form>
          <b-table responsive :items="venta.relItems" :fields="itemCampos">
            <template #cell(Acciones)="fila">
              <span v-if="!lectura"
                class="span-comando"
                @click="eliminarItem(fila)"
                v-b-tooltip.hover
                title="Eliminar item"
              >
                <i class="mdi mdi-trash-can mdi-18px"/>
              </span>
              <div v-else class="invisible"/>
            </template>
            <template #cell(Cantidad)="fila">
              <div v-if="lectura" style="text-align: right;">
                <span>
                  {{ fila.item.Cantidad }}
                </span>
              </div>
              <b-form-input v-else type="text" pattern="^\d*(\.\d{0,0})?$" 
                class="input-tabla-celda text-right" size="sm" v-model.number="fila.item.Cantidad"
              />
            </template>            
            <template #cell(Descuento)="fila">
              <div v-if="lectura" style="text-align: right;">
                <span>
                  {{ fila.item.Descuento }}%
                </span>
              </div>
              <b-form-input v-else class="input-tabla-celda text-right" size="sm" v-model="fila.item.Descuento"/>
            </template>
            <template #cell(Precio)="fila">
              <div v-if="lectura" style="text-align: right;">
                <span>
                  {{ parseFloat(fila.item.Precio) | dinero }}
                </span>
              </div>
              <b-form-input v-else type="text" pattern="^\d*(\.\d{0,2})?$" 
                class="input-tabla-celda text-right" size="sm" v-model.number="fila.item.Precio"
              />
            </template>
            <template #cell(Subtotal)="fila">
              <div style="text-align: right;">
                <span v-if="fila.item.Descuento != undefined && parseFloat(fila.item.Descuento) > 0">
                  {{ (parseFloat(fila.item.Cantidad) * parseFloat(fila.item.Precio)) * ((100 - parseFloat(fila.item.Descuento)) / 100) | dinero }}
                </span>
                <span v-else>
                  {{ parseFloat(fila.item.Cantidad) * parseFloat(fila.item.Precio) | dinero }}
                </span>
              </div>
            </template>
            <template v-if="lectura" #head(Acciones)="data">
              <div class="invisible"/>
            </template>
            <template #head(Cantidad)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(Precio)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(Descuento)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(Subtotal)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #empty>
              <h4>{{ $t('vista.transacciones.no-items') }}</h4>
            </template>
          </b-table>
          <hr/>
          <div class="d-flex espaciado">
            <div class="flex-inicio">
              <b-button
                class="mr-4"
                size="xs"
                variant="outline-secondary"
                @click="vaciarItems()" 
                :disabled="lectura || venta.relItems.length <= 0"
              >
                <i class="mdi mdi-delete-sweep"/> {{ $t('vista.transacciones.eliminar-todo') }}
              </b-button> 
              <b-checkbox switch v-if="!lectura"
                v-model="autorizarAlGuardar"
                theme="custom"
                color="primary-inverse"
                class="vue-switcher-small d-md-inline-block align-middle mr-2"
              >Autorizar</b-checkbox>
              <b-checkbox switch v-if="!lectura"
                v-model="imprimirAlGuardar"
                theme="custom"
                color="primary-inverse"
                class="vue-switcher-small d-md-inline-block align-middle"
              >Imprimir</b-checkbox>
            </div>
            <div>
              <div v-if="grabado" style="text-align: right;">
                <span class="font-weight-semibold mr-4">Subtotal</span>
                <span class="font-weight-semibold mr-2">{{ subtotal | dinero }}</span>
              </div>
              <div v-if="grabado" style="text-align: right; margin-top: 8px; margin-bottom: 10px">
                <span class="font-weight-semibold mr-4">Impuestos</span>
                <span class="font-weight-semibold mr-2">{{ totalImpuestos | dinero }}</span>
              </div>
              <div style="text-align: right;">
                <span class="font-weight-semibold mr-4">{{$t('vista.ventas.facturas.campos.total-may')}}</span>
                <span class="font-weight-semibold mr-2">{{ total | dinero }}</span>
              </div>
            </div>            
          </div>
          <div class="mt-2">
            <b-overlay
              :show="procesando" 
              opacity=0.6
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
              @hidden="ocultaOverlay"
            >
              <b-button v-if="!lectura" ref="btGuardar" :disabled="guardarDesactivado" @click="guardar();" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
              <b-button v-else ref="btModificar" @click="modificar();" variant="success" class="ml-4">{{ $t('vista.comandos.modificar') }}</b-button>
            </b-overlay>
            <!--b-button ref="btImprimir" :disabled="procesando" @click="guardarImprimir();" variant="primary" class="ml-4">{{ $t('vista.comandos.imprimir') }}</!b-button-->
            <b-button v-if="!lectura" ref="btCancelar" :disabled="procesando" @click="cancelar();" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
            <!--b-button ref="btNuevo" :disabled="procesando" @click="nuevo();" variant="primary" class="ml-4">{{ $t('vista.comandos.nuevo') }}</b-button-->
          </div>
        </b-card>
      </b-colxx>
    </b-row>
    <div id="prnFactura">
    </div>
  </div>
</template>

<script>
import { tipoFactura } from "@/constants/tipos";
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import ProductoBuscador from "@/components/Inventarios/ProductoBuscador";
import ClienteSeleccionar from "@/components/Maestros/ClienteSeleccionar";
import { mapGetters } from 'vuex';
import moment from 'moment'
import VRuntimeTemplate from "v-runtime-template";
import { getEmpresa } from "../../utils";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    Datepicker,
    'producto-seleccionar': ProductoSeleccionar,
    'producto-buscar': ProductoBuscador,
    'cliente-seleccionar': ClienteSeleccionar,
    VRuntimeTemplate
  },
  data: function () {
    return {
      es: es,
      venta: {
        Id: 0,
        Tipo: 11,
        Numero: 0,
        Fecha: null,
        SucursalId: 1,
        Plazo: 0,
        ClienteId: 0,
        VendedorId: 0,
        Notas: '',
        PorcentajeDescuento: 0,
        PorcentajeVenta: 0,
        Subtotal: 0, 
        SubtotalEx: 0, 
        Descuento: 0, 
        Recargo: 0, 
        Flete: 0, 
        Impuestos: 0, 
        Abonos: 0, 
        AbonosPf: 0, 
        Estado: 0,
        Especie: 0, 
        BodegaId: 0, 
        Comprobante: 0,
        Contado: 0, 
        Operador: '',
        CEClaveAcceso: '',
        CEAutorizacion: '',
        CEAutorizaFecha: null,
        CEContenido: '',
        CEEtapa: 0,
        CERespuestaId: 0,
        CERespuestaTipo: '',
        CERespuestaMsj: '',
        relCliente: {
          Id: 0,
          Nombres: '',
          Identificacion: '',
          TipoIdentificacion: 0,
          Email: '',
          Direccion: '',
          Telefonos: ''
        },
        Comprobante: 0,
        Contado: 0,
        relItems: [],
        relSucursal: null,
        relImpuestos: [],
        itemsEliminados: []        
      },
      original: null,
      sucursales: [],
      bodegas: [],
      operadores: [],
      tiposIdentificacion: [],
      procesando: false,
      lectura: false,
      productoSeleccion: {
        id: 0,
        nombre: "",
        cantidad: 0,
        precio: 0,
        descuento: 0,
        producto: {
          id: 0,
          nombre: '',
          medida: ''
        },
        existencia: '0',
        precios: []
      },
      clienteSeleccion: {
        id: 0,
        nombre: "",
      },
      busquedaClienteAvz: false,
      plantilla: "",
      plantillaCompilada: "",
      selClienteVer: false,
      tipoId: tipoFactura,
      itemCampos: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "Acciones", 
          sortable: false,
        },
        { 
          label: this.$t("vista.inventarios.productos.campos.codigo"), 
          key: "relProducto.Codigo",
          sortable: true
        },
        { 
          label: this.$t("vista.ventas.facturas.campos.producto"), 
          key: "relProducto.Nombre",
          sortable: true
        },
        {
          label: this.$t("vista.inventarios.productos.campos.medida"), 
          key: "relProducto.Medida", 
          sortable: true 
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.cantidad"),
          key: "Cantidad",
          sortable: true
        },
        {
          label: this.$t("vista.ventas.facturas.campos.descuento_porcentaje"),
          key: "Descuento",
          sortable: true
        },
        {
          label: this.$t("vista.ventas.facturas.campos.precio"),
          key: "Precio",
          sortable: true
        },
        {
          label: this.$t("vista.ventas.facturas.campos.subtotal"),
          key: "Subtotal",
          sortable: true
        }
      ],
      ocupadoCedula: false,
      verDatosCliente: false,
      grabado: false,
      itemsIndice: 0,
      ivaIncluido: false,
      autorizarAlGuardar: false,
      imprimirAlGuardar: false
    }
  },
  watch: {
    '$route.path': function(val, oldVal){
      if (val != oldVal)
        this.iniciarComponente();
    }
  },
  validations: {
    venta: {
      relCliente: {
        Nombres: {
          required
        }
      }
    }
  },
  computed: {
    ...mapGetters("inventarios", [
      "selProducto",
      "selProductoLista"
    ]),
    ...mapGetters("maestros", [
      "selCliente"
    ]),    
    productoNoSeleccionado() {
      return this.selProducto == null;
    },
    clienteNoSeleccionado() {
      return this.selCliente == null;
    },
    tituloAccion() {
      return this.lectura ? "Solo lectura" : this.$route.meta.accion
    },
    itemIncompleto() {
      return this.productoSeleccion == null ||
        this.productoSeleccion.producto == null ||
        this.productoSeleccion.cantidad <= 0 ||
        this.productoSeleccion.precio <= 0
    },
    fechaProp: {
      get: function() {
        if (this.venta.Fecha != null)
          return this.$moment(this.venta.Fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.venta.Fecha = v;
      }
    },
    subtotal() {
      if (this.lectura) {
          return parseFloat(this.venta.Subtotal) + (this.venta.SubtotalEx != null ? parseFloat(this.venta.SubtotalEx) : 0.00);
      } else {
        if (this.venta.relItems.length > 0) {
          return this.venta.relItems.reduce(
            (acc, item) => acc + 
              (
                item.Descuento != undefined && parseFloat(item.Descuento) > 0 ? 
                (item.Cantidad * item.Precio) * ((100 - item.Descuento) / 100) :
                (item.Cantidad * item.Precio)
              )  
            , 0
          );
        } else {
          return 0.00
        }
      }
    },
    totalImpuestos() {
      if (this.grabado) {
        if (this.lectura) {
          return this.venta.Impuestos;
        } else {
          if (this.venta.relItems.length > 0) {
            return this.venta.relItems.reduce(
              (acc, item) => acc + 
                  item.impuestos
              , 0
            );
          } else {
            return 0;
          }
        }
      } else {
        return  0;
      }
    },
    total() {
      return parseFloat(this.subtotal) + parseFloat(this.totalImpuestos);
    },
    guardarDesactivado() {
      return this.procesando || 
        this.venta.relItems.length <= 0 || 
        this.venta.BodegaId <= 0 || 
        (this.venta.ClienteId <= 0 && (!this.verDatosCliente || this.venta.relCliente.Nombres.length <= 4)) || 
        this.venta.SucursalId <= 0;
    },
    esSecuencial() {
      return this.venta.CEAutorizaFecha != null;
    }
  },
  methods: {
    pulsaControl(ev) {
      if(ev.keyCode == 114) {
        this.busquedaClienteAvz = !this.busquedaClienteAvz;
      }
    },
    productoSeleccionado() {
      this.productoSeleccion.id = this.selProducto.Id;
      this.productoSeleccion.producto = this.selProducto;
      this.productoSeleccion.precios = this.selProducto.relPrecios;
      if (this.productoSeleccion.precios != undefined) {
        if (this.productoSeleccion.precios.length == 1) {
          this.productoSeleccion.precio = this.selProducto.relPrecios[0].Precio
        }
      } else {
        this.productoSeleccion.precios = []
      }
      this.$store.commit('inventarios/setSelProductoLista', [])
      this.productoSeleccion.existencia = 0;
      this.$store
        .dispatch("inventarios/productoExistencias", {
          id: this.productoSeleccion.id,
          bodega: this.venta.BodegaId
        })
        .then(function(r) {
          if (r.id == 1) {
            let s = "";
            if (r.respuesta.data != undefined) {
              r.respuesta.data.forEach(e => {
                if (s.length > 0) {
                  s += "; " + parseFloat(e.Saldo);
                } else {
                  s = parseFloat(e.Saldo);
                }
              });
              if (s.length <= 0) {
                s = '0';
              }
              this.productoSeleccion.existencia = s;
            }
          }
        }.bind(this));
      //this.enfocarCantidad();
    },
    seleccionadoCliente() {
      this.clienteSeleccion.id = this.selCliente.Id;
      this.clienteSeleccion.nombre = this.selCliente.Nombres;
      this.venta.ClienteId = this.selCliente.Id;
      this.venta.relCliente = this.selCliente;
      // Validar cupo de credito
    },
    guardar() {
      this.procesando = true;
      if (this.venta.Tipo <= 0 || this.venta.Tipo == undefined)
        this.venta.Tipo = this.tipoId;
      this.venta.SubtotalEx = 0;  
      this.venta.Subtotal = this.subtotal;
      this.venta.Impuestos = this.totalImpuestos;
      let imposiciones = [];
      this.venta.relItems.forEach(function(itemVenta) {
        itemVenta.relProducto.relImposiciones.forEach(function(imposicion){
          let itemImpuesto = {
            impuestoId: imposicion.ImpuestoId,
            porcentaje: imposicion.relImpuesto.Porcentaje,
            base: parseFloat(itemVenta.Cantidad) * parseFloat(itemVenta.Precio),
            valor: ((parseFloat(itemVenta.Cantidad) * parseFloat(itemVenta.Precio)) * parseFloat(imposicion.relImpuesto.Porcentaje)) / 100
          }
          imposiciones.push(itemImpuesto);
        });
      });
      var ventaImpuestos = [];
      imposiciones.reduce(function(res, value) {
        if (!res[value.impuestoId]) {
          res[value.impuestoId] = { 
            impuestoId: value.impuestoId, 
            porcentaje: value.porcentaje,
            base: 0,
            valor: 0,
          };
          ventaImpuestos.push(res[value.impuestoId])
        }
        res[value.impuestoId].base += value.base;
        res[value.impuestoId].valor += value.valor;
        return res;
      }, {});

      let impuestosIns= [];
      impuestosIns = this.venta.relImpuestos.map(item => {
        var ret = ventaImpuestos.filter(x => {
          return x.impuestoId == item.ImpuestoId;
        });
        if (ret.length > 0) {
          item.Porcentaje = ret[0].porcentaje,
          item.base = ret[0].base,
          item.Valor = ret[0].valor
        }
        return item;
      });
      this.venta.relImpuestos = impuestosIns;
      if (this.venta.relCliente.Id == 0) {
        this.venta.relCliente.EmpresaId = getEmpresa().id;
      }
      this.$store
        .dispatch("ventas/ventaGuardar", { venta: this.venta, generarCa: this.autorizarAlGuardar, autorizar: this.autorizarAlGuardar })
        .then(function(res) {
          if (res.data.cid > 0)
            this.venta = res.data.ven;
          this.lectura = true;
          this.iniciarImpuestos();
          if (res.status <= 201) {
            if (this.imprimirAlGuardar) {
              this.imprimir();
            }
            this.$notify(
              "success",
              this.$t("vista.transacciones.guardando") + ' ' + this.$t("vista.ventas.facturas.denominacion"),
              res.data.msj,
              { duration: 3000, permanent: false }
            );
          } else {
            this.$notify(
              "warning",
              this.$t("vista.transacciones.guardando") + ' ' + this.$t("vista.ventas.facturas.denominacion"),
              res.data.msj,
              { duration: 3000, permanent: false }
            );
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = this.$t("vista.transacciones.guardar-error");
          if (e.response != undefined && e.response.data != undefined && e.response.data.msj != undefined)
            msj = e.response.msj;
          else {
            if (e.message != undefined) {
              msj = e.message;
            }
          }
          this.$notify(
            "danger",
            this.$t("vista.transacciones.guardando") + ' ' + this.$t("vista.ventas.facturas.denominacion"),
            msj,
            { duration: 3000, permanent: false }
          );
        }.bind(this)
      );
      this.procesando = false;
    },
    imprimir() {
      if (this.venta.relItems.length > 0) {
        // inyectar el html en la etiqueta prnFactura segun la plantilla en db
        this.$htmlToPaper("prnFactura");
      }
    },
    enfocarCantidad() {
      this.$nextTick(function() {
        this.$refs.txCantidad.$el.focus();
        this.$refs.txCantidad.$el.select();
      }.bind(this));
    },
    pasarFocoDescuento() {
      this.$refs.txDescuento.$el.focus();
      this.$refs.txDescuento.$el.select();
    },
    pasarFocoPrecio() {
      this.$refs.txPrecio.$el.focus();
      this.$refs.txPrecio.$el.select();
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      if (this.original != null) {        
        this.venta = this.original;
        this.original = null;
        this.lectura = true; 
      }
      if (this.original == null || 
        this.$route.params.retornable != undefined) 
      {
        this.$router.back();
      }
    },
    agregarItem() {
      if (this.productoSeleccion != null && 
        this.productoSeleccion.producto != null && 
        this.productoSeleccion.cantidad > 0 && 
        this.productoSeleccion.precio > 0) {
        let imps = 0;
        let precioProcesado = this.productoSeleccion.precio;
        if (this.grabado) {
          if (this.productoSeleccion.producto.relImposiciones != undefined) {
            if (this.ivaIncluido) {
              let porcentajeImpuesto = 15;
              if (this.productoSeleccion.producto.relImposiciones.length == 1) {
                let imp = this.productoSeleccion.producto.relImposiciones.at(0);
                porcentajeImpuesto = imp.relImpuesto.Porcentaje;
              }
              let res = (porcentajeImpuesto / 100) + 1;
              precioProcesado /= res; // (p * res) / 100; // TODO Aplicar impuestos incluido en el precio otros impuestos solo
            }
            this.productoSeleccion.producto.relImposiciones.forEach(imp => {
              if (imp.relImpuesto != null)
              {
                imps += ((this.productoSeleccion.cantidad * precioProcesado) * imp.relImpuesto.Porcentaje) / 100;
              }
            });
          }
          this.venta.Impuestos += imps;
        }
        let item = {
          id: 0,
          VentaId: this.venta.Id,
          Bodega: this.venta.BodegaId,
          ProductoId: this.productoSeleccion.id,
          Cantidad: this.productoSeleccion.cantidad,
          Despachado: 0,
          Precio: precioProcesado,
          Costo: 0,
          Descuento: this.productoSeleccion.descuento,
          Adicional: 0,
          relProducto: this.productoSeleccion.producto,
          impuestos: imps,
          indice: this.itemsIndice + 1
        };
        this.venta.relItems.push(item);
        this.productoSeleccion = {
          cantidad: 0,
          nombre: "",
          indicaciones: "",
          productoid: 0,
          precio: 0,
          descuento: 0,
          producto: {
            id: 0,
            nombre: '',
            medida: ''
          },
          existencia: '0'
        };
        this.itemsIndice++;
        this.$store.commit('inventarios/setSelProducto', null);
        this.$store.commit('inventarios/setSelProductoTexto', '');
        this.$store.commit('inventarios/setSelProductoLista', []);
        this.$refs.buscadorPrd.enfocarBusqueda();
      }
    },
    eliminarItem(p) {
      if (this.venta.Id > 0) {
        if (p.item.Id > 0) {
          this.venta.itemsEliminados.push(p.item)
        }
      }
      if (this.grabado) {
        let imps = 0;
        if (p.item.impuestos != undefined) {
          imps = parseFloat(p.item.impuestos);
        } else {
          if (p.item.relProducto.relImposiciones != undefined) {
            p.item.relProducto.relImposiciones.forEach(imp => {
              if (imp.relImpuesto != null) {
                imps += ((p.item.Cantidad * p.item.Precio) * imp.relImpuesto.Porcentaje) / 100;
              }
            });
          }
        }
        this.venta.Impuestos -= imps;
      }
      if (this.venta.relItems.length == 1) {
        this.vaciarItems();
      } else {
        if (p.item.indice > 0) {
          var ret = this.venta.relItems.filter(x => {
            return x.indice != p.item.indice;
          });
          this.venta.relItems = ret;  
        } else {
          if (p.item.Id > 0) {
            var ret = this.venta.relItems.filter(x => {
              return x.relProducto.Id != p.item.relProducto.Id;
            });
            this.venta.relItems = ret;  
          }
        }
      }
    },
    vaciarItems() {
      this.venta.relItems = [];
    },
    validarCedula() {
      if (!this.lectura) {
        this.venta.relCliente.Id = 0;
        this.venta.relCliente.Nombres = '';
        this.venta.relCliente.TipoIdentificacion = 0;
        this.venta.relCliente.Email = '';
        this.venta.relCliente.Direccion = '';
        this.venta.relCliente.Telefonos = '';
        this.ocupadoCedula = true;
        this.$store
          .dispatch("maestros/clientePorCedula", this.venta.relCliente.Identificacion)
          .then(function(r) {
            if (r.status == 200) {
              // presentar lista para elegir si hay mas de un resultado
              if (r.data.length == 1) {
                if (r.data[0].Id > 0) {
                  this.venta.ClienteId = r.data[0].Id;p
                  this.venta.relCliente = r.data[0];
                  this.verDatosCliente = false;
                } else {
                  if (r.data[0].Nombres.length > 0) {
                    this.$notify(
                      "warning",
                      this.$t("vista.transacciones.atencion"),
                      this.$t("vista.ventas.facturas.validacion.cedula-nuevo"),
                      { duration: 3000, permanent: false }
                    );
                    this.ocupadoCedula = false;
                    this.verDatosCliente = true;
                  } 
                }
              } else {
                if (r.data.length > 0) {
                  this.$refs.cliSeleccionador.cargarClientes(r.data, true);
                }
              }
            }
            this.ocupadoCedula = false;
          }.bind(this))
          .catch(function(e) {
            this.$notify(
              "warning",
              this.$t("vista.transacciones.atencion"),
              this.$t("vista.ventas.facturas.validacion.cedula-nuevo"),
              { duration: 3000, permanent: false }
            );
            this.ocupadoCedula = false;
            this.verDatosCliente = true;
          }.bind(this));
      }
    },
    buscarCliente() {
      if (!this.lectura && this.venta.relCliente.Nombres.length > 0) {
        this.$refs.cliSeleccionador.cargarBusqueda(this.venta.relCliente.Nombres, this.busquedaClienteAvz);
      }
    },
    modificar() {
      this.original = this.venta;
      this.lectura = false;
    },
    imprimir() {
      this.$htmlToPaper("prnFactura");
    },
    iniciarImpuestos() {
      let idx = 1;
      let itemsVenta = this.venta.relItems.map(item => {
        let impuestosItem = 0;
        if (this.grabado) {
          if (item.relProducto.relImposiciones != undefined) {
            item.relProducto.relImposiciones.forEach(imp => {
              if (imp.relImpuesto != null) {
                impuestosItem += ((parseFloat(item.Cantidad) * parseFloat(item.Precio)) * parseFloat(imp.relImpuesto.Porcentaje)) / 100;
              }
            });
          }
        }
        item.indice = idx;
        idx++;
        if (this.grabado) {
          item.impuestos = impuestosItem;
        }
        return item;
      });
      this.venta.relItems = itemsVenta;
      this.itemsIndice = idx;
    },
    clienteSeleccionado(cli) {
      this.venta.relCliente = cli;
      this.venta.ClienteId = cli.Id;
      this.verDatosCliente = false;
    },
    productoEncontrado() {
      if (this.selProducto != null) {
        this.productoSeleccion.producto = this.selProducto;
        this.productoSeleccion.id = this.selProducto.Id;
        this.productoSeleccion.precios = this.selProducto.relPrecios;
        if (this.productoSeleccion.precios.length == 1) {
          this.productoSeleccion.precio = this.productoSeleccion.precios[0].Precio;
        }
        this.enfocarCantidad();
      }
    },
    productosEncontrados() {
      if (this.selProductoLista.length > 0) {
        this.$refs.prdSeleccionador.cargarLista(true);
      }
    },
    cargarPrecio(event) {
      if (this != null && !this.lectura) {
        if (this.productoSeleccion.precios.length === 1) {
          this.productoSeleccion.precio = this.productoSeleccion.precios[0].Precio;
        } else {
          if (this.productoSeleccion.precios.length > 0) {
            let cantidad = this.productoSeleccion.cantidad;
            let preItem = this.productoSeleccion.precios.filter(function(item) {
              return item.VolumenCondicion <= cantidad;
            })
            if (preItem.length > 0) {
              const precioFiltrado = preItem.reduce(function(prev, current) {
                  return (prev && prev.y > current.y) ? prev : current
              })
              if (precioFiltrado != null)
                this.productoSeleccion.precio = precioFiltrado.Precio;
            }
          }
        }
      }
    },
    seleccionarPrecio(p) {
      try {
        this.productoSeleccion.precio = parseFloat(p);
      } catch (ex) {
        this.productoSeleccion.precio = 0;
      }
    },
    iniciarComponente() {
      if (this.$route.params.dato != null) {
        this.venta = {
          Id: this.$route.params.dato.Id,
          Tipo: this.$route.params.dato.Tipo,        
          Numero: this.$route.params.dato.Numero,
          Fecha: this.$route.params.dato.Fecha,
          Notas: this.$route.params.dato.Notas,
          SucursalId: this.$route.params.dato.SucursalId,
          Especie: this.$route.params.dato.Especie,
          Plazo: this.$route.params.dato.Plazo,
          ClienteId: this.$route.params.dato.ClienteId,
          VendedorId: this.$route.params.dato.VendedorId,
          PorcentajeDescuento: this.$route.params.dato.PorcentajeDescuento,
          PorcentajeVenta: this.$route.params.dato.PorcentajeVenta,
          Subtotal: this.$route.params.dato.Subtotal, 
          Subtotalex: this.$route.params.dato.Subtotalex, 
          Descuento: this.$route.params.dato.Descuento, 
          Recargo: this.$route.params.dato.Recargo, 
          Flete: this.$route.params.dato.Flete, 
          Impuestos: this.$route.params.dato.Impuestos, 
          Abonos: this.$route.params.dato.Abonos, 
          AbonosPf: this.$route.params.dato.AbonosPf, 
          Estado: this.$route.params.dato.Estado,
          BodegaId: this.$route.params.dato.BodegaId, 
          Comprobante: this.$route.params.dato.Comprobante, 
          CEAutorizaFecha: this.$route.params.dato.CEAutorizaFecha,
          CEClaveAcceso: this.$route.params.dato.CEClaveAcceso,
          CERespuestaTipo: this.$route.params.dato.CERespuestaTipo,
          Operador: this.$route.params.dato.Operador,
          Estado: this.$route.params.dato.Estado,
          Contado: this.$route.params.dato.Contado,
          relCliente: this.$route.params.dato.relCliente,
          relItems: this.$route.params.dato.relItems,
          relImpuestos: this.$route.params.dato.relImpuestos,
          itemsEliminados: []
        };
        if (this.$route.params.dato.Fecha != undefined) {
          try {
            this.fechaProp = this.$moment(this.venta.Fecha).toDate();
          } catch(e) {
            this.fechaProp = new moment.utc(this.venta.Fecha).toDate();
          }
        } else {
          this.venta.Fecha = null;
        }
        this.iniciarImpuestos();
      } else {
        if (this.$route.params.id == 0 || this.$route.params.id == undefined) {
          this.venta = {
            Id: 0,
            Tipo: 11,
            Numero: 0,
            Fecha: null,
            SucursalId: 1,
            Plazo: 0,
            ClienteId: 0,
            VendedorId: 0,
            Notas: '',
            PorcentajeDescuento: 0,
            PorcentajeVenta: 0,
            Subtotal: 0, 
            SubtotalEx: 0, 
            Descuento: 0, 
            Recargo: 0, 
            Flete: 0, 
            Impuestos: 0, 
            Abonos: 0, 
            AbonosPf: 0, 
            Estado: 0,
            Especie: 0, 
            BodegaId: 0, 
            Comprobante: 0,
            Contado: 0, 
            Operador: '',
            CEClaveAcceso: '',
            CEAutorizacion: '',
            CEAutorizaFecha: null,
            CEContenido: '',
            CEEtapa: 0,
            CERespuestaId: 0,
            CERespuestaTipo: '',
            CERespuestaMsj: '',
            relCliente: {
              Id: 0,
              Nombres: '',
              Identificacion: '',
              TipoIdentificacion: 0,
              Email: '',
              Direccion: '',
              Telefonos: ''
            },
            Comprobante: 0,
            Contado: 0,
            relItems: [],
            relSucursal: null,
            relImpuestos: [],
            itemsEliminados: []
          }
          this.fechaProp = this.$moment().format('YYYY-MM-DD');
        }
      } 
      if (this.$route.params.lectura != undefined) {
        this.lectura = this.$route.params.lectura;
      } else {
        this.lectura = false;
      }
    }
  },
  filters: {
    dinero(val) {
      if (!val) {
        return '0.00';
      }

      try {
        return val.toFixed(2);
      } catch {
        return val;
      }
    }
  },
  created() {
    let empresaId = getEmpresa().id
    this.$store
       .dispatch("inventarios/bodegasPorEstado", { estado: 0, empresa: empresaId})
      .then(function(r) {
        this.bodegas = r.data;
        if (this.bodegas.length > 0) {
          this.venta.BodegaId = this.bodegas[0].Id;
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", getEmpresa().id)
      .then(function(r) {
        if (r) {
          this.sucursales = r.data;
          if (this.sucursales.length > 0) {
            this.venta.SucursalId = this.sucursales[0].Id;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 12 // Tipos de identificacion
      }).then(function(r) {
        if (r) {
          this.tiposIdentificacion = r.respuesta.data;
        }
      }.bind(this)); 
    this.$store
      .dispatch("ajustes/registroPorTablaIndice", {
        id: 5, // Configuraciones
        indice: 17 // Precios incluyen iva
      }).then(function(r) {
        if (r) {
          this.ivaIncluido = r.respuesta.data.Contenedor == 1;
        }
      }.bind(this)); 
      
    if (this.$route.params.id != undefined && this.$route.params.id != null && this.$route.params.id > 0) {
      // traer venta por el id si el id es distinto a cero
      this.$store
      .dispatch("ventas/ventaPorId", this.$route.params.id)
      .then(function(r) {
        if (r.data) {
          this.venta = {
            Id: r.data.Id,
            Tipo: r.data.Tipo,        
            Numero: r.data.Numero,
            Fecha: r.data.Fecha,
            Notas: r.data.Notas,
            SucursalId: r.data.SucursalId,
            Especie: r.data.Especie,
            Plazo: r.data.Plazo,
            ClienteId: r.data.ClienteId,
            VendedorId: r.data.VendedorId,
            PorcentajeDescuento: r.data.PorcentajeDescuento,
            PorcentajeVenta: r.data.PorcentajeVenta,
            Subtotal: r.data.Subtotal, 
            Subtotalex: r.data.Subtotalex, 
            Descuento: r.data.Descuento, 
            Recargo: r.data.Recargo, 
            Flete: r.data.Flete, 
            Impuestos: r.data.Impuestos, 
            Abonos: r.data.Abonos, 
            AbonosPf: r.data.AbonosPf, 
            Estado: r.data.Estado,
            BodegaId: r.data.BodegaId, 
            Comprobante: r.data.Comprobante,
            CEAutorizaFecha: r.data.CEAutorizaFecha,
            CEClaveAcceso: r.data.CEClaveAcceso,
            CERespuestaTipo: r.data.CERespuestaTipo,
            Operador: r.data.Operador,
            Estado: r.data.Estado,
            Contado: r.data.Contado,
            relCliente: r.data.relCliente,
            relItems: r.data.relItems,
            relImpuestos: r.data.relImpuestos,
            itemsEliminados: []
          };
          if (r.data.Fecha != undefined) {
            try {
              this.fechaProp = this.$moment(this.venta.Fecha).toDate();
            } catch(e) {
              this.fechaProp = new momenverDatosClienteverDAtost.utc(this.venta.Fecha).toDate();
            }
          } else {
            this.venta.Fecha = null;
          }
          this.tipoId = r.data.Tipo;
          this.grabado = this.tipoId == tipoFactura;
          this.iniciarImpuestos();
        }
      }.bind(this))
      .catch((e) => {
        console.log(e);
      });
    } else {
      this.tipoId = this.$route.meta.tipo;
      this.venta.Tipo = this.tipoId;
      this.grabado = this.$route.meta.grabado;
    }
  },
  mounted() {
    this.iniciarComponente();
  }
}
</script>

