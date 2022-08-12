let root = "/nomina";

//#region Empleados
export const empleadosBuscar = function(p) {
  return {
    metodo : "get",
    ruta: `${root}/empleados/sub/${p.sub}/emp/${p.emp}/tipo/${p.tipo}/estado/${p.estado}/atributo/${p.atributo}/filtro/${p.filtro}/buscar`
  }
};

export const empleadosBuscarMin = function(filtro) {
  return {
    metodo : "get",
    ruta: `${root}/empleados/buscar/${filtro}`
  }
};

export const empleadoPorId = function(id) {
  return {
    metodo : "get",
    ruta: `${root}/empleados/${id}`
  }
};

export const empleadoRegistrado = function(p) {
  return {
    metodo : "get",
    ruta: `${root}/empleados/${p.id}/sub/${p.sub}/emp/${p.emp}/ced/${p.cedula}/nom/${p.nombres}/registrado`
  }
};

export const empleadoPorCedula = function(p) {
  return {
    metodo : "get",
    ruta: `${root}/empleados/sub/${p.sub}/emp/${p.emp}/ced/${p.cedula}`
  }
};

export const empleadoModificarEstado = function(p) {
  return {
    metodo : "patch",
    ruta: `${root}/empleados/${p.id}/estado/${p.est}/modificar`
  }
};

export const empleadoGuardar = function() {
  return {
    metodo : "post",
    ruta: `${root}/empleados/guardar`
  }
};
//#endergion

//#region Cargos
export const cargosPorEstado = function(p) {
  return {
    metodo : "get",
    ruta: `${root}/cargos/sub/${p.sub}/emp/${p.emp}/estado/${p.estado}`
  }
}

export const cargoModificarEstado = function(p) {
  return {
    metodo : "patch",
    ruta: `${root}/cargos/${p.id}/estado/${p.estado}/modificar`
  }
}

export const cargoGuardar = function() {
  return {
    metodo : "post",
    ruta: `${root}/cargos/guardar`
  }
}
//#endregion
