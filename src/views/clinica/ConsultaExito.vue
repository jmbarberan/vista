<template>  
  <b-row class="mt-4">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-jumbotron header-level="2">
        <template #header>
          <b-row class="d-inline-flex">
            <b-col>
              <img alt="ANCRIS" width="70" src="@/assets/logos/mobile.png">
            </b-col>
            <b-col>
              <h1 class="pt-4">ANCRIS</h1>
            </b-col>
          </b-row>
        </template>
        <template #lead>
          Su consulta ha sido agendada exitosamente
        </template>
        <hr class="my-4">
        <p>Paciente: {{ consulta.relPaciente.relCliente.nombres }}</p>
        <p>Fecha: {{ $moment(consulta.fecha).format("YYYY-MM-DD") }}</p>
        <p>Turno: {{ horaCita }}</p>
        <p>Profesional: {{ consulta.relMedico.nombres }}</p>
        <p>Especialidad: {{ consulta.relServicio.descripcion }}</p>

        <b-button class="mr-2" variant="primary" style="width=80" @click="imprimir()">Imprimir</b-button>
        <b-button variant="success" style="width=80" @click="irInicio()">Inicio</b-button>
      </b-jumbotron>
    </b-colxx>
    <div id="prnTurno">
      <b-row class="medioA4 invisible">
        <b-colxx xxs="12" class="mb-5">
          <div style="background-color:#ffffff; height:660px; max-width:830px; font-family: Helvetica,Arial,sans-serif !important; position: relative;">
            <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="width:100%; background-color:#ffffff;border-collapse:separate !important; border-spacing:0;color:#242128; margin:0; padding-left:30px; padding-right:30px;" heigth="auto">
              <tbody>
                <tr>
                  <td align="left" valign="center" style="padding-bottom:0px; padding-top:10px; border-top:0;width:100% !important;">
                    <img src="@/assets/logos/black.png" />
                  </td>
                  <td align="right" valign="center" style="padding-bottom:0px;border-top:0;width:100% !important;">
                    <p style="color: #8f8f8f; font-weight: normal; line-height: 1.2; font-size: 12px; white-space: nowrap; ">
                      Centro médico comunitario<br> Telf.: 0994066015
                    </p>
                  </td>
                </tr>
                <tr>
                  <td v-if="consulta != null" align="left" valign="center" style="padding-top: 30px; padding-bottom: 30px; border-top:0; font-weight: bold; width:100% !important;">
                    TICKET DE TURNO DE {{ horaCita }}
                  </td>
                  <td v-if="consulta != null" align="right" valign="center" style="padding-top: 30px; padding-bottom:30px; border-top:0; font-weight: bold; width:100% !important;">
                    FECHA: {{ $moment(consulta.fecha).format("YYYY-MM-DD") }}
                  </td>
                </tr>
                <tr v-if="consulta != null">
                  <td colspan="2" style="padding-bottom: 10px; padding-left: 20px">
                    Paciente: {{ consulta.relPaciente.relCliente.nombres }}
                  </td>
                </tr>
                <tr v-if="consulta != null">
                  <td colspan="2" style="padding-bottom: 10px; padding-left: 20px">
                    Profesional: {{ consulta.relMedico.nombres }}
                  </td>
                </tr>
                <tr v-if="consulta != null">
                  <td colspan="2" style="padding-bottom: 10px; padding-left: 20px">
                    Servicio médico: {{ consulta.relServicio.descripcion }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-colxx>
      </b-row>              
    </div>
  </b-row>
  
</template>

<script>
import { horario } from '../../utils'
export default {
  data: function () {
    return {
      consulta: {
        id: 0,
        sucursal_id: 1,
        paciente_id: 0,
        medico_id: 0,
        fecha: null,
        servicio_id: 0,
        hora: "",
        motivo: "",
        numero: 0,
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
      horaCita: null
    }
  },
  methods: {
    irInicio() {
      this.$router.push("/bienvenido");
    },
    imprimir() {
      this.$htmlToPaper("prnTurno");
    }
  },
  mounted() {
    if (this.$route.params.dato != null) {
      this.consulta = {
        id: this.$route.params.id,
        paciente_id: this.$route.params.dato.paciente_id,
        medico_id: this.$route.params.dato.medico_id,
        fecha: this.$route.params.dato.fecha,
        numero: this.$route.params.dato.numero,
        hora: this.$route.params.dato.hora,
        motivo: this.$route.params.dato.motivo,
        examenes: this.$route.params.dato.examenes,
        factura_id: this.$route.params.dato.factura_id,
        sucursal_id: this.$route.params.dato.sucursal_id,
        estado: this.$route.params.dato.estado,
        servicio_id: this.$route.params.dato.servicio_id,
        relPaciente: this.$route.params.dato.relPaciente,
        relMedico: this.$route.params.dato.relMedico,
        relServicio: this.$route.params.dato.relServicio,
      }
      if (this.consulta.relServicio == undefined && this.$route.params.dato.relServicio != null) {
        this.consulta.relServicio = this.$route.params.dato.relServicio;
      }
      if (this.consulta.relMedico == null && this.$route.params.dato != null) {
        this.consulta.relMedico = this.$route.params.dato.relMedico;
      }
      this.horaCita = this.consulta.numero > 0 ? horario()[this.consulta.numero - 1].titulo:  "";
    }
  }
}
</script>

<style>

</style>