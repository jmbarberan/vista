<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>Comparativo inventario fisico No. {{ numero }}</h1>
        <div class="top-right-button-container">
          <b-button
            @click="volver()"
            variant="primary"
            size="sm"
            class="top-right-button mb-2"
          >Volver</b-button>
        </div>
        <b-card class="mb-4">
          <b-table
            ref="tablaMovimientos"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="items"
            :current-page="paginaActual"
            :busy="busquedaEjecutando"
            responsive
          >
            <template #table-busy>
              <div class="loading-with-text">
                <span class="loader"/>
              </div>
            </template>
            <template #cell(Existencia)="fila">
              <div style="text-align: right;">
                {{ fila.item.existencia }}
              </div>
            </template>
            <template #cell(Conteo)="fila">
              <div style="text-align: right;">
                {{ fila.item.conteo }}
              </div>
            </template>
            <template #cell(Diferencia)="fila">
              <div style="text-align: right;">
                {{ calcularDiferencia(fila.item.existencia, fila.item.conteo) }}
              </div>
            </template>
            <template #cell(Estado)="fila">
              <b-badge :variant="colorDiferencia(fila.item.existencia, fila.item.conteo)">
                {{ textoDiferencia(fila.item.existencia, fila.item.conteo) }}
              </b-badge>
            </template>
          </b-table>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>

export default {
  data() {
    return {
      numero: 1,
      porPagina: 10,
      paginaActual: 1,
      lPaginas: [ 5, 10, 15, 20 ],
      desde: 0,
      hasta: 0,
      columnas: [
        {
          label: "Codigo", 
          key: "relProducto.Codigo", 
          sortable: false,
        },
        { 
          label: "Producto", 
          key: "relProducto.Nombre",
          sortable: true
        },
        { 
          label: "Saldo teorico", 
          key: "existencia",
          sortable: true,
        },
        {
          label: "Conteo", 
          key: "conteo", 
          sortable: true 
        },
        {
          label: "Diferencia",
          key: "Diferencia",
          sortable: true
        },
        {
          label: "Estado",
          key: "Estado",
          sortable: true
        }
      ],
      items: [],
      busquedaEjecutando: false
    }
  },
  computed: {
    paginas() {
      return Math.ceil(this.total / this.porPagina)
    }
  },
  methods: {
    cambiarPagina(p) {
      this.porPagina = p;
    },
    cambiarPaginaActual(e) {
      if (this.total == 0) {
        this.desde = 0;
      } else {
        if (e == 1) {
          this.desde = e;
        } else {
          this.desde = ((e - 1) * this.porPagina) + 1;
        };
      }
      if (this.total == 0) {
        this.hasta = 0;
      } else {
        if (e == this.paginas) {
          this.hasta = this.total;
        } else {
          this.hasta = (this.desde - 1) + this.porPagina;
        }
      }
      this.paginaActual = e;
    },
    calcularDiferencia(saldoTeorico, conteo) {
      if (conteo > saldoTeorico) {
        return conteo - saldoTeorico
      }
      return saldoTeorico - conteo
    },
    colorDiferencia(saldoTeorico, conteo) {
      if (conteo > saldoTeorico) {
        return "success"
      } else {
        return "danger"
      }
    },
    textoDiferencia(saldoTeorico, conteo) {
      if (conteo > saldoTeorico) {
        return "Sobrante"
      }
      return "Faltante"
    },
    cargarItems(p) {
      this.busquedaEjecutando = true;
      this.items = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("inventarios/inventarioFisicoComparativo", { id: p })
        .then(function(r) {
          if (r.data.result == true) {
            this.numero = r.data.numero;
            if (r.data.data != undefined) {
              this.items = r.data.data;
            }
          }
          this.busquedaEjecutando = false;
          if (this.items.length > 0) {
            this.paginaActual = 1;
            this.cambiarPaginaActual(1);
          } else {
            this.$notify("warning",
              "Comparativo de inventario fisico",
              "No se han encontrado diferencias en el inventario físico",
              { duration: 3000, permanent: false });
          }
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.busquedaEjecutando = false;
          this.$notify("warning",
            "Comparativo de inventario fisico",
            "No se pudo consultar las diferencias en el inventario físico",
            { duration: 3000, permanent: false });
        }.bind(this));
    },
    volver() {
      this.$router.go(-1);
    }
  },
  watch: {
    $route(to, from) {
      const id = parseInt(to.params.id);
      if (!isNaN(id)) {
        this.cargarItems(id);
      }
    }
  },
  filters: {
    dinero(val) {
      return val.toFixed(2);
    }
  },
  created() {
    const id = parseInt(this.$route.params.id);
    if (!isNaN(id)) {
      this.cargarItems(id);
    }
  },
  beforeDestroy() {
    this.respaldarTipo(this.tipoId);
  }
}
</script>