<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb heading="Datos del empleado"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
          <b-card class="mb-4" :title="tituloAccion" >
            <h6 class="mb-4">{{ $t('vista.ventas.clientes.datos-personales') }}</h6>
              <b-form class="av-tooltip mb-5 tooltip-label-right">
                <b-row>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                      <div>
                        <b-overlay :show="consultandoCedula" rounded="lg" opacity="0.6">
                          <template #overlay>
                            <div class="d-flex align-items-center">
                              <b-spinner small type="grow" variant="secondary"></b-spinner>
                              <b-spinner type="grow" variant="dark"></b-spinner>
                              <b-spinner small type="grow" variant="secondary"></b-spinner>
                              <!-- We add an SR only text for screen readers -->
                              <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') }}...</span>
                            </div>
                          </template>
                          <b-form-input 
                            type="text" v-model.trim="empleado.cedula" 
                            @keyup.enter="consultarCedula()" class="fondo-transparente-min" 
                            :state="!$v.paciente.cedula.$error"
                            :placeholder="$t('vista.busqueda.digitar-enter')"/>
                          <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.cedula') }}</b-form-invalid-feedback>
                        </b-overlay>
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                      <b-form-input type="text" v-model="empleado.nombres" :state="!$v.empleado.nombres.$error"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.nombres') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="12">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                      <b-form-input type="text" v-model.trim="empleado.direccion" :state="!$v.empleado.direccion.$error"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.direccion') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                      <b-form-input type="text" v-model.trim="empleado.telefonos" :state="!$v.empleado.telefonos.$error"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.telefonos') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                      <b-form-input type="text" v-model.trim="empleado.email"  :state="!$v.empleado.email.$error"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.email') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                </b-row>
                <h6 class="mb-4">Datos de nomina</h6>
                <b-row>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group label="Cargo">
                      <b-form-select
                        v-model="empleado.cargo_id" 
                        :options="cargos"
                        value-field="id"
                        text-field="denominacion"
                        size="sm"
                      />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group label="">
                      <b-form-input type="text" pattern="^\d*(\.\d{0,2})?$" v-model.number="empleado.sueldo"/>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group label='Fecha de ingreso'>
                      <datepicker
                        class="fecha-md"
                        :bootstrap-styling="true"
                        v-model="entrada"
                        :language="es"
                      ></datepicker>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group label='Entrada al seguro social'>
                      <datepicker
                        class="fecha-md"
                        :bootstrap-styling="true"
                        v-model="asegurado"
                        :language="es"
                      ></datepicker>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group label='Registro en el ministerio'>
                      <datepicker
                        class="fecha-md"
                        :bootstrap-styling="true"
                        v-model="registro"
                        :language="es"
                      ></datepicker>
                    </b-form-group>
                  </b-colxx>
                </b-row>
                <div class="mt-4">
                  <b-overlay 
                    :show="guardando" 
                    opacity=0.6
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                    @hidden="ocultarGuardando"
                  >
                    <b-button ref="btGuardar" :disabled="guardando" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
                  </b-overlay>  
                  <b-button ref="btCancelar" :disabled="guardando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
                </div>
            </b-form>
          </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>

 export default {
    data() {
      return {
        empleado: {
          id: 0,
          subscripcion_id: 0,
          empresa_id: 0,
          cedula: "",
          nombres: "",
          direccion: "",
          telefonos: "",
          emai: "",
          cargo_id: "",
          sueldo: 0,
          entrada_fecha: null,
          aseguramiento_fecha: null,
          ministerio_fecha: null,
          departamento_id: 0,
          referencia: 0,
          estado: 0,
        },
        cargos: [],
        guardando: true,
        consultandoCedula: false,
      }
    },
    computed: {
      entrada: {
        get: function() {
          if (this.empleado.entrada_fecha != null)
            return this.$moment(this.empleado.entrada_fecha).toDate();
          else
            return null;  
        },
        set: function(v) {
          this.empleado.entrada_fecha = v;
        }
      },
      asegurado: {
        get: function() {
          if (this.empleado.aseguramiento_fecha != null)
            return this.$moment(this.empleado.aseguramiento_fecha).toDate();
          else
            return null;  
        },
        set: function(v) {
          this.empleado.aseguramiento_fecha = v;
        }
      },
      registro: {
        get: function() {
          if (this.empleado.ministerio_fecha != null)
            return this.$moment(this.empleado.ministerio_fecha).toDate();
          else
            return null;  
        },
        set: function(v) {
          this.empleado.ministerio_fecha = v;
        }
      },
    },
    methods: {
      guardar() {

      },
      cancelar() {

      },
      ocultarGuardando() {

      },
      consultarCedula() {

      }
    },
 }
</script>