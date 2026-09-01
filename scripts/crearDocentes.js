const bcrypt = require("bcryptjs");

const databaseManager =
    require("../database/databaseManager");


// ==========================
// CONECTAR BD
// ==========================

databaseManager.connect();


// ==========================
// PERSONAL
// ==========================

const usuarios = [

    {
        nombres: "GINA",
        apellidos: "ZEBALLOS",
        usuario: "gzeballos",
        password: "462026",
        rol_id: 2
    },

    {
        nombres: "MARINA",
        apellidos: "VERGARA",
        usuario: "mvergara",
        password: "472026",
        rol_id: 2
    },

    {
        nombres: "SERGIO",
        apellidos: "SOTOMAYOR MELO",
        usuario: "ssotomayor",
        password: "482026",
        rol_id: 5
    },

    {
        nombres: "LIZBETH",
        apellidos: "LLERENA PICARDO",
        usuario: "lllerena",
        password: "492026",
        rol_id: 5
    },

    {
        nombres: "NERSSY JULISA",
        apellidos: "TALAVERA SALAS",
        usuario: "ntalavera",
        password: "362026",
        rol_id: 3
    },

    {
        nombres: "MAGDALENA",
        apellidos: "LOAYZA CRUZ",
        usuario: "mloayza",
        password: "442026",
        rol_id: 5
    },

    {
        nombres: "CESAR",
        apellidos: "CRUZ ORTIZ",
        usuario: "ccruz",
        password: "452026",
        rol_id: 6
    }

];


// ==========================
// INSERTAR USUARIOS
// ==========================

async function crearDocentes() {

    console.log(
        "SCRIPT CREAR DOCENTES INICIADO"
    );

    const db =
        databaseManager.getConnection();


    try {

        for (const u of usuarios) {

            // ==========================
            // VERIFICAR SI EXISTE
            // ==========================

            const existeResult =
                await db.query(
                    `
                    SELECT id
                    FROM usuarios
                    WHERE usuario = $1
                    `,
                    [
                        u.usuario
                    ]
                );


            if (existeResult.rows.length > 0) {

                console.log(
                    "Ya existe:",
                    u.usuario
                );

                continue;
            }


            // ==========================
            // GENERAR PASSWORD
            // ==========================

            const hash =
                await bcrypt.hash(
                    u.password,
                    10
                );


            // ==========================
            // INSERTAR
            // ==========================

            await db.query(
                `
                INSERT INTO usuarios
                (
                    usuario,
                    password,
                    nombres,
                    apellidos,
                    rol_id,
                    activo
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    TRUE
                )
                `,
                [
                    u.usuario,
                    hash,
                    u.nombres,
                    u.apellidos,
                    u.rol_id
                ]
            );


            console.log(
                "Creado:",
                u.usuario
            );

        }


        console.log(
            "Proceso terminado."
        );


    } catch (error) {

        console.error(
            "ERROR AL CREAR DOCENTES:"
        );

        console.error(error);

    } finally {

        await db.end();

    }

}


// ==========================
// EJECUTAR
// ==========================

crearDocentes();