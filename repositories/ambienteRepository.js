const databaseManager =
    require("../database/databaseManager");


class AmbienteRepository {


    // ==========================
    // OBTENER TODOS
    // ==========================

    async getAll() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM ambientes

                ORDER BY tipo, nombre

            `);


        return result.rows;

    }


    // ==========================
    // BUSCAR POR ID
    // ==========================

    async getById(id) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM ambientes

                WHERE id = $1

            `,
            [
                id
            ]);


        return result.rows[0] || null;

    }


}


module.exports =
    new AmbienteRepository();