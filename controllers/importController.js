const importStudentService =
require("../services/import/importStudentService");


const studentController =
require("./studentController");


const workstationService =
require("../services/workstationService");


const workstationRepository =
require("../repositories/workstationRepository");





class ImportController {




// ==========================
// IMPORTAR ESTUDIANTES
// ==========================

async importStudents(archivo){



    // ==========================
    // OBTENER CONFIGURACIÓN PC
    // ==========================


    const workstation =
    await workstationService.getWorkstation();

console.log(
    "WORKSTATION ACTUAL:",
    workstation
);



    if(!workstation){


        throw new Error(

            "Este equipo no tiene un ambiente configurado."

        );


    }







    const ambienteId =
    workstation.ambiente_id;







    // ==========================
    // OBTENER AMBIENTE
    // ==========================


    const ambientes =
    await workstationRepository.getAllAmbientes();





    const ambiente =
    ambientes.find(

        item =>
        item.id == ambienteId

    );







    if(!ambiente){


        throw new Error(

            "No se encontró información del ambiente."

        );


    }








    console.log(

        "Ambiente para importar:",

        ambiente

    );









    // ==========================
    // LEER EXCEL
    // ==========================


    const filas =
    importStudentService.read(

        archivo

    );









    const estudiantes =
    importStudentService.parse(

        filas,

        ambiente.nivel,

        ambiente.grado,

        ambiente.seccion,

        ambiente.id

    );









    const respuesta =
    await studentController.importStudents(

        estudiantes

    );







    return respuesta;



}



}



module.exports =
new ImportController();