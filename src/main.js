import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/bootstrap.rtl.only.min.css";
import axios from 'axios'
import { getThemeColor } from "./utils";
import { getCurrentSubscriber } from './utils'

var color = getThemeColor();

let render = () => {
  if (color != undefined) {
    import("./assets/css/sass/themes/piaf." + color + ".scss").then(() =>
      require("./index")
    );
  } else {
    import("./assets/css/sass/themes/piaf.light.blueolympic.scss").then(() =>
      require("./index")
    );
  }
}
render();

fetch('/config.json')
  .then(response => response.json())
  .then(config => {
    let sub = getCurrentSubscriber();
    if (sub != undefined) {
      axios.defaults.headers.common['Authorization'] = sub.codigo;
    }
    axios.defaults.baseURL = config.apiUrl;
  })
  .catch(error => {
    console.error('Error cargando config:', error);
  });