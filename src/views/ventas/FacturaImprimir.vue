<b-colxx xxs="12" class="mb-5">
          <div style="background-color:#ffffff; height:660px; max-width:830px; font-family: Helvetica,Arial,sans-serif !important; position: relative;">
            <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="width:100%; background-color:#ffffff;border-collapse:separate !important; border-spacing:0;color:#242128; margin:0; padding-left:30px; padding-right:30px;" heigth="auto">
              <tbody>
                <tr>
                  <td colspan="2">
                    <table style="width: 100%;">
                      <tbody>
                      </tbody>
                    </table>
                    <div style="width: 100%; display: table;">
                      <table style="width: 40%; float: left; margin-top:20px; margin-right: 60px;">
                        <tr>
                          <td>
                            <p>
                              {{ this.venta.relCliente.nombres }}
                            </p>
                            <p>  
                              {{ this.venta.relCliente.direccion }}
                            </p>
                            <p>  
                              {{ this.venta.relCliente.identificacion }}  {{ $moment(venta.fecha).format("YYYY-MM-DD") }}
                            </p>
                          </td>
                          <!--td style="text-align: right; padding-top:0px; padding-bottom:0; vertical-align:middle; padding:15px; background-color: #f9f9f9; border-radius: 3px; border-left: 5px solid white;">
                            <p style="color:#8f8f8f; font-size: 14px; padding: 0; line-height: 1.6; margin:0; ">
                              
                            </p>
                          </td-->
                        </tr>
                        <tbody>
                          <tr v-for="item in venta.relItems" :key="item.relProducto.id" style="padding-top: 10px;">
                            <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                              <p href="#" style="font-size: 13px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                {{ item.cantidad }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px;">
                              <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                                {{ item.relProducto.medida }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px;">
                              <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                                {{ item.relProducto.nombre }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                              <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                {{ item.precio | dinero }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                              <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                {{ item.cantidad * item.precio | dinero }}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table style="width: 40%; float: left; margin-top:20px; margin-right: 60px;">
                        <tr>
                          <td>
                            <p>
                              {{ this.venta.relCliente.nombres }}
                            </p>
                            <p>  
                              {{ this.venta.relCliente.direccion }}
                            </p>
                            <p>  
                              {{ this.venta.relCliente.identificacion }}  {{ $moment(venta.fecha).format("YYYY-MM-DD") }}
                            </p>
                          </td>
                          <!--td style="text-align: right; padding-top:0px; padding-bottom:0; vertical-align:middle; padding:15px; background-color: #f9f9f9; border-radius: 3px; border-left: 5px solid white;">
                            <p style="color:#8f8f8f; font-size: 14px; padding: 0; line-height: 1.6; margin:0; ">
                              
                            </p>
                          </td-->
                        </tr>
                        <tbody>
                          <tr v-for="item in venta.relItems" :key="item.relProducto.id" style="padding-top: 10px;">
                            <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                              <p href="#" style="font-size: 13px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                {{ item.cantidad }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px;">
                              <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                                {{ item.relProducto.medida }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px;">
                              <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                                {{ item.relProducto.nombre }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                              <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                {{ item.precio | dinero }}
                              </p>
                            </td>
                            <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                              <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                                {{ item.cantidad * item.precio | dinero }}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-colxx>


<b-row class="medioA4 invisible">
        <div class="col" style="max-width: 400px;">
          <div class="row">
            {{ this.venta.relCliente.nombres }}
          </div>
          <div class="row">
            {{ this.venta.relCliente.direccion }}.
          </div>
          <div class="row">
            <div class="col" style="min-width: 180px;">
              {{ this.venta.relCliente.identificacion }}
            </div>
            <div class="col" style="max-width: 120px;">
              {{ $moment(venta.fecha).format("YYYY-MM-DD") }}
            </div>  
          </div>
          <table style="margin-top:20px;">
            <tbody>
              <tr v-for="item in venta.relItems" :key="item.relProducto.id" style="padding-top: 10px;">
                <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                  <p href="#" style="font-size: 13px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0; min-width: 60px">
                    {{ item.cantidad }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px;">
                  <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px; min-width: 90px">
                    {{ item.relProducto.medida }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px;">
                  <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                    {{ item.relProducto.nombre }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                  <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;  min-width: 60px">
                    {{ item.precio | dinero }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                  <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;  min-width: 60px">
                    {{ item.cantidad * item.precio | dinero }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <span>TOTAL</span>
            <span>{{ venta.subtotal | dinero }}</span>
          </div>
        </div>
        <div class="col" style="max-width: 400px;">
          <div class="row">
            {{ this.venta.relCliente.nombres }}
          </div>
          <div class="row">
            {{ this.venta.relCliente.direccion }}.
          </div>
          <div class="row">
            <div class="col" style="min-width: 180px;">
              {{ this.venta.relCliente.identificacion }}
            </div>
            <div class="col" style="max-width: 120px;">
              {{ $moment(venta.fecha).format("YYYY-MM-DD") }}
            </div>  
          </div>
          <table style="margin-top:20px;">
            <tbody>
              <tr v-for="item in venta.relItems" :key="item.relProducto.id" style="padding-top: 10px;">
                <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                  <p href="#" style="font-size: 13px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0; min-width: 60px">
                    {{ item.cantidad }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px;">
                  <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px; min-width: 90px">
                    {{ item.relProducto.medida }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px;">
                  <p style="font-size: 12px; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                    {{ item.relProducto.nombre }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                  <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;  min-width: 60px">
                    {{ item.precio | dinero }}
                  </p>
                </td>
                <td style="padding-top:10px; padding-bottom:18px; text-align: right;">
                  <p href="#" style="font-size: 12px; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;  min-width: 60px">
                    {{ item.cantidad * item.precio | dinero }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <span>TOTAL</span>
            <span>{{ venta.subtotal | dinero }}</span>
          </div>
        </div>
      </b-row>