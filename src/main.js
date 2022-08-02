import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/bootstrap.rtl.only.min.css";
import { getThemeColor } from "./utils";
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