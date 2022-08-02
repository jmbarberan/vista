<template>
    <b-overlay :show="busquedaEjecutando" 
      opacity=0.6
    >
      <template #overlay>
        <div class="loading-with-text">
          <span class="loader"/>
        </div>
      </template>
      <b-input-group class="mb-4">
        <b-form-input 
          v-model="busquedaTexto" 
          size="sm" 
          :placeholder='$t("vista.comandos.buscar")' 
          @keyup.enter="buscar()"
        />
        <b-input-group-append>
          <b-button variant="primary" class="borde-recto" @click="buscar()">
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
        :busy="busquedaEjecutando"
      >
        <!--template #table-busy>
          <table-busy :mensaje="$t('vista.busqueda.ejecutandoq') + '...'" />
        </!--template-->
      </b-table>
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
    </b-overlay>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      paginaActual: 1,
      seleccionado: null,
      campos: [
        { key: "Nombre", label: this.$t('vista.ventas.clientes.campos.nombres'), sortable: true },
        { key: "Identificacion", label: this.$t('vista.ventas.clientes.campos.cedula'), sortable: true }
      ],
      items: [],
      busquedaEjecutando: false,
      porPagina: 5
    }
  },
  computed: {
    ...mapGetters('maestros', [
      'selClienteTexto'
    ]),
    busquedaTexto: {
      get () {
        return this.selClienteTexto;
      },
      set (value) {
        this.$store.commit('maestros/setSelClienteTexto', value);
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
    buscar() {
      this.busquedaEjecutando = true;
      this.items = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("maestros/proveedoresPorNombre", { estado: 0, texto: this.selClienteTexto})
        .then(function(r) {
          if (r.data != undefined) {
              this.items = r.data;
            }
          this.busquedaEjecutando = false;
        }.bind(this))
        .catch(function() {
          this.busquedaEjecutando = false;
        }.bind(this));
    },
    filaSeleccionada(p) {
      this.seleccionado = p[0];
      this.busquedaTexto = this.seleccionado.Nombre;
      this.$store.commit("maestros/setSelCliente", this.seleccionado);
    }
  },
  created() {
    if (this.selClienteTexto.length > 0) {
      this.buscar();
    }
  }
}
</script>
