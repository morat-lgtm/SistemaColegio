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
// CONTADOR DE MENSAJES
// ==========================

async function actualizarContadorMensajes() {

    try {

        const usuarioActual =
            JSON.parse(
                localStorage.getItem(
                    "usuario"
                )
            );


        // ==========================
        // VERIFICAR USUARIO
        // ==========================

        if (
            !usuarioActual ||
            !usuarioActual.id
        ) {

            console.log(
                "No se encontró usuario para actualizar contador de mensajes."
            );

            return;

        }


        let cantidad = 0;


        // ==========================
        // ELECTRON
        // ==========================

        if (
            window.electronAPI &&
            typeof window.electronAPI
                .getMensajesNoLeidos ===
                "function"
        ) {

            cantidad =
                await window.electronAPI
                    .getMensajesNoLeidos(
                        Number(
                            usuarioActual.id
                        )
                    );

        }


        // ==========================
        // CHROME / NAVEGADOR
        // ==========================

        else {

            const respuesta =
                await fetch(
                    `/api/mensajes/${usuarioActual.id}/no-leidos`
                );


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo obtener la cantidad de mensajes no leídos. HTTP " +
                    respuesta.status
                );

            }


            const datos =
                await respuesta.json();


            cantidad =
                Number(
                    datos.cantidad || 0
                );

        }


        // ==========================
        // VALIDAR CANTIDAD
        // ==========================

        if (
            !Number.isFinite(
                cantidad
            ) ||
            cantidad < 0
        ) {

            cantidad = 0;

        }


        // ==========================
        // OBTENER CONTADOR
        // ==========================

        const contador =
            document.getElementById(
                "contadorMensajes"
            );


        if (!contador) {

            console.warn(
                "No se encontró #contadorMensajes."
            );

            return;

        }


        // ==========================
        // MOSTRAR CONTADOR
        // ==========================

        if (
            cantidad > 0
        ) {

            contador.textContent =
                cantidad > 99
                    ? "99+"
                    : String(
                        cantidad
                    );


            contador.style.display =
                "inline-flex";


            contador.style.alignItems =
                "center";


            contador.style.justifyContent =
                "center";


            contador.style.minWidth =
                "20px";


            contador.style.height =
                "20px";


            contador.style.padding =
                "0 5px";


            contador.style.marginLeft =
                "8px";


            contador.style.boxSizing =
                "border-box";


            contador.style.backgroundColor =
                "#d32f2f";


            contador.style.color =
                "#ffffff";


            contador.style.borderRadius =
                "50%";


            contador.style.fontSize =
                "11px";


            contador.style.fontWeight =
                "700";


            contador.style.lineHeight =
                "20px";


            contador.style.textAlign =
                "center";


            contador.style.verticalAlign =
                "middle";


            contador.style.position =
                "relative";


            contador.style.top =
                "-1px";


            contador.style.zIndex =
                "10";

        }


        // ==========================
        // OCULTAR SI NO HAY MENSAJES
        // ==========================

        else {

            contador.textContent =
                "";


            contador.style.display =
                "none";

        }


        console.log(
            "Mensajes no leídos:",
            cantidad
        );


        return cantidad;

    }
    catch(error) {

        console.error(
            "Error actualizando contador de mensajes:",
            error
        );


        const contador =
            document.getElementById(
                "contadorMensajes"
            );


        if (contador) {

            contador.textContent =
                "";


            contador.style.display =
                "none";

        }


        return 0;

    }

}


// ==========================
// HACER FUNCIÓN GLOBAL
// ==========================
// Esto permite que mensajes.js
// pueda actualizar el contador
// inmediatamente después de leer
// un mensaje.

window.actualizarContadorMensajes =
    actualizarContadorMensajes;


// ==========================
// ACTUALIZAR CONTADOR AL INICIAR
// ==========================

actualizarContadorMensajes();


// ==========================
// ACTUALIZAR CADA 30 SEGUNDOS
// ==========================

setInterval(
    actualizarContadorMensajes,
    30000
);


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
        async () => {

            // Actualizar inmediatamente
            // antes de entrar a Mensajes

            await actualizarContadorMensajes();


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
    document.getElementById(
        "btnCerrarSesion"
    );


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

                // Limpiar datos de sesión
                // del navegador

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