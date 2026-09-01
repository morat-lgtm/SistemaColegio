const studentRepository =
require("../repositories/studentRepository");


class StudentService {




// ==========================
// OBTENER TODOS
// ==========================

async getAll(){


    return await studentRepository.getAll();


}







// ==========================
// ESTUDIANTES POR AMBIENTE
// ==========================

async getByAmbiente(ambienteId){


    return await studentRepository.getByAmbiente(

        ambienteId

    );


}







// ==========================
// OBTENER POR ID
// ==========================

async getById(id){


    return await studentRepository.getById(

        id

    );


}







// ==========================
// BUSCAR
// ==========================

async search(texto){



    if(!texto || texto.trim()===""){


        return await studentRepository.getAll();


    }




    return await studentRepository.search(

        texto

    );


}







// ==========================
// CREAR
// ==========================

async create(estudiante){



    if(!estudiante.apellidos ||
       estudiante.apellidos.trim()===""
    ){

        throw new Error(
            "Los apellidos son obligatorios."
        );

    }





    if(!estudiante.nombres ||
       estudiante.nombres.trim()===""
    ){

        throw new Error(
            "Los nombres son obligatorios."
        );

    }





    if(!estudiante.nivel ||
       estudiante.nivel.trim()===""
    ){

        throw new Error(
            "Debe indicar el nivel."
        );

    }





    if(!estudiante.grado ||
       estudiante.grado.trim()===""
    ){

        throw new Error(
            "Debe indicar el grado."
        );

    }





    if(!estudiante.seccion ||
       estudiante.seccion.trim()===""
    ){

        throw new Error(
            "Debe indicar la sección."
        );

    }




    return await studentRepository.create(

        estudiante

    );


}







// ==========================
// ACTUALIZAR
// ==========================

async update(estudiante){


    return await studentRepository.update(

        estudiante

    );


}







// ==========================
// ELIMINAR
// ==========================

async delete(id){


    return await studentRepository.delete(

        id

    );


}







// ==========================
// IMPORTAR ESTUDIANTES
// ==========================

async importStudents(estudiantes){



    let importados = 0;

    let omitidos = 0;





    for(const estudiante of estudiantes){



        const existe =

        await studentRepository.exists(


            estudiante.apellidos,


            estudiante.nombres,


            estudiante.nivel,


            estudiante.grado,


            estudiante.seccion


        );






        if(existe){


            omitidos++;


            continue;


        }





        await studentRepository.create(

            estudiante

        );



        importados++;



    }






    return {


        success:true,


        importados,


        omitidos


    };



}



}



module.exports =
new StudentService();