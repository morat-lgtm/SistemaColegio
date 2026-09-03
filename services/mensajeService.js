const mensajeRepository =
    require("../repositories/mensajeRepository");


class MensajeService {


    // ==========================
    // REGISTRAR MENSAJE
    // ==========================

    async registrarMensaje(mensaje) {

        const resultado =
            await mensajeRepository
                .registrarMensaje(
                    mensaje
                );


        return {

            success: true,

            message:
                "Mensaje enviado correctamente.",

            mensaje:
                resultado

        };

    }


    // ==========================
    // OBTENER MENSAJES
    // ==========================

    async getMensajes(usuarioId) {

        return await mensajeRepository
            .getMensajes(
                usuarioId
            );

    }


    // ==========================
    // OBTENER NO LEÍDOS
    // ==========================

    async getMensajesNoLeidos(
        usuarioId
    ) {

        return await mensajeRepository
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

        const resultado =
            await mensajeRepository
                .marcarLeido(
                    id,
                    usuarioId
                );


        return {

            success: true,

            message:
                "Mensaje marcado como leído.",

            cambios:
                resultado.cambios

        };

    }

}


module.exports =
    new MensajeService();