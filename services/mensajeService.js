const mensajeRepository = require("../repositories/mensajeRepository");


class MensajeService {


// ==========================
// REGISTRAR MENSAJE
// ==========================

registrarMensaje(mensaje) {


    mensajeRepository.registrarMensaje(mensaje);



    return {

        success:true,

        message:"Mensaje enviado correctamente."

    };


}



// ==========================
// OBTENER MENSAJES
// ==========================

getMensajes(usuarioId) {


    return mensajeRepository.getMensajes(usuarioId);


}



// ==========================
// MARCAR LEÍDO
// ==========================

marcarLeido(id) {


    mensajeRepository.marcarLeido(id);



    return {

        success:true,

        message:"Mensaje marcado como leído."

    };


}


}


module.exports = new MensajeService();