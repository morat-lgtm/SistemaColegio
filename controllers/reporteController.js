const reporteService =
    require("../services/reporteService");


class ReporteController {


    // ==========================
    // REPORTE POR ESTUDIANTE
    // ==========================

    async getReportePorEstudiante(estudianteId) {

        return await reporteService
            .getReportePorEstudiante(
                estudianteId
            );

    }


    // ==========================
    // REPORTE POR FECHA
    // ==========================

    async getReportePorFecha(fecha) {

        return await reporteService
            .getReportePorFecha(
                fecha
            );

    }


    // ==========================
    // RANKING GENERAL DE SALIDAS
    // ==========================

    async getRankingSalidas() {

        return await reporteService
            .getRankingSalidas();

    }


}


// ==========================
// EXPORTAR
// ==========================

module.exports =
    new ReporteController();