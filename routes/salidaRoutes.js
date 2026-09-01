const express = require("express");

const salidaController =
require("../controllers/salidaController");

const router = express.Router();




// ==========================
// SALIDAS ACTIVAS
// ==========================

router.get(
"/activas",
async(req,res)=>{


    try{


        const resultado =
        await salidaController.getSalidasActivas();



        res.json(
            resultado
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// REGISTRAR SALIDA
// ==========================

router.post(
"/",
async(req,res)=>{


    try{


        const resultado =
        await salidaController.registrarSalida(

            req.body

        );



        res.json(
            resultado
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// REGISTRAR RETORNO
// ==========================

router.put(
"/retorno/:id",
async(req,res)=>{


    try{


        const resultado =
        await salidaController.registrarRetorno(

            req.params.id

        );



        res.json(
            resultado
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// HISTORIAL
// ==========================

router.get(
"/historial",
async(req,res)=>{


    try{


        const resultado =
        await salidaController.getHistorial();



        res.json(
            resultado
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});





module.exports = router;