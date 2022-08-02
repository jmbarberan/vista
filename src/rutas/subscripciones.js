let rutaBase = "/subscripciones";

export const codigoValidar = function(p) {
  return `${rutaBase}/codigo/validar`;
};

export const codigoReseteoSolicitar = function() {
  return `${rutaBase}/ticket/reseteo/solicitar`;
};

export const codigoReseteoValidar = function(p) {
  return `${rutaBase}/ticket/reseteo/validar/${p}`;
};

export const codigoResetear = function(p) {
  return `${rutaBase}/codigo/resetear`;
};
