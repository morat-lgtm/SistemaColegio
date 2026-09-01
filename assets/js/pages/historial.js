(() => {

console.log("Módulo Historial iniciado.");



const tabla =
document.getElementById("tablaHistorial");

const buscar =
document.getElementById("txtBuscarHistorial");



if (!tabla) {

    return;

}



let registros = [];





// ==========================
// INICIO
// ==========================

cargarHistorial();







// ==========================
// CARGAR HISTORIAL
// ==========================

async function cargarHistorial() {


    const sesion =
        await window.electronAPI.getSession();



    if (!sesion) {

        console.log(
            "No existe sesión."
        );

        return;

    }





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
            "Historial completo:",
            sesion.rol
        );



        registros =
            await window.electronAPI
            .getHistorialSalidas();



    } else {



        const workstation =
            await window.electronAPI
            .getWorkstation();





        if (!workstation) {


            console.log(
                "Equipo no configurado."
            );


            return;


        }






        console.log(
            "Historial por ambiente:",
            workstation.ambiente_id
        );



        registros =
            await window.electronAPI
            .getHistorialSalidasByAmbiente(
                workstation.ambiente_id
            );



    }






    mostrarHistorial(registros);



}








// ==========================
// MOSTRAR HISTORIAL
// ==========================

function mostrarHistorial(datos) {


    if (datos.length === 0) {


        tabla.innerHTML = `

            <div class="empty">

                <h3>
                    No existen registros.
                </h3>

            </div>

        `;


        return;


    }






    tabla.innerHTML = "";





    datos.forEach(salida => {


        tabla.innerHTML += `


        <div class="student-card">


            <h3>

                ${salida.apellidos}
                ${salida.nombres}

            </h3>



            <p>

                🚻 Motivo:
                ${salida.motivo}

            </p>



            <small>


                🕒 Salida:
                ${salida.hora_salida}


                <br>


                🔄 Retorno:
                ${salida.hora_regreso ?? "Pendiente"}


                <br>


                Estado:
                ${salida.estado}


            </small>



        </div>


        `;


    });



}









// ==========================
// BUSCAR
// ==========================

if (buscar) {


    buscar.oninput = () => {



        const texto =
            buscar.value
            .toLowerCase()
            .trim();





        const filtrados =
            registros.filter(e =>



                `${e.apellidos} ${e.nombres}`
                .toLowerCase()
                .includes(texto)



            );




        mostrarHistorial(
            filtrados
        );



    };


}



})();