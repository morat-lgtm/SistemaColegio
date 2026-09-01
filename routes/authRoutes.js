const express =
    require("express");


const authController =
    require("../controllers/authController");


const sessionManager =
    require("../helpers/sessionManager");


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
                workstationKey
            } = req.body;


            console.log(
                "LOGIN RECIBIDO:",
                {
                    usuario,
                    workstationKey
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
                await authController.login(
                    usuario,
                    password,
                    workstationKey
                );


            // ==========================
            // RESPUESTA
            // ==========================

            return res.json(
                resultado
            );


        } catch (error) {

            console.error(
                "ERROR LOGIN:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Error interno del servidor."

            });

        }

    }
);


// ==========================
// OBTENER SESIÓN
// ==========================

router.get(
    "/session/:sessionId",
    (req, res) => {

        try {

            const {
                sessionId
            } = req.params;


            console.log(
                "SOLICITUD DE SESIÓN:",
                sessionId
            );


            // ==========================
            // OBTENER SESIÓN
            // ==========================

            const sesion =
                sessionManager.get(
                    String(sessionId)
                );


            // ==========================
            // SESIÓN NO EXISTE
            // ==========================

            if (!sesion) {

                console.warn(
                    "SESIÓN NO ENCONTRADA:",
                    sessionId
                );


                return res.status(404).json({

                    success: false,

                    message:
                        "Sesión no encontrada."

                });

            }


            // ==========================
            // RESPUESTA
            // ==========================

            console.log(
                "SESIÓN ENCONTRADA:",
                sesion
            );


            return res.json({

                success: true,

                session:
                    sesion

            });


        } catch (error) {

            console.error(
                "ERROR OBTENIENDO SESIÓN:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Error interno del servidor."

            });

        }

    }
);


// ==========================
// EXPORTAR
// ==========================

module.exports =
    router;