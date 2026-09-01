const motivoSalidaService =
require("../services/motivoSalidaService");


class MotivoSalidaController {



// ==========================
// OBTENER MOTIVOS DE SALIDA
// ==========================

async getAll(){


    return await motivoSalidaService.getAll();


}



}



module.exports =
new MotivoSalidaController();