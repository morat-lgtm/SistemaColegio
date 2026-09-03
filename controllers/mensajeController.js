const mensajeService =
    require("../services/mensajeService");


class MensajeController {


    // ==========================
    // REGISTRAR
    // ==========================

    async registrarMensaje(
        mensaje
    ) {

        return await mensajeService
            .registrarMensaje(
                mensaje
            );

    }


    // ==========================
    // OBTENER MENSAJES
    // ==========================

    async getMensajes(
        usuarioId
    ) {

        return await mensajeService
            .getMensajes(
                usuarioId
            );

    }


    // ==========================
    // NO LEÍDOS
    // ==========================

    async getMensajesNoLeidos(
        usuarioId
    ) {

        return await mensajeService
            .getMensajesNoLeidos(
                usuarioId
            );

    }


    // ==========================
    // MARCAR LEÍDO
    // ==========================

    async marcarLeido(
        id,
        usuarioId
    ) {

        return await mensajeService
            .marcarLeido(
                id,
                usuarioId
            );

    }

}


module.exports =
    new MensajeController();