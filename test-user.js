require("dotenv").config();

const databaseManager =
    require("./database/databaseManager");

const userRepository =
    require("./repositories/userRepository");


async function probar() {

    try {

        databaseManager.connect();

        // Esperar un momento para establecer la conexión
        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );


        console.log("\n==============================");
        console.log("PRUEBA: BUSCAR USUARIO");
        console.log("==============================");


        const usuario =
            await userRepository.findByUsername("admin");


        console.log("Resultado:");
        console.log(usuario);


        console.log("\n==============================");
        console.log("PRUEBA: USUARIOS ACTIVOS");
        console.log("==============================");


        const usuarios =
            await userRepository.getUsuarios();


        console.log(
            "Cantidad de usuarios activos:",
            usuarios.length
        );


        console.log("\nPrimeros usuarios:");

        console.table(
            usuarios.slice(0, 5)
        );


    } catch (error) {

        console.error(
            "\nERROR EN USER REPOSITORY:"
        );

        console.error(error);

    } finally {

        const db =
            databaseManager.getConnection();

        if (db) {
            await db.end();
        }

    }

}


probar();