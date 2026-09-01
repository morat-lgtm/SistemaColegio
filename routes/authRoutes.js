const express = require("express");

const authService =
    require("../services/authService");

const sessionManager =
    require("../helpers/sessionManager");

const workstationRepository =
    require("../repositories/workstationRepository");


const router =
    express.Router();


// ==========================
// LOGIN
// ==========================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                usuario,
                password,
                hostname
            } = req.body;


            console.log(
                "LOGIN RECIBIDO:",
                {
                    usuario,
                    hostname
                }
            );


            // ==========================
            // VALIDAR DATOS
            // ==========================

            if (!usuario || !password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Debe ingresar usuario y contraseña."

                });

            }


            // ==========================
            // LOGIN
            // ==========================

            const resultado =
                await authService.login(
                    usuario,
                    password,
                    hostname
                );


            res.json(
                resultado
            );


        }
        catch (error) {

            console.error(
                "Error login:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Error interno del servidor."

            });

        }

    }
);


// ==========================
// OBTENER SESIÓN ACTUAL
// ==========================

router.get(
    "/session/:sessionId",
    (req, res) => {

        try {

            const {
                sessionId
            } = req.params;


            const sesion =
                sessionManager.get(
                    sessionId
                );


            if (!sesion) {

                return res.json(null);

            }


            res.json(
                sesion
            );


        }
        catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                error:
                    error.message

            });

        }

    }
);


// ==========================
// CERRAR SESIÓN
// ==========================

router.post(
    "/logout",
    (req, res) => {

        try {

            const {
                sessionId
            } = req.body;


            if (!sessionId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Sesión no encontrada."

                });

            }


            sessionManager.clear(
                sessionId
            );


            console.log(
                "SESIÓN CERRADA:",
                sessionId
            );


            res.json({

                success: true,

                message:
                    "Sesión cerrada correctamente."

            });


        }
        catch (error) {

            console.error(
                "Error cerrando sesión:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Error cerrando sesión."

            });

        }

    }
);


// ==========================
// CAMBIAR AMBIENTE
// ==========================

router.post(
    "/ambiente",
    async (req, res) => {

        try {

            const {
                ambiente_id,
                sessionId
            } = req.body;


            if (!ambiente_id) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Debe seleccionar un ambiente."

                });

            }


            if (!sessionId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Sesión no encontrada."

                });

            }


            const ambientes =
                await workstationRepository
                    .getAllAmbientes();


            const ambiente =
                ambientes.find(
                    item =>
                        item.id == ambiente_id
                );


            if (!ambiente) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Ambiente no encontrado."

                });

            }


            console.log(
                "GUARDANDO AMBIENTE",
                sessionId,
                ambiente
            );


            sessionManager.setAmbiente(
                sessionId,
                ambiente
            );


            res.json({

                success: true,

                ambiente:
                    ambiente

            });


        }
        catch (error) {

            console.error(
                "ERROR CAMBIANDO AMBIENTE:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);


module.exports =
    router;