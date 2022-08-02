<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ titulo }}</h1>
      <div class="top-right-button-container">
        <b-button
          @click="crear()"
          variant="primary"
          size="sm"
          class="top-right-button mb-2"
        >{{ $t('vista.comandos.nuevo') }}</b-button>
      </div>
      <piaf-breadcrumb />
      <div class="mb-2">
        <div class="float-sm-left d-sm-inline-block">
          <b-dropdown
            id="ddAtributoBusca"
            :text="`${$t('vista.busqueda.etiqueta')} ${busquedaAtributoProp}`"
            variant="outline-primary"
            class="mr-2 combo-sm float-md-left btn-group inline-vertical-middle"
            size="xs"
          >
            <b-dropdown-item v-for="(atrib,index) in busquedaAtributos" :key="index" @click="busquedaCambiarAtributo(index)">
              {{ atrib }}
            </b-dropdown-item>
          </b-dropdown>
          <div class="d-inline-block float-md-left align-center inline-vertical-middle">
            <div class="search-sm d-inline-block float-md-left inline-vertical-middle">
              <b-form-input class="input-sm" v-model="busquedaTexto" :placeholder="$t('vista.comandos.buscar')" @keyup.enter="(val) => buscar(val)"/> 
            </div>
            <b-button class="btn-xs-nav float-md-left ml-2 inline-vertical-middle"
              @click="buscar()" 
              v-b-tooltip.hover 
              title="Ejecutar la busqueda" >
              <i class="mdi mdi-find-replace"/> 
            </b-button>
          </div>
        </div>
        <div class="float-sm-right">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-lg-none mr-2"
            v-b-toggle.searchOptions
            title="Opciones de busqueda"
          >
            <i class="mdi mdi-18px mdi-filter-variant" /> 
          </b-button>
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-lg-none"
            v-b-toggle.displayOptions
            :title="`${ $t('pages.display-options') }`"
          >
            <i class="mdi mdi-18px mdi-table-settings" /> 
          </b-button>          
        </div>
        <b-collapse id="displayOptions" class="float-sm-right d-lg-inline-block">
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
        <b-collapse id="searchOptions" class="float-sm-right d-lg-inline-block ml-1">
          <b-checkbox switch
            v-model="busquedaExtendida" 
            theme="custom" 
            color="primary-inverse" 
            class="vue-switcher-small d-lg-inline-block inline-vertical-middle mr-3" 
          >{{ $t("vista.busqueda.extendida") }}</b-checkbox> 
          <b-checkbox switch 
            v-model="busquedaEliminados" 
            theme="custom" 
            color="primary-inverse" 
            class="vue-switcher-small d-lg-inline-block inline-vertical-middle mr-3" 
          >{{ $t("vista.busqueda.eliminados") }}</b-checkbox>
        </b-collapse>
      </div>
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex';
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
    "cambiarPagina"
  ],
  computed: {
    ...mapGetters('clinica', [
      'buscaPacienteTexto',
      'buscaPacienteExtendida',
      'buscaPacienteEliminados',
      'busquedaAtributo'
    ]),
    busquedaTexto: {
      get () {
        return this.buscaPacienteTexto;
      },
      set (value) {
        this.$store.commit('clinica/setBuscaTablasTexto', value)
      }
    },
    busquedaExtendida: {
      get: function() {
        return this.buscaPacienteExtendida;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaTablasExtendida", val);
      }
    },
    busquedaEliminados: {
      get: function() {
        return this.buscaPacienteEliminados;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaTablasEliminados", val);
      }
    },
    busquedaAtributoProp: {
      get: function() {
        return this.busquedaAtributo;
      }
    }
  },
  methods: {
    busquedaCambiarAtributo(id) {
      this.$store.commit("clinica/setBusquedaAtributo", this.busquedaAtributos[id]);
      this.$store.commit("clinica/setBusquedaAtributoIdx", id);
    }
  },
}

</script>
