<template>
    <div>
      <b-row>
        <b-colxx xxs="12">
          <h1>Comprobantes electronicos</h1>
          <piaf-breadcrumb />
          <div class="mb-2">
            <div class="d-block d-md-inline-block">
              <datepicker
                class="fecha-sm-nav d-inline-block float-md-left mt-1 inline-vertical-middle"
                :bootstrap-styling="true"
                v-model="busquedaDesde"
                format="yyyy/MM/dd"
                :language="es"
              ></datepicker>
              <datepicker
                class="fecha-sm-nav d-inline-block float-md-left mt-1 ml-2 inline-vertical-middle"
                :bootstrap-styling="true"
                v-model="busquedaHasta"
                format="yyyy/MM/dd"
                :language="es"
              ></datepicker>
              <a 
                class="d-inline-block float-md-left ml-3 view-icon boton-comando inline-vertical-middle"
                @click="buscar()"
                v-b-tooltip.hover 
                :title="$t('vista.comandos.actualizar') + ' ' + $t('vista.busqueda.resultados')"
              >
                <i class="mdi mdi-24px mdi-find-replace"/>
              </a>
              <a 
                class="d-inline-block float-md-left ml-3 view-icon boton-comando inline-vertical-middle"
                @click="imprimir()"
                v-b-tooltip.hover 
                :title="$t('vista.comandos.imprimir')"
              >
                <i class="mdi mdi-24px mdi-printer"/>
              </a>
              <!--b-button @click="imprimir()" class="float-right">Imprimir</b-button-->
              <b-dropdown
                id="ddSucursal"
                :text="sucursalSel.nombre"
                variant="outline-primary"
                class="d-md-inline-block align-middle btn-group inline-vertical-middle ml-4"
                size="xs"
              >
                <b-dropdown-item v-for="item in sucursales" :key="item.Id" @click="seleccionarSucursal(item)">
                  {{ item.Nombre }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <!--div class="float-sm-right inline-vertical-middle">
                
            </div-->
          </div>    
        </b-colxx>
      </b-row>
      <b-row id="prnDiario">
        <b-colxx xxs="12">
          <b-card class="mb-4">
            <!--h5>{{ $t('vista.inventarios.productos.titulop') }}</!--h5-->
            <b-table
              responsive
              ref="custom-table"
              class="vuetable"
              :fields="columnas"
              :items="ventas"
              :busy="busquedaEjecutando"
            >
              <template #table-busy>
                <div class="loading-with-text">
                  <span class="loader"/>
                </div>
              </template>
              <template #cell(acciones)="row">
                <span
                    class="span-comando pt-1"
                    @click="ver(row.item)"
                    v-b-tooltip.hover
                    title="Ver comprobante"
                >
                  <i class="mdi mdi-eye mdi-18px"/>
                </span>
              </template>
              <template #head(Fecha)="data">
                <div style="text-align: center;">
                  {{ data.label }}
                </div>
              </template>
              <template #cell(Fecha)="fila">
                <div style="text-align: center;">
                  {{ $moment(fila.item.Fecha).format('YYYY-MM-DD') }}
                </div>
              </template>
              <template #head(SubtotalMasEx)="data">
                <div style="text-align: right;">
                  {{ data.label }}
                </div>
              </template>
              <template #cell(SubtotalMasEx)="fila">
                <div style="text-align: right;">
                  ${{ parseFloat(fila.item.Subtotal) + parseFloat(fila.item.SubtotalEx) | dinero }}
                </div>
              </template>
              <template #head(Impuestos)="data">
                <div style="text-align: right;">
                  {{ data.label }}
                </div>
              </template>
              <template #cell(Impuestos)="fila">
                <div style="text-align: right;">
                  ${{ parseFloat(fila.item.Impuestos) | dinero }}
                </div>
              </template>
              <template #head(Total)="data">
                <div style="text-align: right;">
                  {{ data.label }}
                </div>
              </template>
              <template #cell(Total)="fila">
                <div style="text-align: right;">
                  ${{ (parseFloat(fila.item.Subtotal) + parseFloat(fila.item.SubtotalEx) + parseFloat(fila.item.Recargo) + parseFloat(fila.item.Flete) + parseFloat(fila.item.Impuestos)) - parseFloat(fila.item.Descuento) | dinero }}
                </div>
              </template>
              <template #foot(total)="fila">
                <div style="text-align: right;">
                  ${{ (parseFloat(fila.item.Subtotal) + parseFloat(fila.item.SubtotalEx) + parseFloat(fila.item.Recargo) + parseFloat(fila.item.Flete) + parseFloat(fila.item.Impuestos)) - parseFloat(fila.item.Descuento) | dinero }}
                </div>
              </template>
              <template #head(CEAutorizaFecha)="data">
                <div style="text-align: center;">
                  {{ data.label }}
                </div>
              </template>
              <template #cell(estado)="fila">
                <b-badge :variant="$t('vista.ventas.facturas.estados.colores.' + parseInt(fila.item.Estado))">{{ etiquetaEstado(fila) }}</b-badge>
              </template>
              <template #cell(CEAutorizaFecha)="fila">
                <div style="text-align: center;">
                  {{ $moment(fila.item.CEAutorizaFecha).format('YYYY-MM-DD') }}
                </div>
              </template>              
            </b-table>
            <!--div style="text-align: right;">
              <span class="font-weight-semibold mr-4">TOTAL</span>
              <span class="font-weight-semibold mr-2">$ {{ totalGeneral | dinero }}</span>
            </div-->
          </b-card>
        </b-colxx>
      </b-row>
    </div>
  </template>
  
  <script>
  import Datepicker from "vuejs-datepicker";
  import {es} from 'vuejs-datepicker/dist/locale'
  import { tipoDenominacion } from "@/constants/tipos";
  import { getEmpresa } from "../../utils";
  export default {
    components: {
      Datepicker
    },
    data() {
      return {
        es: es,
        busquedaEjecutando: false,
        busquedaDesde: new Date(),
        busquedaHasta: new Date(),
        ventas: [],
        columnas: [
          {
            label: this.$t("vista.comandos.acciones"), 
            key: "acciones", 
            sortable: false,
          },
          {
            label: "Secuencial", 
            key: "Secuencial",
            sortable: true
          },
          { 
            label: this.$t("vista.transacciones.campos.fecha"), 
            key: "Fecha",
            sortable: true,
          },
          {
            label: "Fec. Autorizacion", 
            key: "CEAutorizaFecha",
            sortable: true,
          },
          {
            label: this.$t("vista.ventas.facturas.campos.cliente"), 
            key: "Nombres", 
            sortable: true 
          },
          {
            label: "Subtotal", 
            key: "SubtotalMasEx", 
            sortable: true,
          },
          {
            label: "Impuestos", 
            key: "Impuestos", 
            sortable: true,
          },
          {
            label: "Total", 
            key: "Total", 
            sortable: true,
          },
          {
            label: "Estado", 
            key: "Estado", 
            sortable: false,
          },
          {
            label: "Num. Sist.", 
            key: "Numero", 
            sortable: false,
          },
          {
            label: "Clave de acceso", 
            key: "CEClaveAcceso", 
            sortable: false,
          }
        ],
        sucursales: [],
        sucursalSel: {
          id: 0,
          nombre: "Seleccionar"
        }
      }
    }, 
    filters: {
      dinero(val) {
        return val.toFixed(2);
      },
      tipo(t) {
        return tipoDenominacion(t);
      }
    },
    computed: {
      totalGeneral: function() {
        return this.ventas.reduce(
          (acc, item) => acc + (parseFloat(item.Subtotal) + parseFloat(item.SubtotalEx) + parseFloat(item.Recargo) + parseFloat(item.Flete) + parseFloat(item.Impuestos)) - parseFloat(item.Descuento), 0
        );
      }
    },
    methods: {
      ver(p) {
        this.$router.push({
					name: "facturas-modificar",
					params: {
						id: p.Id,
						dato: null,
						tipoId: p.Tipo, 
						lectura: true
					}
        });
      },
      buscar() {
        this.busquedaEjecutando = true;
        this.ventas = [];
        this.$store
          .dispatch("ventas/ventasDiarioCE", { sucursal: this.sucursalSel.id, desde: this.busquedaDesde, hasta: this.busquedaHasta})
          .then(function(r) {
            if (r.id == 1) {
              if (r.respuesta.data != undefined) {
                this.ventas = r.respuesta.data;
              }
            }
            this.busquedaEjecutando = false;
            if (this.ventas.length <= 0) {
              this.$notify("warning",
                "Diario de ventas",
                this.$t("vista.busqueda.no-encontrado"),
                { duration: 3000, permanent: false });
            }
          }.bind(this))
          .catch(function(e) {
            console.log("Error");
            console.log(e);
            this.busquedaEjecutando = false;
            this.$notify("warning",
              "Diario de ventas",
              this.$t("vista.busqueda.no-encontrado"),
              { duration: 3000, permanent: false });
          }.bind(this));
      },
      imprimir() {
        this.$htmlToPaper("prnDiario");
      },
      seleccionarSucursal(suc) {
        this.sucursalSel.id = suc.Id
        this.sucursalSel.nombre = suc.Nombre
      },
      etiquetaEstado(fila)  {
      if (fila.item.Estado <= 1) {
        return 'Activo';
      } else {
        return this.$t('vista.ventas.facturas.estados.' + parseInt(fila.item.Estado))
      }
    },
    },
    mounted() {
      this.$store
        .dispatch("ajustes/sucursalesEmpresa", getEmpresa().id)
        .then(function(r) {
          this.sucursales = r.data
          this.sucursalSel.id = r.data[0].Id
          this.sucursalSel.nombre = r.data[0].Nombre
        }.bind(this));  
    },
  }
  </script>