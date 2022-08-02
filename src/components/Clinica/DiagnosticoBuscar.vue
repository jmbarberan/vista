<template>
  <div>
    <b-form-input 
      ref="txBuscar"
      v-model="busquedaTexto"
      size="sm"
      :placeholder='$t("vista.comandos.buscar")'
      @keyup.enter="pulsaEnter"
      class="mb-4"
    />
    <b-table
      ref="tbItems"
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
    ></b-table>
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      paginaActual: 1,
      seleccionado: null,
      campos: [
        { key: "codigo", label: this.$t('vista.ventas.clientes.datos-personales.campos.codigo'), sortable:false },
        { key: "descripcion", label: this.$t('vista.clinica.consultas.campos.diagnostico'), sortable: false }
      ],
      items: [],
      filasPagina: [],
      busquedaEjecutando: false,
      porPagina: 5,
      selIndex: -1
    }
  },
  computed: {
    ...mapGetters('clinica', [
      'selDiagnosticoTexto'
    ]),
    busquedaTexto: {
      get () {
        return this.selDiagnosticoTexto;
      },
      set (value) {
        this.$store.commit('clinica/setSelDiagnosticoTexto', value);
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
    pulsaEnter() {
      if (this.busquedaTexto.length > 0) 
        this.buscar();
    },
    buscar() {
      this.busquedaEjecutando = true;
      this.items = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("clinica/diagnosticoBuscar", this.busquedaTexto)
        .then(function(r) {
          /*if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.selIndex = -1;
              this.items = r.respuesta.data;
              let tabla = this.$refs.tbItems.$el;
              let tbo = tabla.getElementsByTagName('tbody')[0];
              this.filasPagina = tbo.getElementsByTagName('tr');
            }
          }*/
          this.items = r;
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
      this.seleccionado = p[0];
      this.busquedaTexto = this.seleccionado.descripcion;
      this.$store.commit("clinica/setSelDiagnostico", this.seleccionado);
    }
  },
  created() {
    if (this.selDiagnosticoTexto.length > 0) {
      this.buscar();
    }
  }
}
</script>
