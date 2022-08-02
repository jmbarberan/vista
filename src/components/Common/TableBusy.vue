<template>
  <div class="text-center text-primary my-2">
    <b-spinner class="align-middle mr-4"></b-spinner>
    <strong>{{ mensaje }}</strong>
  </div>
</template>

<script>
export default {
  props: [
    "mensaje"
  ]
}
</script>
