const express = require("express");
const multer = require("multer");

const importController =
require("../controllers/importController");


const router = express.Router();



// ==========================
// CONFIGURACIÓN SUBIDA ARCHIVO
// ==========================

const upload = multer({

    dest:"uploads/"

});





// ==========================
// IMPORTAR ESTUDIANTES
// ==========================

router.post(
"/import",
upload.single("archivo"),
async(req,res)=>{


    try{


        if(!req.file){


            return res.status(400).json({

                success:false,

                message:
                "No se recibió archivo Excel."

            });


        }





        const resultado =
        await importController.importStudents(

            req.file.path

        );





        res.json({

            success:true,

            ...resultado

        });




    }catch(error){


        console.error(error);



        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }



});





module.exports = router;