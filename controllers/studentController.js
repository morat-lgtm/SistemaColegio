const studentService =
require("../services/studentService");


class StudentController {



// ==========================
// OBTENER TODOS
// ==========================

async getAll(){

    return await studentService.getAll();

}






// ==========================
// ESTUDIANTES POR AMBIENTE
// ==========================

async getByAmbiente(ambienteId){

    return await studentService.getByAmbiente(
        ambienteId
    );

}






// ==========================
// OBTENER POR ID
// ==========================

async getById(id){

    return await studentService.getById(
        id
    );

}






// ==========================
// BUSCAR
// ==========================

async search(texto){

    return await studentService.search(
        texto
    );

}






// ==========================
// CREAR
// ==========================

async create(estudiante){

    return await studentService.create(
        estudiante
    );

}






// ==========================
// ACTUALIZAR
// ==========================

async update(estudiante){

    return await studentService.update(
        estudiante
    );

}






// ==========================
// ELIMINAR
// ==========================

async delete(id){

    return await studentService.delete(
        id
    );

}






// ==========================
// IMPORTAR ESTUDIANTES
// ==========================

async importStudents(estudiantes){

    return await studentService.importStudents(
        estudiantes
    );

}



}



module.exports =
new StudentController();