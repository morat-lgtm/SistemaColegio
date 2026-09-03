const express =
    require("express");


const mensajeController =
    require("../controllers/mensajeController");


const router =
    express.Router();


// ==========================
// MENSAJES NO LEÍDOS
// ==========================

router.get(
    "/:usuarioId/no-leidos",
    async (req, res) => {

        try {

            const usuarioId =
                parseInt(
                    req.params.usuarioId
                );


            if (
                !Number.isInteger(usuarioId)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Usuario inválido."

                });

            }


            const cantidad =
                await mensajeController
                    .getMensajesNoLeidos(
                        usuarioId
                    );


            res.json({

                cantidad:
                    cantidad

            });

        }
        catch (error) {

            console.error(
                "Error obteniendo mensajes no leídos:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Error obteniendo mensajes no leídos."

            });

        }

    }
);


// ==========================
// OBTENER MENSAJES
// ==========================

router.get(
    "/:usuarioId",
    async (req, res) => {

        try {

            const usuarioId =
                parseInt(
                    req.params.usuarioId
                );


            if (
                !Number.isInteger(usuarioId)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Usuario inválido."

                });

            }


            const mensajes =
                await mensajeController
                    .getMensajes(
                        usuarioId
                    );


            res.json(
                mensajes
            );

        }
        catch (error) {

            console.error(
                "Error obteniendo mensajes:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Error obteniendo mensajes."

            });

        }

    }
);


// ==========================
// REGISTRAR MENSAJE
// ==========================

router.post(
    "/",
    async (req, res) => {

        try {

            const mensaje =
                req.body;


            if (
                !mensaje.usuario_origen ||
                !mensaje.usuario_destino ||
                !mensaje.mensaje
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Faltan datos obligatorios."

                });

            }


            const resultado =
                await mensajeController
                    .registrarMensaje(
                        mensaje
                    );


            res.json(
                resultado
            );

        }
        catch (error) {

            console.error(
                "Error registrando mensaje:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "No se pudo enviar el mensaje."

            });

        }

    }
);


// ==========================
// MARCAR LEÍDO
// ==========================

router.put(
    "/:id/leido",
    async (req, res) => {

        try {

            const id =
                parseInt(
                    req.params.id
                );


            const usuarioId =
                parseInt(
                    req.body.usuarioId
                );


            if (
                !Number.isInteger(id) ||
                !Number.isInteger(usuarioId)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Datos inválidos."

                });

            }


            const resultado =
                await mensajeController
                    .marcarLeido(
                        id,
                        usuarioId
                    );


            res.json(
                resultado
            );

        }
        catch (error) {

            console.error(
                "Error marcando mensaje como leído:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "No se pudo marcar el mensaje."

            });

        }

    }
);


module.exports =
    router;