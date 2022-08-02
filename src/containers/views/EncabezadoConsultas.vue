<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ titulo }}</h1>
      <div class="top-right-button-container">
        <b-button v-if="!esMedico"
          @click="crear()"
          variant="primary"
          size="sm"
          class="top-right-button"
        >{{ $t('vista.comandos.nuevo') }}</b-button>
      </div>
      <piaf-breadcrumb />
      <div class="mb-2">
        <div class="d-block d-md-inline-block">
          <span class="mr-3 d-inline-block float-md-left">
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===4}"
              @click="cambiarBuscaTipo(4)"
              v-b-tooltip.hover 
              title="Consultas de hoy"
            >
              <i class="mdi mdi-24px mdi-clock-outline"/>
            </a>
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===0}"
              @click="cambiarBuscaTipo(0)"
              v-b-tooltip.hover 
              title="Buscar por paciente"
            >
              <i class="mdi mdi-24px mdi-account"/>
            </a>
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===1}"
              @click="cambiarBuscaTipo(1)"
              v-b-tooltip.hover 
              title="Buscar por fecha"
            >
              <i class="mdi mdi-24px mdi-calendar-month"/>
            </a>
            <a  v-if="!esMedico"
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===2}"
              @click="cambiarBuscaTipo(2)"
              v-b-tooltip.hover 
              title="Buscar por medico"
            >
              <i class="mdi mdi-24px mdi-doctor"/>
            </a>
            <!--a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===3}"
              @click="cambiarBuscaTipo(3)"
              v-b-tooltip.hover 
              title="Buscar por motivo de consulta"
            >
              <i class="mdi mdi-24px mdi-clipboard-text-outline"/>
            </!--a-->
          </span>
          <b-dropdown
            v-if="busquedaTipo == 0 || busquedaTipo == 2"
            id="ddAtributoBusca"
            :text="`${$t('vista.busqueda.etiqueta')} ${busquedaAtributoProp}`"
            variant="outline-primary"
            class="mr-2 float-md-left btn-group mt-1"
            size="xs"
          >
            <b-dropdown-item v-for="(atrib,index) in busquedaAtributos" :key="index" @click="busquedaCambiarAtributo(index)">
              {{ atrib }}
            </b-dropdown-item>
          </b-dropdown>
          <div v-if="busquedaTipo != 1 && busquedaTipo != 4" class="search-sm d-inline-block float-md-left mr-1 mt-1">
            <b-form-input v-model="busquedaTexto" :placeholder="$t('vista.comandos.buscar')" @keyup.enter="(val) => buscar(val)"/>
          </div>
          <datepicker v-if="busquedaTipo == 1"
            class="fecha-sm d-inline-block float-md-left mt-1 mr-3"
            :bootstrap-styling="true"
            v-model="busquedaDesde"
            format="yyyy/MM/dd"
            :language="es"
          ></datepicker>
          <datepicker v-if="busquedaTipo == 1"
            class="fecha-sm d-inline-block float-md-left mt-1"
            :bootstrap-styling="true"
            v-model="busquedaHasta"
            format="yyyy/MM/dd"
            :language="es"
          ></datepicker>
          <a 
            class="d-inline-block float-md-left ml-3 view-icon boton-comando"
            @click="actualizar()"
            v-b-tooltip.hover 
            title="Actualizar resultados"
          >
            <i class="mdi mdi-24px mdi-find-replace"/>
          </a>
          <a v-if="imprimirVisible"
              class="d-inline-block float-md-left ml-3 view-icon boton-comando"
              @click="imprimir()"
              v-b-tooltip.hover 
              :title="$t('vista.comandos.imprimir')"
            >
              <i class="mdi mdi-24px mdi-printer"/>
            </a>
        </div>
        <div class="d-md-inline-block float-md-right">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-md-none"
            v-b-toggle.displayOptions
          >
            {{ $t('pages.display-options') }}
            <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <b-checkbox switch v-if="busquedaTipo != 1 && busquedaTipo != 4"
              v-model="busquedaExtendida"
              theme="custom"
              color="primary-inverse"
              class="vue-switcher-small d-md-inline-block align-middle mr-3"
            >{{ $t("vista.busqueda.extendida") }}</b-checkbox>
            <b-checkbox switch
              v-model="busquedaEliminados" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle mr-3"
            >{{ $t("vista.busqueda.eliminados") }}</b-checkbox>
            <span class="text-muted text-small mr-1 mb-2">{{desde}} {{ $t('vista.busqueda.al') }} {{hasta}} {{ $t('vista.busqueda.de') }} {{ total }}</span>
            <b-dropdown
              id="ddown2"
              right
              :text="`${xPagina}`"
              variant="outline-secundary"
              class="d-inline-block"
              size="xs"
            >
              <b-dropdown-item
                v-for="(size,index) in lPaginas"
                :key="index"
                @click="cambiarPagina(size)"
              >{{ size }}</b-dropdown-item>
            </b-dropdown>
          </b-collapse> 
        </div>
      </div>
    </b-colxx>
  </b-row>    
</template>
  
<script>
  import Datepicker from "vuejs-datepicker";
  import {es} from 'vuejs-datepicker/dist/locale'
  import { mapGetters } from 'vuex';
  import { getCurrentUser } from '@/utils'
  export default {
  props: [
    "titulo",
    "busquedaAtributos",
    "crear",
    "buscar",
    "desde",
    "hasta",
    "total",
    "xPagina",
    "lPaginas",
    "cambiarPagina",
    "actualizar",
    "imprimir",
    "imprimirVisible",
  ],
  data: function() {
    return {
      es: es
    }
  },
  components: {
    Datepicker
  }, 
  computed: {
    ...mapGetters('clinica', [
      'buscaConsultaExtendida',
      'buscaConsultaEliminados',
      'buscaConsultaAtributo',
      'buscaConsultaDesde',
      'buscaConsultaHasta',
      'buscaConsultaTipo'
    ]),
    ...mapGetters([
      'currentUser'
    ]),
    esMedico() {
      return this.currentUser != null ? this.currentUser.rol_id-1 >= 4 : false;
    },                                  
    busquedaTexto: {
      get () {
        if (this.busquedaTipo == 0)
          return this.$store.state.clinica.selPacienteTexto;
        else
          return this.$store.state.clinica.selMedicoTexto;
      },
      set (value) {
        let origen = 'clinica/setSelPacienteTexto';
        if (this.busquedaTipo == 2) 
          origen = 'clinica/setSelMedicoTexto';
        this.$store.commit(origen, value);
      }
    },
    busquedaExtendida: {
      get: function() {
        return this.buscaConsultaExtendida;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaConsultaExtendida", val);
      }
    },
    busquedaEliminados: {
      get: function() {
        return this.buscaConsultaEliminados;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaConsultaEliminados", val);
      }
    },
    busquedaDesde: {
      get: function() {
        return this.buscaConsultaDesde;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaConsultaDesde", val);
      }
    },
    busquedaHasta: {
      get: function() {
        return this.buscaConsultaHasta;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaConsultaHasta", val);
      }
    },
    busquedaTipo: {
      get: function() {
        return this.buscaConsultaTipo;
      }
    },
    busquedaAtributoProp: {
      get: function() {
        return this.buscaConsultaAtributo;
      }
    }
  },
  methods: {
    busquedaCambiarAtributo(id) {
      this.$store.commit("clinica/setBuscaConsultaAtributo", this.busquedaAtributos[id]);
      this.$store.commit("clinica/setBuscaConsultaAtributoIdx", id);
    },
    cambiarBuscaTipo(p) {
      this.$store.commit("clinica/setBuscaConsultaTipo", p);
      if (p == 4) {
        // traer consultas de hoy
      }
    },
    fechaSeleccionada(p) {
      this.$refs[p].hide(true);
    }
  },
}
</script>
