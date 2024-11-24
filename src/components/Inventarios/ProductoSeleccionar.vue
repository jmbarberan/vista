<template>
  <b-modal class="modal-dialog-sel" 
    v-model="verModal" title="Seleccionar producto" 
    v-on:hidden="cancelarModal()"
  >
    <b-overlay :show="busquedaEjecutando" 
      rounded="lg"
      opacity=0.75s
    >
      <template v-if="mostrarFoto" #overlay>
        <b-container fluid class="p-4 bg-dark">
          <b-img thumbnail fluid :src="fotoProducto" alt="Foto del producto"></b-img>
          <b-button
            ref="cancel"
            variant="outline-danger"
            size="sm"
            class="mt-4"
            @click="mostrarFoto = false; busquedaEjecutando = false; fotoProducto='';"
          >
            Cerrar
          </b-button>
        </b-container>    
      </template>
      <template v-else #overlay>
        <div class="loading-with-text">
          <span class="loader"/>
        </div>
      </template>
      <div class="d-flex">
        <b-input-group class="mb-4">
          <b-form-input
            ref="txBuscar"
            v-model="busquedaTexto"
            size="sm"
            :placeholder='$t("vista.comandos.buscar")'
            @keyup.enter="pulsaEnter"
            @keyup.ctrl.stop.prevent="pulsaControl"
          />
          <b-input-group-append is-text>
            <input type="checkbox" v-model="busquedaAvz" title="Busqueda extendida"/>
          </b-input-group-append>
          <b-input-group-append>
            <b-button variant="outline-primary" class="borde-recto" @click="pulsaEnter()">
              <i class="mdi mdi-magnify"/>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-button
          class="btn-icono flex-inicio"
          v-b-toggle.ayuda-control
          title="Como seleccionar?"
        >
          <i class="mdi mdi-help mdi-18px"/>
        </b-button>
      </div>
      <div>
        <b-table
          ref="tbItems"
          small
          striped
          hover
          select-mode="single"
          selectable
          selected-variant="primary"
          :items="items"
          :per-page="porPagina"
          :fields="campos"
          :current-page="paginaActual"
          @row-selected="filaSeleccionada"
          @row-clicked="clickedRowsEvt">
          <template #cell(acciones)="row">
            <button v-if="hasImages(row.item)" @click="cargarImagen(row.item)" type="button" class="btn btn-primary"
              style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
            >
              Foto
            </button>
          </template>
        </b-table>
        <b-pagination
          ref="paginador"
          v-model="paginaActual"
          :total-rows="total"
          :per-page="porPagina"
          @change="cambiarPagina()"
          size="sm"
          align="center"
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
      </div>
      <b-collapse id="ayuda-control" @shown="enfocarBusqueda()" @hidden="enfocarBusqueda()">
        <p class="text-small"><b-badge variant="primary">Ctrl+F3</b-badge> Buqueda extendida  
          <b-badge variant="primary">Ctrl+Espacio</b-badge> Seleccionar siguiente item
        </p>
        <p class="text-small"><b-badge variant="primary">Ctrl+Flecha izq</b-badge> Ir a la pagina anterior  
          <b-badge variant="primary">Ctrl+Flecha der.</b-badge> Ir a la pagina siguiente
        </p>
        <p class="text-small"><b-badge variant="primary">Ctrl+Enter</b-badge> Aceptar item seleccionado</p>
      </b-collapse>
    </b-overlay>  
    <template #modal-footer="{ ok }">
      <b-button v-show="!mostrarFoto" variant="success" size="sm" @click="aceptar()" :disabled="seleccionado == null">
        {{ $t('vista.comandos.aceptar') }}
      </b-button>
    </template>  
  </b-modal>
</template>

<script>
import { getEmpresa } from "../../utils";
import { mapGetters } from "vuex";
export default {

  data() {
    return {
      paginaActual: 1,
      verModal: false,
      seleccionado: null,
      campos: [
        { key: "Nombre", label: this.$t('vista.inventarios.productos.campos.nombre'), sortable: false },
        { key: "Medida", label: this.$t('vista.inventarios.productos.campos.medida'), sortable:false },
        { key: "acciones", label: 'Foto' }
      ],
      items: [],
      filasPagina: [],
      busquedaEjecutando: false,
      mostrarFoto: false,
      fotoProducto: '',
      porPagina: 5,
      selIndex: -1,
      controlPulsado: false
    }
  },
  computed: {
    ...mapGetters('inventarios', [
      'selProductoTexto',
      'selProductoExtendida',
      'selProductoLista'
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
    total() {
      if (!this.busquedaEjecutando) {
        return this.items.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina);
    }
  },
  methods: {
    hasImages(pro) {
      return pro.relImagenes.length > 0
    },
    pulsaEnter() {
      if (!this.controlPulsado) {
        if (this.busquedaTexto.length > 0) 
          this.buscar();
      }
    },
    pulsaControl(ev) {
      this.controlPulsado = true;
      switch (ev.keyCode) {
        case 13: {
          if (this.seleccionado != null) {
            this.selIndex = -1,
            this.busquedaTexto = this.seleccionado.Nombre;
            this.$store.commit("inventarios/setSelProducto", this.seleccionado);
            this.$store.commit('inventarios/setSelProductoLista', []);
            this.$emit("buscadorProd-seleccionado");
            this.verModal = false;
          }
          break;
        }
        case 32: {
          if ((this.filasPagina.length -1) > this.selIndex)
            this.selIndex += 1; // Saltar seleccion
          else
            this.selIndex = 0;  
          this.filasPagina[this.selIndex].click();
          break;
        }
        case 37: {
          try {
            if (this.paginaActual != 1)
              this.paginaActual -= 1;            
          } catch { }
          break;
        }
        case 39: {               
          try {
            if (this.paginas > 0 && (this.paginaActual < (this.paginas)))
              this.paginaActual += 1;              
          } catch { }
          break;
        }
        case 114: {
          this.busquedaAvz = !this.busquedaAvz;
          break;
        }
      }
      this.controlPulsado = false;
    },
    buscar() {
      this.busquedaEjecutando = true;
      this.items = [];
      this.paginaActual = 1;
      let p = {
        tipo: this.busquedaAvz ? 1 : 0,
        atributo: 0,
        estado: 0,
        texto: this.busquedaTexto
      }
      this.$store
        .dispatch("inventarios/productosBuscarMin", p)
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.selIndex = -1;
              this.items = r.respuesta.data;
              this.cargarFilasPagina();
            }
          }
          this.busquedaEjecutando = false;
          if (this.items.length > 0) {
            this.paginaActual = 1;
          }
        }.bind(this))
        .catch(function() {
          this.busquedaEjecutando = false;
        }.bind(this));
    },
    filaSeleccionada(p) {
      if (p[0] != undefined) {
        this.seleccionado = p[0];
      }
    },
    clickedRowsEvt(item, index) {
      this.selIndex = index;
      this.enfocarBusqueda();
    },
    saltarSeleccionado() {
      this.selIndex += 1;
      this.$refs.tbItems.selectRow(this.selIdex);
    },
    enfocarBusqueda() {
      if (this.$refs.txBuscar != undefined) {
        setTimeout(() => {
          this.$refs.txBuscar.$el.focus();
        }, 100);
      }
    },
    cambiarPagina() {
      this.selIndex = -1;
      let tabla = this.$refs.tbItems.$el;
      let tbo = tabla.getElementsByTagName('tbody')[0];
      this.filasPagina = tbo.getElementsByTagName('tr');
    },
    mostrarControl() {
      this.controlVisible = true;
    },
    aceptar() {
      if (this.seleccionado != null) {
        this.selIndex = -1,
        this.busquedaTexto = this.seleccionado.Nombre;
        this.$store.commit("inventarios/setSelProducto", this.seleccionado);
        this.$store.commit('inventarios/setSelProductoLista', []);
      }
      this.$emit("buscadorProd-seleccionado");
      this.verModal = false;
    },
    cancelarModal() {
      //this.$store.commit("inventarios/setSelProducto", null);
      this.$store.commit('inventarios/setSelProductoLista', []);
      this.mostrarFoto = false;
      this.busquedaEjecutando = false;
    },
    cargarLista(p) {
      if (this.selProductoLista.length > 0) {
        this.items = this.selProductoLista;
        this.seleccionado = null;
        this.verModal = p;
        this.$nextTick(function(){
          this.enfocarBusqueda();
          this.cargarFilasPagina();
        }.bind(this));
      }
    },
    cargarBusqueda() {
      if (this.selProductoTexto.length > 0) {
        this.enfocarBusqueda();
        this.buscar();
      }
    },
    cargarFilasPagina() {
      let tabla = this.$refs.tbItems;
      if (tabla != undefined && tabla.$el != undefined) {
        this.filasPagina = tabla.$el.getElementsByTagName('tbody')[0].getElementsByTagName('tr');  
      }
    },
    cargarImagen(pro) {
      if (pro.relImagenes.length > 0) {
        const fotoId = pro.relImagenes[0].Id;
        this.$store
          .dispatch("inventarios/imagenProductoPorId", fotoId)
          .then(function(r) {
            let imgUrl = URL.createObjectURL(r.data);
            console.log('Url img', imgUrl);
            this.fotoProducto = imgUrl;
            this.mostrarFoto = true;
            this.busquedaEjecutando = true;
          }.bind(this)
        );
      }
    }
  }
}
</script>
