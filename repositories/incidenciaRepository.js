const databaseManager =
    require("../database/databaseManager");


class IncidenciaRepository {


    // ==========================
    // OBTENER TIPOS DE INCIDENCIA
    // ==========================

    async getTiposIncidencia() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    id,

                    nombre

                FROM tipos_incidencia

                WHERE activo = TRUE

                ORDER BY nombre

            `);


        return result.rows;

    }


    // ==========================
    // REGISTRAR INCIDENCIA
    // ==========================

    async registrarIncidencia(incidencia) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                INSERT INTO incidencias

                (
                    estudiante_id,
                    tipo_id,
                    descripcion,
                    usuario_id,
                    workstation_id,
                    fecha,
                    estado
                )

                VALUES

                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    NOW(),
                    'REGISTRADA'
                )

                RETURNING id

            `,
            [
                incidencia.estudiante_id,
                incidencia.tipo_id,
                incidencia.descripcion,
                incidencia.usuario_id,
                incidencia.workstation_id
            ]);


        return {

            id: result.rows[0].id

        };

    }


    // ==========================
    // HISTORIAL DE INCIDENCIAS DEL DÍA
    // ==========================

    async getIncidenciasHoy() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    i.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    t.nombre AS incidencia,

                    i.descripcion,

                    i.fecha,

                    i.estado,

                    u.nombres || ' ' || u.apellidos AS docente


                FROM incidencias i


                INNER JOIN estudiantes e

                    ON e.id = i.estudiante_id


                INNER JOIN tipos_incidencia t

                    ON t.id = i.tipo_id


                INNER JOIN usuarios u

                    ON u.id = i.usuario_id


                WHERE
                    (i.fecha AT TIME ZONE 'America/Lima')::date =
                    (NOW() AT TIME ZONE 'America/Lima')::date


                ORDER BY i.fecha DESC

            `);


        return result.rows;

    }


    // ==========================
    // REPORTE POR ESTUDIANTE
    // ==========================

    async getIncidenciasByEstudiante(estudianteId) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    i.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    t.nombre AS incidencia,

                    i.descripcion,

                    i.fecha,

                    i.estado,

                    u.nombres || ' ' || u.apellidos AS docente


                FROM incidencias i


                INNER JOIN estudiantes e

                    ON e.id = i.estudiante_id


                INNER JOIN tipos_incidencia t

                    ON t.id = i.tipo_id


                INNER JOIN usuarios u

                    ON u.id = i.usuario_id


                WHERE i.estudiante_id = $1


                ORDER BY i.fecha DESC

            `,
            [
                estudianteId
            ]);


        return result.rows;

    }


}


// ==========================
// EXPORTAR REPOSITORY
// ==========================

module.exports =
    new IncidenciaRepository();