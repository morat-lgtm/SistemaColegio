(() => {

console.log("Módulo Salidas iniciado.");


const lista = document.getElementById("listaSalidas");
const comboMotivo = document.getElementById("cmbMotivo");
const buscar = document.getElementById("txtBuscarSalida");
const botonRegistrar = document.getElementById("btnRegistrarSalida");
const observacion = document.getElementById("txtObservacion");


if (!lista || !comboMotivo || !buscar || !botonRegistrar) {

    return;

}



let estudiantes = [];
let estudianteSeleccionado = null;





// ==========================
// INICIO
// ==========================

cargarMotivos();

cargarEstudiantes();

cargarSalidas();






// ==========================
// CARGAR MOTIVOS
// ==========================

async function cargarMotivos() {


    const motivos =
        await window.electronAPI.getMotivosSalida();



    comboMotivo.innerHTML = `

        <option value="">
            Seleccione motivo
        </option>

    `;



    motivos.forEach(motivo => {


        comboMotivo.innerHTML += `

            <option value="${motivo.id}">
                ${motivo.nombre}
            </option>

        `;


    });


}








// ==========================
// CARGAR ESTUDIANTES SEGÚN ROL
// ==========================

async function cargarEstudiantes() {


    const sesion =
        await window.electronAPI.getSession();



    if (!sesion) {


        console.log(
            "No existe sesión activa."
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


        estudiantes =
            await window.electronAPI.getStudents();



        console.log(
            "Acceso general:",
            sesion.rol
        );



    } else {



        const workstation =
            await window.electronAPI.getWorkstation();



        if (!workstation) {


            console.log(
                "No existe equipo configurado."
            );


            return;


        }





        estudiantes =
            await window.electronAPI
            .getStudentsByAmbiente(
                workstation.ambiente_id
            );



        console.log(
            "Acceso limitado al aula:",
            workstation.ambiente_id
        );


    }





    console.log(
        "Estudiantes disponibles:",
        estudiantes
    );


}








// ==========================
// BUSCAR ESTUDIANTE
// ==========================

buscar.oninput = () => {


    const texto =
        buscar.value.toLowerCase().trim();



    estudianteSeleccionado = null;



    if (texto === "") {


        return;


    }





    const encontrado =
        estudiantes.find(e =>


            `${e.apellidos} ${e.nombres}`
            .toLowerCase()
            .includes(texto)


        );





    if (encontrado) {


        estudianteSeleccionado =
            encontrado;



        console.log(
            "Estudiante seleccionado:",
            encontrado
        );


    }


};








// ==========================
// REGISTRAR SALIDA
// ==========================

botonRegistrar.onclick = async () => {


    if (!estudianteSeleccionado) {


        alert(
            "Seleccione un estudiante."
        );


        return;


    }





    if (!comboMotivo.value) {


        alert(
            "Seleccione un motivo."
        );


        return;


    }





    const sesion =
        await window.electronAPI.getSession();



    const workstation =
        await window.electronAPI.getWorkstation();





    if (!sesion || !workstation) {


        alert(
            "No existe sesión o equipo configurado."
        );


        return;


    }





    const salida = {


        estudiante_id:
            estudianteSeleccionado.id,



        motivo_id:
            Number(comboMotivo.value),



        usuario_id:
            sesion.id,



        workstation_id:
            workstation.id,



        observacion:
            observacion.value


    };





    console.log(
        "Registrando salida:",
        salida
    );





    const respuesta =
        await window.electronAPI.registrarSalida(
            salida
        );





    if (respuesta.success) {


        buscar.value = "";

        observacion.value = "";

        comboMotivo.value = "";

        estudianteSeleccionado = null;



        cargarSalidas();



        buscar.focus();


    }


};








// ==========================
// MOSTRAR SALIDAS ACTIVAS
// ==========================

async function cargarSalidas() {


    const salidas =
        await window.electronAPI.getSalidasActivas();





    if (salidas.length === 0) {


        lista.innerHTML = `

            <div class="empty">

                <h3>
                    No existen salidas activas.
                </h3>

                <p>
                    Todos los estudiantes están en el aula.
                </p>

            </div>

        `;


        return;


    }





    lista.innerHTML = "";





    salidas.forEach(salida => {


        lista.innerHTML += `


        <div class="student-card">


            <h3>
                ${salida.apellidos}
            </h3>



            <p>
                ${salida.nombres}
            </p>



            <small>

                🚻 ${salida.motivo}

                <br>

                🕒 ${salida.hora_salida}

            </small>



            <br><br>



            <button

                type="button"

                class="btn-retorno"

                data-id="${salida.id}">


                🔄 Registrar retorno


            </button>



        </div>


        `;


    });






    document
    .querySelectorAll(".btn-retorno")
    .forEach(boton => {



        boton.onclick = async () => {


            const id =
                Number(
                    boton.dataset.id
                );



            const respuesta =
                await window.electronAPI.registrarRetorno(
                    id
                );



            if (respuesta.success) {


                cargarSalidas();


            }


        };


    });



}



})();