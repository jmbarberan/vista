<template>
  <div>
    <b-overlay :show="ocupado" rounded="lg" opacity="0.6">
      <template #overlay>
        <div class="d-flex align-items-center">
          <b-spinner small type="grow" variant="secondary"></b-spinner>
          <b-spinner type="grow" variant="dark"></b-spinner>
          <b-spinner small type="grow" variant="secondary"></b-spinner>
          <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') + '...' }}</span>
        </div>
      </template>
      <b-input-group>
        <b-form-input 
          ref="txProducto" 
          size="sm" 
          v-model="busquedaTexto" 
          :placeholder="$t('vista.busqueda.digitar-enter')" 
          @keyup.enter="buscar()"
          @keyup.ctrl.stop.prevent="pulsaControl"/>
        <b-input-group-append is-text v-if="seleccionado">
          {{ medida }}
        </b-input-group-append>
        <b-input-group-append is-text>
          <input size="sm" type="checkbox" v-model="busquedaAvz" title="Busqueda extendida"/>
        </b-input-group-append>
        <b-input-group-append>
          <b-button variant="outline-primary" class="borde-recto" @click="buscar()" title="Ejecutar busqueda">
            <i class="mdi mdi-magnify"/>
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-overlay>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getEmpresa } from "../../utils";
export default {
  expose: ['enfocarCantidad'],
  data: function() {
    return {
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
      ocupado: false,
    }
  },
  computed: {
    ...mapGetters('inventarios', [
      'selProducto',
      'selProductoTexto',   
      'selProductoExtendida'
    ]),
    busquedaTexto: {
      get () {
        return this.selProductoTexto;
      },
      set (value) {
        this.$store.commit('inventarios/setSelProductoTexto', value);
      }
    },
    busquedaAvz: {
      get () {
        return this.selProductoExtendida;
      },
      set (value) {
        this.$store.commit('inventarios/setSelProductoExtendida', value);
      }
    },
    seleccionado: {
      get () {
        return this.selProducto != null;
      }
    },
    medida: {
      get () {
        return this.selProducto != null ? this.selProducto.Medida : '';
      }
    }
  },
  methods: {
    buscar() {
      if (this.busquedaTexto.length > 0) {
        if (this.selProducto != null && this.selProducto.Nombre === this.busquedaTexto) {
          this.$emit("buscarProducto-saltar");
        } else {
          this.ocupado = true;
          let params = {
            ext: this.busquedaAvz ? 1 : 0,
            emp: getEmpresa().id,
            estado: 0,
            filtro: this.busquedaTexto
          }
          this.$store
            .dispatch("inventarios/productoSeleccionar", params)
            .then(function(r) {
              let result = false;
              if (r.id == 1) {
                if (r.respuesta.data != undefined) {
                  if (r.respuesta.data.length == 1) {
                    this.$store.commit('inventarios/setSelProducto', r.respuesta.data[0]);
                    this.busquedaTexto = r.respuesta.data[0].Nombre
                    result = true;
                    this.$emit("buscarProducto-encontrado");
                  } else {
                    if (r.respuesta.data.length > 0) {
                      this.$store.commit('inventarios/setSelProductoLista', r.respuesta.data);
                      this.$store.commit('inventarios/setSelProductoTexto', this.busquedaTexto);                    
                      result = true;
                      this.$emit("buscarProductos-encontrados");
                    }
                  }
                }
              }
              if (!result) {
                this.$notify(
                  "warning",
                  "Busqueda de producto",
                  "La busqueda no produjo resultados",
                  { duration: 3000, permanent: false }
                );
              }
              this.ocupado = false;
            }.bind(this))
            .catch(function(ex) {
              this.ocupado = false;
              let msj = "Se produjo un error al buscar"
              if (ex.message != undefined)
                msj = ex.message;
              this.$notify(
                "warning",
                "Busqueda de producto",
                msj,
                { duration: 3000, permanent: false }
              );
            }.bind(this));
        }
      }
    },
    pulsaControl(ev) {
      switch (ev.keyCode) {
        case 114: {
          this.busquedaAvz = true;
          break;
        }
      }
    },
    enfocarBusqueda() {
      this.$refs.txProducto.focus();
    }
  },
}
</script>