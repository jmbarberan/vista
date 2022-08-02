<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.clinica.recetas')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" >
        <b-table :fields="campos" :items="recetas" :key="id">
          <template #cell(comandos)="fila">
            <span
              class="span-comando pt-1"
              @click="eliminar(fila)"
              v-b-tooltip.hover
              title="Imprimir receta"
            ><i class="mdi mdi-printer mdi-18px"/></span>
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
      campos: [
        { key: 'comandos', label: this.$t('vista.comandos.acciones'), sortable: false },
        { key: 'fecha', label: this.$t('vista.clinica.consultas.fecha'), sortable: false },
        { key: 'paciente', label: this.$t('vista.clinica.consultas.campos.paciente'), sortable: false },
        { key: 'medico', label: this.$t('vista.clinica.consultas.campos.profesional'), sortable: false },
      ],
      recetas: []
    }
  }

}
</script>
