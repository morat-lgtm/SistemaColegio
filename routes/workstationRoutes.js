const express = require("express");

const workstationController =
require("../controllers/workstationController");

const router = express.Router();


// ==========================
// OBTENER HOSTNAME
// ==========================

router.get(
"/hostname",
(req,res)=>{

    try{

        const hostname =
        workstationController.getHostname();


        res.json({

            hostname

        });


    }catch(error){

        console.error(error);


        res.status(500).json({

            error:error.message

        });

    }

});


// ==========================
// LISTAR AMBIENTES
// ==========================

router.get(
"/ambientes",
async(req,res)=>{

    try{

        const ambientes =
        await workstationController.getAmbientes();


        res.json(
            ambientes
        );


    }catch(error){

        console.error(error);


        res.status(500).json({

            error:error.message

        });

    }

});


// ==========================
// GUARDAR CONFIGURACIÓN
// ==========================

router.post(
"/",
async(req,res)=>{

    try{

        const {

            hostname,

            ambiente_id

        } = req.body;


        // ==========================
        // VALIDAR HOSTNAME
        // ==========================

        if(!hostname){

            return res.status(400).json({

                success:false,

                error:
                "No se recibió el hostname de la computadora."

            });

        }


        // ==========================
        // VALIDAR AMBIENTE
        // ==========================

        if(!ambiente_id){

            return res.status(400).json({

                success:false,

                error:
                "Debe seleccionar un ambiente."

            });

        }


        console.log(

            "GUARDANDO WORKSTATION:",

            {

                hostname,

                ambiente_id

            }

        );


        // ==========================
        // GUARDAR
        // ==========================

        const resultado =
        await workstationController
        .saveWorkstation(

            hostname,

            ambiente_id

        );


        res.json({

            success:true,

            workstation:
            resultado

        });


    }catch(error){

        console.error(

            "Error guardando workstation:",

            error

        );


        res.status(500).json({

            success:false,

            error:error.message

        });

    }

});


// ==========================
// OBTENER CONFIGURACIÓN ACTUAL
// ==========================

router.get(
"/",
async(req,res)=>{

    try{

        // Por ahora esta ruta
        // utiliza el hostname del servidor
        // como respaldo.

        const workstation =
        await workstationController
        .getWorkstation();


        res.json(
            workstation
        );


    }catch(error){

        console.error(error);


        res.status(500).json({

            error:error.message

        });

    }

});


module.exports = router;