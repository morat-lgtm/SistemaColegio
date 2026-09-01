const databaseManager =
    require("../database/databaseManager");


class WorkstationRepository {


    // ==========================
    // OBTENER TODAS LAS PCS
    // ==========================

    async getAll() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM workstations

                ORDER BY hostname

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

                FROM workstations

                WHERE id = $1

            `,
            [
                id
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // VERIFICAR EXISTENCIA
    // ==========================

    async exists() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT COUNT(*) AS total

                FROM workstations

            `);


        return Number(
            result.rows[0].total
        ) > 0;

    }


    // ==========================
    // BUSCAR POR NOMBRE PC
    // ==========================

    async getByHostname(hostname) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM workstations

                WHERE hostname = $1

            `,
            [
                hostname
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // GUARDAR / ACTUALIZAR
    // ==========================

    async save(hostname, ambienteId) {

        const db =
            databaseManager.getConnection();


        const existe =
            await this.getByHostname(
                hostname
            );


        if (existe) {

            const result =
                await db.query(`

                    UPDATE workstations

                    SET ambiente_id = $1

                    WHERE hostname = $2

                    RETURNING *

                `,
                [
                    ambienteId,
                    hostname
                ]);


            return result.rows[0];

        }


        const result =
            await db.query(`

                INSERT INTO workstations

                (
                    hostname,
                    ambiente_id
                )

                VALUES

                (
                    $1,
                    $2
                )

                RETURNING *

            `,
            [
                hostname,
                ambienteId
            ]);


        return result.rows[0];

    }


    // ==========================
    // LISTAR AMBIENTES
    // ==========================

    async getAllAmbientes() {

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


}


module.exports =
    new WorkstationRepository();