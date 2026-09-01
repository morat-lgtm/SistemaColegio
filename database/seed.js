const bcrypt = require("bcryptjs");

const databaseManager =
    require("./databaseManager");


class SeedManager {


    constructor(db){

        this.db = db;

    }


    // ==========================
    // ROLES
    // ==========================

    async seedRoles(){

        const roles = [

            ["Administrador","Control total del sistema"],

            ["Dirección","Dirección del colegio"],

            ["Subdirección","Subdirección"],

            ["Secretaría","Secretaría"],

            ["Coordinación Académica","Coordinación"],

            ["Convivencia Escolar","Convivencia"],

            ["Psicología","Departamento de Psicología"],

            ["Enfermería","Enfermería"],

            ["Docente","Profesor"],

            ["Tutor","Tutor de aula"],

            ["Portería","Control de ingreso"]

        ];


        for(const rol of roles){

            await this.db.query(`

                INSERT INTO roles

                (
                    nombre,
                    descripcion
                )

                VALUES ($1,$2)

                ON CONFLICT (nombre)
                DO NOTHING

            `, [

                rol[0],
                rol[1]

            ]);

        }


        console.log(
            "✔ Roles verificados."
        );

    }



    // ==========================
    // ADMINISTRADOR
    // ==========================

    async seedAdmin(){

        const existe =
            await this.db.query(`

                SELECT id

                FROM usuarios

                WHERE usuario = $1

            `, [

                "admin"

            ]);


        if(existe.rows.length > 0){

            console.log(
                "✔ Usuario administrador ya existe."
            );

            return;

        }


        const password =
            bcrypt.hashSync(
                "admin123",
                10
            );


        await this.db.query(`

            INSERT INTO usuarios

            (
                usuario,
                password,
                nombres,
                apellidos,
                rol_id
            )

            VALUES
            ($1,$2,$3,$4,$5)

        `, [

            "admin",
            password,
            "Administrador",
            "Sistema",
            1

        ]);


        console.log(
            "✔ Usuario administrador creado."
        );

    }



    // ==========================
    // USUARIOS INSTITUCIONALES
    // ==========================

    async seedUsuarios(){

        const password =
            bcrypt.hashSync(
                "123456",
                10
            );


        const usuarios = [

            [
                "direccion",
                password,
                "Juan",
                "Director",
                2
            ],

            [
                "coordinacion",
                password,
                "Maria",
                "Coordinadora",
                5
            ],

            [
                "convivencia",
                password,
                "Ana",
                "Convivencia",
                6
            ],

            [
                "docente",
                password,
                "Carlos",
                "Profesor",
                9
            ]

        ];


        for(const usuario of usuarios){

            await this.db.query(`

                INSERT INTO usuarios

                (
                    usuario,
                    password,
                    nombres,
                    apellidos,
                    rol_id
                )

                VALUES
                ($1,$2,$3,$4,$5)

                ON CONFLICT (usuario)
                DO NOTHING

            `, [

                usuario[0],
                usuario[1],
                usuario[2],
                usuario[3],
                usuario[4]

            ]);

        }


        console.log(
            "✔ Usuarios institucionales verificados."
        );

    }



    // ==========================
    // AMBIENTES
    // ==========================

    async seedAmbientes(){

        const ambientes = [

            ["Dirección","Oficina"],

            ["Subdirección","Oficina"],

            ["Secretaría","Oficina"],

            ["Coordinación Académica","Oficina"],

            ["Convivencia Escolar","Oficina"],

            ["Psicología","Oficina"],

            ["Enfermería","Oficina"],

            ["Tesorería","Oficina"],

            ["Laboratorio de Robótica","Laboratorio"],

            ["Laboratorio de Cómputo","Laboratorio"],

            ["Biblioteca","Servicio"]

        ];


        for(const ambiente of ambientes){

            await this.db.query(`

                INSERT INTO ambientes

                (
                    nombre,
                    tipo
                )

                VALUES
                ($1,$2)

                ON CONFLICT (nombre)
                DO NOTHING

            `, [

                ambiente[0],
                ambiente[1]

            ]);

        }


        console.log(
            "✔ Ambientes iniciales verificados."
        );

    }



    // ==========================
    // AULAS ACADÉMICAS
    // ==========================

    async seedAulasAcademicas(){

        const aulas = [

            ["3 años A","Aula","Inicial","3 años","A"],

            ["4 años A","Aula","Inicial","4 años","A"],

            ["5 años A","Aula","Inicial","5 años","A"],


            ["1° Primaria A","Aula","Primaria","1","A"],

            ["1° Primaria B","Aula","Primaria","1","B"],

            ["2° Primaria A","Aula","Primaria","2","A"],

            ["2° Primaria B","Aula","Primaria","2","B"],

            ["3° Primaria A","Aula","Primaria","3","A"],

            ["3° Primaria B","Aula","Primaria","3","B"],

            ["4° Primaria A","Aula","Primaria","4","A"],

            ["4° Primaria B","Aula","Primaria","4","B"],

            ["5° Primaria A","Aula","Primaria","5","A"],

            ["5° Primaria B","Aula","Primaria","5","B"],

            ["6° Primaria A","Aula","Primaria","6","A"],

            ["6° Primaria B","Aula","Primaria","6","B"],


            ["1° Secundaria A","Aula","Secundaria","1","A"],

            ["1° Secundaria B","Aula","Secundaria","1","B"],

            ["2° Secundaria A","Aula","Secundaria","2","A"],

            ["2° Secundaria B","Aula","Secundaria","2","B"],

            ["3° Secundaria A","Aula","Secundaria","3","A"],

            ["3° Secundaria B","Aula","Secundaria","3","B"],

            ["4° Secundaria A","Aula","Secundaria","4","A"],

            ["4° Secundaria B","Aula","Secundaria","4","B"],

            ["5° Secundaria A","Aula","Secundaria","5","A"],

            ["5° Secundaria B","Aula","Secundaria","5","B"]

        ];


        for(const aula of aulas){

            await this.db.query(`

                INSERT INTO ambientes

                (
                    nombre,
                    tipo,
                    nivel,
                    grado,
                    seccion
                )

                VALUES
                ($1,$2,$3,$4,$5)

                ON CONFLICT (nombre)
                DO NOTHING

            `, [

                aula[0],
                aula[1],
                aula[2],
                aula[3],
                aula[4]

            ]);

        }


        console.log(
            "✔ Aulas académicas verificadas."
        );

    }
        // ==========================
    // MOTIVOS DE SALIDA
    // ==========================

    async seedMotivosSalida(){

        const motivos = [

            "Baño",
            "Enfermería",
            "Dirección",
            "Biblioteca",
            "Laboratorio",
            "Secretaría",
            "Llamada de padres",
            "Otro",
            "Psicología"

        ];


        for(const nombre of motivos){

            await this.db.query(`

                INSERT INTO motivos_salida
                (
                    nombre,
                    activo
                )

                VALUES
                ($1, TRUE)

                ON CONFLICT (nombre)
                DO NOTHING

            `, [

                nombre

            ]);

        }


        console.log(
            "✔ Motivos de salida verificados."
        );

    }



    // ==========================
    // TIPOS DE INCIDENCIA
    // ==========================

    async seedTiposIncidencia(){

        const tipos = [

            "Agresión física entre estudiantes",

            "Acoso escolar / bullying",

            "Amenazas",

            "Apodos ofensivos",

            "Discriminación",

            "Falta de respeto",

            "Indisciplina",

            "Incumplimiento de normas",

            "Interrupción de clase",

            "Uso inadecuado del celular",

            "Daño a materiales",

            "Daño a infraestructura",

            "Robo / pérdida de objetos",

            "Llegada tarde",

            "Inasistencia injustificada",

            "Abandona la actividad.",

            "Accidente en aula de robótica",

            "Accidente en laboratorio",

            "Accidente en taller",

            "Amenaza externa",

            "Conflicto entre estudiantes",

            "Conducta inapropiada",

            "Falta de materiales",

            "Problemas de convivencia",

            "Otro"

        ];


        for(const nombre of tipos){

            await this.db.query(`

                INSERT INTO tipos_incidencia
                (
                    nombre,
                    activo
                )

                VALUES
                ($1, TRUE)

                ON CONFLICT (nombre)
                DO NOTHING

            `, [

                nombre

            ]);

        }


        console.log(
            "✔ Tipos de incidencia verificados."
        );

    }



    // ==========================
    // FINALIZAR SEED
    // ==========================

    async ejecutar(){

        console.log(
            "\n================================="
        );

        console.log(
            "INICIANDO SEED DE SUPABASE"
        );

        console.log(
            "=================================\n"
        );


        await this.seedRoles();

        await this.seedAdmin();

        await this.seedUsuarios();

        await this.seedAmbientes();

        await this.seedAulasAcademicas();

        await this.seedMotivosSalida();

        await this.seedTiposIncidencia();


        console.log(
            "\n================================="
        );

        console.log(
            "SEED COMPLETADO CORRECTAMENTE"
        );

        console.log(
            "================================="
        );

    }

}



// ==========================
// EJECUTAR
// ==========================

async function iniciar(){

    try{


        const db =
            databaseManager.getConnection();


        if(!db){

            await databaseManager.connect();

        }


        const conexion =
            databaseManager.getConnection();


        const seed =
            new SeedManager(
                conexion
            );


        await seed.ejecutar();


    }catch(error){

        console.error(
            "\nERROR EJECUTANDO SEED:"
        );

        console.error(error);


        process.exitCode = 1;

    }finally{

        const db =
            databaseManager.getConnection();


        if(db){

            await db.end();

        }

    }

}


iniciar();
