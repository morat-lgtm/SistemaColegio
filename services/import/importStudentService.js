const XLSX = require("xlsx");


class ImportStudentService {



// ==========================
// LEER EXCEL
// ==========================

read(filePath){


    const workbook =
    XLSX.readFile(
        filePath
    );



    const sheet =
    workbook.Sheets[
        workbook.SheetNames[0]
    ];



    return XLSX.utils.sheet_to_json(

        sheet,

        {

            header:1

        }

    );


}





// ==========================
// CONVERTIR FILAS
// ==========================

parse(
rows,
nivel,
grado,
seccion,
ambienteId
){



    const estudiantes = [];





    for(
        const row of rows
    ){



        // Ignorar filas vacías

        if(
            !row ||
            !row[1]
        ){

            continue;

        }






        const texto =
        String(
            row[1]
        )
        .trim();






        // Formato esperado:
        // APELLIDOS, NOMBRES

        if(
            !texto.includes(",")
        ){

            continue;

        }






        const partes =
        texto.split(",");






        const apellidos =
        partes[0]
        .trim();





        const nombres =
        partes
        .slice(1)
        .join(",")
        .trim();







        if(
            apellidos === "" ||
            nombres === ""
        ){

            continue;

        }







        estudiantes.push({



            codigo:null,


            dni:null,



            apellidos,


            nombres,



            nivel,


            grado,


            seccion,



            ambiente_id:
            ambienteId



        });



    }







    return estudiantes;



}



}



module.exports =
new ImportStudentService();