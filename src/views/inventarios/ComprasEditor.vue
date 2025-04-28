<template>
  <div>
    <producto-seleccionar ref="prdSeleccionador" v-on:buscadorProd-seleccionado="productoSeleccionado()"/>
    <b-modal v-model="selProveedorVer" title="Seleccionar cliente" v-on:ok="seleccionadoProveedor()">
      <proveedor-seleccionar/> 
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="success" size="sm" @click="ok()" :disabled="proveedorNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button variant="primery" size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="this.$route.meta.titulo"/>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <b-form class="av-tooltip mb-1 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.transacciones.campos.numero')" class="has-float-label">
                  <b-form-input type="text" v-model="compra.Numero" readonly/>
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
                    v-model="compra.BodegaId"
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
                    v-model="compra.SucursalId"
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
                  <b-form-input type="text" v-model.trim="compra.Notas" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" md="12">
                <h6 class="mb-2">{{ $t('vista.inventarios.compras.campos.datos-proveedor') }}</h6>
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
                          <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') + '...' }}</span>
                        </div>
                      </template>
                      <b-input-group>
                        <b-form-input type="text" 
                          v-model.trim="compra.relProveedor.Identificacion" 
                          @keyup.enter="validarCedula()" 
                          :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.cedula')" 
                          :readonly="lectura"/>
                        <b-input-group-append v-if="!lectura">
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
                      v-model="compra.relProveedor.Nombre" 
                      :state="!$v.compra.relProveedor.Nombre.$error" 
                      :readonly="lectura" 
                      @keyup.enter="buscarProveedor()"
                      :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.nombres')"/>
                    <b-input-group-append v-if="!lectura">
                      <b-button variant="outline-primary" class="borde-recto" @click="buscarProveedor()" title="Ejecutar busqueda">
                        <i class="mdi mdi-magnify"/>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                  <b-form-invalid-feedback>{{ $t('vista.inventarios.compras.validacion.proveedor') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
            </b-row>
            <h6 v-if="!lectura">Agregar productos</h6>
            <div v-if="!lectura">
              <b-row>
                <b-col xxs="12" sm="8" md="12" lg="5">
                  <b-form-group label="Buscar producto" class="has-float-label mb-4">
                    <producto-buscar ref="buscadorPrd" 
                      v-on:buscarProducto-encontrado="productoEncontrado()" 
                      v-on:buscarProducto-saltar="enfocarCantidad()" 
                      v-on:buscarProductos-encontrados="productosEncontrados()" 
                    />
                  </b-form-group>
                </b-col>
                <b-col xxs="12" sm="4" md="4" lg="2">
                  <b-form-group label="Cantidad" class="has-float-label mb-4">
                    <b-form-input type="number" ref="txCantidad" pattern="^\d*(\.\d{0,0})?$" size="sm" v-model.number="productoSeleccion.cantidad" @keyup.enter="pasarFocoDescuento()"/>
                  </b-form-group>  
                </b-col>
                <b-col xxs="12" sm="4" md="4" lg="2">
                  <b-form-group label="% Descuento" class="has-float-label mb-4">
                    <b-form-input type="number" ref="txDescuento" pattern="^\d*(\.\d{0,2})?$" size="sm" v-model.number="productoSeleccion.descuento" @keyup.enter="pasarFocoPrecio()"/>
                  </b-form-group>  
                </b-col>
                <b-col xxs="12" sm="8" md="4" lg="3">
                  <div class="d-flex">
                    <b-form-group :label="$t('vista.inventarios.movimientos.campos.costo')" class="has-float-label mb-4">
                      <b-input-group class="w-100">
                        <b-form-input type="number" ref="txCosto" pattern="^\d*(\.\d{0,2})?$" size="sm" v-model.number="productoSeleccion.costo" @keyup.enter="agregarItem()"/>
                        <b-input-group-append>
                          <b-button variant="outline-primary" class="borde-recto" @click="agregarItem()" title="Agregar item seleccionado" :disabled="itemIncompleto">
                            <i class="mdi mdi-plus"/>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </div>  
                </b-col>
              </b-row>
            </div>
          </b-form>
          <b-table responsive :items="compra.relItems" :fields="itemCampos">
            <template #cell(Acciones)="fila">
              <span v-if="!lectura"
                class="span-comando pt-1"
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
              <b-form-input v-else class="input-tabla-celda text-right" size="sm" v-model.number="fila.item.Descuento"/>
            </template>
            <template #cell(Costo)="fila">
              <div v-if="lectura" style="text-align: right;">
                <span>
                  {{ parseFloat(fila.item.Costo) | dinero }}
                </span>
              </div>
              <b-form-input v-else type="text" pattern="^\d*(\.\d{0,2})?$" 
                class="input-tabla-celda text-right" size="sm" v-model.number="fila.item.Costo" 
              />
            </template>
            <template #cell(Subtotal)="fila">
              <div style="text-align: right;">
                <span v-if="fila.item.Descuento != undefined && parseFloat(fila.item.Descuento) > 0">
                  {{ (parseFloat(fila.item.Cantidad) * parseFloat(fila.item.Costo)) * ((100 - parseFloat(fila.item.Descuento)) / 100) | dinero }}
                </span>
                <span v-else>
                  {{ parseFloat(fila.item.Cantidad) * parseFloat(fila.item.Costo) | dinero }}
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
            <template #head(Costo)="data">
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
            <b-button
              class="flex-inicio"
              size="xs"
              variant="outline-secondary"
              @click="vaciarItems()" 
              :disabled="lectura || compra.relItems.length <= 0"
            ><i class="mdi mdi-delete-sweep"/> {{ $t('vista.transacciones.eliminar-todo') }}</b-button> 
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
          <div class="mt-4">
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
            <b-button ref="btCancelar" :disabled="procesando" @click="cancelar();" variant="primary" class="ml-4">{{ !lectura ? $t('vista.comandos.cancelar') : 'Volver' }}</b-button>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { tipoCompra } from "@/constants/tipos";
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import ProductoBuscador from "@/components/Inventarios/ProductoBuscador";
import ProveedorSeleccionar from "@/components/Maestros/ProveedorSeleccionar";
import { mapGetters } from 'vuex';
import moment from 'moment'
import { getEmpresa } from "../../utils";
const { required } = require("vuelidate/lib/validators");

export default {
  components: {
    Datepicker,
    'producto-seleccionar': ProductoSeleccionar,
    'producto-buscar': ProductoBuscador,
    'proveedor-seleccionar': ProveedorSeleccionar,
  },
  data: function () {
    return {
      es: es,
      compra: {
        Id: 0, 
        Tipo: 0,
        Numero: 0,
        Especie: "",
        ProveedorId: 0,
        Fecha: null, 
        Notas: "", 
        PorcentajeDescuento: 0 ,
        BodegaId: 0,
        Plazo: 0,
        Subtotal: 0,
        SubtotalEx: 0, 
        PorcentajeCompra:0, 
        Descuento: 0,
        Recargo: 0, 
        Flete: 0, 
        Impuestos: 0, 
        Pagos: 0,
        CostoFinal: 0, 
        SucursalId:0,
        Estado: 0,
        relItems: [],
        relImpuestos: [],
        relBodega: null,
        relSucursal: null,
        relProveedor: {
          Id: 0,
          Nombre: '',
          Identificacion: ''
        },
        itemsEliminados: []
      },
      original: null,
      sucursales: [],
      bodegas: [],
      procesando: false,
      lectura: false,
      productoSeleccion: {
        id: 0,
        nombre: "",
        cantidad: 0,
        costo: 0,
        descuento: 0,
        producto: {
          id: 0,
          nombre: '',
          medida: ''
        }
      },
      proveedorSeleccion: {
        id: 0,
        nombre: "",
      },
      selProductoVer: false,
      selProveedorVer: false,
      tipoId: tipoCompra,
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
          sortable: false 
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.cantidad"),
          key: "Cantidad",
          sortable: false
        },
        {
          label: this.$t("vista.ventas.facturas.campos.descuento_porcentaje"),
          key: "Descuento",
          sortable: false
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.costo"),
          key: "Costo",
          sortable: false
        },
        {
          label: this.$t("vista.ventas.facturas.campos.subtotal"),
          key: "Subtotal",
          sortable: false
        }
      ],
      ocupadoCedula: false,
      grabado: false,
      impuestos: 0,
      itemsIndice: 0
    }
  },
  validations: {
    compra: {
      relProveedor: {
        Nombre: {
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
    proveedorNoSeleccionado() {
      return this.selCliente == null; // Usar store de cliente para proveedor
    },
    tituloAccion() {
      return this.lectura ? "Solo lectura" : this.$route.meta.accion
    },
    itemIncompleto() {
      return this.productoSeleccion == null ||
        this.productoSeleccion.producto == null ||
        this.productoSeleccion.cantidad <= 0 ||
        this.productoSeleccion.costo <= 0
    },
    fechaProp: {
      get: function() {
        if (this.compra.Fecha != null)
          return this.$moment(this.compra.Fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.compra.Fecha = v;
      }
    },
    subtotal() {
      if (this.compra.relItems.length > 0) {
        return this.compra.relItems.reduce(
          (acc, item) => acc + 
            (
              item.Descuento != undefined && parseFloat(item.Descuento) > 0 ? 
              (item.Cantidad * item.Costo) * ((100 - item.Descuento) / 100) :
              (item.Cantidad * item.Costo)
            )  
          , 0
        );
      } else {
        return 0
      }
    },
    totalImpuestos() {
      if (this.grabado) {
        if (this.compra.relItems.length > 0) {
          return this.compra.relItems.reduce(
            (acc, item) => acc + 
                item.impuestos
            , 0
          );
        } else {
          return 0;
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
        this.compra.relItems.length <= 0 ||
        this.compra.BodegaId <= 0 ||
        this.compra.ProveedorId <= 0 ||
        this.compra.SucursalId <= 0;
    }
  },
  methods: {
    productoSeleccionado() {
      this.productoSeleccion.id = this.selProducto.Id;
      this.productoSeleccion.producto = this.selProducto;
      this.productoSeleccion.costo = this.selProducto.UltimoCosto;
      this.$store.commit('inventarios/setSelProductoLista', [])
    },
    seleccionadoProveedor() {
      this.proveedorSeleccion.id = this.selCliente.Id; // usar store de cliente en lugar de proveedor
      this.proveedorSeleccion.nombre = this.selCliente.Nombre;
      this.compra.ProveedorId = this.selCliente.Id;
      this.compra.relProveedor = this.selCliente;
    },
    guardar() {
      this.procesando = true;
      if (this.compra.Tipo >= 0 || this.compra.Tipo == undefined)
        this.compra.Tipo = this.tipoId;
      this.compra.SubtotalEx = 0;
      this.compra.Subtotal = this.subtotal;
      this.compra.Impuestos = this.totalImpuestos;
      let imposiciones = [];
      this.compra.relItems.forEach(function(itemCompra) {
        itemCompra.relProducto.relImposiciones.forEach(function(imposicion){
          let itemImpuesto = {
            impuestoId: imposicion.ImpuestoId,
            porcentaje: imposicion.relImpuesto.Porcentaje,
            base: parseFloat(itemCompra.Cantidad) * parseFloat(itemCompra.Costo),
            valor: ((parseFloat(itemCompra.Cantidad) * parseFloat(itemCompra.Costo)) * parseFloat(imposicion.relImpuesto.Porcentaje)) / 100
          }
          imposiciones.push(itemImpuesto);
        });
      });
      var compraImpuestos = [];
      imposiciones.reduce(function(res, value) {
        if (!res[value.impuestoId]) {
          res[value.impuestoId] = { 
            impuestoId: value.impuestoId, 
            porcentaje: value.porcentaje,
            base: 0,
            valor: 0,
          };
          compraImpuestos.push(res[value.impuestoId])
        }
        res[value.impuestoId].base += value.base;
        res[value.impuestoId].valor += value.valor;
        return res;
      }, {});

      let impuestosIns= [];
      impuestosIns = this.compra.relImpuestos.map(item => {
        var ret = compraImpuestos.filter(x => {
          return x.impuestoId == item.ImpuestoId;
        });
        if (ret.length > 0) {
          item.Porcentaje = ret[0].porcentaje,
          item.Base = ret[0].base,
          item.Valor = ret[0].valor
        }
        return item;
      });
      this.compra.relImpuestos = impuestosIns;
      this.$store
        .dispatch("inventarios/compraGuardar", this.compra)
        .then(function(res) {
          if (res.data.cid > 0)
            this.compra = res.data.com;
          this.lectura = true;
          this.iniciarImpuestos();
          if (res.status <= 201) {            
            this.$notify(
              "success",
              this.$t("vista.transacciones.guardando") + " " + this.$t("vista.inventarios.compras.denominacion"),
              res.data.msj,
              { duration: 3000, permanent: false }
            );
          } else {
            this.$notify(
              "warning",
              "Guardando compra",
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
            "error",
            this.$t("vista.transacciones.guardando-reg"),
            msj,
            { duration: 3000, permanent: false }
          );
        }.bind(this)
      );
      this.procesando = false;
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
      this.$refs.txCosto.$el.focus();
      this.$refs.txCosto.$el.select();
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      if (this.original != null) {
        this.compra = this.original;
        this.original = null;
        this.lectura = true;
      } else {
        this.$router.back();
      }
    },
    agregarItem() {
      if (this.productoSeleccion != null && 
        this.productoSeleccion.producto != null && 
        this.productoSeleccion.cantidad > 0 && 
        this.productoSeleccion.costo > 0) 
      {
        let imps = 0;
        if (this.grabado) {
          if (this.productoSeleccion.producto.relImposiciones != undefined) {
            this.productoSeleccion.producto.relImposiciones.forEach(imp => {
              if (imp.relImpuesto != null)
              {
                imps += ((this.productoSeleccion.cantidad * this.productoSeleccion.costo) * imp.relImpuesto.Porcentaje) / 100;
              }
            });
          }
          this.compra.Impuestos += imps;
        }
        let item = {
          Id: 0,
          CompraId: this.compra.Id,
          ProductoId:this.productoSeleccion.id,
          Cantidad: this.productoSeleccion.cantidad,
          Costo: this.productoSeleccion.costo,
          Descuento: this.productoSeleccion.descuento,
          Bodega: this.compra.BodegaId,
          Adicional: 0,
          Bultos: 0,
          Lote: "",
          Expiracion: null,
          BultoCosto: 0,
          relProducto: this.productoSeleccion.producto,
          impuestos: imps,
          indice: this.itemsIndice + 1
        };        
        this.compra.relItems.push(item);
        this.productoSeleccion = {
          id: 0,
          nombre: "",
          cantidad: 0,
          costo: 0,
          descuento: 0,
          producto: {
            id: 0,
            nombre: '',
            medida: ''
          }
        }        
        this.itemsIndice++;
        this.$store.commit('inventarios/setSelProducto', null);
        this.$store.commit('inventarios/setSelProductoTexto', '');
        this.$store.commit('inventarios/setSelProductoLista', []);
        this.$refs.buscadorPrd.enfocarBusqueda();
      }
    },
    eliminarItem(p) {
      if (this.compra.Id > 0) {
        if (p.item.Id > 0) {
          this.compra.itemsEliminados.push(p.item)
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
                imps += ((p.item.Cantidad * p.item.Costo) * imp.relImpuesto.Porcentaje) / 100;
              }
            });
          }
        }
        this.compra.Impuestos -= imps;
      }
      if (this.compra.relItems.length == 1) {
        this.vaciarItems();
      } else {
        if (p.item.indice > 0) {
          var ret = this.compra.relItems.filter(x => {
            return x.indice != p.item.indice;
          });
          this.compra.relItems = ret;  
        } else {
          if (p.item.Id > 0) {
            var ret = this.compra.relItems.filter(x => {
              return x.relProducto.Id != p.item.relProducto.Id;
            });
            this.compra.relItems = ret;  
          }
        }
      }
    },
    productoEncontrado() {
      if (this.selProducto != null) {
        this.productoSeleccion.producto = this.selProducto;
        this.productoSeleccion.id = this.selProducto.Id;
        this.productoSeleccion.costo = this.selProducto.UltimoCosto;
        this.enfocarCantidad();
      }
    },
    productosEncontrados() {
      if (this.selProductoLista.length > 0) {
        this.$refs.prdSeleccionador.cargarLista(true);
      }
    },
    validarCedula() {
      if (!this.lectura) {
        this.ocupadoCedula = true;
        this.$store
          .dispatch("maestros/proveedorPorCedula", this.compra.relProveedor.Identificacion)
          .then(function(r) {
            if (r.status == 200) {
              // TODO presentar lista para elegir si hay mas de un resultado
              this.compra.ProveedorId = r.data[0].Id;
              this.compra.relProveedor = r.data[0];
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
          }.bind(this));
      }
    },
    buscarProveedor() {
      if (!this.lectura && this.compra.relProveedor.Nombre.length > 0) {
        this.$store.commit('maestros/setSelClienteTexto', this.compra.relProveedor.Nombre); // Uso store de cliente en lugar de proveedor
        this.selProveedorVer = true;
      }
    },
    vaciarItems() {
      this.compra.relItems = [];
    },
    modificar() {
      this.original = this.compra;
      this.lectura = false;
    },
    iniciarImpuestos() {
      let idx = 1;
      let itemsCompra = this.compra.relItems.map(item => {
        let impuestosItem = 0;
        if (this.grabado && item.relProducto.relImposiciones != undefined) {
          item.relProducto.relImposiciones.forEach(imp => {
            if (imp.relImpuesto != null) {
              impuestosItem += ((parseFloat(item.Cantidad) * parseFloat(item.Costo)) * parseFloat(imp.relImpuesto.Porcentaje)) / 100;
            }
          });
        }
        item.indice = idx;
        idx++;
        if (this.grabado) {
          item.impuestos = impuestosItem;
        }
        return item;
      });
      this.compra.relItems = itemsCompra;
      this.itemsIndice = idx;
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
    this.$store
      .dispatch("inventarios/bodegasPorEstado", { estado: 0, empresa: getEmpresa().id })
      .then(function(r) {
        this.bodegas = r.data;
        if (this.bodegas.length > 0) {
          this.compra.BodegaId = this.bodegas[0].Id;
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", getEmpresa().id)
      .then(function(r) {
        if (r) {
          this.sucursales = r.data;
          if (this.sucursales.length > 0) {
            this.compra.SucursalId = this.sucursales[0].Id;
          }
        }
      }.bind(this));
    this.tipoId = this.$route.meta.tipo;
    this.compra.Tipo = this.tipoId;
    this.grabado = this.$route.meta.impuestos;
  },
  mounted() {
    if (this.$route.params.dato != null) {
      this.compra = {
        Id: this.$route.params.dato.Id, 
        Tipo: this.$route.params.dato.Tipo,
        Numero: this.$route.params.dato.Numero,
        Especie: this.$route.params.dato.Especie,
        ProveedorId: this.$route.params.dato.ProveedorId,
        Notas: this.$route.params.dato.Notas, 
        PorcentajeDescuento: this.$route.params.dato.PorcentajeDescuento,
        BodegaId: this.$route.params.dato.BodegaId,
        Plazo: this.$route.params.dato.Plazo,
        Subtotal: this.$route.params.dato.Subtotal, 
        SubtotalEx: this.$route.params.dato.SubtotalEx, 
        PorcentajeCompra: this.$route.params.dato.PorcentajeCompra, 
        Descuento: this.$route.params.dato.Descuento,
        Recargo: this.$route.params.dato.Recargo, 
        Flete: this.$route.params.dato.Flete, 
        Impuestos: this.$route.params.dato.Impuestos, 
        Pagos: this.$route.params.dato.Pagos,
        CostoFinal: this.$route.params.dato.CostoFinal, 
        SucursalId: this.$route.params.dato.SucursalId,
        Estado: this.$route.params.dato.Estado,
        relProveedor: this.$route.params.dato.relProveedor,
        relItems: this.$route.params.dato.relItems,
        relImpuestos: this.$route.params.dato.relImpuestos,
        itemsEliminados: []
      };
      if (this.$route.params.dato.Fecha != undefined) {
        try {
          this.fechaProp = this.$moment(this.$route.params.dato.Fecha).toDate();
        } catch(e) {
          this.fechaProp = new moment.utc(this.$route.params.dato.Fecha).toDate();
        }
      } else {
        this.compra.Fecha = null;
      }
      this.iniciarImpuestos();
    } else {
      
      this.fechaProp = this.$moment().format('YYYY-MM-DD');
    }
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }
  }
}
</script>
