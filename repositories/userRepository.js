const databaseManager =
    require("../database/databaseManager");


class UserRepository {


    // ==========================
    // BUSCAR USUARIO POR LOGIN
    // ==========================

    async findByUsername(usuario) {

        const db =
            databaseManager.getConnection();


        const sql = `

            SELECT

                u.id,

                u.usuario,

                u.password,

                u.nombres,

                u.apellidos,

                u.rol_id,

                r.nombre AS rol

            FROM usuarios u

            INNER JOIN roles r

                ON r.id = u.rol_id

            WHERE u.usuario = $1

        `;


        const result =
            await db.query(
                sql,
                [usuario]
            );


        return result.rows[0] || null;

    }


    // ==========================
    // OBTENER USUARIOS ACTIVOS
    // ==========================

    async getUsuarios() {

        const db =
            databaseManager.getConnection();


        const sql = `

            SELECT

                u.id,

                u.nombres,

                u.apellidos,

                r.nombre AS rol

            FROM usuarios u

            INNER JOIN roles r

                ON r.id = u.rol_id

            WHERE u.activo = TRUE

            ORDER BY u.apellidos

        `;


        const result =
            await db.query(sql);


        return result.rows;

    }

}


module.exports =
    new UserRepository();