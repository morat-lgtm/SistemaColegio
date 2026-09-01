const reporteRepository =
require("../repositories/reporteRepository");


class ReporteService {



// ==========================
// REPORTE POR ESTUDIANTE
// ==========================

async getReportePorEstudiante(estudianteId){


    return await reporteRepository
    .getReportePorEstudiante(

        estudianteId

    );


}







// ==========================
// REPORTE POR FECHA
// ==========================

async getReportePorFecha(fecha){


    return await reporteRepository
    .getReportePorFecha(

        fecha

    );


}



}



module.exports =
new ReporteService();