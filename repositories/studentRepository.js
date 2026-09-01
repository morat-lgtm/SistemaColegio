const databaseManager =
    require("../database/databaseManager");


class StudentRepository {


    // ==========================
    // OBTENER TODOS
    // ==========================

    async getAll() {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM estudiantes

                WHERE activo = true

                ORDER BY
                    apellidos,
                    nombres

            `);


        return result.rows;

    }


    // ==========================
    // ESTUDIANTES POR AMBIENTE
    // ==========================

    async getByAmbiente(ambienteId) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT *

                FROM estudiantes

                WHERE ambiente_id = $1

                AND activo = true

                ORDER BY
                    apellidos,
                    nombres

            `,
            [
                ambienteId
            ]);


        console.log(
            "ESTUDIANTES DEL AMBIENTE:",
            ambienteId,
            result.rows
        );


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

                FROM estudiantes

                WHERE id = $1

            `,
            [
                id
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // BUSCAR ESTUDIANTES
    // ==========================

    async search(texto) {

        const db =
            databaseManager.getConnection();


        const textoBusqueda =
            texto.trim();


        if (textoBusqueda === "") {

            return [];

        }


        const patron =
            `%${textoBusqueda}%`;


        const result =
            await db.query(`

                SELECT *

                FROM estudiantes

                WHERE activo = true

                AND (

                    apellidos ILIKE $1

                    OR nombres ILIKE $1

                    OR (

                        apellidos || ' ' || nombres
                    ) ILIKE $1

                    OR (

                        nombres || ' ' || apellidos
                    ) ILIKE $1

                    OR codigo ILIKE $1

                    OR dni ILIKE $1

                )

                ORDER BY
                    apellidos,
                    nombres

                LIMIT 20

            `,
            [
                patron
            ]);


        console.log(
            "BUSQUEDA DE ESTUDIANTES:",
            textoBusqueda,
            result.rows.length
        );


        return result.rows;

    }


    // ==========================
    // EXISTE
    // ==========================

    async exists(
        apellidos,
        nombres,
        nivel,
        grado,
        seccion
    ) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                SELECT id

                FROM estudiantes

                WHERE

                    apellidos = $1

                    AND nombres = $2

                    AND nivel = $3

                    AND grado = $4

                    AND seccion = $5

            `,
            [
                apellidos,
                nombres,
                nivel,
                grado,
                seccion
            ]);


        return result.rows[0] || null;

    }


    // ==========================
    // CREAR
    // ==========================

    async create(estudiante) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                INSERT INTO estudiantes

                (
                    codigo,
                    dni,
                    apellidos,
                    nombres,
                    nivel,
                    grado,
                    seccion,
                    ambiente_id
                )

                VALUES

                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8
                )

                RETURNING id

            `,
            [
                estudiante.codigo,
                estudiante.dni,
                estudiante.apellidos,
                estudiante.nombres,
                estudiante.nivel,
                estudiante.grado,
                estudiante.seccion,
                estudiante.ambiente_id
            ]);


        return {

            id:
                result.rows[0].id

        };

    }


    // ==========================
    // ACTUALIZAR
    // ==========================

    async update(estudiante) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                UPDATE estudiantes

                SET

                    codigo = $1,

                    dni = $2,

                    apellidos = $3,

                    nombres = $4,

                    nivel = $5,

                    grado = $6,

                    seccion = $7,

                    ambiente_id = $8,

                    activo = $9

                WHERE id = $10

            `,
            [
                estudiante.codigo,
                estudiante.dni,
                estudiante.apellidos,
                estudiante.nombres,
                estudiante.nivel,
                estudiante.grado,
                estudiante.seccion,
                estudiante.ambiente_id,
                estudiante.activo,
                estudiante.id
            ]);


        return {

            cambios:
                result.rowCount

        };

    }


    // ==========================
    // ELIMINAR
    // ==========================

    async delete(id) {

        const db =
            databaseManager.getConnection();


        const result =
            await db.query(`

                DELETE FROM estudiantes

                WHERE id = $1

            `,
            [
                id
            ]);


        return {

            cambios:
                result.rowCount

        };

    }


}


// ==========================
// EXPORTAR
// ==========================

module.exports =
    new StudentRepository();