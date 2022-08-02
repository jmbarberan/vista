import { app } from "@/main";
let rutaBase = "/clinica";

// PACIENTES

export const pacientePorId = function(id) {
  return `${rutaBase}/pacientes/${id}`;
};

export const pacientesBuscar = function(emp, tipo, atrib, estado, filtro) {
  return `${rutaBase}/pacientes/buscar/emp/${emp}/tipo/${tipo}/estado/${estado}/atributo/${atrib}/filtro/${filtro}`;
};

export const pacienteRegistrado = function(id, ced, nom) {
  return `${rutaBase}/pacientes/${id}/existe/${ced}/nombre/${nom}`;
};

export const pacientePorCedula = function(ced) {
  return `${rutaBase}/paciente/cedula/${ced}`;
};

export const cedulaRegistrada = function(id, ced) {
  return `${rutaBase}/pacientes/${id}/cedula/${ced}/registrada`;
};

export const pacienteGuardar = function() {
  return `${rutaBase}/pacientes/guardar`;
};

export const pacientesUnificar = function(id) {
  return `${rutaBase}/consultas/paciente/${id}/unificar`;
};

export const pacienteModificarEstado = function(id, estado) {
  return `${rutaBase}/pacientes/${id}/modificar/estado/${estado}`
}

// MEDICOS

export const medicoPorId = function(id) {
  return `${rutaBase}/medicos/${id}`;
};
export const medicoPorUsuario = function(id) {
  return `${rutaBase}/medicos/usuario/${id}`;
};
export const medicosBuscar = function(emp, tipo, atrib, estado, filtro) {
  return `${rutaBase}/medicos/buscar/emp/${emp}/tipo/${tipo}/estado/${estado}/atributo/${atrib}/filtro/${filtro}`;
};
export const medicoRegistrado = function(id, ced, nom) {
  return `${rutaBase}/medicos/${id}/existe/${ced}/nombre/${nom}`;
};
export const medicoPorCedula = function(ced) {
  return `${rutaBase}/medicos/cedula/${ced}`;
};

export const medicoCedulaRegistrada = function(id, ced) {
  return `${rutaBase}/medicos/${id}/cedula/${ced}/registrada`;
};

export const medicoGuardar = function() {
  return `${rutaBase}/medicos/guardar`;
}

export const medicosPorEstado = function(estado) {
  return `${rutaBase}/medicos/estado/${estado}`;
}

export const medicosPorEspecialidadEstado = function(especialidad, estado) {
  return `${rutaBase}/medicos/especialidad/${especialidad}/estado/${estado}`;
}

export const medicoModificarEstado = function(id, estado) {
  return `${rutaBase}/medicos/${id}/modificar/estado/${estado}`
}
// CONSULTAS

export const consultasPorPaciente = function(id, estado) {
  return `${rutaBase}/consultas/paciente/${id}/estado/${estado}`;
}

export const consultasPorMedico = function(id, estado) {
  return `${rutaBase}/consultas/medico/${id}/estado/${estado}`;
}

export const consultasMedicoFecha = function(id, desde, hasta, estado) {
  return `${rutaBase}/consultas/medico/${id}/desde/${desde}/hasta/${hasta}/estado/${estado}`;
}

export const consultasPorFecha = function(desde, hasta, estado) {
  return `${rutaBase}/consultas/desde/${desde}/hasta/${hasta}/estado/${estado}`;
}

export const consultasPorMotivo = function(motivo, estado) {
  return `${rutaBase}/consultas/motivo/${motivo}/estado/${estado}`;
}

export const consultasPorId = function(id) {
  return `${rutaBase}/consultas/${id}`;
}

export const consultaGuardar = function() {
  return `${rutaBase}/consultas/guardar`;
}

export const consultasGuardarFactura = function(id, fac) {
  return `${rutaBase}/consultas/${id}/factura/${fac}/actualizar`;
}

export const consultasGuardarEstado = function(id, est) {
  return `${rutaBase}/consultas/${id}/estado/${est}/actualizar`;
}

export const consultasGuardarMedidas = function(id) {
  return `${rutaBase}/consultas/${id}/mediciones/guardar`;
}

export const consultasGuardarAtencion = function(id) {
  return `${rutaBase}/consultas/${id}/atencion/guardar`;
}

export const consultasPacienteLimite = function(id, limite, conid) {
  return `${rutaBase}/consultas/paciente/${id}/limite/${limite}/consulta/${conid}`;
}

export const consultaPlantillaPorId = function(id) {
  return `${rutaBase}/pantilla/${id}`;
}

export const plantillasPorEstado = function(estado) {
  return `${rutaBase}/plantillas/estado/${estado}`;
}

// SERVICIOS

export const servicioPorId = function(id) {
  return `${rutaBase}/servicios/${id}`;
}

export const serviciosBuscar = function(tipo, filtro, estado) {
  return `${rutaBase}/servicios/buscar/tipo/${tipo}/estado/${estado}/filtro/${filtro}`;
}

export const servicioRegistrado = function(id, cod, des) {
  return `${rutaBase}/servicios/${id}/existe/${cod}/descripcion/${des}`;
};

export const serviciosGuardar = function() {
  return `${rutaBase}/servicios/guardar`;
}

export const servicioModificarEstado = function(id, estado) {
  return `${rutaBase}/servicios/${id}/modificar/estado/${estado}`;
}

export const registrosPorTabla = function(id) {
  return `${rutaBase}/tablas/${id}/registros`;
};

// TABLAS

export const registroPorId = function(id) {
  return `${rutaBase}/tablas/registros/${id}`;
};

export const serviciosEspecialidad = function(esp) {
  return `${rutaBase}/servicios/especialidad/${esp}`;
}

export const especialidadesTodas = function() {
  return `${rutaBase}/especialidades/todas`;
}

export const examenesLista = function() {
  return `${rutaBase}/examenes`;
}
