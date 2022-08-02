<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ $t('vista.inventarios.existencias') }}</h1>
      <piaf-breadcrumb />
      <div class="mb-2">
        <div class="d-block d-md-inline-block">
          <b-dropdown
            id="ddAtributoBusca"
            :text="`${bodegaTexto}`"
            variant="outline-primary"
            class="d-md-inline-block align-middle btn-group, mr-4 float-left"
            size="xs"
          >
            <b-dropdown-item v-for="item in bodegas" :key="item.Id" @click="cambiarBodega(item)">
              {{ item.Denominacion }}
            </b-dropdown-item>
          </b-dropdown>
          <!--b-button @click="imprimir()" class="float-right">Imprimir</b-button-->
          <a 
            class="d-inline-block float-md-left ml-3 view-icon boton-comando"
            @click="actualizar()"
            v-b-tooltip.hover 
            :title="$t('vista.comandos.actualizar') + ' ' + $t('vista.busqueda.resultados')"
          >
            <i class="mdi mdi-24px mdi-find-replace"/>
          </a>
          <a 
            class="d-inline-block float-md-left ml-3 view-icon boton-comando;"
            @click="imprimir()"
            v-b-tooltip.hover 
            :title="$t('vista.comandos.actualizar') + ' ' + $t('vista.busqueda.resultados')"
          >
            <i class="mdi mdi-24px mdi-printer"/>
          </a>
          <div class="d-md-inline-block float-md-right">
            <b-checkbox switch
              v-model="verCeros" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle ml-5"
            >{{ $t('vista.inventarios.sin-stock') }}</b-checkbox>
          </div>
        </div>
      </div>
    </b-colxx>
    <b-colxx id="prnExiste" xxs="12">
      <b-table responsive :items="items" :busy="busquedaEjecutando" :fields="campos">
        <template #table-busy>
          <table-busy :mensaje="$t('vista.busqueda.ejecutandoq') + '...'" />
        </template>
        <template #cell(Saldo)="fila">
          <div style="text-align: right;">
            {{ fila.item.Saldo }}
          </div>  
        </template>
        <template #head(Saldo)="data">
          <div style="text-align: right;">
            <span>{{ data.label }}</span>
          </div>
        </template>
      </b-table>
    </b-colxx>    
  </b-row>    
</template>
<script>
export default {
  data() {
    return {
      busquedaEjecutando: false,
      bodegas: [],
      bodegaId: 0,
      bodegaTexto: '',
      verCeros: false,
      items: [],
      campos: [
        { 
          label: this.$t("vista.inventarios.productos.campos.codigo"), 
          key: "Codigo",
          sortable: true
        },
        { 
          label: this.$t("vista.inventarios.productos.campos.nombre"), 
          key: "Nombre",
          sortable: true
        },
        {
          label: this.$t("vista.inventarios.productos.campos.medida"), 
          key: "Medida", 
          sortable: true 
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.cantidad"),
          key: "Saldo",
          sortable: true
        }
      ]
    }
  },
  methods: {
    imprimir() {
      this.$htmlToPaper("prnExiste");
    },
    cambiarBodega(p) {
      this.bodegaId = p.Id;
    },
    actualizar() {
      this.busquedaEjecutando = true;
      this.items = [];
      let z = this.verCeros ? 1 : 0;  
      this.$store
        .dispatch("inventarios/existenciasCeros", {
          bodega: this.bodegaId,
          zeros: z
        })
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.items = r.respuesta.data;
              this.busquedaEjecutando = false;
            }
          }
          this.busquedaEjecutando = false;
        }.bind(this));
    }
  },
  created() {
    this.$store
      .dispatch("inventarios/bodegasPorEstado", { estado: 0, empresa: this.$store.state.empresaAccedida.id})
      .then(function(r) {
        this.bodegas = r.data;
        this.bodegaId = r.data[0].Id;
        this.bodegaTexto = r.data[0].Denominacion;
        this.actualizar();
      }.bind(this));  
  }
}
</script>