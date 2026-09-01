const express = require("express");

const incidenciaController =
require("../controllers/incidenciaController");

const sessionManager =
require("../helpers/sessionManager");


const router = express.Router();


console.log("✔ Ruta incidenciaRoutes cargada.");


// ==========================
// OBTENER TIPOS DE INCIDENCIA
// ==========================

router.get(

"/tipos",

async(req,res)=>{


    try{


        const resultado =

        await incidenciaController
        .getTiposIncidencia();


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
// REGISTRAR INCIDENCIA
// ==========================

router.post(

"/",

async(req,res)=>{


    try{


        const {

            sessionId,

            estudiante_id,

            tipo_id,

            descripcion

        } = req.body;



        // ==========================
        // VALIDAR SESIÓN
        // ==========================

        if(!sessionId){


            return res.status(401).json({

                success:false,

                error:
                "Sesión no encontrada."

            });


        }



        const sesion =

        sessionManager.get(

            sessionId

        );



        if(!sesion){


            return res.status(401).json({

                success:false,

                error:
                "La sesión no es válida o ha expirado."

            });


        }



        // ==========================
        // CONSTRUIR INCIDENCIA
        // ==========================

        const incidencia = {


            estudiante_id:

            estudiante_id,


            tipo_id:

            tipo_id,


            descripcion:

            descripcion,


            // USUARIO REAL DE LA SESIÓN

            usuario_id:

            sesion.id,


            // COMPUTADORA ASOCIADA
            // A LA SESIÓN

            workstation_id:

            sesion.workstation?.id || null


        };



        // ==========================
        // MOSTRAR INFORMACIÓN
        // EN CONSOLA
        // ==========================

        console.log(

            "REGISTRANDO INCIDENCIA:",

            {

                usuario_id:
                incidencia.usuario_id,

                nombre:
                sesion.nombre,

                workstation_id:
                incidencia.workstation_id

            }

        );



        // ==========================
        // REGISTRAR
        // ==========================

        const resultado =

        await incidenciaController
        .registrarIncidencia(

            incidencia

        );



        res.json({

            success:true,

            resultado

        });


    }catch(error){


        console.error(

            "Error registrando incidencia:",

            error

        );


        res.status(500).json({

            success:false,

            error:
            error.message

        });


    }


});




// ==========================
// HISTORIAL DE INCIDENCIAS
// DEL DÍA
// ==========================

router.get(

"/hoy",

async(req,res)=>{


    try{


        const resultado =

        await incidenciaController
        .getIncidenciasHoy();


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
// REPORTE POR ESTUDIANTE
// ==========================

router.get(

"/estudiante/:id",

async(req,res)=>{


    try{


        const resultado =

        await incidenciaController
        .getIncidenciasByEstudiante(

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




module.exports = router;