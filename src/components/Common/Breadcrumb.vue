<template>
  <span>
    <h1 v-if="heading && heading.length>0">{{ heading }}</h1>
    <b-nav class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block">
      <b-breadcrumb :items="items" />
    </b-nav>
  </span>
</template>

<script>
export default {
  props: ["heading"],
  data() {
    return {
      items: []
    };
  },
  methods: {
    getUrl(path, sub, index) {
      return "/" + path.split(sub)[0] + sub;
    },
    cargarItems() {
      this.items = []
      let path = this.$route.path.substr(1);
      if (path.endsWith("/")) {
        path = path.substring(0, path.length-1);
      }
      let rawPaths = path.split("/");
      for (var pName in this.$route.params) {
        if (rawPaths.includes(this.$route.params[pName])) {
          rawPaths = rawPaths.filter(x => x !== this.$route.params[pName]);
        }    
      }
      let cumul = "menu";     
      rawPaths.map((parte, index) => {
        cumul = cumul + "." + parte;
        this.items.push({
          text: typeof this.$t(cumul) === 'string' ? this.$t(cumul) : this.$t(cumul+".titulo"),
          to: this.getUrl(path, parte, index)
        });
      });
    }
  },
  watch: {
    $route(to, from) {
      /*this.respaldarTipo(from.matched[2].meta.tipo);
      this.cargarTipo(to.matched[2].meta.tipo);
      this.tipoId = this.$route.meta.tipo
      this.titulo = this.$route.meta.titulo*/
      this.cargarItems();
    }
  },
  mounted() {
    this.cargarItems()
  }
};
</script>
