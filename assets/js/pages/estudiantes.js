(() => {

console.log("Módulo Estudiantes iniciado.");



const lista =
document.getElementById("listaEstudiantes");

const botonImportar =
document.getElementById("btnImportar");



if (!lista || !botonImportar) {

    return;

}



cargarEstudiantes();



botonImportar.addEventListener(
"click",
async () => {



    const resultado =
        await window.electronAPI.importarEstudiantes();



    if (!resultado) return;



    alert(

        `Importados: ${resultado.importados}\n` +

        `Omitidos: ${resultado.omitidos}`

    );



    cargarEstudiantes();


});





// ==========================
// CARGAR ESTUDIANTES
// ==========================

async function cargarEstudiantes() {


    const sesion =
        await window.electronAPI.getSession();



    if (!sesion) {

        console.log(
            "No existe sesión."
        );

        return;

    }





    let estudiantes = [];





    const rolesGenerales = [


        "Administrador",

        "Dirección",

        "Subdirección",

        "Secretaría",

        "Coordinación Académica",

        "Convivencia Escolar",

        "Psicología",

        "Enfermería"


    ];





    if (
        rolesGenerales.includes(
            sesion.rol
        )
    ) {


        console.log(
            "Usuario con acceso general:",
            sesion.rol
        );



        estudiantes =
            await window.electronAPI.getStudents();



    } else {


        const workstation =
            await window.electronAPI.getWorkstation();



        if (
            workstation &&
            workstation.ambiente_id
        ) {


            console.log(
                "Usuario limitado al ambiente:",
                workstation.ambiente_id
            );



            estudiantes =
                await window.electronAPI
                .getStudentsByAmbiente(
                    workstation.ambiente_id
                );


        }


    }






    if (estudiantes.length === 0) {


        lista.innerHTML = `

            <p>
                No hay estudiantes registrados.
            </p>

        `;


        return;


    }





    lista.innerHTML = "";





    estudiantes.forEach(estudiante => {



        lista.innerHTML += `


        <div class="student-card">


            <h3>
                ${estudiante.apellidos}
            </h3>



            <p>
                ${estudiante.nombres}
            </p>



            <small>

                ${estudiante.grado}° ${estudiante.nivel}

                -

                Sección ${estudiante.seccion}


            </small>



        </div>


        `;



    });



}



})();