const motivoSalidaRepository =
require("../repositories/motivoSalidaRepository");


class MotivoSalidaService {



// ==========================
// OBTENER MOTIVOS DE SALIDA
// ==========================

async getAll(){


    return await motivoSalidaRepository.getAll();


}



}



module.exports =
new MotivoSalidaService();