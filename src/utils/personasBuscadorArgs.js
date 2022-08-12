export class BuscadorPersonasArgs {  
  constructor(params) {
    this.subscripcionId = params.sub      || 0;
    this.empresaId      = params.emp      || 0;
    this.atributo       = params.atributo || "";
    this.estado         = params.estado   || 0;
    this.tipo           = params.tipo     || 0;
    this.filtro         = params.filtro   || "";
  }

  buildParams() {
    return {
      sub:      this.subscripcionId,
      emp:      this.empresaId,
      tipo:     this.tipo,
      estado:   this.estado,
      atributo: this.atributo
    }
  }

  buildParamswFiltro() {
    let res     = this.buildParams();
    res.filtro  = this.filtro;
    return res;
  }
}