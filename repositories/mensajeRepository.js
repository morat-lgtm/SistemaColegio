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
                mensaje
            )

            VALUES

            (
                $1,
                $2,
                $3,
                $4
            )

            RETURNING id

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


        return {

            id: result.rows[0].id

        };

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

                m.asunto,

                m.mensaje,

                m.estado,

                m.fecha,

                u.nombres || ' ' || u.apellidos AS origen


            FROM mensajes m


            INNER JOIN usuarios u

                ON u.id = m.usuario_origen


            WHERE

                m.usuario_destino = $1

                OR

                m.usuario_destino IS NULL


            ORDER BY m.fecha DESC

        `;


        const result =
            await db.query(
                sql,
                [usuarioId]
            );


        return result.rows;

    }


    // ==========================
    // MARCAR COMO LEÍDO
    // ==========================

    async marcarLeido(id) {

        const db =
            databaseManager.getConnection();


        const sql = `

            UPDATE mensajes

            SET estado = 'LEIDO'

            WHERE id = $1

        `;


        const result =
            await db.query(
                sql,
                [id]
            );


        return {

            cambios: result.rowCount

        };

    }


}


module.exports =
    new MensajeRepository();