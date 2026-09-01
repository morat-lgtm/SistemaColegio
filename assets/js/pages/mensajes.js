(() => {

console.log("Módulo Mensajes iniciado.");



const botonNuevo =
document.getElementById("btnNuevoMensaje");

const formulario =
document.getElementById("formMensaje");

const botonEnviar =
document.getElementById("btnEnviarMensaje");

const lista =
document.getElementById("listaMensajes");

const asunto =
document.getElementById("txtAsunto");

const mensaje =
document.getElementById("txtMensaje");

const destinatario =
document.getElementById("cmbDestinatario");



if (!lista || !destinatario) {

    return;

}



let sesionActual = null;



// ==========================
// INICIO
// ==========================

iniciar();



async function iniciar() {


    sesionActual =
        await window.electronAPI.getSession();



    await cargarUsuarios();



    cargarMensajes();


}



// ==========================
// CARGAR USUARIOS
// ==========================

async function cargarUsuarios() {


    const usuarios =
        await window.electronAPI.getUsuarios();



    console.log(
        "Usuarios recibidos:",
        usuarios
    );



    destinatario.innerHTML = `

        <option value="">
            Seleccione usuario
        </option>

    `;



    usuarios.forEach(usuario => {


        destinatario.innerHTML += `

            <option value="${usuario.id}">

                ${usuario.nombres}
                ${usuario.apellidos}
                (${usuario.rol})

            </option>

        `;


    });


}



// ==========================
// NUEVO MENSAJE
// ==========================

botonNuevo.onclick = () => {


    formulario.style.display = "block";


};




// ==========================
// CARGAR MENSAJES
// ==========================

async function cargarMensajes() {


    if (!sesionActual) {

        return;

    }



    const mensajes =
        await window.electronAPI.getMensajes(
            sesionActual.id
        );



    mostrarMensajes(mensajes);


}





// ==========================
// MOSTRAR MENSAJES
// ==========================

function mostrarMensajes(mensajes) {


    if (mensajes.length === 0) {


        lista.innerHTML = `

            <div class="empty">

                <h3>
                    No existen mensajes.
                </h3>

                <p>
                    La bandeja está vacía.
                </p>

            </div>

        `;


        return;


    }



    lista.innerHTML = "";



    mensajes.forEach(item => {



        lista.innerHTML += `

        <div class="student-card">


            <h3>
                ${item.asunto}
            </h3>


            <p>
                ${item.mensaje}
            </p>


            <small>

                De:
                ${item.origen}

                <br>

                Fecha:
                ${item.fecha}

                <br>

                Estado:
                ${item.estado}

            </small>


            <br><br>


            <button

                class="btn-leer"

                data-id="${item.id}">

                ✔ Marcar leído

            </button>


        </div>

        `;


    });




    document
    .querySelectorAll(".btn-leer")
    .forEach(boton => {



        boton.onclick = async () => {



            const id =
                Number(
                    boton.dataset.id
                );



            const respuesta =
                await window.electronAPI
                .marcarMensajeLeido(id);



            console.log(
                respuesta.message
            );



            cargarMensajes();


        };


    });



}





// ==========================
// ENVIAR MENSAJE
// ==========================

botonEnviar.onclick = async () => {



    if (
        !asunto.value ||
        !mensaje.value
    ) {


        alert(
            "Complete asunto y mensaje."
        );


        return;

    }





    const nuevoMensaje = {



        usuario_origen:
            sesionActual.id,



        usuario_destino:
            destinatario.value
            ? Number(destinatario.value)
            : null,



        asunto:
            asunto.value,



        mensaje:
            mensaje.value



    };





    const respuesta =
        await window.electronAPI
        .registrarMensaje(
            nuevoMensaje
        );



    alert(
        respuesta.message
    );



    if(respuesta.success){



        asunto.value = "";

        mensaje.value = "";

        formulario.style.display =
            "none";



        cargarMensajes();


    }



};



})();