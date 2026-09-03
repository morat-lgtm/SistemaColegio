const databaseManager =
    require("../database/databaseManager");


class MensajeRepository {


    // ==========================
    // REGISTRAR MENSAJE
    // ==========================

    async registrarMensaje(mensaje) {

        const db =
            databaseManager.getConnection();


        const sql = `

            INSERT INTO mensajes
            (
                usuario_origen,
                usuario_destino,
                asunto,
                mensaje,
                estado
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                'PENDIENTE'
            )

            RETURNING
                id,
                usuario_origen,
                usuario_destino,
                asunto,
                mensaje,
                estado,
                fecha

        `;


        const result =
            await db.query(
                sql,
                [
                    mensaje.usuario_origen,
                    mensaje.usuario_destino,
                    mensaje.asunto,
                    mensaje.mensaje
                ]
            );


        return result.rows[0];

    }


    // ==========================
    // OBTENER MENSAJES
    // ==========================

    async getMensajes(usuarioId) {

        const db =
            databaseManager.getConnection();


        const sql = `

            SELECT

                m.id,

                m.usuario_origen,

                m.usuario_destino,

                m.asunto,

                m.mensaje,

                m.estado,

                m.fecha,


                uOrigen.nombres ||
                ' ' ||
                uOrigen.apellidos
                AS origen,


                uDestino.nombres ||
                ' ' ||
                uDestino.apellidos
                AS destino


            FROM mensajes m


            LEFT JOIN usuarios uOrigen

                ON uOrigen.id =
                   m.usuario_origen


            LEFT JOIN usuarios uDestino

                ON uDestino.id =
                   m.usuario_destino


            WHERE

                m.usuario_destino = $1

                OR

                m.usuario_origen = $1

                OR

                m.usuario_destino IS NULL


            ORDER BY
                m.fecha DESC

        `;


        const result =
            await db.query(
                sql,
                [usuarioId]
            );


        return result.rows;

    }


    // ==========================
    // MENSAJES NO LEÍDOS
    // ==========================

    async getMensajesNoLeidos(usuarioId) {

        const db =
            databaseManager.getConnection();


        const sql = `

            SELECT

                COUNT(*)::integer
                AS cantidad

            FROM mensajes

            WHERE

                usuario_destino = $1

                AND

                estado = 'PENDIENTE'

        `;


        const result =
            await db.query(
                sql,
                [usuarioId]
            );


        return result.rows[0].cantidad;

    }


    // ==========================
    // MARCAR MENSAJE COMO LEÍDO
    // ==========================

    async marcarLeido(
        id,
        usuarioId
    ) {

        const db =
            databaseManager.getConnection();


        const sql = `

            UPDATE mensajes

            SET estado = 'LEIDO'

            WHERE

                id = $1

                AND

                usuario_destino = $2

            RETURNING id

        `;


        const result =
            await db.query(
                sql,
                [
                    id,
                    usuarioId
                ]
            );


        return {

            cambios:
                result.rowCount,

            id:
                result.rows[0]?.id || null

        };

    }

}


module.exports =
    new MensajeRepository();