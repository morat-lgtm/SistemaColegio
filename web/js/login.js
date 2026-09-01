const express = require("express");

const authController =
    require("../controllers/authController");

const router = express.Router();


// ==========================
// LOGIN
// ==========================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                usuario,
                password
            } = req.body;


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
                    password
                );


            // ==========================
            // RESPUESTA
            // ==========================

            res.json(
                resultado
            );


        } catch (error) {

            console.error(
                "ERROR LOGIN:",
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


module.exports = router;