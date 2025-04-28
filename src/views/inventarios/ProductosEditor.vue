<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('vista.inventarios.productos.editor-titulo')"/>
        <div class="separator mb-5"/>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.auto-codigo')">
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      <input type="checkbox" v-model="codigoGenerar" title="Marque para generar un codigo autonúmerico"/>
                    </b-input-group-prepend>
                    <b-form-input type="text" v-model.trim="producto.Codigo"/>
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.codigo-barras')">
                  <b-form-input type="text" v-model.trim="producto.Barcode" class="fondo-transparente-min"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.nombre')">
                  <b-form-input type="text" v-model.trim="producto.Nombre" class="fondo-transparente-min" :state="!$v.producto.Nombre.$error"/>
                  <b-form-invalid-feedback>{{ $t('vista.inventarios.productos.validacion.nombre') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.medida')">
                  <b-form-input type="text" v-model="producto.Medida"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.tipo')">
                  <b-form-select 
                    v-model="producto.Tipo" 
                    :options="tiposProducto"
                    value-field="Id"
                    text-field="Denominacion"
                    size="sm"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.categoria')">
                  <b-form-select 
                    v-model="producto.Grupo" 
                    :options="categorias"
                    value-field="Indice"
                    text-field="Denominacion"
                    size="sm"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group label="Ultimo costo">
                  <b-form-input type="text" pattern="^\d*(\.\d{0,2})?$" v-model.number="producto.UltimoCosto"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group label="Grabado con IVA">
                  <b-checkbox switch v-model="grabado"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12">
                <b-form-group :label="$t('vista.inventarios.productos.campos.descripcion')">
                  <b-form-input type="text" v-model.trim="producto.Descripcion"/>
                </b-form-group>
              </b-colxx>              
            </b-row>
            <hr/>
            <div>
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.facturas.campos.precio-vta')" class="has-float-label">
                    <b-form-input ref="txPrecio" size="sm" v-model.number="precioItem.precio" @keyup.enter="pasarFocoVolumen()"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <div class="d-flex">
                    <b-form-group label="Cantidad" class="has-float-label mb-4 flex-grow-1">
                      <b-input-group class="w-100">
                        <b-form-input ref="txVolumen" size="sm" v-model.number="precioItem.volumen" @keyup.enter="agregarItem()"/>
                        <b-input-group-append>
                            <b-button variant="outline-primary" class="borde-recto" @click="agregarItem()">
                              <i class="mdi mdi-plus"/>
                            </b-button>
                          </b-input-group-append>
                      </b-input-group>
                    </b-form-group>  
                    <span
                      class="span-comando pt-1 flex-shrink-1 ml-3 mr-3"
                      @click="vaciarItems()"
                      v-b-tooltip.hover
                      :title="$t('vista.transacciones.eliminar-todo')"
                    >
                      <i class="mdi mdi-delete-sweep mdi-18px"/>
                    </span>
                  </div>  
                </b-colxx>
              </b-row>
            </div>
            <b-table responsive :items="producto.relPrecios" :fields="itemCampos">
              <template #cell(Acciones)="fila">
                <span
                  class="span-comando pt-1"
                  @click="eliminarItem(fila)"
                  v-b-tooltip.hover
                  title="Eliminar item"
                >
                  <i class="mdi mdi-trash-can mdi-18px"/>
                </span>
              </template>
              <template #cell(Precio)="fila">
                <b-form-input class="input-tabla-celda text-right" pattern="^\d*(\.\d{0,2})?$" size="sm" v-model.number="fila.item.Precio"/>
              </template>
              <template #cell(VolumenCondicion)="fila">
                <b-form-input class="input-tabla-celda text-right" size="sm" v-model.number="fila.item.VolumenCondicion"/>
              </template>
              <template #head(Precio)="data">
                <div style="text-align: right;">
                  <span class="input-tabla-encabezado">{{ data.label }}</span>
                </div>
              </template>
              <template #head(VolumenCondicion)="data">
                <div style="text-align: right;">
                  <span class="input-tabla-encabezado">{{ data.label }}</span>
                </div>
              </template>
              <template #empty>
                <h4>{{ $t('vista.transacciones.no-items') }}</h4>
              </template>
            </b-table>
            <div class="mt-4">
              <b-overlay 
                :show="procesando" 
                opacity=0.6
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
                @hidden="ocultaOverlay"
              >
                <b-button ref="btGuardar" :disabled="procesando" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
              </b-overlay>  
              <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
            </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </div>  
</template>

<script>
import { getEmpresa } from "../../utils";

const { required } = require("vuelidate/lib/validators");
export default {
  data() {
    return {
      producto: {
        Id: 0,
        Codigo: '',
        Barcode: '',
        Nombre: '',
        Grupo: 0,
        Descripcion: '',
        Medida: '',
        Tipo: '',
        UltimoCosto: 0,
        Precio: 0,
        Adicional: 0,
        Referencia: 0,
        Marca: 0,
        Modelo: 0,
        PrecioOrigen: 0,
        EspecieId: 0,
        EmpresaId: getEmpresa().id,
        Exitencia: 0,
        Estado: 0,
        EmbalajeTipo: 0,
        EmbalejeCantidad: 0,
        EmbalajeUnidad: 0,
        EmbalajeVolumen: '',
        relPrecios: [],
        relPreciosEliminados: [],
        relImposiciones: []
      },
      categorias: [],
      tiposProducto: [],
      itemCampos: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "Acciones", 
          sortable: false,
        },
        {
          label: this.$t("vista.ventas.facturas.campos.precio"),
          key: "Precio",
          sortable: false
        },
        {
          label: "Cantidad",
          key: "VolumenCondicion",
          sortable: false
        },
      ],
      procesando: false,
      codigoGenerar: true,
      precioItem: {
        precio: 0,
        volumen: 1,
      },
      secuenciaPrecio: 0
    }
  },
  validations: {
    producto: {
      Nombre: {
        required
      },
      Tipo: {
        required
      },
    }
  },
  methods: {
    pasarFocoVolumen() {
      this.$refs.txVolumen.$el.focus();
      this.$refs.txVolumen.$el.select();
    },
    agregarItem() {
      if (this.precioItem.precio > 0) {
        this.producto.relPrecios.push(
          { 
            Id: 0, 
            Precio: this.precioItem.precio, 
            ProductoId: this.producto.Id, 
            Medida:	"" ,
            MinimoCondicion: this.secuenciaPrecio + 1,
            VolumenCondicion: this.precioItem.volumen
          }
        )
        this.secuenciaPrecio += 1
        this.precioItem.precio = 0
        this.precioItem.volumen = 1
        this.$refs.txPrecio.$el.focus();
        this.$refs.txPrecio.$el.select();
      }
    },
    eliminarItem(p) {
      if (this.producto.relPrecios.length == 1) {
        this.vaciarItems();
      } else {
        if (p.item.Id > 0) {
          this.producto.relPreciosEliminados.push(p.item)
          this.producto.relPrecios = this.producto.relPrecios.filter(x => {
            return x.Id != p.item.Id
          });
        } else {
          this.producto.relPrecios = this.producto.relPrecios.filter(x => {
            return x.MinimoCondicion != p.item.MinimoCondicion
          })
        }
      }
    },
    vaciarItems() {
      if (this.producto.relPrecios.length > 0) {
        this.producto.relPrecios.forEach(pre => {
          if (pre.Id > 0) {
            this.producto.relPreciosEliminados.push({
              Id: pre.Id,
              Precio: pre.Precio
            });
          }
        });
        this.producto.relPrecios = [];
      }
    },
    guardar() {      
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify(
          "warning", 
          this.$t("vista.transacciones.guardar-canot"), 
          this.$t("vista.transacciones.guardar-invalido"), 
          { duration: 3000, permanent: false }
        ); 
      } else {
        this.procesando = true; 
        if (this.producto.Id == 0) { 
          // Validar producto existe
          this.$store 
            .dispatch("inventarios/productoRegistrado", { 
              id: this.producto.Id, 
              codigo: this.producto.Codigo,  
              nombre: this.producto.Nombre })
            .then(function(res) {
              if (res.status == 200) {
                /*if (this.grabado)  {
                  this.producto.Marca = 1;
                  if (this.producto.relImposiciones.length <= 0) { 
                    this.producto.relImposiciones = [ 
                      {
                        Id: 0,
                        ImpuestoId: 1,
                        ProductoId: this.producto.Id
                      }
                    ]
                  }
                } else {
                  this.producto.Marca = 0;
                  if (this.producto.relImposiciones.length > 0) {
                    this.producto.relImposiciones = []
                  }
                }*/
                this.producto.relPrecios.map(function(pre) {
                  if (pre.MinimoCondicion > 0) {
                    pre.MinimoCondicion = 0;
                  }
                })
                this.procesarGuardado();
              } else {
                this.$notify(
                  "warning", 
                  this.$t("vista.transacciones.guardar-canot"), 
                  res.data, 
                  { duration: 3000, permanent: false }
                );
              }
              this.procesando = false;
            }.bind(this))
            .catch(function(e) {
              console.log(e);
              let msg = this.$t("vista.transacciones.guardar-error");
              if (e.response != undefined)
                msg = e.response.data;
              this.procesando = false;
              this.$notify(
                "warning", 
                this.$t("vista.transacciones.guardar-canot"), 
                msg,
                { duration: 3000, permanent: false }
              );
            }.bind(this));
          this.procesando = false;
        } else {
          this.procesarGuardado();
          this.procesando = false;
        }
      }
    },
    procesarGuardado() {
      this.$store
        .dispatch("inventarios/productoGuardar", this.producto)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify(
              "success", 
              this.$t("vista.comandos.guardar") + " " + this.$t("vista.inventarios.productos.denominacion"), 
              res.data.msj, 
              { duration: 3000, permanent: false }
            );
            this.$router.back();
          } else {
            this.$notify(
              "warning", 
              this.$t("vista.comandos.guardar") + " " + this.$t("vista.inventarios.productos.denominacion"), 
              res.data.msj, 
              { duration: 3000, permanent: false }
            );
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          console.log(e);
          this.procesando = false;
          let msj = this.$t("vista.transacciones.guardar-error");
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.$notify(
            "error", 
            this.$t("vista.comandos.guardar") + " " + this.$t("vista.inventarios.productos.denominacion"), 
            msj,
            { duration: 3000, permanent: false }
          );
        }.bind(this)
      );
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.back();
    },
  },
  computed: {
    tituloAccion: function() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.producto.Id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    grabado: {
      get () {
        return this.producto.Marca == 1;
      },
      set (value) {
        this.producto.Marca = (value ? 1 : 0);
      }
    },
  },
  created() {
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 3 // Tipos de producto
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.tiposProducto = r.respuesta.data;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 4 // Tipos de identificacion
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.categorias = r.respuesta.data;
          }
        }
      }.bind(this));  
  },
  mounted() {
    if (this.$route.params.id > 0) {
      if (this.$route.params.dato.Codigo.length > 0) {
        this.codigoGenerar = false;
      }
      if (this.$route.params.dato.relPrecios.length > 0) {
        this.secuenciaPrecio = this.$route.params.dato.relPrecios.length;
      }
      this.producto.Id = this.$route.params.dato.Id
      this.producto.Codigo = this.$route.params.dato.Codigo
      this.producto.Nombre = this.$route.params.dato.Nombre
      this.producto.Barcode = this.$route.params.dato.Barcode
      this.producto.Grupo = this.$route.params.dato.Grupo
      this.producto.Descripcion = this.$route.params.dato.Descripcion
      this.producto.Medida = this.$route.params.dato.Medida
      this.producto.Tipo = this.$route.params.dato.Tipo
      this.producto.UltimoCosto = this.$route.params.dato.UltimoCosto
      this.producto.Precio = this.$route.params.dato.Precio
      this.producto.Adicional = this.$route.params.dato.Adicional
      this.producto.Referencia = this.$route.params.dato.Referencia
      this.producto.Marca = this.$route.params.dato.Marca
      this.producto.Modelo = this.$route.params.dato.Modelo
      this.producto.Exitencia = this.$route.params.dato.Exitencia
      this.producto.PrecioOrigen = this.$route.params.dato.PrecioOrigen
      this.producto.EmpresaId = this.$route.params.dato.EmpresaId
      this.producto.EspecieId = this.$route.params.dato.EspecieId
      this.producto.Estado = this.$route.params.dato.Estado
      this.producto.EmbalajeTipo = this.$route.params.dato.EmbalajeTipo
      this.producto.EmbalejeCantidad = this.$route.params.dato.EmbalejeCantidad
      this.producto.EmbalajeUnidad = this.$route.params.dato.EmbalajeUnidad
      this.producto.EmbalajeVolumen = this.$route.params.dato.EmbalajeVolumen
      this.producto.relPrecios = this.$route.params.dato.relPrecios
      this.producto.relImposiciones = this.$route.params.dato.relImposiciones
    }
  }
}
</script>
