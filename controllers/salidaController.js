const salidaService =
require("../services/salidaService");


class SalidaController {




// ==========================
// REGISTRAR SALIDA
// ==========================

async registrarSalida(salida){


    return await salidaService.registrarSalida(

        salida

    );


}







// ==========================
// OBTENER SALIDAS ACTIVAS
// ==========================

async getSalidasActivas(){


    return await salidaService.getSalidasActivas();


}







// ==========================
// REGISTRAR RETORNO
// ==========================

async registrarRetorno(id){


    return await salidaService.registrarRetorno(

        id

    );


}







// ==========================
// OBTENER HISTORIAL COMPLETO
// ==========================

async getHistorial(){


    return await salidaService.getHistorial();


}







// ==========================
// OBTENER HISTORIAL POR AMBIENTE
// ==========================

async getHistorialByAmbiente(ambienteId){


    return await salidaService.getHistorialByAmbiente(

        ambienteId

    );


}



}



module.exports =
new SalidaController();