const incidenciaService =
    require("../services/incidenciaService");



class IncidenciaController {




    // ==========================
    // OBTENER TIPOS DE INCIDENCIA
    // ==========================

    async getTiposIncidencia() {

        return await incidenciaService
            .getTiposIncidencia();

    }




    // ==========================
    // REGISTRAR INCIDENCIA
    // ==========================

    async registrarIncidencia(incidencia) {

        return await incidenciaService
            .registrarIncidencia(
                incidencia
            );

    }




    // ==========================
    // HISTORIAL DEL DÍA
    // ==========================

    async getIncidenciasHoy() {

        return await incidenciaService
            .getIncidenciasHoy();

    }




    // ==========================
    // REPORTE POR ESTUDIANTE
    // ==========================

    async getIncidenciasByEstudiante(estudianteId) {

        return await incidenciaService
            .getIncidenciasByEstudiante(
                estudianteId
            );

    }




    // ==========================
    // RANKING DE INCIDENCIAS
    // ==========================

    async getRankingIncidencias() {

        return await incidenciaService
            .getRankingIncidencias();

    }


}




module.exports =
    new IncidenciaController();