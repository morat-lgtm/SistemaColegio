const databaseManager =
    require("../database/databaseManager");


class ReporteRepository {


    // ==========================
    // REPORTE POR ESTUDIANTE
    // ==========================

    async getReportePorEstudiante(estudianteId) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    s.hora_salida,

                    s.hora_regreso,

                    s.observacion,

                    s.estado,

                    m.nombre AS motivo,

                    u.nombres || ' ' || u.apellidos AS docente

                FROM salidas s

                INNER JOIN estudiantes e
                    ON e.id = s.estudiante_id

                INNER JOIN motivos_salida m
                    ON m.id = s.motivo_id

                INNER JOIN usuarios u
                    ON u.id = s.usuario_id

                WHERE s.estudiante_id = $1

                ORDER BY
                    s.hora_salida DESC

            `,

            [
                estudianteId
            ]);


        return result.rows;

    }


    // ==========================
    // REPORTE POR FECHA
    // ==========================

    async getReportePorFecha(fecha) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    s.hora_salida,

                    s.hora_regreso,

                    s.observacion,

                    s.estado,

                    m.nombre AS motivo,

                    u.nombres || ' ' || u.apellidos AS docente

                FROM salidas s

                INNER JOIN estudiantes e
                    ON e.id = s.estudiante_id

                INNER JOIN motivos_salida m
                    ON m.id = s.motivo_id

                INNER JOIN usuarios u
                    ON u.id = s.usuario_id

                WHERE s.hora_salida::date = $1::date

                ORDER BY

                    e.apellidos,

                    s.hora_salida

            `,

            [
                fecha
            ]);


        return result.rows;

    }


    // ==========================
    // RANKING GENERAL DE SALIDAS
    // ==========================

    async getRankingSalidas() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    e.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    COUNT(s.id) AS total_salidas,

                    MAX(s.hora_salida) AS ultima_salida

                FROM estudiantes e

                INNER JOIN salidas s
                    ON s.estudiante_id = e.id

                GROUP BY

                    e.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion

                ORDER BY

                    COUNT(s.id) DESC,

                    e.apellidos ASC,

                    e.nombres ASC

            `);


        return result.rows;

    }

}


// ==========================
// EXPORTAR REPOSITORY
// ==========================

module.exports =
    new ReporteRepository();