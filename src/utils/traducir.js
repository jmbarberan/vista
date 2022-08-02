import Vue from "vue";
import VueI18n from 'vue-i18n';
import { getCurrentLanguage } from '@/utils'
import en from '@/locales/rutas/en.json'
import es from '@/locales/rutas/es.json'

Vue.use(VueI18n);

const messages = { en: en, es: es };
const locale = getCurrentLanguage();
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'es',
  messages
});

export default function traducir(txt) {
  return i18n.t(txt);
}