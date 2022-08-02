<template>
  <b-overlay v-model="busquedaEjecutando">
    <div>
      <b-form-input 
        v-model="busquedaTexto" 
        size="sm" 
        :placeholder='$t("vista.comandos.buscar")' 
        @keyup.enter="buscar()"
        class="mb-4"
      />  
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      paginaActual: 1,
      seleccionado: null,
      campos: [
        { key: "nombres", label: this.$t('vista.ventas.clientes.campos.nombres'), sortable: false },
        { key: "identificacion", label: this.$t('vista.ventas.clientes.campos.cedula'), sortable:false }
      ],
      items: [],
      busquedaEjecutando: false,
      porPagina: 5
    }
  },
  computed: {
    ...mapGetters('clinica', [
      'selMedicoTexto'
    ]),
    busquedaTexto: {
      get () {
        return this.selMedicoTexto;
      },
      set (value) {
        this.$store.commit('clinica/setSelMedicoTexto', value);
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
      let p = {
        tipo: 1,
        atributo: 0,
        estado: 0,
        texto: this.busquedaTexto
      }
      this.$store
        .dispatch("clinica/buscarMedicoMin", p)
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.items = r.respuesta.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.items.length <= 0) {
            this.$notify("warning", 
              this.$t("vista.busqueda.buscar") + " " + this.$t("vista.clinica.medicos.denominacion"), 
              this.$t("vista.busqueda.no-encontrado"), 
              { duration: 3000, permanent: false });
          } else {
            this.paginaActual = 1;
            //this.cambiarPaginaActual(1);
          }
        }.bind(this))
        .catch(function() {
          this.busquedaEjecutando = false;
          this.$notify("warning", 
            this.$t("vista.busqueda.buscar") + " " + this.$t("vista.clinica.medicos.denominacion"), 
              this.$t("vista.busqueda.no-encontrado"), 
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    filaSeleccionada(p) {
      if (p != null) {
        this.seleccionado = p[0];
        this.busquedaTexto = this.seleccionado.nombres;
        this.$store.commit("clinica/setSelMedico", this.seleccionado);
      } else {
        this.seleccionado = p
      }
    }
  },
  created() {
    if (this.selMedicoTexto.length > 0) {
      this.buscar();
    }
  }
}
</script>
