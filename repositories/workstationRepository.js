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

                SELECT
                    id,
                    hostname,
                    workstation_key,
                    ambiente_id,
                    activo,
                    created_at

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

                SELECT
                    id,
                    hostname,
                    workstation_key,
                    ambiente_id,
                    activo,
                    created_at

                FROM workstations

                WHERE id = $1

            `,
            [
                id
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // BUSCAR POR WORKSTATION KEY
    // ==========================

    async getByWorkstationKey(
        workstationKey
    ) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT
                    id,
                    hostname,
                    workstation_key,
                    ambiente_id,
                    activo,
                    created_at

                FROM workstations

                WHERE workstation_key = $1

                AND activo = true

            `,
            [
                workstationKey
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // BUSCAR POR NOMBRE DE PC
    // ==========================

    async getByHostname(hostname) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT
                    id,
                    hostname,
                    workstation_key,
                    ambiente_id,
                    activo,
                    created_at

                FROM workstations

                WHERE hostname = $1

            `,
            [
                hostname
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

                SELECT
                    COUNT(*) AS total

                FROM workstations

            `);


        return Number(
            result.rows[0].total
        ) > 0;

    }


    // ==========================
    // GUARDAR / ACTUALIZAR
    // ==========================

    async save(
        hostname,
        ambienteId,
        workstationKey = null
    ) {

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

                    SET
                        ambiente_id = $1,
                        workstation_key = $2

                    WHERE hostname = $3

                    RETURNING *

                `,
                [
                    ambienteId,
                    workstationKey,
                    hostname
                ]);


            return result.rows[0];

        }


        const result =
            await db.query(`

                INSERT INTO workstations
                (
                    hostname,
                    ambiente_id,
                    workstation_key,
                    activo
                )

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    true
                )

                RETURNING *

            `,
            [
                hostname,
                ambienteId,
                workstationKey
            ]);


        return result.rows[0];

    }


    // ==========================
    // ASIGNAR WORKSTATION KEY
    // ==========================

    async setWorkstationKey(
        id,
        workstationKey
    ) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                UPDATE workstations

                SET
                    workstation_key = $1

                WHERE id = $2

                RETURNING *

            `,
            [
                workstationKey,
                id
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // BUSCAR AMBIENTE POR ID
    // ==========================

    async getAmbienteById(id) {

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


// ==========================
// EXPORTAR
// ==========================

module.exports =
    new WorkstationRepository();