const express = require("express");

const reporteController =
require("../controllers/reporteController");


const router = express.Router();



// ==========================
// REPORTE POR ESTUDIANTE
// ==========================

router.get(
"/estudiante/:id",
async(req,res)=>{


    try{


        const resultado =

        await reporteController
        .getReportePorEstudiante(

            req.params.id

        );



        res.json(

            resultado

        );



    }catch(error){


        console.error(

            "Error reporte estudiante:",

            error

        );



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// REPORTE POR FECHA
// ==========================

router.get(
"/fecha/:fecha",
async(req,res)=>{


    try{


        const resultado =

        await reporteController
        .getReportePorFecha(

            req.params.fecha

        );



        res.json(

            resultado

        );



    }catch(error){


        console.error(

            "Error reporte fecha:",

            error

        );



        res.status(500).json({

            error:error.message

        });


    }


});






module.exports = router;