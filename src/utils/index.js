import { defaultDirection, defaultColor, 
  themeSelectedColorStorageKey, themeRadiusStorageKey, 
  localeOptions, defaultLocale } from '../constants/config'

export const getRequestConfig = (bkend) => {
  return {
    url: `${process.env.VUE_APP_ROOT_API}${bkend.ruta}`,
    method: bkend.metodo,
    crossorigin: true
  }
}

export const getRequestwDataConfig = (bkend, datos) => {
  return {
    url: `${process.env.VUE_APP_ROOT_API}${bkend.ruta}`,
    data: datos,
    method: bkend.metodo,
    crossorigin: true
  }
}

export const getRequestwParamsConfig = (bkend, params) => {
  return {
    url: `${process.env.VUE_APP_ROOT_API}${bkend.ruta}`,
    params: params,
    method: bkend.metodo,
    crossorigin: true
  }
}

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    var A = a[key]
    var B = b[key]
    if (order.indexOf(A + '') > order.indexOf(B + '')) {
      return 1
    } else {
      return -1
    }
  })
  return array
}

export const getDateWithFormat = () => {
  const today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!

  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return dd + '.' + mm + '.' + yyyy
}

export const getCurrentTime = () => {
  const now = new Date()
  return now.getHours() + ':' + now.getMinutes()
}

export const ThemeColors = () => {
  let rootStyle = getComputedStyle(document.body)
  return {
    themeColor1: rootStyle.getPropertyValue('--theme-color-1').trim(),
    themeColor2: rootStyle.getPropertyValue('--theme-color-2').trim(),
    themeColor3: rootStyle.getPropertyValue('--theme-color-3').trim(),
    themeColor4: rootStyle.getPropertyValue('--theme-color-4').trim(),
    themeColor5: rootStyle.getPropertyValue('--theme-color-5').trim(),
    themeColor6: rootStyle.getPropertyValue('--theme-color-6').trim(),
    themeColor1_10: rootStyle.getPropertyValue('--theme-color-1-10').trim(),
    themeColor2_10: rootStyle.getPropertyValue('--theme-color-2-10').trim(),
    themeColor3_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor4_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor5_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    themeColor6_10: rootStyle.getPropertyValue('--theme-color-3-10').trim(),
    primaryColor: rootStyle.getPropertyValue('--primary-color').trim(),
    foregroundColor: rootStyle.getPropertyValue('--foreground-color').trim(),
    separatorColor: rootStyle.getPropertyValue('--separator-color').trim()
  }
}

export const getDirection = () => {
  let direction = defaultDirection
  if (localStorage.getItem('direction')) {
    const localValue = localStorage.getItem('direction')
    if (localValue === 'rtl' || localValue === 'ltr') {
      direction = localValue
    }
  }
  return {
    direction,
    isRtl: direction === 'rtl'
  }
}

export const setDirection = localValue => {
  let direction = 'ltr'
  if (localValue === 'rtl' || localValue === 'ltr') {
    direction = localValue
  }
  localStorage.setItem('direction', direction)
}

export const getThemeColor = () => {
  let color = defaultColor;
  try {
    if (localStorage.getItem(themeSelectedColorStorageKey)) {
      color = localStorage.getItem(themeSelectedColorStorageKey) || defaultColor;
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : getThemeColor -> error", error)
    color = defaultColor;
  }
  return color;
}

export const setThemeColor = (color) => {
  try {
    localStorage.setItem(themeSelectedColorStorageKey, color);
  } catch (error) {
    console.log(">>>> src/utils/index.js : setThemeColor -> error", error)
  }
}

export const getThemeRadius = () => {
  let radius = "rounded";
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      radius = localStorage.getItem(themeRadiusStorageKey) || "rounded";
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : getThemeRadius -> error", error)
    radius = "rounded";
  }
  return radius;
}

export const setThemeRadius = (radius) => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    console.log(">>>> src/utils/index.js : setThemeRadius -> error", error)
  }
}

export const getCurrentLanguage = () => {
  let locale = defaultLocale;
  try {
    if (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) { locale = localStorage.getItem('currentLanguage'); }
  } catch (error) {
    console.log(">>>> src/utils/index.js : getCurrentLanguage -> error", error)
    locale = defaultLocale;
  }
  return locale;
}

export const setCurrentLanguage = (lang) => {
  try {
    localStorage.setItem('currentLanguage', lang)
  } catch (error) {
    console.log(">>>> src/utils/index.js : setCurrentLanguage -> error", error)
  }
}

export const getCurrentUser = () => {
  let user = null;
  try {
    user = localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null;
  } catch (error) {
    console.log(">>>> src/utils/index.js : getCurrentUser -> error", error)
    user = null;
  }
  return user;
}

export const setCurrentUser = (user) => {
  try {
    if (user) {
      let storeUser = {
        Id: user.Id,
        Codigo: user.Codigo,
        Nombres: user.Nombres,
        RolId: user.RolId,
        relRol: user.relRol
      }
      localStorage.setItem('user', JSON.stringify(storeUser))
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : setCurrentUser -> error", error)
  }
}

export const getEmpresa = () => {
  let emp = null;
  try {
    emp = localStorage.getItem('empresa') != null ? JSON.parse(localStorage.getItem('empresa')) : null;
  } catch (error) {
    console.log(">>>> src/utils/index.js : getEmpresa -> error", error)
    emp = null;
  }
  return emp;
}

export const setEmpresa = (emp) => {
  try {
    if (emp) {
      localStorage.setItem('empresa', JSON.stringify(emp))
    } else {
      localStorage.removeItem('empresa');
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : setEmpresa -> error", error)
  }
}

export const getCurrentSubscriber = () => {
  let data = null;
  try {
    data = localStorage.getItem('subscriber') != null ? JSON.parse(localStorage.getItem('subscriber')) : null;
  } catch (error) {
    console.log(">>>> src/utils/index.js : getCurrentSubscriber -> error", error)
    return null;
  }
  return data;
}

export const setCurrentSubscriber = (data) => {
  try {
    if (data) {
      localStorage.setItem('subscriber', JSON.stringify(data))
    } else {
      localStorage.removeItem('subscriber');
    }
  } catch (error) {
    console.log(">>>> src/utils/index.js : setCurrentSubscriber -> error", error)
  }
}

export const cedulaValida = (cedula) => {
  let ret = false;
  if(cedula.length == 10){    
    //Obtenemos el digito de la region que sonlos dos primeros digitos
    var digito_region = cedula.substring(0,2);
    //Pregunto si la region existe ecuador se divide en 24 regiones
    if( digito_region >= 1 && digito_region <=30 ){
      // Extraigo el ultimo digito
      var ultimo_digito   = cedula.substring(9,10);
      //Agrupo todos los pares y los sumo
      var pares = parseInt(cedula.substring(1,2)) + parseInt(cedula.substring(3,4)) + parseInt(cedula.substring(5,6)) + parseInt(cedula.substring(7,8));
      //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
      var numero1 = cedula.substring(0,1);
      var numero1 = (numero1 * 2);
      if( numero1 > 9 ){ var numero1 = (numero1 - 9); }
      var numero3 = cedula.substring(2,3);
      var numero3 = (numero3 * 2);
      if( numero3 > 9 ){ var numero3 = (numero3 - 9); }

      var numero5 = cedula.substring(4,5);
      var numero5 = (numero5 * 2);
      if( numero5 > 9 ){ var numero5 = (numero5 - 9); }

      var numero7 = cedula.substring(6,7);
      var numero7 = (numero7 * 2);
      if( numero7 > 9 ){ var numero7 = (numero7 - 9); }

      var numero9 = cedula.substring(8,9);
      var numero9 = (numero9 * 2);
      if( numero9 > 9 ){ var numero9 = (numero9 - 9); }

      var impares = numero1 + numero3 + numero5 + numero7 + numero9;

      //Suma total
      var suma_total = (pares + impares);
      //extraemos el primero digito
      var primer_digito_suma = String(suma_total).substring(0,1);
      //Obtenemos la decena inmediata
      var decena = (parseInt(primer_digito_suma) + 1)  * 10;
      //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
      var digito_validador = decena - suma_total;
      //Si el digito validador es = a 10 toma el valor de 0
      if(digito_validador == 10)
        var digito_validador = 0;
      //Validamos que el digito validador sea igual al de la cedula
      if(digito_validador == ultimo_digito){
        ret = true;
      }
    }
  }
  return ret;
}

export const ayer =()=> {
  return new Date(new Date().getTime() - 24*60*60*1000); //new Date(yesterdayTimeStamp);
}

export const horario =()=> {
  return [
    { id:1,  codigo: "08:00", titulo: "08:00H", hora: 8, minuto: 0 },
    { id:2,  codigo: "08:15", titulo: "08:15H", hora: 8, minuto: 15 },
    { id:3,  codigo: "08:30", titulo: "08:30H", hora: 8, minuto: 30 },
    { id:4,  codigo: "08:45", titulo: "08:45H", hora: 8, minuto: 45 },
    { id:5,  codigo: "09:00", titulo: "09:00H", hora: 9, minuto: 0 },
    { id:6,  codigo: "09:15", titulo: "09:15H", hora: 9, minuto: 15 },
    { id:7,  codigo: "09:30", titulo: "09:30H", hora: 9, minuto: 30 },
    { id:8,  codigo: "09:45", titulo: "09:45H", hora: 9, minuto: 45 },
    { id:9,  codigo: "10:00", titulo: "10:00H", hora: 10, minuto: 0 },
    { id:10, codigo: "10:15", titulo: "10:15H", hora: 10, minuto: 15 },
    { id:11, codigo: "10:30", titulo: "10:30H", hora: 10, minuto: 30 },
    { id:12, codigo: "10:45", titulo: "10:45H", hora: 10, minuto: 45 },
    { id:13, codigo: "11:00", titulo: "11:00H", hora: 11, minuto: 0 },
    { id:14, codigo: "11:15", titulo: "11:15H", hora: 11, minuto: 15 },
    { id:15, codigo: "11:30", titulo: "11:30H", hora: 11, minuto: 30 },
    { id:16, codigo: "11:45", titulo: "11:45H", hora: 11, minuto: 45 },
    { id:17, codigo: "13:00", titulo: "13:00H", hora: 13, minuto: 0 },
    { id:18, codigo: "13:15", titulo: "13:15H", hora: 13, minuto: 15 },
    { id:19, codigo: "13:30", titulo: "13:30H", hora: 13, minuto: 30 },
    { id:20, codigo: "13:45", titulo: "13:45H", hora: 13, minuto: 45 },
    { id:21, codigo: "14:00", titulo: "14:00H", hora: 14, minuto: 0 },
    { id:22, codigo: "14:15", titulo: "14:15H", hora: 14, minuto: 15 },
    { id:23, codigo: "14:30", titulo: "14:30H", hora: 14, minuto: 30 },
    { id:24, codigo: "14:45", titulo: "14:45H", hora: 14, minuto: 45 },
    { id:25, codigo: "15:00", titulo: "15:00H", hora: 15, minuto: 0 },
    { id:26, codigo: "15:15", titulo: "15:15H", hora: 15, minuto: 15 },
    { id:27, codigo: "15:30", titulo: "15:30H", hora: 15, minuto: 30 },
    { id:28, codigo: "15:45", titulo: "15:45H", hora: 15, minuto: 45 },
    { id:25, codigo: "16:00", titulo: "16:00H", hora: 16, minuto: 0 },
    { id:26, codigo: "16:15", titulo: "16:15H", hora: 16, minuto: 15 },
    { id:27, codigo: "16:30", titulo: "16:30H", hora: 16, minuto: 30 },
    { id:28, codigo: "16:45", titulo: "16:45H", hora: 16, minuto: 45 },
  ]
}