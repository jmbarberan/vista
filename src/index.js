import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import en from './locales/en.json'
import es from './locales/es.json'
import VueI18n from 'vue-i18n'
import Notifications from './components/Common/Notification'
import Breadcrumb from './components/Common/Breadcrumb'  
import RefreshButton from './components/Common/RefreshButton'
import Colxx from './components/Common/Colxx'
import vuePerfectScrollbar from 'vue-perfect-scrollbar'
import TableBusy from './components/Common/TableBusy'
import contentmenu from 'v-contextmenu'
import VueScrollTo from 'vue-scrollto'
import { getCurrentLanguage, getCurrentSubscriber } from './utils'
import 'vue-search-select/dist/VueSearchSelect.css'
import Vuelidate from "vuelidate";
import "@mdi/font/css/materialdesignicons.css";
//import VueHtmlToPaper from "vue-html-to-paper";
import momentz from 'moment-timezone';

momentz.tz.setDefault('America/Guayaquil');
/*const printOpciones = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    `${process.env.BASE_URL}css/pointerp.css`
  ]
};*/

const messages = { en: en, es: es };
const locale = getCurrentLanguage();
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'es',
  messages
});

const momentCfg = require('moment')
require('moment/locale/es')

Vue.use(BootstrapVue);
Vue.use(VueI18n);
Vue.use(Notifications);
Vue.use(require('vue-shortkey'));
Vue.use(contentmenu);
Vue.use(VueScrollTo);
Vue.use(Vuelidate);
//Vue.use(VueHtmlToPaper, printOpciones);
 
Vue.use(require('vue-moment'), {
    momentCfg
})
Vue.component('piaf-breadcrumb', Breadcrumb); 
Vue.component('b-refresh-button', RefreshButton);
Vue.component('b-colxx', Colxx);
Vue.component('table-busy', TableBusy);
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar);

Vue.config.productionTip = false;

Vue.mixin({
  data() {
    return {
      appConfig: {
        adminRoot: "viniapro",
        accedidoLocal: false,
        apiUrl: process.env.VUE_APP_ROOT_API
      }
    }
  },
  created() {
    fetch('/config.json')
      .then(response => response.json())
      .then(config => {
        this.appConfig.apiUrl = config.apiUrl;
      })
      .catch(error => {
        console.error('Error cargando config:', error);
      });
  },
  mounted() {
    let sub = getCurrentSubscriber();
    if (sub != undefined) {
      if (sub.codigo != undefined && sub.codigo.length > 0) {
        this.accedido = true;
        axios.defaults.headers.common['Authorization'] = sub.codigo;
      }
    }
  }
})

const app = new Vue({
  i18n,
  router,
  store,
  validations: {},
  render: h => h(App)
})
store.$app = app;
router.$app = app;
app.$mount('#app');

export default app;