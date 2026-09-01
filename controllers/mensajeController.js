const mensajeService = require("../services/mensajeService");


class MensajeController {


// ==========================
// REGISTRAR MENSAJE
// ==========================

registrarMensaje(mensaje) {


    return mensajeService.registrarMensaje(mensaje);


}



// ==========================
// OBTENER MENSAJES
// ==========================

getMensajes(usuarioId) {


    return mensajeService.getMensajes(usuarioId);


}



// ==========================
// MARCAR LEÍDO
// ==========================

marcarLeido(id) {


    return mensajeService.marcarLeido(id);


}


}


module.exports = new MensajeController();