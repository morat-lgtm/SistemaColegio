const express = require("express");

const motivoSalidaController =
require("../controllers/motivoSalidaController");

const router = express.Router();




// ==========================
// OBTENER MOTIVOS DE SALIDA
// ==========================

router.get(
"/",
async(req,res)=>{


    try{


        const motivos =
        await motivoSalidaController.getAll();



        res.json(
            motivos
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});





module.exports = router;