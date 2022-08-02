<template>
  <div>
    <b-row v-if="!esPublico">
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('vista.clinica.consultas.editor-titulo')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-modal v-model="selPacienteVer" title="Seleccionar paciente" v-on:ok="seleccionadoPaciente()">
      <paciente-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="ok()" :disabled="pacienteNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row>
      <b-colxx xxs="12">
          <b-card class="mb-4" :title="tituloAccion" >
            <h6 class="mb-4">{{ $t('vista.clinica.consultas.datos-paciente') }}</h6>
              <b-form class="av-tooltip mb-5 tooltip-label-right">
                <b-row>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.tipo-identificacion')">
                      <b-form-select v-model="consulta.relPaciente.relCliente.identificacion_tipo"
                        :options="tiposIdentificacion"
                        value-field="id"
                        text-field="denominacion"
                        size="xs"
                      />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                      <div>
                        <b-overlay :show="ocupadoCedula" rounded="lg" opacity="0.6">
                          <template #overlay>
                            <div class="d-flex align-items-center">
                              <b-spinner small type="grow" variant="secondary"></b-spinner>
                              <b-spinner type="grow" variant="dark"></b-spinner>
                              <b-spinner small type="grow" variant="secondary"></b-spinner>
                              <!-- We add an SR only text for screen readers -->
                              <span class="sr-only">Espere por favor...</span>
                            </div>
                          </template>
                          <b-form-input type="text" 
                            :state="!$v.consulta.relPaciente.relCliente.identificacion.$error"
                            v-model.trim="consulta.relPaciente.relCliente.identificacion"
                            :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.cedula')"
                            @keyup.enter="validarCedula()" :disabled="esPublico"/>
                          <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.cedula') }}</b-form-invalid-feedback>  
                        </b-overlay>
                      </div>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                      <b-form-input ref="txNombre" type="text" v-model="nombrePaciente" 
                        :state="!$v.consulta.relPaciente.relCliente.nombres.$error" 
                        :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.busqueda.por') + ' ' + $t('vista.ventas.clientes.campos.nombres')"
                        @keyup.enter="buscarPaciente()"/>
                      <b-form-invalid-feedback>{{ $t('vista.clinica.consultas.validacion.paciente') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                      <b-form-input 
                        :state="!$v.consulta.relPaciente.relCliente.direccion.$error"
                        type="text" v-model.trim="consulta.relPaciente.relCliente.direccion"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.direccion') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                      <b-form-input 
                        :state="!$v.consulta.relPaciente.relCliente.telefonos.$error"
                        type="text" v-model.trim="consulta.relPaciente.relCliente.telefonos"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.telefonos') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                      <b-form-input 
                        :state="!$v.consulta.relPaciente.relCliente.email.$error"
                        type="text" v-model.trim="consulta.relPaciente.relCliente.email"/>
                      <b-form-invalid-feedback>{{ $t('vista.ventas.clientes.validacion.email') }}</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                </b-row>
                <h6 class="mb-4">{{ $t('vista.clinica.consultas.datos-consulta') }}</h6>
                <b-row>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.clinica.consultas.campos.especialidad')">
                      <model-list-select 
                        :list="especialidades"
                        v-model="especialidadSeleccionado"
                        option-value="id"
                        option-text="descripcion"
                        placeholder="Digite para seleccione una opción">
                      </model-list-select>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.clinica.consultas.campos.servicio')">
                      <b-overlay :show="ocupadoServicio" rounded="lg" opacity="0.6">
                        <template #overlay>
                          <div class="d-flex align-items-center">
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <b-spinner type="grow" variant="dark"></b-spinner>
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') }}...</span>
                          </div>
                        </template>
                        <model-list-select 
                          :list="servicios"
                          v-model="servicioSeleccionado"
                          option-value="id"
                          option-text="descripcion">
                        </model-list-select>
                        <b-form-invalid-feedback :state="!$v.servicioSeleccionado.$error" >{{ $t('vista.clinica.consultas.validacion.servicio') }}</b-form-invalid-feedback>
                      </b-overlay>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="6">
                    <b-form-group :label="$t('vista.clinica.consultas.campos.medico')">
                      <b-overlay :show="ocupadoServicio" rounded="lg" opacity="0.6">
                        <template #overlay>
                          <div class="d-flex align-items-center">
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <b-spinner type="grow" variant="dark"></b-spinner>
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') }}...</span>
                          </div>
                        </template>
                        <model-list-select
                          :list="medicos"
                          v-model="medicoSeleccionado"
                          option-value="id"
                          option-text="nombres">
                        </model-list-select>
                        <b-form-invalid-feedback :state="!$v.medicoSeleccionado.$error" >{{ $t('vista.clinica.consultas.validacion.medico') }}</b-form-invalid-feedback>
                      </b-overlay>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="4">
                    <b-form-group :label='$t("vista.clinica.consultas.campos.fecha")'>
                      <datepicker
                        class="fecha-md"
                        :bootstrap-styling="true"
                        v-model="fechaSeleccionado"
                        :language="es"
                        :disabled-dates="fechasInvalidas"
                      ></datepicker>
                      <b-form-invalid-feedback :state="!$v.consulta.fecha.$error">{{ $t('vista.clinica.consultas.validacion.fecha') }}</b-form-invalid-feedback>  
                    </b-form-group>
                  </b-colxx>
                  <b-colxx xxs="12" sm="2">
                    <b-form-group label='Hora'>
                      <b-overlay :show="procesandoFecha" rounded="lg" opacity="0.6">
                        <template #overlay>
                          <div class="d-flex align-items-center">
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <b-spinner type="grow" variant="dark"></b-spinner>
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <span class="sr-only">{{ $t('vista.busqueda.espere-porfa') }}...</span>
                          </div>
                        </template>
                        <b-form-select v-model="horaSeleccionada" :options="horas" class="w-100"></b-form-select>
                      </b-overlay>
                      <b-form-invalid-feedback :state="!$v.consulta.numero.$error" >No ha seleccionado un horario</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>
                </b-row>
                <b-row>
                  <b-colxx xxs="12" sm="12">
                    <b-alert :show="alerta.ver" :variant="alerta.tipo" class="mt-4">{{ alerta.mensaje }}</b-alert>
                  </b-colxx>  
                </b-row>
                <div class="mt-4">
                  <b-overlay
                    :show="procesando"
                    opacity=0.6
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                    @hidden="ocultaOverlay"
                  >
                    <b-button ref="btGuardar" :disabled="procesando" @click="guardar(false)" variant="success" class="mr-3 mb-3">{{ $t('vista.comandos.guardar') }}</b-button>
                  </b-overlay>
                  <b-overlay
                    v-if="!esPublico"
                    :show="procesando" 
                    opacity=0.6
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                    @hidden="ocultaOverlay"
                  >
                    <b-button v-if="consulta.id <= 0" ref="btGuardarFac" :disabled="procesando" @click="guardar(true)" variant="success" class="mr-3 mb-3">{{ $t('vista.comandos.guardar-facturar') }}</b-button>
                  </b-overlay>
                  <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="mb-3">{{ $t('vista.comandos.cancelar') }}</b-button>
                </div>
            </b-form>
          </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import { cedulaValida, ayer, horario } from '../../utils'
const { required, numeric, email, between } = require("vuelidate/lib/validators");
import moment from 'moment';
import Datepicker from "vuejs-datepicker";
import {es} from 'vuejs-datepicker/dist/locale'
import { ModelListSelect } from 'vue-search-select'
import { mapGetters } from 'vuex';
import PacienteSeleccionar from "@/components/Clinica/PacienteSeleccionar";
//const mustBeCool = (value) => !helpers.req(value) || value.indexOf('cool') >= 0

export default {
  components: {
    ModelListSelect,
    Datepicker,
    "paciente-seleccionar": PacienteSeleccionar
  },
  data: function () {
    return {
      es: es,
      consulta: {
        id: 0,
        numero: 0,
        sucursal_id: 1,
        paciente_id: 0,
        medico_id: 0,
        fecha: null,
        servicio_id: 0,
        hora: "",
        motivo: "",
        estado: 0,
        relMedico: {
          id: 0,
          nombres: ""
        },
        relServicio: {
          id: 0,
          descripcion: ""
        },
        relPaciente: {
          id: 0,
          cliente_id: 0,
          fecha_nacimiento: null,
          sexo: 0,
          estado_civil: 0,
          instruccion: 0,
          grupo_sanguineo: 0,
          foto: "",
          alergias: "",
          antecedentes_familiares: "",
          antecedentes_personales: "",
          estado: 0,
          relCliente: {
            id: 0,
            empresa_id: 0,
            codigo: "",
            identificacion: "",
            identificacion_tipo: 0,
            nombres: "",
            direccion: "",
            telefonos: "",
            representante_nom: "",
            representante_ced: "",
            email: "",
            cupo: 0,
            estado: 0,
            relIdentificaTipo: null
          }
        }  
      },
      especialidades: [],
      servicios: [ { id: 0, descripcion: this.$t('vista.clinica.consultas.seleccione-esp') } ],
      medicos: [ { id: 0, nombres: this.$t('vista.clinica.consultas.seleccione-esp') } ],
      especialidadSel: 0,
      tiposIdentificacion: [],
      procesando: false,
      ocupadoCedula: false,
      ocupadoServicio: false,
      alerta: {
        ver: false,
        tipo: "info",
        mensaje: ""
      },
      selPacienteVer: false,
      fechasInvalidas: {
        to: ayer(), // Desactivar fechas hasta ayer
        days: [6, 0] // Sabados y domingos
      },
      horas: [],
      horaSeleccionada: 0,
      procesandoFecha: false
    }
  },
  validations: {
    consulta: {
      relPaciente: {
        relCliente: {
          identificacion: {
            required,
            valido(val) {
              return val.length <= 10 ? cedulaValida(val) : (val.length == 13 ? true : false);
            }
          },
          nombres: {
            required
          },
          direccion: {
            required
          },
          telefonos: {
            numeric
          },
          email: {
            email
          }
        }
      },
      fecha: {
        required,
        minValue(val) {
          return (this.$moment(new Date()).format("YYYY-MM-DD") <= this.$moment(val).format("YYYY-MM-DD"));
        },
      },
      numero: {
        between: between(1, 28)
      }
    },
    medicoSeleccionado: {
      required() {
        return this.consulta.medico_id > 0;
      }
    },
    servicioSeleccionado: {
      required() {
        return this.consulta.servicio_id > 0
      }
    }
  },
  computed: {
    ...mapGetters("clinica", [
      "selPaciente",
      'selPacienteTexto'
    ]),
    tituloAccion: function() {
      let res = this.$t('menu.clinica.consultas.nuevo');
      if (this.consulta.id > 0) {
        res = this.$t('menu.clinica.consultas.modificar');
      } else {
        if (this.$route.params.publico != undefined) {
          res = this.$t('vista.clinica.consultas.agendando');
        }
      }
      return res;  
    },
    esPublico: function() {
      return this.$route.params.id <= 0 && this.$route.params.publico != undefined;
    },
    fechaSeleccionado: {
      get: function() {
        return this.$moment(this.consulta.fecha).toDate();
      },
      set: function(v) {
        this.consulta.fecha = v;
      }
    },
    especialidadSeleccionado: {
      get: function() {
        return this.especialidadSel;
      },
      set: function(v) {
        this.especialidadSel = v;
        this.cambiarEspecialidad();
      }
    },
    servicioSeleccionado: {
      get: function() {
        return this.consulta.servicio_id;
      },
      set: function(v) {
        this.consulta.servicio_id = v;
        this.consulta.relServicio = this.servicios.find(x => x.id == v);
      }
    },
    medicoSeleccionado: {
      get: function() {
        return this.consulta.medico_id;
      },
      set: function(v) {
        this.consulta.medico_id = v;
        this.cargarHorariosDisponibles(this.consulta.fecha);
      }
    },
    pacienteNoSeleccionado() {
      return this.selPaciente == null;
    },
    nombrePaciente: {
      get () {
        return this.selPacienteTexto;
      },
      set (value) {
        this.consulta.relPaciente.relCliente.nombres = value;
        this.$store.commit('clinica/setSelPacienteTexto', value);
      }
    },
  },
  watch: {    
    'consulta.fecha'(valor) {
      this.cargarHorariosDisponibles(valor);
    }
  },
  methods: {
    guardar(fac) {
      if (this.horaSeleccionada != null)
        this.consulta.numero = this.horaSeleccionada;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify(
          "warning",
          this.$t('vista.transacciones.guardar-canot'),
          this.$t('vista.transacciones.guardar-invalido'),
          { duration: 3000, permanent: false }
        );
      } else {
        // TODO (parametrizar validacion)
        let val = true;
        let msj = this.$t("vista.transacciones.incompleto");
        if (val) {
          this.procesarGuardado(fac);
        } else {
          this.$notify(
            "warning",
            this.$t('vista.transacciones.guardar-canot'),
            this.$t('vista.transacciones.campos-req') + ": " + msj,
            { duration: 3000, permanent: false }
          );
        }
      }
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.go(-1);
    },
    validarCedula() {
      this.ocupadoCedula = true;
      this.$store
        .dispatch("clinica/pacientePorCedula", this.consulta.relPaciente.relCliente.identificacion)
        .then(function(r) {
          if (r.status == 200) {
            if (r.data.res) {
              if (r.data.data != undefined) {
                this.consulta.relPaciente = r.data.data;
                this.$store.commit('clinica/setSelPacienteTexto', r.data.data.relCliente.nombres);
                if (this.$route.params.id <= 0 ) {
                  if (this.$route.params.publico) {

                  }
                }
              }
            } else {
              if (r.data.cid > 0) {
                this.consulta.relPaciente.relCliente.id = r.data.data;
                this.relPaciente.id = 0;
                this.nombrePaciente = r.data.data.relCliente.nombres;
                if (r.data.data != undefined) {
                  this.alerta.mensaje = "La cédula está en la base de datos pero no esta registrado como paciente, se creará un registro nuevo";
                  this.alerta.tipo = "warning";
                  this.alerta.ver = true;
                  this.consulta.relPaciente.relCliente = r.data.data;
                }
              }
            }
          }
          this.ocupadoCedula = false;
        }.bind(this))
        .catch(function(e) {
          this.ocupadoCedula = false;
        }.bind(this));
    },
    procesarGuardado(fac) {
      if (this.consulta.relPaciente.id != undefined) {
        this.consulta.paciente_id = this.consulta.relPaciente.id;
      }
      this.$store
        .dispatch("clinica/consultaGuardar", this.consulta)
        .then(function(res) {
          if (res.status <= 201) {
            if (fac) {
              this.guardarfac(res.data.cid);
            } else {
              if (this.esPublico) {
                this.consulta.id = res.data.cid;
                this.irAExito();
              } else {
                this.$router.go(-1);
              }
            }
          } else {
            if (fac) {
              this.guardarfac(res.data.cid);
            }
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          console.log(">>>> ConsultaDatos.vue : ProcesarGuardado -> error", e)
          this.procesando = false;
          this.$notify(
            "danger", 
            this.$t('vista.transacciones.guardando-reg'), 
            this.$t('vista.transacciones.guardar-error') + ": " + e.message,
            { duration: 3000, permanent: false }
          );
        }.bind(this));
    },
    guardarfac(cid) {
      console.log(cid);
      let fac = {
        id: 0,
        tipo: 11,
        numero: 0,
        fecha: this.consulta.fecha,
        sucursal_id: this.consulta.sucursal_id,
        plazo: 0,
        cliente_id: this.consulta.relPaciente.relCliente.id,
        vendedor_id: 1,
        observaciones: this.$t('vista.clinica.consultas.factura-receta'),
        descuento_porcentaje: 0,
        porcentaje_venta: 0, // Rect
        subtotal: 0, 
        subtotalex: 0, 
        descuento: 0, 
        recargo: 0, 
        flete: 0, 
        impuestos: 0, 
        abonos: 0, 
        estado: 0,
        especie: cid, // Consulta
        movimiento_id: 1, // Bodega 
        ecomprobante_id: 0, 
        operador: '',
        relCliente: this.consulta.relPaciente.relCliente,
        relItems: [],
      }
      if (this.consulta.relServicio.relProducto != undefined) {
        let item = {
          id: 0,
          venta_id: 0,
          movitem_id: 1,
          producto_id: this.consulta.relServicio.relProducto.id,
          cantidad: 1,
          pedido: 0,
          precio: this.consulta.relServicio.relProducto.precio,
          costo: 0,
          descuento: 0,
          adicional: 0,
          observacion: '',
          presentacion_id: 0, 
          lote_id: 0,
          relProducto: this.consulta.relServicio.relProducto
        }
        fac.relItems.push(item);
      }

      let valServ = this.consulta.relServicio.valor;
      this.$router.push({
        name: 'facturas-crear',
        params: {
          id: 0,
          dato: fac,
          tipo: "Factura",
          tipoId: 11,
          lectura: false,
          servicioValor: valServ,
        }
      });
      // insertar el producto del servicio
    },
    cambiarEspecialidad() {
      // Actualizar lista de servicio por especialidad
      this.ocupadoServicio = true;
      this.$store
        .dispatch("clinica/serviciosEspecialidad", this.especialidadSel)
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta != null) {
              this.servicios = r.respuesta.data;
            }
          }
          this.ocupadoServicio = false;
        }.bind(this))
        .catch(function(e) {
          this.ocupadoServicio = false;
        }.bind(this));

        // Actualizar lista de medicos por especialidad
        this.$store
          .dispatch("clinica/medicosPorEspecialidadEstado", {
            especialidad: this.especialidadSel,
            estado: 0
          })
          .then(function(r) {
            if (r.id == 1) {
              if (r.respuesta != null) {
                this.medicos = r.respuesta.data;
              }
            }
          }.bind(this));
    },
    seleccionadoPaciente() {
      this.consulta.relPaciente = this.selPaciente;
      this.nombrePaciente = this.selPaciente.relCliente.nombres;
      this.$refs.txNombre.$el.value = this.selPaciente.relCliente.nombres;
    },
    buscarPaciente() {
      this.selPacienteVer = true;
    },
    irAExito() {
      // buscar doctor en this.medicos
      let med = this.medicos.filter(x => {
        return x.id == this.consulta.medico_id;
      });
      this.$router.push({
        name: "agendado",
        params: {
          id: 0,
          dato: {
            id: this.consulta.id,
            numero: this.consulta.numero,
            paciente_id: this.consulta.paciente_id,
            medico_id: this.consulta.medico_id,
            fecha: this.consulta.fecha,
            hora: "",
            motivo: this.consulta.motivo,
            sucursal_id: 1,
            estado: 0,
            servicio_id: this.consulta.servicio_id,
            relPaciente: this.consulta.relPaciente,
            relMedico: med[0],
            relServicio: this.consulta.relServicio
          }
        }
      });
    },
    cargarHorariosDisponibles(valor) {
      let hoy = new Date();
      let horas = hoy.getHours();
      let minutos = hoy.getMinutes();
      if (horas < 10) horas = 0 + horas;
      if (minutos < 10) minutos = "0" + minutos;
      let horaActual = horas + ":" + minutos;
      if (this.consulta.medico_id > 0) {
        this.horas = [];
        this.procesandoFecha = true;
        let param = {
          id: this.consulta.medico_id,
          desde: valor,
          hasta: valor,
          estado: 0
        }
        // marcar desactivados
        this.$store
          .dispatch("clinica/consultasMedicoFechaEstado", param)
          .then(function(r) {
            if (r.respuesta.length == 28) {
              this.$notify(
                "danger", 
                "Agendar cita", 
                "No hay horarios disponibles para este medico",
                { duration: 3000, permanent: false }
              );  
            } else {
              horario().forEach(h => {
                // en numero esta registrado el horario.id
                let desactivado = h.codigo < horaActual;
                console.log("Comparacion de horas = " + desactivado)
                console.log(h.codigo);
                console.log(horaActual);
                if (r.respuesta.length > 0) {
                  // Marcar los agendados como inactivos
                  let ooo = r.respuesta.some(e => e.numero == h.id);
                  if (ooo) {
                    desactivado = true;
                  }
                }
                let item = { value: h.id, text: h.titulo, disabled: desactivado };
                this.horas.push(item);
              });
            }
            this.procesandoFecha = false;
          }.bind(this))
          .catch(function(e) {
            console.log(e);
            this.procesandoFecha = false;
          }.bind(this));
        
      }
    }
  },
  mounted() {
    this.nombrePaciente = "";
    this.$store
      .dispatch("clinica/especialidadesTodas")
      .then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.especialidades = r.respuesta.data;
          }
        }
      }.bind(this));

    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 12 // Tipos de identificacion
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.tiposIdentificacion = r.respuesta.data;
            if (this.$route.params.publico) {
              let tipoid = this.$route.params.cedula.length == 13 ? 0 : 1
              this.consulta.relPaciente.relCliente.identificacion_tipo = r.respuesta.data[tipoid].id;
            }
          }
        }
      }.bind(this));

    if (this.$route.params.id > 0) {
      this.consulta = {
        id: this.$route.params.id,
        paciente_id: this.$route.params.dato.paciente_id,
        medico_id: this.$route.params.dato.medico_id,
        fecha: this.$route.params.dato.fecha,
        numero: this.$route.params.dato.numero,
        hora: this.$route.params.dato.hora,
        sucursal_id: this.$route.params.dato.sucursal_id,
        estado: this.$route.params.dato.estado,
        servicio_id: this.$route.params.dato.servicio_id,
        relPaciente: this.$route.params.dato.relPaciente,
        relMedico: this.$route.params.dato.relMedico,
        relServicio: this.$route.params.dato.relServicio,
      }
      if (this.consulta.fecha != undefined) {
        try {
          const f = this.consulta.fecha.split();
          this.consulta.fecha = new moment(f[0], f[1], f[2]).toDate();
        } catch(e) {
          this.consulta.fecha = new moment.utc(this.consulta.fecha);
        }
      }

      if (this.consulta.numero > 0) {
        this.horaSeleccionada = horario()[this.consulta.numero - 1].id;
      }

      if (this.$route.params.dato.relServicio != null && this.$route.params.dato.relServicio.relEspecialidad != null) {
        this.especialidadSel = this.$route.params.dato.relServicio.relEspecialidad.id;
        this.cambiarEspecialidad();
      }

      if (this.consulta.relPaciente == null && this.$route.params.dato != null) {
        this.consulta.relPaciente = this.$route.params.dato.relPaciente;
        this.nombrePaciente = this.$route.params.dato.relPaciente.relCliente.nombres;
      }
      
      if (this.consulta.relPaciente != null) {
        this.nombrePaciente = this.consulta.relPaciente.relCliente.nombres;
      }
    } else {      
      this.consulta.fecha = new Date();
    };
    if (this.$route.params.id <= 0) {
      this.consulta.relPaciente = {
        id: 0,
        cliente_id: 0,
        fecha_nacimiento: null,
        sexo: 0,
        estado_civil: 0,
        instruccion: 0,
        grupo_sanguineo: 0,
        foto: "",
        alergias: "",
        antecedentes_familiares: "",
        antecedentes_personales: "",
        estado: 0,
        relCliente: {
          id: 0,
          empresa_id: 0,
          codigo: "",
          identificacion: "",
          identificacion_tipo: 0,
          nombres: "",
          direccion: "",
          telefonos: "",
          representante_nom: "",
          representante_ced: "",
          email: "",
          cupo: 0,
          estado: 0,
          relIdentificaTipo: null
        }
      }
      if (this.$route.params.publico) {
        this.consulta.relPaciente.relCliente.identificacion = this.$route.params.cedula;
        this.validarCedula();
      }
    }
  }
}
</script>