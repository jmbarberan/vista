<template>
  <b-modal class="modal-dialog-sel"
    v-model="verModal"
  >
    <template #title>
      <slot name="titulo"/>
    </template>
    <b-overlay :show="busquedaEjecutando" 
      opacity=0.6
      rounded="lg"
    >
      <template #overlay>
        <div class="loading-with-text">
          <span class="loader"/>
        </div>
      </template>
      <div>
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
            <b-button variant="outline-primary" class="borde-recto" @click="buscar()">
              <i class="mdi mdi-magnify"/>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-table 
          small 
          :per-page="porPagina"
          :fields="campos"
          striped
          hover
          :items="items"
          select-mode="single"
          selectable
          selected-variant="primary"
          :current-page="paginaActual"
          :selected="seleccionado"
          @row-selected="filaSeleccionada"
        ></b-table>
        <b-pagination
          v-model="paginaActual"
          :total-rows="total"
          :per-page="porPagina"
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
    </b-overlay>
    <template #modal-footer="{ ok }">
      <b-button variant="success" size="sm" @click="aceptar()" :disabled="seleccionado == null">
        {{ $t('vista.comandos.aceptar') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { BuscadorPersonasArgs } from "../../utils/personasBuscadorArgs"
export default {
  props:{
    campos: Array,
    buscador: String,
    params: Object
  },
  data() {
    return {
      paginaActual: 1,
      verModal: false,
      busquedaTexto: "",
      busquedaAvz: false,
      seleccionado: null,
      items: [],
      filasPagina: [],
      busquedaEjecutando: false,
      porPagina: 5,
      selIndex: -1,
      controlPulsado: false,
    }
  },
  computed: {
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
          if (this.seleccionado != null)
            this.$emit("seleccionado-persona", this.seleccionado);
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
      let args = new BuscadorPersonasArgs(this.params);
      args.tipo = this.busquedaAvz ? 1 : 0;
      this.$store
        .dispatch(this.buscador, {
          filtro: this.busquedaTexto,
          params: args.buildParams()
        })
        .then(function(r) {
          if (r.data != undefined) {
            this.selIndex = -1;
            this.items = r.data;
            this.cargarFilasPagina();
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
    cargarPersonas(pers, ver) {
      this.items = pers;
      this.seleccionado = null;
      this.verModal = ver;
      this.$nextTick(function() {
        this.enfocarBusqueda();
        this.cargarFilasPagina();
      }.bind(this));
    },
    aceptar() {
      this.$emit("seleccionado-persona", this.seleccionado);
      this.verModal = false;
    },        
    cargarBusqueda(txt, avz) {
      if (txt.length > 0) {
        this.busquedaTexto = txt;
        this.busquedaAvz = avz;        
        this.verModal = true;
        this.enfocarBusqueda();
        this.buscar();
      }
    },
    cargarFilasPagina() {
      let tabla = this.$refs.tbItems;
      if (tabla != undefined && tabla.$el != undefined) {
        this.filasPagina = tabla.$el.getElementsByTagName('tbody')[0].getElementsByTagName('tr');  
      }
    }
  },
}
</script>
