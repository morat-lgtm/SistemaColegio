const incidenciaRepository =
require("../repositories/incidenciaRepository");



class IncidenciaService {




// ==========================
// OBTENER TIPOS DE INCIDENCIA
// ==========================

async getTiposIncidencia(){


    return await incidenciaRepository
    .getTiposIncidencia();


}







// ==========================
// REGISTRAR INCIDENCIA
// ==========================

async registrarIncidencia(incidencia){


    return await incidenciaRepository
    .registrarIncidencia(

        incidencia

    );


}







// ==========================
// HISTORIAL DEL DÍA
// ==========================

async getIncidenciasHoy(){


    return await incidenciaRepository
    .getIncidenciasHoy();


}
// ==========================
// REPORTE POR ESTUDIANTE
// ==========================

async getIncidenciasByEstudiante(estudianteId){


    return await incidenciaRepository
    .getIncidenciasByEstudiante(

        estudianteId

    );


}




}




module.exports =

new IncidenciaService();