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
        <div class="d-block d-md-inline-block">
          <b-list-group class="float-md-left inline-vertical-middle mr-2 invisible-sm" horizontal>
            <b-list-group-item 
              :active="busquedaTipo == 0" button 
              @click="cambiarBuscaTipo(0)"
              v-b-tooltip.hover 
              :title="`${titulo} recientes`"
            >
              <i class="mdi mdi-18px mdi-clock-outline"/>
            </b-list-group-item>
            <b-list-group-item 
              :active="busquedaTipo == 1" button 
              @click="cambiarBuscaTipo(1)"
              v-b-tooltip.hover 
              title="Buscar por fecha" 
            >
              <i class="mdi mdi-18px mdi-calendar-month"/>
            </b-list-group-item>
            <b-list-group-item 
              :active="busquedaTipo == 2" button 
              @click="cambiarBuscaTipo(2)"
              v-b-tooltip.hover 
              title="Buscar por concepto"
            >
              <i class="mdi mdi-18px mdi-clipboard-text-outline"/>
            </b-list-group-item>
            <b-list-group-item 
              :active="busquedaTipo == 3" button 
              @click="cambiarBuscaTipo(3)"
              v-b-tooltip.hover 
              title="Buscar por numero"
            >
              <i class="mdi mdi-18px mdi-pound"/>
            </b-list-group-item>
          </b-list-group>
          <b-dropdown 
            class="d-md-none float-md-left inline-vertical-middle mr-2"
            variant="outline-primary"
            size="xs"
            no-caret
          >
            <template slot="button-content">
              <i :class="`${iconoBuscaTipo}`"/>
            </template>
            <b-dropdown-item key="0" 
              @click="cambiarBuscaTipo(0)"
              v-b-tooltip.hover 
              :title="`${titulo} de hoy`"
            >
              <i class="mdi mdi-24px mdi-clock-outline"/>
            </b-dropdown-item>
            <b-dropdown-item key="1" 
              @click="cambiarBuscaTipo(1)"
              v-b-tooltip.hover 
              title="Buscar por fecha" 
            > 
              <i class="mdi mdi-24px mdi-calendar-month"/>
            </b-dropdown-item>
            <b-dropdown-item key="2" 
              @click="cambiarBuscaTipo(2)"
              v-b-tooltip.hover 
              title="Buscar por concepto"
            >
              <i class="mdi mdi-24px mdi-clipboard-text-outline"/>
            </b-dropdown-item>
            <b-dropdown-item key="3" 
              @click="cambiarBuscaTipo(3)"
              v-b-tooltip.hover 
              title="Buscar por numero"
            >
              <i class="mdi mdi-24px mdi-pound"/>
            </b-dropdown-item>
          </b-dropdown>
          <div v-if="busquedaTipo == 2 || busquedaTipo == 3" class="search-sm d-inline-block float-md-left inline-vertical-middle"> 
            <b-form-input v-model="busquedaTexto" :placeholder="$t('vista.comandos.buscar')" @keyup.enter="(val) => buscar(val)"/> 
          </div>
          <datepicker v-if="busquedaTipo == 1" 
            class="fecha-sm-nav d-inline-block float-md-left mr-2 inline-vertical-middle" 
            :bootstrap-styling="true" 
            v-model="busquedaDesde" 
            format="yyyy/MM/dd" 
            :language="es" 
          ></datepicker>
          <datepicker v-if="busquedaTipo == 1" 
            class="fecha-sm-nav d-inline-block float-md-left inline-vertical-middle" 
            :bootstrap-styling="true" 
            v-model="busquedaHasta" 
            format="yyyy/MM/dd" 
            :language="es" 
          ></datepicker>
          <b-button class="btn-xs-nav float-md-left ml-2 inline-vertical-middle" 
            @click="actualizar()" 
            v-b-tooltip.hover 
            title="Actualizar resultados" >
            <i class="mdi mdi-find-replace"/> 
          </b-button>
        </div> 
        <div class="float-sm-right"> 
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-lg-none mr-2"
            v-b-toggle.searchOptions
          >            
            <i class="mdi mdi-18px mdi-filter-variant" /> 
          </b-button> 
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-lg-none"
            v-b-toggle.displayOptions
          >            
            <i class="mdi mdi-18px mdi-table-settings" /> 
          </b-button> 
        </div>
        <b-collapse id="displayOptions" class="float-sm-right d-lg-inline-block"> 
          <span class="text-muted text-small mr-2 mb-2">{{desde}} {{ $t('vista.busqueda.al') }} {{hasta}} {{ $t('vista.busqueda.de') }} {{ total }}</span>
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
        <b-collapse id="searchOptions" class="float-sm-right d-lg-inline-block ml-2">
          <b-checkbox switch v-if="busquedaTipo == 2" 
            v-model="busquedaExtendida" 
            theme="custom" 
            color="primary-inverse" 
            class="vue-switcher-small d-lg-inline-block inline-vertical-middle mr-3" 
          > 
            {{ $t("vista.busqueda.extendida") }} 
          </b-checkbox> 
          <b-checkbox switch 
            v-model="busquedaEliminados" 
            theme="custom" 
            color="primary-inverse" 
            class="vue-switcher-small d-lg-inline-block inline-vertical-middle mr-4" 
          > 
            {{ $t("vista.busqueda.eliminados") }}
          </b-checkbox>
          <b-dropdown
            id="ddAtributoBusca"
            :text="`${controlItemTexto}`"
            variant="outline-primary"
            class="d-md-inline-block align-middle btn-group, mr-4"
            size="xs"
          >
            <b-dropdown-item v-for="item in controlItems" :key="item.id" @click="busquedaCambiarAtributo(item)">
              {{ item.nombre }}
            </b-dropdown-item>
          </b-dropdown>
        </b-collapse>
      </div>
    </b-colxx>
  </b-row>    
</template>
  
<script>
  import Datepicker from "vuejs-datepicker";
  import {es} from 'vuejs-datepicker/dist/locale'
  import { mapGetters } from 'vuex';
  export default {
  props: [
    "titulo",
    "crear",
    "buscar",
    "desde",
    "hasta",
    "total",
    "xPagina",
    "lPaginas",
    "cambiarPagina",
    "actualizar",
    "tipo"
  ],
  data: function() {
    return {
      es: es,
    }
  },
  components: {
    Datepicker
  },
  computed: {
    ...mapGetters([
      'buscaMovimientosExtendida',
      'buscaMovimientosEliminados',
      'buscaMovimientosDesde',
      'buscaMovimientosHasta',
      'buscaMovimientosTipo',
      'buscaMovimientosTexto',
      'buscaMovimientosControlItems',
      'buscaMovimientosAtributo'
    ]),
    iconoBuscaTipo: {
      get () {
        switch (this.buscaMovimientosTipo) {
          case 1: return 'mdi mdi-18px mdi-calendar-month'
          case 2: return 'mdi mdi-18px mdi-clipboard-text-outline'
          case 3: return 'mdi mdi-18px mdi-pound'
          default: return 'mdi mdi-18px mdi-clock-outline'
        }
      }
    },
    controlItemTexto: {
      get () {
        if (this.buscaMovimientosAtributo != null)
          return this.buscaMovimientosAtributo.nombre
        else
          return "Seleccionar"  
      }
    },
    busquedaTexto: {
      get () {
        return this.buscaMovimientosTexto;
      },
      set (val) {
        this.$store.commit('setBuscaMovimientosTexto', val);
      }
    },
    busquedaExtendida: {
      get: function() {
        return this.buscaMovimientosExtendida;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosExtendida", val);
      }
    },
    busquedaEliminados: {
      get: function() {
        return this.buscaMovimientosEliminados;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosEliminados", val);
      }
    },
    busquedaDesde: {
      get: function() {
        return this.buscaMovimientosDesde;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosDesde", val);
      }
    },
    busquedaHasta: {
      get: function() {
        return this.buscaMovimientosHasta;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosHasta", val);
      }
    },
    busquedaTipo: {
      get: function() {
        return this.buscaMovimientosTipo;
      }
    },
    controlItems: {
      get: function() {
        return this.buscaMovimientosControlItems;
      }
    }
  },
  methods: {
    textoItem(p) {
      console.log(p)
      return p.Nombre == undefined ? p.Denominacion : p.Nombre
    },
    busquedaCambiarAtributo(atrib) {
      this.$store.commit("setBuscaMovimientosAtributo", atrib);
    },
    cambiarBuscaTipo(p) {
      this.$store.commit("setBuscaMovimientosTipo", p);
    },
    fechaSeleccionada(p) {
      this.$refs[p].hide(true);
    }
  },
}
</script>
