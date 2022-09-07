<template>
  <div>
    <producto-seleccionar ref="prdSeleccionador" v-on:buscadorProd-seleccionado="productoSeleccionado()"/>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="this.$route.meta.titulo"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.transacciones.datos-generales') }}</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4" lg="3">
                <b-form-group :label="$t('vista.transacciones.campos.numero')" class="has-float-label">
                  <b-form-input type="text" v-model="movimiento.Numero" readonly/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" lg="3">
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
              <b-colxx xxs="12" sm="4" lg="3">
                <b-form-group :label="$t('vista.inventarios.movimientos.campos.bodega')" class="has-float-label">
                  <b-form-select
                    v-model="movimiento.BodegaId"
                    :options="bodegas"
                    value-field="Id"
                    text-field="Denominacion"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" lg="3" class="has-float-label">
                <b-form-group :label="$t('vista.ventas.facturas.campos.sucursal')">
                  <b-form-select
                    v-model="movimiento.SucursalId"
                    :options="sucursales"
                    value-field="Id"
                    text-field="Nombre"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>  
              </b-colxx>
              <b-colxx xxs="12" sm="8" lg="12">
                <b-form-group :label="$t('vista.transacciones.campos.concepto')" class="has-float-label">
                  <b-form-input type="text" v-model.trim="movimiento.Descripcion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
            </b-row>  
            <h6 v-if="!lectura">Agregar productos</h6>
            <div v-if="!lectura">
              <b-row>
                <b-colxx xxs="12" sm="8">
                  <b-form-group label="Producto" class="has-float-label">
                    <producto-buscar ref="buscadorPrd" 
                      v-on:buscarProducto-encontrado="productoEncontrado()" 
                      v-on:buscarProducto-saltar="enfocarCantidad()" 
                      v-on:buscarProductos-encontrados="productosEncontrados()"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="4">                
                  <b-form-group label="Cantidad" class="has-float-label">
                    <b-input-group class="w-100">
                      <b-form-input ref="txCantidad" size="sm" v-model="productoSeleccion.cantidad" :placeholder="$t('vista.inventarios.movimientos.campos.cantidad')"  @keyup.enter="agregarItem()"/>
                      <b-input-group-append>
                        <b-button variant="outline-primary" class="borde-recto" @click="agregarItem()">
                          <i class="mdi mdi-plus"/>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-colxx>
              </b-row>
            </div>
          </b-form>
          <b-table responsive :items="movimiento.relItems" :fields="itemCampos">
            <template #cell(acciones)="fila">
              <span
                v-if="!lectura"
                class="span-comando pt-1"
                @click="eliminarItem(fila)"
                v-b-tooltip.hover
                :title="$t('vista.transacciones.eliminar-item')"
              >
                <i class="mdi mdi-trash-can mdi-18px"/>
              </span>
              <div v-else class="invisible"/>
            </template>
            <template #cell(Cantidad)="fila">
              <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.Cantidad"/>
            </template>
            <template #head(Acciones)="data">
              <div v-if="lectura" class="invisible"/>
            </template>
            <template #head(Cantidad)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
          </b-table>
          <b-button
            class="flex-inicio mt-4"
            size="xs"
            variant="outline-secondary"
            @click="vaciarItems()" 
            :disabled="lectura || movimiento.relItems.length <= 0"
          ><i class="mdi mdi-delete-sweep"/> {{ $t('vista.transacciones.eliminar-todo') }}</b-button> 
          <div class="mt-4">
            <b-overlay
              :show="procesando" 
              opacity=0.6
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
              @hidden="ocultaOverlay"
            >
              <b-button v-if="!lectura" ref="btGuardar" :disabled="procesando || itemsVacio" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
            </b-overlay>  
            <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
          </div>
        </b-card>
      </b-colxx>
    </b-row>  
  </div>  
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import ProductoBuscador from "@/components/Inventarios/ProductoBuscador";
import { mapGetters } from 'vuex'
import { getEmpresa } from "../../utils";
export default {
  components: {
    Datepicker,
    'producto-seleccionar': ProductoSeleccionar,
    'producto-buscar': ProductoBuscador
  },
  data: function () {
    return {
      es: es,
      movimiento: {
        Id: 0,
        Tipo: 0,
        Numero: 0,
        Fecha: null,
        BodegaId: 0,
        SucursalId: 1,
        Descripcion: "",        
        Referencia: 0,
        Concepto: 0, 
        Estado: 0,
        relItems: [],
        relBodega: null
      },
      bodegas: [],
      sucursales: [],
      procesando: false,
      lectura: false,
      productoSeleccion: {
        id: 0,
        nombre: "",
        cantidad: 0,
        producto: null
      },
      selProductoVer: false,
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
          label: this.$t("vista.inventarios.productos.campos.nombre"), 
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
        }
      ],
      itemsIndice: 1
    }
  },
  computed: {
    ...mapGetters("inventarios", [
      "selProducto",
      "selProductoLista"
    ]),
    productoNoSeleccionado() {
      return this.selProducto == null;
    },
    tituloAccion() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.movimiento.Id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    fechaProp: {
      get: function() {
        if (this.movimiento.Fecha != null)
          return this.$moment(this.movimiento.Fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.movimiento.Fecha = v;
      }
    },
    itemsVacio() {
      return this.movimiento.relItems == null || this.movimiento.relItems.length <= 0;
    },
  },
  methods: {
    productoSeleccionado() {
      this.productoSeleccion.id = this.selProducto.Id;
      this.productoSeleccion.producto = this.selProducto;
      this.$store.commit('inventarios/setSelProductoLista', []);
    },
    guardar() {
      if (this.movimiento.BodegaId == null || this.movimiento.BodegaId <= 0) {
        this.$notify("danger",
          this.$t("vista.comandos.guardar"),
          this.$t("vista.inventarios.sel-bodega"),
          { duration: 3000, permanent: false });
        this.procesando = false;
      } else {
        this.procesarGuardado();
        this.procesando = false;
      }
    },
    enfocarCantidad() {
      this.$nextTick(function() {
        this.$refs.txCantidad.$el.focus();
        this.$refs.txCantidad.$el.select();
      }.bind(this));
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.lectura = true;
      this.$router.back();
    },
    procesarGuardado() {
      this.$store
        .dispatch("inventarios/movimientoGuardar", this.movimiento)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify("success",
              this.$t("vista.transacciones.guardando-reg"),
              res.data.msj,
              { duration: 3000, permanent: false });
            this.lectura = true;
            this.$router.back();
          } else {
            this.$notify("warning",
              this.$t("vista.transacciones.guardar-reg"),
              res.data.msj,
              { duration: 3000, permanent: false });
            this.procesando = false;  
          }
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = this.$t("vista.transacciones.guardar-error");
          console.log(e)
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.$notify("danger",
            this.$t("vista.comandos.guardar"),
            msj,
            { duration: 3000, permanent: false });  
        }.bind(this)
      );
    },
    agregarItem() {
      if (this.productoSeleccion != null && 
        this.productoSeleccion.producto != null && 
        this.productoSeleccion.cantidad > 0)  
      {
        let item = {
          Id: 0,
          KardexId: this.movimiento.Id,
          ProductoId: this.productoSeleccion.id,
          Cantidad: this.productoSeleccion.cantidad,
          Costo: 0,
          relProducto: this.productoSeleccion.producto,
          indice: this.itemsIndice + 1
        };
        this.movimiento.relItems.push(item);
        this.productoSeleccion = {
          cantidad: 0,
          nombre: "",
          indicaciones: "",
          productoid: 0,
          producto: null
        };
        this.itemsIndice++;
        this.$store.commit('inventarios/setSelProducto', null);
        this.$store.commit('inventarios/setSelProductoTexto', '');
        this.$store.commit('inventarios/setSelProductoLista', []);
        this.$refs.buscadorPrd.enfocarBusqueda();
      }
    },
    eliminarItem(p) {
      if (this.movimiento.relItems.length == 1) {
        this.vaciarItems();
      } else {
        if (p.item.indice > 0) {
          var ret = this.movimiento.relItems.filter(x => {
            return x.indice != p.item.indice;
          });
          this.movimiento.relItems = ret;  
        } else {
          if (p.item.Id > 0) {
            var ret = this.movimiento.relItems.filter(x => {
              return x.relProducto.Id != p.item.relProducto.Id;
            });
            this.movimiento.relItems = ret;  
          }
        }
      }
    },
    productoEncontrado() {
      if (this.selProducto != null) {
        this.productoSeleccion.producto = this.selProducto;
        this.productoSeleccion.id = this.selProducto.Id;
        this.enfocarCantidad();
      }
    },
    productosEncontrados() {
      if (this.selProductoLista.length > 0) {
        this.$refs.prdSeleccionador.cargarLista(true);
      }
    },
    vaciarItems() {
      this.movimiento.relItems = [];
    },
    prevenirSalida(e) {
      if (this.lectura) return
      e.preventDefault();
      e.returnValue = "";
    },
    indexarItems() {
      let idx = 1;
      let itemsMov = this.movimiento.relItems.map(item => {
        item.indice = idx;
        idx++;
        return item;
      });
      this.movimiento.relItems = itemsMov;
      this.itemsIndice = idx;
    }
  },
  created() {
    this.$store
      .dispatch("inventarios/bodegasPorEstado", { estado: 0, empresa: getEmpresa().id})
      .then(function(r) {
        this.bodegas = r.data;
        if (this.bodegas.length > 0) {
          if (this.movimiento.BodegaId == 0)
            this.movimiento.BodegaId = this.bodegas[0].Id;
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", getEmpresa().id)
      .then(function(r) {
        if (r) {
          this.sucursales = r.data;
          if (this.sucursales.length > 0) {
            if (this.movimiento.SucursalId == 0)
              this.movimiento.SucursalId = this.sucursales[0].Id;
          }
        }
      }.bind(this));  
     this.movimiento.Tipo = this.$route.meta.tipo; 
  },
  mounted() {
    if (this.$route.params.id > 0) {
      this.movimiento = {
        Id: this.$route.params.dato.Id,
        Tipo: this.$route.params.dato.Tipo,
        Numero: this.$route.params.dato.Numero,
        BodegaId: this.$route.params.dato.BodegaId,
        Descripcion: this.$route.params.dato.Descripcion,
        SucursalId: this.$route.params.dato.SucursalId,
        Referencia: this.$route.params.dato.Referencia,
        Fecha: this.$route.params.dato.Fecha, 
        Concepto: this.$route.params.dato.Concepto,
        Estado: this.$route.params.dato.Estado,
        relItems: this.$route.params.dato.relItems,
        //relBodega: this.$route.params.dato.relBodega
      };
      if (this.$route.params.dato.Fecha != undefined) {
        try {
          this.fechaProp = this.$moment(this.movimiento.Fecha).toDate();
        } catch(e) {
          this.fechaProp = new moment.utc(this.movimiento.Fecha).toDate();
        }
      } else {
        this.movimiento.Fecha = null;
      }
      this.indexarItems();
    } else {
      this.fechaProp = this.$moment(new Date()).format('YYYY-MM-DD');
    }
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.prevenirSalida)
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.prevenirSalida)
    })
  },
  beforeRouteLeave (to, from, next) {
    if (!this.lectura) {
      if (!window.confirm("Desea salir sin guardar?")) {
        return
      }
    }
    next();
  }
}
</script>
