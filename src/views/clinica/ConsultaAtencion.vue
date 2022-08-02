<template>
  <div>
    <b-modal v-model="selProductoVer" title="Seleccionar producto" v-on:ok="productoSeleccionado()">
      <producto-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="ok()" :disabled="productoNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-modal v-model="selDiagnosticoVer" title="Seleccionar diagnostico" v-on:ok="diagnosticoSeleccionado()">
      <diagnostico-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="ok()" :disabled="diagnosticoNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row class="mb-4">
      <b-colxx lg="12" md="12">
        <piaf-breadcrumb :heading="$t('vista.clinica.consultas.atencion')"/>
        <div class="top-right-button-container">
          <b-button v-if="!lectura"
            variant="success"
            size="lg"
            class="top-right-button mr-2"
            @click="guardar()"
          >{{ $t('vista.comandos.guardar') }}</b-button>
          <b-button
            variant="primary"
            size="lg"
            class="top-right-button"
            @click="cancelar()"
          >{{ lectura ? $t('vista.comandos.volver') : $t('vista.comandos.cancelar') }}</b-button>
        </div>
      </b-colxx>
      <b-colxx lg="12" md="12">
        <div class="d-flex flex-row chat-heading">
          <div class="d-flex">
            <!--b-avatar v-if="hayFoto()" variant="info" :src="consulta.relPaciente.foto"></!--b-avatar-->
            <b-avatar variant="info" :text="traerIniciales(consulta.relPaciente.relCliente.nombres)" class="border-0 ml-0 mr-4 align-self-center"></b-avatar>
          </div>
          <div class="d-flex min-width-zero" style="width: 100%">
            <div
              class="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
            >
              <div class="min-width-zero" style="width: 100%">
                <b-row>
                  <b-colxx lg="4" md="12">
                    <p class="list-item-heading mb-1 truncate">
                      {{ $t('vista.clinica.consultas.campos.paciente') }}: {{ consulta.relPaciente.relCliente.nombres }}
                    </p>
                  </b-colxx>
                  <b-colxx lg="4" md="6">
                    <p class="list-item-heading mb-1 truncate">
                      {{ $t('vista.clinica.consultas.campos.medico') }}: {{ consulta.relMedico.nombres }}
                    </p>
                  </b-colxx>
                  <b-colxx lg="2" md="2">
                    {{ $t('vista.clinica.pacientes.campos.edad') }}: {{ edadPaciente() }}
                  </b-colxx>
                  <b-colxx lg="2" md="4">
                    {{ $t('vista.clinica.consultas.campos.fecha') }}: {{ consulta.fecha }}
                  </b-colxx>
                </b-row>
                <b-row>
                  <b-colxx lg="12" md="12">
                    <span class="mb-0 text-muted text-small mr-4">
                      {{ $t('vista.clinica.pacientes.campos.especialidad') }}: {{ consulta.relServicio.relEspecialidad.descripcion }}
                    </span>
                    <span class="mb-0 text-muted text-small">
                      {{ $t('vista.clinica.pacientes.campos.servicio') }}: {{ consulta.relServicio.descripcion }}
                    </span>
                  </b-colxx>
                  <!--b-colxx lg="6" md="12">
                    
                  </b-colxx-->
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </b-colxx>
    </b-row>
    <b-row class="mb-4">
      <b-colxx lg="12" md="12" sm="12">
        <b-card :title="$t('vista.clinica.consultas.mediciones')">
          <span v-if="medicionesAnt.length > 0">{{ medicionesAnt }}</span>
          <b-list-group v-else class="card-sinborde" horizontal="md">
            <b-list-group-item v-for="med in traerMediciones()" :key="med.id" class="flex-fill">
              <span class="text-muted">{{ med.titulo }}:</span>
              <span>{{ med.valor }}</span>
              <span>{{ med.sufijo }}</span>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-colxx>
    </b-row>
    <b-tabs content-class="mt-2" justified>
      <b-tab title="Atención General" active>
        <b-row> <!-- Sintomas, Exp. fisica, signos vitales, historial medico -->
          <b-colxx lg="6" md="6" sm="12">
            <b-card class="mb-4" :title="$t('vista.clinica.consultas.datos-consulta')">
              <b-form class="form-container">
                <b-form-group :label="$t('vista.clinica.consultas.campos.sintomas')">
                  <!--b-form-input v-model="consulta.sintomas_subjetivos" :disabled="lectura"></!--b-form-input-->
                  <b-textarea
                    v-model="consulta.sintomas_subjetivos"
                    :rows="4"
                    :max-rows="4"
                    :disabled="lectura"
                  />
                </b-form-group>
                <b-form-group :label="$t('vista.clinica.consultas.campos.antecedentes')">
                  <b-textarea
                    v-model="consulta.antecedentes"
                    :rows="4"
                    :max-rows="4"
                    :disabled="lectura"
                  />
                </b-form-group>
                <b-form-group :label="$t('vista.clinica.consultas.campos.exploracion')">
                  <b-textarea
                    v-model="consulta.exploracion_fisica"
                    :rows="4"
                    :max-rows="4"
                    :disabled="lectura"
                  />
                </b-form-group>
                <b-form-group>
                  <b-form-group :label="$t('vista.clinica.consultas.campos.diagnostico')">
                    <b-input-group>
                      <!--b-form-input ref="txDiagnostico" type="text" v-model="diagnosticoDescripcion" @keyup.enter="buscarDiagnostico()"/-->
                      <b-form-input v-model="diagnosticoTexto" :disabled="lectura" :placeholder="$t('vista.busqueda.digitar-enter') + ' ' + $t('vista.clinica.consultas.campos.diagnostico')" @keyup.enter.stop.prevent="buscarDiagnostico()"/>
                      <b-input-group-append is-text v-if="!diagnosticoNoSeleccionado">
                        {{ diagnosticoSeleccion.codigo }}
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-form-group>
                <b-form-group :label="$t('vista.clinica.consultas.campos.diagnostico-ext')">
                  <!--b-form-input v-model="consulta.diagnostico_descripcion" :disabled="lectura"></b-form-input-->
                  <b-textarea
                    v-model="consulta.diagnostico_descripcion"
                    :rows="4"
                    :max-rows="4"
                    :disabled="lectura"
                  />
                </b-form-group>
                <b-form-group :label="$t('vista.clinica.consultas.campos.tratamiento')">
                  <b-textarea
                    v-model="consulta.tratamiento"
                    :rows="4"
                    :max-rows="4"
                    :disabled="lectura"
                  />
                </b-form-group>
                <b-form-group :label="$t('vista.clinica.consultas.campos.datos-laboratorio')">
                  <b-textarea
                    v-model="consulta.laboratorio"
                    :rows="4"
                    :max-rows="4"
                    :disabled="lectura"
                  />
                </b-form-group>
                <b-form-group :label="$t('vista.clinica.consultas.campos.proxima-fecha')">
                  <datepicker
                    class="fecha-md"
                    :bootstrap-styling="true"
                    v-model="fechaProxima"
                    :language="es"
                    :disabled='lectura'
                    :disabled-dates="fechasInvalidas"
                  ></datepicker>
                </b-form-group>
              </b-form>
            </b-card>
          </b-colxx>
          <b-colxx lg="6" md="6" sm="12">
            <b-card class="mb-4" :title="$t('vista.clinica.consultas.historial')">
              <vue-perfect-scrollbar
                class="scroll lista-historico-consultas"
                :settings="{ suppressScrollX: true, wheelPropagation: false }"
              >
                <historial-item
                  v-for="his in historial"
                  :consulta="his"
                  :key="his.id"
                />
              </vue-perfect-scrollbar>
            </b-card>
          </b-colxx>
        </b-row>
        <b-row class="mb-4">
          <b-colxx lg="12" md="12" sm="12">
            <b-card class="mb-4">
              <template v-if="!lectura" #header>
                <h4 class="mt-4 ml-2">{{ $t('vista.clinica.consultas.receta') }} - {{ $t('vista.transacciones.agregar-items') }}</h4>
                <b-row class="ml-1 mr-1">
                  <b-col sm="8" md="4" lg="4" class="espacio-corto mb-2">
                    <b-input-group>
                      <b-form-input v-model="productoSeleccion.texto" :placeholder="$t('vista.busqueda.digitar-enter') + ' medicinas'" @keyup.enter.stop.prevent="buscarProducto()"/>
                      <b-input-group-append>
                        <b-button variant="primary" class="borde-recto" @click="buscarProducto()">
                          <i class="mdi mdi-magnify"/>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                  <b-col sm="4" md="2" lg="2" class="espacio-corto mb-2">
                    <b-form-input ref="txCantidad" size="sm" v-model="productoSeleccion.cantidad" 
                      placeholder="Cant." 
                      @keyup.enter="enfocarIndicaciones()"/>
                  </b-col>
                  <b-col sm="12" md="6" lg="6" class="espacio-corto mb-2">
                    <b-input-group>
                      <b-form-input ref="txDosis" v-model="productoSeleccion.indicaciones" 
                        :placeholder="$t('vista.clinica.consultas.campos.indicaciones')" 
                        @keyup.enter="agregarItem()"/>
                      <b-input-group-append>
                        <b-button variant="primary" class="borde-recto" @click="agregarItem()">
                          <i class="mdi mdi-plus"/>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                </b-row>
              </template>
              <template #footer>
                <b-row class="ml-1 mr-1">
                  <b-colxx md="4" lg="3" sm="6">
                    <b-button @click="recetaImprimir()">{{ $t('vista.comandos.imprimir') }}</b-button>
                    <b-button @click="recetaFacturar()" class="ml-2" 
                      v-if="lectura && consulta.recetaItems.length > 0 && esAdmin"
                    >{{ $t('vista.comandos.facturar') }}</b-button>
                  </b-colxx>
                  <b-colxx md="4" lg="3" sm="6">
                    
                  </b-colxx>
                </b-row>
              </template>
              <b-table responsive :items="consulta.recetaItems" :fields="recetaCampos" >
                <template #cell(comandos)="fila">
                  <span
                    class="span-comando pt-1"
                    @click="eliminarItem(fila)"
                    v-b-tooltip.hover
                    title="Eliminar item"
                  >
                    <i class="mdi mdi-trash-can mdi-18px"/>
                  </span>
                </template>
                <template #cell(descripcion)="fila">
                  <span v-if="fila.item.relProducto == null || fila.item.producto_id <= 0">{{ fila.item.descripcion }}</span>
                  <span v-else>{{ fila.item.relProducto.nombre }}</span>
                </template>
              </b-table>
            </b-card>
            <div id="prnReceta">
              <b-row class="medioA4 invisible">
                <b-colxx xxs="12" class="mb-5">
                  <div style="background-color:#ffffff; height:660px; max-width:830px; font-family: Helvetica,Arial,sans-serif !important; position: relative;">
                    <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" 
                      style="width:100%; background-color:#ffffff;border-collapse:separate !important; border-spacing:0;color:#242128; margin:0; padding-left:30px; padding-right:30px;" heigth="auto">
                      <tbody>
                        <tr>
                          <td align="left" valign="center" style="padding-bottom:0px; padding-top:10px; border-top:0;width:100% !important;">
                            <img src="@/assets/logos/black.png" />
                          </td>
                          <td align="right" valign="center" style="padding-bottom:0px;border-top:0;width:100% !important;">
                            <p style="color: #8f8f8f; font-weight: normal; line-height: 1.2; font-size: 12px; white-space: nowrap; ">
                              {{ empresa.lema }}<br> {{ empresa.telefonos }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">
                            <table style="width: 100%;">
                              <tbody>
                                <tr>
                                  <td style="vertical-align:middle; border-radius: 3px; padding:15px; background-color: #f9f9f9; border-right: 5px solid white;">
                                    <p style=" font-size: 11px">
                                      <span style="color:#303030; font-size: 11px;  line-height: 1.6; margin:0; padding:0;">{{ $t('vista.clinica.consultas.campos.paciente') }}:</span> {{ consulta.relPaciente.relCliente.nombres }} <br/>
                                      <span style="color:#303030; font-size: 11px;  line-height: 1.6; margin:0; padding:0;">{{ $t('vista.clinica.consultas.campos.medico') }}:</span> {{ consulta.relMedico.nombres }}<br/>
                                      <span v-if="consulta.proxima != null" style="color:#303030; font-size: 14px;  line-height: 1.6; margin:0; padding:0;">{{ $t('vista.clinica.consultas.campos.proxima-fecha') }}:</span> {{ $moment(consulta.proxima).format('YYYY-MM-DD') }}
                                    </p>
                                  </td>
                                  <td style="text-align: right; padding-top:0px; padding-bottom:0; vertical-align:middle; padding:15px; background-color: #f9f9f9; border-radius: 3px; border-left: 5px solid white;">
                                    <p style="color:#8f8f8f; font-size: 11px; padding: 0; line-height: 1.6; margin:0; ">
                                      {{ $t('vista.clinica.consultas.receta-titulos') }}<br>
                                      {{ consulta.fecha }}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div style="width: 100%; display: table;">
                              <table style="width: 40%; float: left; margin-top:20px; margin-right: 60px;">
                                <thead>
                                  <tr style="padding-top: 0px;">
                                    <th style="text-align: left; font-size: 10px; color:#8f8f8f; padding-bottom:5px;">
                                      {{ $t('vista.clinica.consultas.medicamento') }}
                                    </th>
                                    <th style="text-align: right; font-size: 10px; color:#8f8f8f; padding-bottom:5px;">
                                      {{ $t('vista.inventarios.movimientos.campos.cantidad') }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="item in consulta.recetaItems" :key="item.id" style="padding-top: 0px;">
                                    <td style="padding-top:0px; padding-bottom:18px;">
                                      <p style="font-size: 11px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                                        <span v-if="item.relProducto == null || item.producto_id <= 0">{{ item.descripcion }}</span>
                                        <span v-else>{{ item.relProducto.nombre }}</span>
                                      </p>
                                    </td>
                                    <td style="padding-top:5px; padding-bottom:18px; text-align: right;">
                                      <p href="#" style="font-size: 11px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                        {{ item.cantidad }}
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="width: 40%; float: left; margin-top:20px;">
                                <thead>
                                  <tr style="padding-top:0px;">
                                    <th style="text-align:left; font-size: 10px; color:#8f8f8f; padding-bottom: 5px;">
                                      {{ $t('vista.clinica.consultas.campos.indicaciones') }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="item in consulta.recetaItems" :key="item.id" style="padding-top: 10px;">
                                    <td style="padding-top:5px; padding-bottom:0px;">
                                      <p style="font-size: 11px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                                        <span v-if="item.relProducto == null || item.producto_id <= 0">{{ item.descripcion }}</span>
                                        <span v-else>{{ item.relProducto.nombre }}</span>
                                      </p>
                                      <p href="#" style="font-size: 11px; text-decoration: none; line-height: 1; color:#909090; padding-left: 15px; margin-top: 4px; margin-bottom:0;">
                                        {{ item.dosis }}
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </b-colxx>
              </b-row>
            </div>
          </b-colxx>
        </b-row>
      </b-tab>
      <b-tab :title="$t('vista.clinica.consultas.certificado')">
        <b-row>
          <b-colxx xxs="12">
            <b-card class="mb-4" :title="$t('vista.clinica.consultas.certificado')">
              <template #footer>
                <b-row class="ml-1 mr-1">
                  <b-colxx md="4" lg="3" sm="12">
                    <b-button @click="certificadoImprimir()">{{ $t('vista.comandos.imprimir') }}</b-button>
                  </b-colxx>
                </b-row>
              </template>
              <quill-editor ref="txtCertificado"
                            v-model="consulta.certificado"
                            :options="informeEditorOps"
                            :disabled="lectura">
            </quill-editor>
            </b-card>
          </b-colxx>
        </b-row>
      </b-tab>
      <b-tab :title="$t('vista.clinica.consultas.campos.orden-examenes')">
        <b-colxx lg="12" md="12" sm="12">
          <b-card class="mb-4" :title="$t('vista.clinica.consultas.campos.orden-examenes')">
            <template #footer>
              <b-row class="ml-1 mr-1">
                <b-colxx md="4" lg="3" sm="12">
                  <b-button @click="examenesImprimir()">{{ $t('vista.comandos.imprimir') }}</b-button>
                </b-colxx>
              </b-row>
            </template>
            <h6>{{ $t('vista.clinica.consultas.adicionales')}}</h6>
            <b-form-input class="mb-4" v-model="consulta.examenes" size="sm" :disabled="lectura"/>
            <div class="examenes">
              <b-form-group
                v-for="exa in vistaExamenes"
                :key="exa.id"
                :label="exa.denominacion"
              >
                <b-form-checkbox-group
                  v-model="exa.seleccionado"
                  :options="exa.items"
                  text-field="denominacion"
                  value-field="id"
                  stacked
                  :disabled="lectura"
                >
                </b-form-checkbox-group>
              </b-form-group>
            </div>
          </b-card>
          <div id="prnExamenes">
            <b-row class="medioA4 invisible">
              <b-colxx xxs="12" class="mb-5">
                <div style="background-color:#ffffff; height:660px; max-width:830px; font-family: Helvetica,Arial,sans-serif !important; position: relative;">
                  <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="width:100%; background-color:#ffffff;border-collapse:separate !important; border-spacing:0;color:#242128; margin:0; padding-left:30px; padding-right:30px;" heigth="auto">
                    <tbody>
                      <tr>
                        <td align="left" valign="center" style="padding-bottom:35px; padding-top:15px; border-top:0;width:100% !important;">
                          <img src="@/assets/logos/black.png" />
                        </td>
                        <td align="right" valign="center" style="padding-bottom:20px;border-top:0;width:100% !important;">
                          <p style="color: #8f8f8f; font-weight: normal; line-height: 1.2; font-size: 12px; white-space: nowrap; ">
                            {{ empresa.lema }}<br> {{ empresa.direccion }}<br> {{ empresa.telefonos }}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <table style="width: 100%;">
                            <tbody>
                              <tr>
                                <td style="vertical-align:middle; border-radius: 3px; padding:15px; background-color: #f9f9f9; border-right: 5px solid white;">
                                  <p>
                                    <span style="color:#303030; font-size: 11px;  line-height: 1.6; margin:0; padding:0;">{{ $t('vista.clinica.consultas.campos.paciente') }}:</span> {{ consulta.relPaciente.relCliente.nombres }} <br/>
                                    <span style="color:#303030; font-size: 11px;  line-height: 1.6; margin:0; padding:0;">{{ $t('vista.clinica.consultas.campos.medico') }}:</span> {{ consulta.relMedico.nombres }}
                                  </p>
                                </td>
                                <td style="text-align: right; padding-top:0px; padding-bottom:0; vertical-align:middle; padding:15px; background-color: #f9f9f9; border-radius: 3px; border-left: 5px solid white;">
                                  <p style="color:#8f8f8f; font-size: 11px; padding: 0; line-height: 1.6; margin:0; ">
                                    {{ $t('vista.clinica.consultas.examenes-titulo') }}<br>
                                    {{ consulta.fecha }}
                                  </p>
                                </td>
                              </tr>
                              <tr style="margin-top: 10px; margin-bottom: 10px">
                                <td>
                                  <p>{{ $t('vista.clinica.consultas.otros-examenes') }}: {{ consulta.examenes }}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div style="display: flex; flex-wrap: wrap;">
                            <div style="font-size: 10px; padding-right: 30px" v-for="sel in examenesSeleccion" :key="sel.id">
                              <h5 class="mb-1">{{ sel.denominacion }}</h5>
                              <div v-for="item in sel.items" :key="item.id">  
                                <p style="padding-left: 10px; font-size: 9px" class="mb-1">{{ item.denominacion }}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-colxx>
            </b-row>
          </div>
        </b-colxx>
      </b-tab>
    </b-tabs>
    <div id="prnInforme">
      <div class="invisible">
        <span v-html="imprimibleInforme"/>
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import Datepicker from "vuejs-datepicker";
import {es} from 'vuejs-datepicker/dist/locale';
import { quillEditor } from 'vue-quill-editor';
import HistorialItem from '@/components/Clinica/HistorialItem.vue';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import DiagnosticoSeleccionar from "@/components/Clinica/DiagnosticoBuscar";
import { mapGetters } from 'vuex';

import { slogan } from "@/constants/config";

export default {
  components: {
    'historial-item': HistorialItem,
    'producto-seleccionar': ProductoSeleccionar,
    'diagnostico-seleccionar': DiagnosticoSeleccionar,
    'quill-editor' : quillEditor,
    Datepicker
  },
  data: function() {
    return {
      es: es,
      consulta: {
        id: 0,
        fecha: null,
        sintomas_subjetivos: "",
        exploracion_fisica: "",
        diagnostico_cie: "",
        diagnostico_descripcion: "",
        tratamiento: "",
        mediciones: "",
        examenes: "",
        relPaciente: {
          id: 0,
          relCliente: {
            id: 0,
            nombres: ""
          }
        },
        relMedico: {
          id: 0,
          nombres: ""
        },
        relServicio: {
          id: 0,
          descripcion: "",
          relEspecialidad: {
            id: 0,
            denominacion: ""
          }
        },
        recetaItems: [],
        relExamenes: [],
        certificado: '',
        informe: '',
        informeEco: '',
        examenesSel: [],
        proxima: null,
        antecedentes: ''
      },
      mediciones: {
        peso: 0,
        estatura: 0,
        temperatura: 0,
        presion: "",
        critmo: 0,
        rritmo: 0,
        oxigeno: 0,
        imc: 0,
        saturaciono2: 0
      },
      medicionesAnt: "",
      historial: [],
      recetaCampos: [
        { key: 'comandos', label: 'Acciones', sortable: false },
        { key: 'cantidad', label: 'Cant.', sortable: false },
        { key: 'descripcion', label: 'Producto', sortable: false },
        { key: 'dosis', label: 'Indicaciones', sortable: false }
      ],
      productoSeleccion: {
        cantidad: 0,
        texto: "",
        indicaciones: "",
        productoid: 0,
        descripcion: ''
      },
      selProductoVer: false,
      diagnosticoSeleccion: {
        descripcion: "",
        codigo: "",
      },
      selDiagnosticoVer: false,
      certificado: '',
      imprimibleInforme: "",
      examenesSeleccion: [],
      informeEcoVisible: false,
      informeEcoEspecilidad: 27,
      lectura: false,
      fechasInvalidas: {
        to: new Date(), // Desactivar fechas hasta ayer
        days: [6, 0] // Sabados y domingos
      },
    }
  },
  computed: {
    ...mapGetters("inventarios", [
      "selProducto"
    ]),
    ...mapGetters("clinica", [
      "selDiagnostico"
    ]),
    ...mapGetters("clinica", [
      "selDiagnosticoTexto"
    ]),
    ...mapGetters([
      'currentUser'
    ]),
    esAdmin() {
      return this.currentUser != null && this.currentUser.rol_id-1 == 0
    },
    productoNoSeleccionado() {
      return this.selProducto == null;
    },
    diagnosticoNoSeleccionado() {
      return this.selDiagnostico == null;
    },
    empresa() {
      return {
        direccion: this.$store.state.empresaAccedida.direccion,
        telefonos: this.$store.state.empresaAccedida.telefonos,
        lema: slogan
      };
    },
    informeEditorOps() {
      return {
        placeholder: 'Digite los datos',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'font': []}],
            [{'size': ['small', false, 'large', 'huge']}],
            [{'color': []}, {'background': []}],
            [{'align': []}],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['link'],
          ]
        }
      }
    },
    vistaExamenes: {
      get () {
        return this.consulta.relExamenes;
      },
      set (value) {
        this.consulta.relExamenes = value;
      }
    },
    fechaProxima: {
      get: function() {
        if (this.consulta.proxima)
          return this.$moment(this.consulta.proxima).toDate();
        else 
          return this.consulta.proxima;  
      },
      set: function(v) {
        this.consulta.proxima = v;
      }
    },
    diagnosticoTexto: {
      get () {
        return this.selDiagnosticoTexto;
      },
      set (value) {
        this.$store.commit('clinica/setSelDiagnosticoTexto', value);
      }
    }
  },
  methods: {
    traerIniciales(txt) {
      txt = txt.replace("   ", " ");
      txt = txt.replace("  ", " ");

      return txt
        .split(" ")
        .map(item => item.charAt(0))
        .slice(0, 2)
        .join("");
    },
    edadPaciente() {
      if (this.consulta.relPaciente.fecha_nacimiento != null) {
        try {
          return this.$moment().year() - this.$moment(this.consulta.relPaciente.fecha_nacimiento).year();
        } catch {
          return 0;
        }
      }
    },
    hayFoto() {
      return false;
    },
    traerMediciones() {
      let meds = [];
      let p = { id: 4, titulo: this.$t('vista.clinica.consultas.campos.mediciones.presion'), valor: this.mediciones.presion, sufijo: '(mm Hg)', color: 'border-warning' };
      meds.push(p);
      if (this.mediciones.peso != undefined && this.mediciones.peso.length > 0) {
        let i1 = { id: 1, titulo: this.$t('vista.clinica.consultas.campos.mediciones.peso'), valor: this.mediciones.peso, sufijo: '(kg)', color: 'border-theme-1' };
        meds.push(i1);
      }
      if (this.mediciones.estatura != undefined && this.mediciones.estatura.length > 0) {
        let i2 = { id: 2, titulo: this.$t('vista.clinica.consultas.campos.mediciones.estatura'), valor: this.mediciones.estatura, sufijo: '(cm)', color: 'border-warning' };
        meds.push(i2);
      }
      if (this.mediciones.temperatura != undefined && this.mediciones.temperatura.length > 0) {
        let i3 = { id: 3, titulo: this.$t('vista.clinica.consultas.campos.mediciones.temperatura'), valor: this.mediciones.temperatura, sufijo: '(°C)', color: 'border-theme-1' };
        meds.push(i3);
      }
      if (this.mediciones.critmo != undefined && this.mediciones.critmo.length > 0) {
        let i5 = { id: 5, titulo: this.$t('vista.clinica.consultas.campos.mediciones.critmo'), valor: this.mediciones.critmo, sufijo: '(xMin)', color: 'border-theme-1' };
        meds.push(i5);
      }
      if (this.mediciones.rritmo != undefined && this.mediciones.rritmo.length > 0) {
        let i6 = { id: 6, titulo: this.$t('vista.clinica.consultas.campos.mediciones.rritmo'), valor: this.mediciones.rritmo, sufijo: '(xMin)', color: 'border-warning' };
        meds.push(i6);
      }
      if (this.mediciones.oxigeno != undefined && this.mediciones.oxigeno.length > 0) {
        let i7 = { id: 7, titulo: this.$t('vista.clinica.consultas.campos.mediciones.oxigeno'), valor: this.mediciones.oxigeno, sufijo: '(%)', color: 'border-theme-1' };
        meds.push(i7);
      }
      if (this.mediciones.imc != undefined && this.mediciones.imc.length > 0) {
        let i8 = { id: 8, titulo: this.$t('vista.clinica.consultas.campos.mediciones.imc'), valor: this.mediciones.imc, sufijo: '(IMC)', color: 'border-warning' };
        meds.push(i8);
      }
      if (this.mediciones.saturaciono2 != undefined && this.mediciones.saturaciono2.length > 0) {
        let i9 = { id: 9, titulo: this.$t('vista.clinica.consultas.campos.mediciones.saturaciono2'), valor: this.mediciones.saturaciono2, sufijo: '(O2)', color: 'border-theme-1' };
        meds.push(i9);
      }
      return meds;
    },
    guardar() {
      this.procesando = true;
      let exs = [];
      this.consulta.relExamenes.forEach(function(ex) {
        let its = "";
        ex.items.forEach(function(i) {
          if (ex.seleccionado.includes(i.id)) {
            its += " " + i.id;
          }
        });
        if (its.trimLeft().length > 0) {
          exs.push({
            id: 0,
            consulta_id: 0,
            examen_id: ex.id,
            seleccionados: its.trimLeft(),
          });
        };
      });
      this.consulta.examenesSel = exs;
      console.log(exs);
      this.consulta.estado = 3;
      this.$store
        .dispatch("clinica/consultaGuardar", this.consulta)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify("success", this.$t('vista.transacciones.guardando-reg'), res.data.msj, { duration: 3000, permanent: false });
          } else {
            this.$notify("warning", this.$t('vista.transacciones.guardar-reg'), res.data.msj, { duration: 3000, permanent: false });
          }
          this.procesando = false;
          this.$router.back();
        }.bind(this))
        .catch(function(e) {
          console.log(e);
          this.procesando = false;
          this.$notify("danger", "Guardar registro", 
            this.$t('vista.transacciones.guardar-error'), 
            { duration: 3000, permanent: false });
        }.bind(this)
      );
      this.procesando = false;
    },
    cancelar() {
      this.$router.back();      
    },
    agregarItem() {
      let item = {
        id: 0,
        consulta_id: this.consulta.id,
        producto_id: this.productoSeleccion.id,
        cantidad: this.productoSeleccion.cantidad,
        dosis: this.productoSeleccion.indicaciones,
        descripcion: this.selProducto != null ? '' : this.productoSeleccion.texto,
        relProducto: this.selProducto
      };
      this.consulta.recetaItems.push(item);
      this.productoSeleccion = {
        cantidad: 0,
        texto: "",
        indicaciones: "",
        descripcion: "",
        productoid: 0,
        relProducto: null
      };
      this.$store.commit("inventarios/setSelProducto", null);
    },
    eliminarItem(p) {
      if (this.consulta.recetaItems.length == 1) {
        this.consulta.recetaItems = [];
      } else {
        if (this.consulta.id > 0) {
          var ret = this.consulta.recetaItems.filter(x => {
            return x.id != p.item.id;
          });
          this.consulta.recetaItems = ret;  
        } else {
          var ret = this.consulta.recetaItems.filter(x => {
            return x.relProducto.id != p.item.relProducto.id;
          });
          this.consulta.recetaItems = ret;  
        }
        
      }
    },
    buscarProducto() {
      if (this.productoSeleccion.texto.length > 0) {
        this.$store.commit('inventarios/setSelProductoTexto', this.productoSeleccion.texto);
        this.selProductoVer = true;
      }
    },
    productoSeleccionado() {
      this.productoSeleccion.id = this.selProducto.id;
      this.productoSeleccion.texto = this.selProducto.nombre;
      this.pasarFoco();
    },
    buscarDiagnostico() {
      if (this.diagnosticoTexto.length > 0) {
        this.selDiagnosticoVer = true;
      }
    },
    diagnosticoSeleccionado() {
      this.consulta.diagnostico_cie = this.selDiagnostico.codigo;
    },
    certificadoImprimir() {
      this.imprimibleInforme = this.convertirDeltaHtml(this.$refs['txtCertificado'].quill.editor.delta.ops);
      this.$htmlToPaper("prnInforme");
      this.imprimibleInforme = "";
    },
    examenesImprimir() {
      let res = [];
      this.consulta.relExamenes.forEach(function(ex) {
        let its = [];
        ex.items.forEach(function(i) {
          if (ex.seleccionado.includes(i.id)) {
            its.push(i);
          }
        });
        if (its.length > 0) {
          res.push({
            id: ex.id,
            denominacion: ex.denominacion,
            items: its
          });
        };
      });
      if (res.length > 0 || this.consulta.examenes.length > 0) {
        this.examenesSeleccion = res;
        console.table(res);
        this.$htmlToPaper("prnExamenes");
        this.examenesSeleccion = [];
      } else {
        console.log("Vacio res o examenes")
      }
    },
    recetaImprimir() {
      if (this.consulta.recetaItems.length > 0) {
        this.$htmlToPaper("prnReceta");
      }
    },
    recetaFacturar() {
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
        especie: 0, // Receta
        movimiento_id: 1, // Bodega 
        ecomprobante_id: 0, 
        operador: '',
        relCliente: this.consulta.relPaciente.relCliente,
        relItems: [],
      }
      this.consulta.recetaItems.forEach(ri => {
        if (ri.producto_id > 0) {
          let item = {
            id: 0,
            venta_id: 0,
            movitem_id: 1,
            producto_id: ri.relProducto.id,
            cantidad: ri.cantidad,
            pedido: 0,
            precio: ri.relProducto.precio,
            costo: 0,
            descuento: 0,
            adicional: 0,
            observacion: '',
            presentacion_id: 0,
            lote_id: 0,
            relProducto: ri.relProducto
          }
          fac.relItems.push(item);
        }
      });

      this.$router.push({
        name: 'facturas-crear',
        params: {
          id: 0,
          dato: fac,
          tipo: this.$t('vista.ventas.facturas.titulo'),
          tipoId: 11,
          lectura: false,
          servicioValor: 0,
        }
      });
    },
    convertirDeltaHtml(delta) {
      let d = this.$store.state.empresaAccedida.direccion;
      let t = this.$store.state.empresaAccedida.telefonos;
      var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
      var cfg = { inlineStyles: true };
      var converter = new QuillDeltaToHtmlConverter(delta, cfg);
      var logo = '<table><tr>' +
                      '<td align="left" valign="center" style="padding-bottom:35px; padding-top:15px; border-top:0;width:100% !important;">'+
                          '<img src="' + require('@/assets/logos/black.png') + '" />'+
                      '</td>'+
                      '<td align="right" valign="center" style="padding-bottom:20px;border-top:0;width:100% !important;">'+
                          '<p style="color: #8f8f8f; font-weight: normal; line-height: 1.2; font-size: 12px; white-space: nowrap; ">'+
                              this.empresa.lema + ' <br> ' + this.empresa.direccion + '<br>' + this.empresa.telefonos +
                          '</p>'+
                      '</td>'+
                  '</tr></table>';
      let doc = converter.convert();
      return logo + doc;
    },
    pasarFoco() {
      if(this.productoSeleccion.id > 0) { 
        setTimeout(() => { this.enfocarCantidad(); }, 100);
      }
    },
    enfocarCantidad() {
      this.$refs.txCantidad.$el.focus();
      this.$refs.txCantidad.$el.select();
    },
    enfocarIndicaciones() {
      if (this.productoSeleccion.cantidad > 0) {
        this.$refs.txDosis.$el.focus();
        this.$refs.txDosis.$el.select();
      }
    },
    procesarExamenes(exams) {
      if (this.consulta.relExamenes != null) {
        let lst = []
        exams.forEach(function(ex) {
          let f = this.consulta.relExamenes.find(t => t.examen_id === ex.id)
          if (f) {
            let sel = f.seleccionados.trimLeft().split(" ")
            ex.seleccionado = sel
          }
          lst.push(ex)
        }.bind(this))
        exams = lst
      }
      this.vistaExamenes = exams
    }
  },
  mounted() {
    if (this.$route.params.dato != undefined) {
      this.consulta = {
        id: this.$route.params.id,
        paciente_id: this.$route.params.dato.paciente_id,
        medico_id: this.$route.params.dato.medico_id,
        fecha: this.$route.params.dato.fecha,
        numero: this.$route.params.dato.numero,
        hora: this.$route.params.dato.hora,
        motivo: this.$route.params.dato.motivo,
        antecedentes: this.$route.params.dato.antecedentes,
        sintomas_subjetivos: this.$route.params.dato.sintomas_subjetivos,
        exploracion_fisica: this.$route.params.dato.exploracion_fisica,
        diagnostico_cie: this.$route.params.dato.diagnostico_cie,
        diagnostico_clase: this.$route.params.dato.diagnostico_clase,
        diagnostico_descripcion: this.$route.params.dato.diagnostico_descripcion,
        tratamiento: this.$route.params.dato.tratamiento,
        mediciones: this.$route.params.dato.mediciones,
        examenes: this.$route.params.dato.examenes,
        factura_id: this.$route.params.dato.factura_id,
        sucursal_id: this.$route.params.dato.sucursal_id,
        estado: this.$route.params.dato.estado,
        servicio_id: this.$route.params.dato.servicio_id,
        relPaciente: this.$route.params.dato.relPaciente,
        relMedico: this.$route.params.dato.relMedico,
        relServicio: this.$route.params.dato.relServicio,
        relExamenes: this.$route.params.dato.relExamenes,
        recetaItems: this.$route.params.dato.recetaItems,
        proxima: this.$route.params.dato.proxima,
        laboratorio: this.$route.params.dato.laboratorio
      }

      if (this.$route.params.dato.relServicio != null) {
        this.servicioSeleccionado = this.consulta.relServicio.id;
      } else {
        this.consulta.relServicio = {
          id: 0,
          descripcion: "",
          relEspecialidad: {
            id: 0,
            descripcion: ""
          }
        }
      }

      if (this.consulta.proxima != undefined) {
        try {
          const f = this.consulta.proxima.split();
          this.consulta.proxima = this.$moment(this.consulta.proxima).toDate();
        } catch(e) {
          this.consulta.proxima = new moment.utc(this.consulta.proxima).toDate();
        }
      } else {
        this.consulta.proxima = null;
      }

      if (this.consulta.relServicio != undefined && this.consulta.relServicio.relEspecialidad != undefined) {
        this.especialidadSel = this.consulta.relServicio.relEspecialidad.id;
      } 

      if (this.$route.params.dato.relMedico != undefined) {
        this.medicoSeleccionado = this.consulta.relMedico.id
      } else {
        this.consulta.relMedico = {
          id: 0,
          nombres: ""
        };
      }

      if (this.$route.params.dato.mediciones.length > 10) {
        try {
          this.mediciones = JSON.parse(this.$route.params.dato.mediciones);
        } catch(e) {
          this.medicionesAnt = this.$route.params.dato.mediciones;
        }
      }

      if (this.consulta.paciente_id > 0) {
        this.$store
        .dispatch("clinica/consultasPacienteLimite", {
          id: this.consulta.paciente_id,
          limite: 10,
          consultaId: this.consulta.id
        })
        .then(function(r) {
          this.historial = r.data;
        }.bind(this));
      }

      if (this.consulta.relServicio.relEspecialidad.id == this.informeEcoEspecilidad)
        this.informeEcoVisible = true;
    }
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }

    this.consulta.certificado = `<br/><p>Fecha</p><p>${this.$moment(this.consulta.fecha).format('YYYY-MM-DD')}<p/><br/><p>Paciente</p><p>${this.consulta.relPaciente.relCliente.nombres}<p/><br/><p>Medico</p><p>${this.consulta.relMedico.nombres}<p/>`;
    if (this.consulta.proxima != undefined) {
      try {
        if (this.consulta.proxima != null)
          this.consulta.proxima = this.$moment(this.consulta.proxima).toDate();
      } catch(e) {
        this.consulta.proxima = new moment.utc(this.consulta.proxima).toDate();
      }
    } else {
      this.consulta.proxima = null;
    }
    // Traer CIE por codigo
  },
  beforeMount() {
    this.$store
      .dispatch("clinica/examenesLista").then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            let exams = []
            r.respuesta.forEach(e => {
              e.seleccionado = [];
              exams.push(e);
            });
            this.procesarExamenes(exams);
          }
        }
      }.bind(this));
  },
  created() {
    this.$store.dispatch("clinica/examenesCargarCache")
  }
}
</script>
