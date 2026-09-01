const express = require("express");

const studentController =
require("../controllers/studentController");

const router = express.Router();




// ==========================
// OBTENER TODOS
// ==========================

router.get(
"/",
async(req,res)=>{


    try{


        const estudiantes =
        await studentController.getAll();



        res.json(
            estudiantes
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// ESTUDIANTES POR AMBIENTE
// ==========================

router.get(
"/ambiente/:id",
async(req,res)=>{


    try{


        const estudiantes =
        await studentController.getByAmbiente(

            req.params.id

        );



        res.json(
            estudiantes
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// BUSCAR ESTUDIANTES
// ==========================

router.get(
"/buscar/:texto",
async(req,res)=>{


    try{


        const estudiantes =
        await studentController.search(

            req.params.texto

        );



        res.json(
            estudiantes
        );



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// CREAR ESTUDIANTE
// ==========================

router.post(
"/",
async(req,res)=>{


    try{


        const resultado =
        await studentController.create(

            req.body

        );



        res.json({

            success:true,

            resultado

        });



    }catch(error){


        console.error(error);



        res.status(400).json({

            success:false,

            error:error.message

        });


    }


});







// ==========================
// ACTUALIZAR
// ==========================

router.put(
"/:id",
async(req,res)=>{


    try{


        const estudiante = {


            id:req.params.id,


            ...req.body


        };



        const resultado =
        await studentController.update(

            estudiante

        );



        res.json({

            success:true,

            resultado

        });



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});







// ==========================
// ELIMINAR
// ==========================

router.delete(
"/:id",
async(req,res)=>{


    try{


        const resultado =
        await studentController.delete(

            req.params.id

        );



        res.json({

            success:true,

            resultado

        });



    }catch(error){


        console.error(error);



        res.status(500).json({

            error:error.message

        });


    }


});





module.exports = router;