const databaseManager =
    require("../database/databaseManager");


class SalidaRepository {


    // ==========================
    // REGISTRAR SALIDA
    // ==========================

    async registrarSalida(salida) {

        const db =
            databaseManager.getConnection();


        const sql = `

            INSERT INTO salidas

            (
                estudiante_id,
                motivo_id,
                usuario_id,
                workstation_id,
                hora_salida,
                observacion,
                estado
            )

            VALUES

            (
                $1,
                $2,
                $3,
                $4,
                NOW(),
                $5,
                'ACTIVA'
            )

            RETURNING id

        `;


        const result =
            await db.query(
                sql,
                [
                    salida.estudiante_id,
                    salida.motivo_id,
                    salida.usuario_id,
                    salida.workstation_id,
                    salida.observacion
                ]
            );


        return {

            id: result.rows[0].id

        };

    }


    // ==========================
    // VERIFICAR SALIDA ACTIVA
    // ==========================

    async getSalidaActiva(estudianteId) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM salidas

                WHERE estudiante_id = $1

                AND estado = 'ACTIVA'

            `,

            [
                estudianteId
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // CONTAR SALIDAS DE BAÑO
    // DEL ESTUDIANTE DURANTE HOY
    // ==========================

    async getCantidadSalidasHoy(
        estudianteId,
        motivoId
    ) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    COUNT(*) AS cantidad

                FROM salidas

                WHERE estudiante_id = $1

                AND motivo_id = $2

                AND hora_salida::date =
                    CURRENT_DATE

            `,

            [
                estudianteId,
                motivoId
            ]);


        return result.rows[0]
            ? Number(result.rows[0].cantidad)
            : 0;

    }


    // ==========================
    // OBTENER SALIDAS ACTIVAS
    // ==========================

    async getSalidasActivas() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    s.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    m.nombre AS motivo,

                    s.hora_salida,

                    s.estado,

                    s.observacion,

                    u.nombres || ' ' || u.apellidos AS usuario,

                    w.hostname

                FROM salidas s

                INNER JOIN estudiantes e
                    ON e.id = s.estudiante_id

                INNER JOIN motivos_salida m
                    ON m.id = s.motivo_id

                INNER JOIN usuarios u
                    ON u.id = s.usuario_id

                INNER JOIN workstations w
                    ON w.id = s.workstation_id

                WHERE s.estado = 'ACTIVA'

                ORDER BY s.hora_salida

            `);


        return result.rows;

    }


    // ==========================
    // REGISTRAR RETORNO
    // ==========================

    async registrarRetorno(id) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                UPDATE salidas

                SET

                    hora_regreso = NOW(),

                    estado = 'RETORNADO'

                WHERE id = $1

            `,

            [
                id
            ]);


        return {

            cambios: result.rowCount

        };

    }


    // ==========================
    // HISTORIAL DEL DÍA
    // ==========================

    async getHistorial() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    s.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    m.nombre AS motivo,

                    s.hora_salida,

                    s.hora_regreso,

                    s.observacion,

                    s.estado,

                    u.nombres || ' ' || u.apellidos AS usuario

                FROM salidas s

                INNER JOIN estudiantes e
                    ON e.id = s.estudiante_id

                INNER JOIN motivos_salida m
                    ON m.id = s.motivo_id

                INNER JOIN usuarios u
                    ON u.id = s.usuario_id

                WHERE s.hora_salida::date =
                      CURRENT_DATE

                ORDER BY s.hora_salida DESC

            `);


        return result.rows;

    }


    // ==========================
    // HISTORIAL POR AMBIENTE
    // DEL DÍA
    // ==========================

    async getHistorialByAmbiente(ambienteId) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    s.id,

                    e.apellidos,

                    e.nombres,

                    e.grado,

                    e.nivel,

                    e.seccion,

                    m.nombre AS motivo,

                    s.hora_salida,

                    s.hora_regreso,

                    s.observacion,

                    s.estado,

                    u.nombres || ' ' || u.apellidos AS usuario

                FROM salidas s

                INNER JOIN estudiantes e
                    ON e.id = s.estudiante_id

                INNER JOIN motivos_salida m
                    ON m.id = s.motivo_id

                INNER JOIN usuarios u
                    ON u.id = s.usuario_id

                WHERE e.ambiente_id = $1

                AND s.hora_salida::date =
                    CURRENT_DATE

                ORDER BY s.hora_salida DESC

            `,

            [
                ambienteId
            ]);


        return result.rows;

    }

}


// ==========================
// EXPORTAR REPOSITORY
// ==========================

module.exports =
    new SalidaRepository();