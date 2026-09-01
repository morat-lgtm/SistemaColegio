const contenido = document.getElementById("contenido");

let scriptActual = null;


// ==========================
// CARGAR PÁGINAS
// ==========================

async function cargarPagina(nombrePagina) {

    try {


        // ==========================
        // ELIMINAR SCRIPT ANTERIOR
        // ==========================

        if (scriptActual) {

            scriptActual.remove();

            scriptActual = null;

        }



        document
        .querySelectorAll(".page-script")
        .forEach(script => {

            script.remove();

        });



        // ==========================
        // CARGAR HTML
        // ==========================


        const respuesta =
            await fetch(`pages/${nombrePagina}.html`);



        const html =
            await respuesta.text();



        contenido.innerHTML = html;




        // ==========================
        // CARGAR JS DEL MÓDULO
        // ==========================


        const script =
            document.createElement("script");



        script.src =
            `../assets/js/pages/${nombrePagina}.js`;



        script.className =
            "page-script";



        scriptActual = script;



        contenido.appendChild(script);



    }
    catch(error) {


        contenido.innerHTML = `

            <h2>Error</h2>

            <p>
                No se pudo cargar la página.
            </p>

        `;


        console.error(error);


    }

}



// ==========================
// HORA
// ==========================

function actualizarHora() {


    const ahora =
        new Date();



    const reloj =
        document.getElementById("lblHora");



    if (reloj) {

        reloj.textContent =
            ahora.toLocaleTimeString();

    }


}


setInterval(actualizarHora,1000);

actualizarHora();



// ==========================
// MENU
// ==========================


document
.getElementById("btnInicio")
.addEventListener("click", () => {

    cargarPagina("inicio");

});



document
.getElementById("btnEstudiantes")
.addEventListener("click", () => {

    cargarPagina("estudiantes");

});



document
.getElementById("btnSalidas")
.addEventListener("click", () => {

    cargarPagina("salidas");

});



// ==========================
// HISTORIAL
// ==========================

document
.getElementById("btnHistorial")
.addEventListener("click", () => {

    cargarPagina("historial");

});



document
.getElementById("btnMensajes")
.addEventListener("click", () => {

    cargarPagina("mensajes");

});



document
.getElementById("btnReportes")
.addEventListener("click", () => {

    cargarPagina("reportes");

});



document
.getElementById("btnConfiguracion")
.addEventListener("click", () => {

    cargarPagina("configuracion");

});



// ==========================
// INICIO
// ==========================

cargarPagina("inicio");