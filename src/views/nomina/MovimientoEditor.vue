<template>
  <div>
    <h4>Transacciones</h4>
    <persona-seleccionar ref="perSeleccionador" v-bind="modeloEmpleadoSel" v-on:seleccionado-persona="personaSeleccionada()" >
      <template #titulo>Seleccionar empleado</template>
    </persona-seleccionar>    
    <b-form-input v-model="texto" @keyup.enter="buscar()"/>
    <b-form-checkbox v-model="avanzada"></b-form-checkbox>
    <span>{{ nombreEmpleado }}</span>
  </div>
</template>
<script>
import { getCurrentSubscriber } from "../../utils/index"
import PersonaSeleccionar from '../../components/Common/PersonaSeleccionar.vue'
export default {
  components: {
    "persona-seleccionar": PersonaSeleccionar
  },
  data() {
    return {
      texto: "",
      avanzada: false,
      empleadoSeleccionado: null,
      modeloEmpleadoSel: {
        campos: [
          { key: "nombres", label: this.$t('vista.ventas.clientes.campos.nombres'), sortable: false },
          { key: "cedula", label: this.$t('vista.ventas.clientes.campos.cedula'), sortable:false }
        ],
        buscador: "nomina/empleadosBuscarMin",
        params: {
          sub: getCurrentSubscriber().id,
          emp: this.$store.state.empresaAccedida.id,
          tipo: 0,
          atributo: "nombres",
          estado: 0
        }
      },
    }    
  },
  computed: {
    nombreEmpleado: function() {
      if (this.empleadoSeleccionado != null) {
        return this.empleadoSeleccionado.nombres + " seleccionado";
      } else {
        return "";
      }
    }
    
  },
  methods: {
    buscar() {
      this.$refs.perSeleccionador.cargarBusqueda(this.texto, this.avanzada);
    },
    personaSeleccionada() {
      if (this.$refs.perSeleccionador.seleccionado)
        this.empleadoSeleccionado = this.$refs.perSeleccionador.seleccionado;
    }
  },
  /*mounted() {
    //this.$refs.perSeleccionador.modelo = this.modeloEmpleadoSel;
  },*/
}
</script>