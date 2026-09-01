const databaseManager =
    require("../database/databaseManager");


class MotivoSalidaRepository {


    // ==========================
    // OBTENER MOTIVOS ACTIVOS
    // ==========================

    async getAll() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT

                    id,

                    nombre,

                    activo

                FROM motivos_salida

                WHERE activo = TRUE

                ORDER BY nombre

            `);


        return result.rows;

    }


}


// ==========================
// EXPORTAR REPOSITORY
// ==========================

module.exports =
    new MotivoSalidaRepository();