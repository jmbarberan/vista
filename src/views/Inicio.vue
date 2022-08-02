<template>
  <div id="root">
    <div class="fixed-background">
      <main>
        <div class="container">
          <b-row class="h-100">
            <b-colxx xxs="12" md="10" class="mx-auto my-auto">
              <b-card class="auth-card" no-body>
                <div class="position-relative image-side">
                  <p class="text-white h2">ANCRIS - SISTEMA ADMINISTRATIVO</p>
                  <p class="white mb-0">No se encuentra el recurso</p>
                </div>
                <div class="form-side">
                  <router-link tag="a" to="/">
                    <span class="logo-single" />
                  </router-link>
                  <h6 class="mb-4">{{ $t("pages.error-title") }}</h6>
                  <p class="mb-0 text-muted text-small mb-0">{{ $t("pages.error-code") }}</p>
                  <p class="display-1 font-weight-bold mb-5">404</p>
                  <b-button
                    type="submit"
                    variant="primary"
                    size="lg"
                    class="btn-shadow"
                    @click="goBack"
                  >{{ $t("pages.go-back-home") }}</b-button>
                </div>
              </b-card>
            </b-colxx>
          </b-row>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goBack() {
      this.$router.push("/");
    },
  },
  mounted: function () {
    document.body.classList.add("background");
  },
  beforeDestroy() {
    document.body.classList.remove("background");
  },
};
</script>


<!--template>
  <user-layout>
  <div>  
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.inicio')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
          <b-card class="mb-4" >
              <b-jumbotron :header="$t('jumbotron.hello-world')" :lead="$t('jumbotron.lead')" header-level="4">
                  <hr class="my-4">
                  <p>{{$t('jumbotron.lead-detail')}}</p>
                  <p class="lead mb-0">
                    <b-button variant="primary" class="mr-4" size="lg">{{$t('jumbotron.learn-more')}}</b-button>
                    <b-button to="/usuario/acceder" variant="success" size="lg">Acceder al sistema</b-button>
                  </p>
              </b-jumbotron>
          </b-card>
      </b-colxx>
    </b-row>
    </div>
  </user-layout>
</template-->
