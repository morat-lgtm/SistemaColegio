const contenido =
    document.getElementById("contenido");


let scriptActual = null;


// ==========================
// CARGAR PÁGINAS
// ==========================

async function cargarPagina(nombrePagina) {

    try {

        console.log(
            "Cargando página:",
            nombrePagina
        );


        // ==========================
        // LIMPIAR SCRIPT ANTERIOR
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
            await fetch(
                `pages/${nombrePagina}.html`
            );


        if (!respuesta.ok) {

            throw new Error(
                `No se pudo cargar ${nombrePagina}.html`
            );

        }


        const html =
            await respuesta.text();


        contenido.innerHTML =
            html;


        // ==========================
        // ASEGURAR INTERACCIÓN
        // ==========================

        contenido.style.pointerEvents =
            "auto";

        contenido.style.userSelect =
            "auto";


        // ==========================
        // CARGAR JAVASCRIPT DE PÁGINA
        // ==========================

        const script =
            document.createElement("script");


        script.src =
    `/assets/js/pages/${nombrePagina}.js`;


        script.className =
            "page-script";


        script.type =
            "text/javascript";


        scriptActual =
            script;


        // ==========================
        // SCRIPT CARGADO
        // ==========================

        script.onload = () => {

            console.log(
                `Script ${nombrePagina}.js cargado correctamente.`
            );

        };


        // ==========================
        // ERROR SCRIPT
        // ==========================

        script.onerror = (error) => {

            console.error(
                `Error cargando ${nombrePagina}.js:`,
                error
            );

        };


        // ==========================
        // INSERTAR SCRIPT
        // ==========================

        contenido.appendChild(
            script
        );


    }
    catch(error) {

        console.error(
            "Error cargando página:",
            error
        );


        contenido.innerHTML = `

            <h2>Error</h2>

            <p>
                No se pudo cargar la página.
            </p>

        `;

    }

}


// ==========================
// HORA
// ==========================

function actualizarHora() {

    const ahora =
        new Date();


    const reloj =
        document.getElementById(
            "lblHora"
        );


    if (reloj) {

        reloj.textContent =
            ahora.toLocaleTimeString();

    }

}


setInterval(
    actualizarHora,
    1000
);


actualizarHora();


// ==========================
// MENU
// ==========================


// ==========================
// INICIO
// ==========================

document
    .getElementById("btnInicio")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "inicio"
            );

        }
    );


// ==========================
// ESTUDIANTES
// ==========================

document
    .getElementById("btnEstudiantes")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "estudiantes"
            );

        }
    );


// ==========================
// SALIDAS
// ==========================

document
    .getElementById("btnSalidas")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "salidas"
            );

        }
    );


// ==========================
// HISTORIAL
// ==========================

document
    .getElementById("btnHistorial")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "historial"
            );

        }
    );


// ==========================
// INCIDENCIAS
// ==========================

document
    .getElementById("btnIncidencias")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "incidencias"
            );

        }
    );


// ==========================
// HISTORIAL INCIDENCIAS
// ==========================

document
    .getElementById("btnHistorialIncidencias")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "historialIncidencias"
            );

        }
    );


// ==========================
// REPORTE INCIDENCIAS
// ==========================

document
    .getElementById("btnReporteIncidencias")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "reporteIncidencias"
            );

        }
    );


// ==========================
// MENSAJES
// ==========================

document
    .getElementById("btnMensajes")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "mensajes"
            );

        }
    );


// ==========================
// REPORTES
// ==========================

document
    .getElementById("btnReportes")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "reportes"
            );

        }
    );


// ==========================
// CONFIGURACIÓN
// ==========================

document
    .getElementById("btnConfiguracion")
    .addEventListener(
        "click",
        () => {

            cargarPagina(
                "configuracion"
            );

        }
    );

// ==========================
// CERRAR SESIÓN
// ==========================

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async () => {

            const confirmar =
                confirm(
                    "¿Está seguro de que desea cerrar sesión?"
                );


            if (!confirmar) {

                return;

            }


            try {

                // Limpiar datos de sesión del navegador

                sessionStorage.clear();

                localStorage.removeItem(
                    "sessionId"
                );

                localStorage.removeItem(
                    "usuario"
                );


                // Regresar al login

                window.location.href =
                    "/";

            }
            catch(error) {

                console.error(
                    "Error cerrando sesión:",
                    error
                );

            }

        }
    );

}
// ==========================
// CARGAR INICIO
// ==========================

cargarPagina(
    "inicio"
);