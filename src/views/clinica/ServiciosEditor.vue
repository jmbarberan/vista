<template>
  <div>
    <b-modal v-model="selProductoVer" title="Seleccionar producto" v-on:ok="productoSeleccionado()">
      <producto-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="ok()" :disabled="productoNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('vista.clinica.consultas.editor-titulo')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" sm="6">
        <b-form-group :label="$t('vista.clinica.consultas.campos.especialidad')">
          <model-list-select 
            :list="especialidades"
            v-model="servicio.especialidad_id"
            option-value="id"
            option-text="descripcion"
             :state="!$v.servicio.especialidad_id.$error"
            >
          </model-list-select>
          <b-form-invalid-feedback>{{ $t('vista.clinica.servicios.validacion.especialidad') }}</b-form-invalid-feedback>
        </b-form-group>
      </b-colxx>
      <b-colxx xxs="12" sm="6">
        <b-form-group :label="$t('vista.clinica.servicios.campos.descripcion')">
          <b-form-input type="text" v-model="servicio.descripcion" :state="!$v.servicio.descripcion.$error"/>
          <b-form-invalid-feedback>{{ $t('vista.clinica.servicios.validacion.descripcion') }}</b-form-invalid-feedback>
        </b-form-group>
      </b-colxx>
    </b-row>  
    <b-row>
      <b-colxx xxs="12" sm="6">
        <b-form-group :label="$t('vista.clinica.servicios.campos.producto')">
          <b-input-group>
            <b-form-input v-model="productoSeleccion.texto"/>
            <b-input-group-append>
              <b-button variant="primary" class="borde-recto" @click="buscarProducto()">
                <i class="mdi mdi-magnify"/>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>  
      </b-colxx>
      <b-colxx xxs="12" sm="3">
        <b-form-group :label="$t('vista.ventas.clientes.campos.codigo')">
          <b-form-input type="text" v-model="servicio.codigo"/>
        </b-form-group>
      </b-colxx>
      <b-colxx xxs="12" sm="3">
        <b-form-group :label="$t('vista.ventas.facturas.campos.precio')">
          <b-form-input type="text" v-model="servicio.valor"/>
        </b-form-group>
      </b-colxx>  
    </b-row>  
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
  </div>  
</template>

<script>
const { required } = require("vuelidate/lib/validators");
import { mapGetters } from 'vuex';
import {es} from 'vuejs-datepicker/dist/locale'
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import { ModelListSelect } from 'vue-search-select'
export default {
  components: {
    'producto-seleccionar': ProductoSeleccionar,
    ModelListSelect
  },
  data: function () {
    return {
      es: es,
      servicio: {
        id: 0,
        codigo: '',
        descripcion: '',
        especialidad_id: 0,
        producto_id: 0,
        valor: 0,
        estado: 0,
        relEspecialidad: {
          id: '',
          descripcion: ''
        },
        relProducto: {
          id: 0,
          nombre: ''
        }
      },
      especialidades: [],
      procesando: false,
      ocupadoEspecialidad: false,
      productoSeleccion: {
        texto: "",
        productoid: 0
      },
      selProductoVer: false,
    }
  },
  validations: {
    servicio: {
      especialidad_id: {
        required
      },
      descripcion: {
        required
      }
    }
  },
  computed: {
    ...mapGetters("inventarios", [
      "selProducto"
    ]),
    tituloAccion: function() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.servicio.id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    productoNoSeleccionado() {
      return this.selProducto == null;
    },
  },
  methods: {
    mensaje(contenido, titulo, variante) {
      this.$bvToast.toast(contenido, {
        title: titulo,
        variant: variante,
        toaster: 'b-toaster-bottom-right',
        solid: true,
        appendToast: false
      })
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.back();
    },
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify("warning",
          this.$t("vista.comandos.guardar-canot"),
          this.$t("vista.transacciones.guardar-error"),
          { duration: 3000, permanent: false });
      } else {
        this.procesando = true;
        if (this.servicio.id == 0) {
          // Validar servicio existe
          this.$store
            .dispatch("clinica/servicioRegistrado", { 
              id: this.servicio.id,
              codigo: this.servicio.codigo,
              descripcion: this.servicio.descripcion })
            .then(function(res) {
              if (res.status == 200) {  
                this.procesarGuardado();
              } else {
                this.$notify("warning",
                  this.$t("vista.comandos.guardar-canot"),
                  res.data,
                  { duration: 3000, permanent: false });
              }
              this.procesando = false;
            }.bind(this))
            .catch(function(e) {
              let msg = this.$t("vista.transacciones.guardar-error");
              if (e.response.data != undefined)
                msg = e.response.data;
              this.procesando = false;
              this.$notify("danger",
                this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.servicios.denominacion"),
                msg,
                { duration: 3000, permanent: false });
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
        .dispatch("clinica/servicioGuardar", this.servicio)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify("success",
              this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.servicios.denominacion"), 
              res.data.msj,
              { duration: 3000, permanent: false });
            this.$router.back();
          } else {
            this.$notify("warning",
              this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.servicios.denominacion"),
              res.data.msj,
              { duration: 3000, permanent: false });
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = this.$t('vista.transacciones.guardar-error');
          console.log(e)
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.$notify("danger",
            this.$t("vista.comandos.guardar") + " " + this.$t("vista.clinica.servicios.denominacion"),
            msj,
            { duration: 3000, permanent: false });  
        }.bind(this)
      );  
    },
    buscarProducto() {
      if (this.productoSeleccion.texto.length > 0) {
        this.$store.commit('inventarios/setSelProductoTexto', this.productoSeleccion.texto);
        this.selProductoVer = true;
      }
    },
    productoSeleccionado() {
      this.productoSeleccion.id = this.selProducto.id;
      this.productoSeleccion.texto = this.selProducto.nombre;
      this.servicio.producto_id = this.selProducto.id;
      if (this.selProducto.precio) {
        this.servicio.valor = this.selProducto.precio;
      }  
    },
  },
  mounted() {
    if (this.$route.params.id > 0) {
      this.servicio.id = this.$route.params.dato.id;
      this.servicio.codigo = this.$route.params.dato.codigo;
      this.servicio.descripcion = this.$route.params.dato.descripcion;
      this.servicio.valor = this.$route.params.dato.valor;
      if (this.$route.params.dato.relEspecialidad != undefined) {
        this.servicio.relEspecialidad = this.$route.params.dato.relEspecialidad;
        this.servicio.especialidad_id = this.$route.params.dato.relEspecialidad.id;
      }
      if (this.$route.params.dato.relProducto != undefined) {
        this.servicio.relProducto = this.$route.params.dato.relProducto;
        this.servicio.producto_id = this.$route.params.dato.relProducto.id;
        this.productoSeleccion.texto = this.$route.params.dato.relProducto.nombre;
        this.productoSeleccion.productoid = this.$route.params.dato.relProducto.id;
      }
      this.servicio.estado = this.$route.params.dato.estado;
    }
  },
  created() {
    this.$store
      .dispatch("clinica/especialidadesTodas")
      .then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.especialidades = r.respuesta.data;
          }
        }
      }.bind(this));
  }
}
</script>
