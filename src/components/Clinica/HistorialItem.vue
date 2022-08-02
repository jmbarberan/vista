<template>
  <div class="d-flex flex-row mb-3">
    <div class="pl-3 pt-2 pr-2 pb-2">
      <h6>{{ consulta.relServicio.relEspecialidad.descripcion }}</h6>
      <h6>{{ consulta.relServicio.descripcion }}</h6>
      <div class="text-primary text-small font-weight-medium d-none d-sm-block">{{ consulta.fecha }}</div>
      <div v-if="consulta.relMedico != null" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.medico') }}: </span> {{ consulta.relMedico.nombres }}</p>
      </div>
      <div v-if="consulta.sintomas_subjetivos != null && consulta.sintomas_subjetivos.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.sintomas') }}: </span> {{ consulta.sintomas_subjetivos }}</p>
      </div>
      <div v-if="consulta.antecedentes != null && consulta.antecedentes.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.antecedentes') }}: </span> {{ consulta.antecedentes }}</p>
      </div>
      <div v-if="consulta.exploracion_fisica != null && consulta.exploracion_fisica.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.exploracion') }}: </span> {{ consulta.exploracion_fisica }}</p>
      </div>
      <div v-if="consulta.diagnostico_descripcion != null && consulta.diagnostico_descripcion.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.diagnostico') }}: </span> {{ consulta.diagnostico_descripcion }}</p>
      </div>
      <div v-if="consulta.laboratorio != null && consulta.laboratorio.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.datos-laboratorio') }}: </span> {{ consulta.laboratorio }}</p>
      </div>
      <div v-if="consulta.tratamiento != null && consulta.tratamiento.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.tratamiento') }}: </span> {{ consulta.tratamiento }}</p>
      </div>
      <div class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.mediciones') }}: </span> {{ traerMediciones() }}</p>
      </div>
      <div v-if="traerExamenes().length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">{{ $t('vista.clinica.consultas.campos.orden-examenes') }}: </span> {{ traerExamenes() }}</p>
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  props: [
    'consulta'
  ],
  data() {
    return {
      examenes: []
    }
  },
  methods: {
    traerMediciones () {
      if (this.$props.consulta.mediciones.length > 10) {
        try {
          const med = JSON.parse(this.$props.consulta.mediciones);
          console.log(med);
          let txt = ''
          if (med.presion != undefined && med.presion.length > 0) {
            txt +=  this.$t('vista.clinica.consultas.campos.mediciones-abreviadas.presion') + `: ${med.presion} (mmHG) `
          }
          if (med.peso != undefined && med.peso.length > 0) {
            txt +=  this.$t('vista.clinica.consultas.campos.mediciones.peso') + `: ${med.peso} (kg) `
          }
          if (med.estatura != undefined && med.estatura.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones.estatura') + `: ${med.estatura} (cm) `
          }
          if (med.temperatura != undefined && med.temperatura.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones.temperatura') + `: ${med.temperatura} (°C) `
          }
          if (med.critmo != undefined && med.critmo.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones-abreviadas.critmo') + `: ${med.critmo} (xMin) `
          }
          if (med.rritmo != undefined && med.rritmo.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones-abreviadas.rritmo') + `: ${med.rritmo} (xMin) `
          }
          if (med.oxigeno != undefined && med.oxigeno.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones-abreviadas.oxigeno') + `: ${med.oxigeno} (%) `
          }
          if (med.imc != undefined && med.imc.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones.imc') + `: ${med.imc} `
          }
          if (med.saturaciono2 != undefined && med.saturaciono2.length > 0) {
            txt += this.$t('vista.clinica.consultas.campos.mediciones-abreviadas.saturaciono2') + `: ${med.saturaciono2}`
          }
          return txt;
        } catch(e) {
          return this.consulta.mediciones;
        }
      }
    },
    traerExamenes () {
      let ret = ''
      if (this.$props.consulta.relExamenes != undefined && this.$props.consulta.relExamenes.length > 0) {
        this.$props.consulta.relExamenes.forEach(ex => {
          let sel = ex.seleccionados.trimLeft().split(" ")
          sel.forEach(e => {
            let l = this.examenes.find(t => t.id === e)
            if (l) {
              if (ret.length > 0) {
               ret += "," }
              ret += " " + l.denominacion
            }
          });
        });
      }
      if (this.$props.consulta.examenes) {
        ret += this.$props.consulta.examenes.trim()
      }
      return ret.trimLeft()
    }
  },
  created() {
    this.examenes = this.$store.state.clinica.examenesCache
  }
}
</script>