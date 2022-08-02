let rutaBase = "/seguridad";

export const apiSeguridad = {
  usuariosAcceso: function() {
    return `${rutaBase}/credenciales/validar`;
  },
  usuariosPorEstado: function(est) {
    return `${rutaBase}/usuarios/lista/${est}`;
  },
  usuarioGuardar: function() {
    return `${rutaBase}/usuarios/guardar`;
  },
  usuarioModificarEstado: function(id, est) {
    return `${rutaBase}/usuario/${id}/modificar/estado/${est}`
  },
  rolesTodos: function() {
    return `${rutaBase}/roles`;
  }
};
