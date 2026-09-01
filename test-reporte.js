require("dotenv").config();

const databaseManager =
    require("./database/databaseManager");

const reporteRepository =
    require("./repositories/reporteRepository");


async function probar() {

    try {

        databaseManager.connect();

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );


        console.log("\n==============================");
        console.log("PRUEBA: REPORTE POR ESTUDIANTE");
        console.log("==============================");


        const reporteEstudiante =
            await reporteRepository
                .getReportePorEstudiante(1);


        console.log(
            "Cantidad de registros:",
            reporteEstudiante.length
        );


        console.table(
            reporteEstudiante
        );


        console.log("\n==============================");
        console.log("PRUEBA: REPORTE POR FECHA");
        console.log("==============================");


        const reporteFecha =
            await reporteRepository
                .getReportePorFecha("2026-09-01");


        console.log(
            "Cantidad de registros:",
            reporteFecha.length
        );


        console.table(
            reporteFecha
        );


    } catch (error) {

        console.error(
            "\nERROR EN REPORTE REPOSITORY:"
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