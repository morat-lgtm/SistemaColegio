const salidaRepository =
require("../repositories/salidaRepository");


class SalidaService {


// ==========================
// REGISTRAR SALIDA
// ==========================

async registrarSalida(salida){

    // ==========================
    // VERIFICAR SALIDA ACTIVA
    // ==========================

    const salidaActiva =
    await salidaRepository.getSalidaActiva(

        salida.estudiante_id

    );


    if(salidaActiva){

        return {

            success:false,

            message:
            "El estudiante ya tiene una salida activa."

        };

    }


    // ==========================
    // CONTAR SALIDAS DEL DÍA
    // ==========================

    const cantidadSalidas =
    await salidaRepository.getCantidadSalidasHoy(

        salida.estudiante_id,

        salida.motivo_id

    );


    console.log(

        "SALIDAS DEL DÍA:",

        {

            estudiante_id:
            salida.estudiante_id,

            motivo_id:
            salida.motivo_id,

            cantidad:
            cantidadSalidas

        }

    );


    // ==========================
    // ALERTA DESDE LA CUARTA
    // ==========================

    // Si ya tiene 3 salidas registradas,
    // la siguiente será la cuarta.
    //
    // Si ya tiene 4, será la quinta,
    // y así sucesivamente.
    //
    // El cliente decidirá si continúa.

    if(

        cantidadSalidas >= 3 &&

        !salida.confirmarSalida

    ){

        return {

            success:false,

            requiereConfirmacion:true,

            cantidad:
            cantidadSalidas + 1,

            message:
            `El estudiante ya está solicitando su ${cantidadSalidas + 1}ª salida por este motivo durante el día.`

        };

    }


    // ==========================
    // REGISTRAR SALIDA
    // ==========================

    await salidaRepository.registrarSalida(

        salida

    );


    return {

        success:true,

        message:
        "Salida registrada correctamente."

    };

}


// ==========================
// SALIDAS ACTIVAS
// ==========================

async getSalidasActivas(){

    return await salidaRepository
    .getSalidasActivas();

}


// ==========================
// REGISTRAR RETORNO
// ==========================

async registrarRetorno(id){

    await salidaRepository
    .registrarRetorno(id);


    return {

        success:true,

        message:
        "Retorno registrado correctamente."

    };

}


// ==========================
// HISTORIAL COMPLETO
// ==========================

async getHistorial(){

    return await salidaRepository
    .getHistorial();

}


// ==========================
// HISTORIAL POR AMBIENTE
// ==========================

async getHistorialByAmbiente(ambienteId){

    return await salidaRepository
    .getHistorialByAmbiente(

        ambienteId

    );

}

}


// ==========================
// EXPORTAR
// ==========================

module.exports =
new SalidaService();