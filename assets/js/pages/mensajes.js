(() => {

    console.log("Módulo Mensajes iniciado.");

    // =====================================================
    // ELEMENTOS DEL DOM
    // =====================================================

    const buscarDestinatario =
        document.getElementById("buscarDestinatario");

    const usuarioDestino =
        document.getElementById("usuarioDestino");

    const listaUsuarios =
        document.getElementById("listaUsuarios");

    const destinatarioSeleccionado =
        document.getElementById("destinatarioSeleccionado");

    const asunto =
        document.getElementById("asuntoMensaje");

    const textoMensaje =
        document.getElementById("textoMensaje");

    const botonEnviar =
        document.getElementById("btnEnviarMensaje");

    const botonLimpiar =
        document.getElementById("btnLimpiarMensaje");

    const resultado =
        document.getElementById("resultadoMensaje");

    const botonEntrada =
        document.getElementById("btnBandejaEntrada");

    const botonEnviados =
        document.getElementById("btnBandejaEnviados");

    const listaMensajes =
        document.getElementById("listaMensajes");

    const detalleMensaje =
        document.getElementById("detalleMensaje");

    const detalleAsunto =
        document.getElementById("detalleAsunto");

    const detalleOrigen =
        document.getElementById("detalleOrigen");

    const detalleDestino =
        document.getElementById("detalleDestino");

    const detalleFecha =
        document.getElementById("detalleFecha");

    const detalleContenido =
        document.getElementById("detalleContenido");

    const botonCerrarDetalle =
        document.getElementById("btnCerrarDetalle");


    // =====================================================
    // VALIDACIÓN DE ELEMENTOS
    // =====================================================

    if (
        !buscarDestinatario ||
        !usuarioDestino ||
        !listaUsuarios ||
        !destinatarioSeleccionado ||
        !asunto ||
        !textoMensaje ||
        !botonEnviar ||
        !botonLimpiar ||
        !resultado ||
        !botonEntrada ||
        !botonEnviados ||
        !listaMensajes ||
        !detalleMensaje ||
        !detalleAsunto ||
        !detalleOrigen ||
        !detalleDestino ||
        !detalleFecha ||
        !detalleContenido ||
        !botonCerrarDetalle
    ) {

        console.error(
            "No se encontraron los elementos necesarios de Mensajes."
        );

        return;
    }


    // =====================================================
    // VARIABLES
    // =====================================================

    let usuarioActual = null;

    let usuarios = [];

    let mensajes = [];

    let bandejaActual = "entrada";


    // =====================================================
    // INICIO
    // =====================================================

    iniciar();


    async function iniciar() {

        try {

            usuarioActual =
                JSON.parse(
                    localStorage.getItem("usuario")
                );


            if (!usuarioActual) {

                console.error(
                    "No se encontró el usuario actual."
                );

                return;
            }


            console.log(
                "Usuario actual:",
                usuarioActual
            );


            await cargarUsuarios();

            await cargarMensajes();

        } catch (error) {

            console.error(
                "Error iniciando módulo Mensajes:",
                error
            );
        }
    }


    // =====================================================
    // CARGAR USUARIOS
    // =====================================================

 async function cargarUsuarios() {
    try {

        console.log("Cargando usuarios...");

        // ==================================================
        // ELECTRON
        // ==================================================

        if (
            window.electronAPI &&
            typeof window.electronAPI.getUsuarios === "function"
        ) {

            console.log(
                "Obteniendo usuarios mediante Electron..."
            );

            usuarios =
                await window.electronAPI.getUsuarios();

        }

        // ==================================================
        // CHROME / NAVEGADOR
        // ==================================================

        else {

            console.log(
                "Obteniendo usuarios mediante API web..."
            );

            const respuesta =
                await fetch("/api/usuarios");

            if (!respuesta.ok) {

                throw new Error(
                    "No se pudieron cargar los usuarios. " +
                    "Código HTTP: " +
                    respuesta.status
                );

            }

            usuarios =
                await respuesta.json();

        }


        // ==================================================
        // VALIDAR RESPUESTA
        // ==================================================

        console.log(
            "Usuarios recibidos:",
            usuarios
        );


        if (!Array.isArray(usuarios)) {

            console.error(
                "La respuesta de usuarios no es un arreglo:",
                usuarios
            );

            usuarios = [];

            return;
        }


        console.log(
            "Cantidad de usuarios recibidos:",
            usuarios.length
        );

    }
    catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

        usuarios = [];

    }
}

    // =====================================================
    // BUSCADOR DE DESTINATARIO
    // =====================================================

    buscarDestinatario.addEventListener(
        "focus",
        () => {

            mostrarUsuariosFiltrados(
                buscarDestinatario.value
            );
        }
    );


    buscarDestinatario.addEventListener(
        "input",
        () => {

            const texto =
                buscarDestinatario.value
                    .trim()
                    .toLowerCase();


            // Al escribir nuevamente,
            // se debe seleccionar otro destinatario
            usuarioDestino.value = "";

            destinatarioSeleccionado.textContent =
                "Ningún destinatario seleccionado.";


            mostrarUsuariosFiltrados(texto);
        }
    );


    // =====================================================
    // FILTRAR USUARIOS
    // =====================================================

    function mostrarUsuariosFiltrados(texto = "") {

        const busqueda =
            String(texto)
                .trim()
                .toLowerCase();


        const resultados =
            usuarios
                .filter(usuario => {

                    // No permitir enviarse mensajes a sí mismo
                    if (
                        Number(usuario.id) ===
                        Number(usuarioActual.id)
                    ) {

                        return false;
                    }


                    // Si no se escribió nada,
                    // mostrar todos los usuarios
                    if (!busqueda) {

                        return true;
                    }


                    const nombres =
                        String(
                            usuario.nombres || ""
                        ).toLowerCase();


                    const apellidos =
                        String(
                            usuario.apellidos || ""
                        ).toLowerCase();


                    const nombreCompleto =
                        `${nombres} ${apellidos}`;


                    const usuarioLogin =
                        String(
                            usuario.usuario || ""
                        ).toLowerCase();


                    const rol =
                        String(
                            usuario.rol || ""
                        ).toLowerCase();


                    return (
                        nombreCompleto.includes(busqueda) ||
                        nombres.includes(busqueda) ||
                        apellidos.includes(busqueda) ||
                        usuarioLogin.includes(busqueda) ||
                        rol.includes(busqueda)
                    );
                })
                .slice(0, 50);


        mostrarUsuarios(resultados);
    }


    // =====================================================
    // MOSTRAR USUARIOS
    // =====================================================

    function mostrarUsuarios(resultados) {

        listaUsuarios.innerHTML = "";


        if (!resultados.length) {

            listaUsuarios.innerHTML = `
                <div class="usuario-opcion">
                    No se encontraron usuarios.
                </div>
            `;

            return;
        }


        resultados.forEach(usuario => {

            const opcion =
                document.createElement("div");


            opcion.className =
                "usuario-opcion";


            const nombre =
                `${usuario.nombres || ""} ${usuario.apellidos || ""}`
                    .trim();


            const rol =
                usuario.rol || "Sin rol";


            opcion.innerHTML = `
                <div class="usuario-opcion-nombre">
                    ${escapeHtml(nombre)}
                </div>

                <div class="usuario-opcion-rol">
                    ${escapeHtml(rol)}
                </div>
            `;


            opcion.addEventListener(
                "click",
                () => {

                    seleccionarUsuario(usuario);
                }
            );


            listaUsuarios.appendChild(opcion);
        });
    }


    // =====================================================
    // SELECCIONAR USUARIO
    // =====================================================

    function seleccionarUsuario(usuario) {

        usuarioDestino.value =
            usuario.id;


        const nombre =
            `${usuario.nombres || ""} ${usuario.apellidos || ""}`
                .trim();


        buscarDestinatario.value =
            nombre;


        destinatarioSeleccionado.innerHTML = `
            Destinatario seleccionado:
            <strong>${escapeHtml(nombre)}</strong>
            ${
                usuario.rol
                    ? `(${escapeHtml(usuario.rol)})`
                    : ""
            }
        `;


        listaUsuarios.innerHTML = "";
    }


    // =====================================================
    // CERRAR LISTA DE USUARIOS
    // =====================================================

    function cerrarListaUsuarios() {

        listaUsuarios.innerHTML = "";
    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".autocomplete-container"
                )
            ) {

                cerrarListaUsuarios();
            }
        }
    );


    // =====================================================
    // LIMPIAR FORMULARIO
    // =====================================================

    botonLimpiar.addEventListener(
        "click",
        limpiarFormulario
    );


    function limpiarFormulario() {

        buscarDestinatario.value = "";

        usuarioDestino.value = "";

        asunto.value = "";

        textoMensaje.value = "";

        listaUsuarios.innerHTML = "";

        destinatarioSeleccionado.textContent =
            "Ningún destinatario seleccionado.";

        resultado.innerHTML = "";
    }


    // =====================================================
    // ENVIAR MENSAJE
    // =====================================================

    botonEnviar.addEventListener(
        "click",
        enviarMensaje
    );


    async function enviarMensaje() {

        resultado.innerHTML = "";


        // -------------------------------------------------
        // VALIDAR DESTINATARIO
        // -------------------------------------------------

        if (!usuarioDestino.value) {

            resultado.innerHTML = `
                <span style="color:#d32f2f;">
                    Seleccione un destinatario.
                </span>
            `;

            return;
        }


        // -------------------------------------------------
        // VALIDAR ASUNTO
        // -------------------------------------------------

        if (!asunto.value.trim()) {

            resultado.innerHTML = `
                <span style="color:#d32f2f;">
                    Complete el asunto.
                </span>
            `;

            asunto.focus();

            return;
        }


        // -------------------------------------------------
        // VALIDAR MENSAJE
        // -------------------------------------------------

        if (!textoMensaje.value.trim()) {

            resultado.innerHTML = `
                <span style="color:#d32f2f;">
                    Escriba el mensaje.
                </span>
            `;

            textoMensaje.focus();

            return;
        }


        // -------------------------------------------------
        // CREAR MENSAJE
        // -------------------------------------------------

        const nuevoMensaje = {

            usuario_origen:
                Number(usuarioActual.id),

            usuario_destino:
                Number(usuarioDestino.value),

            asunto:
                asunto.value.trim(),

            mensaje:
                textoMensaje.value.trim()
        };


        console.log(
            "Mensaje a enviar:",
            nuevoMensaje
        );


        // -------------------------------------------------
        // ENVIAR
        // -------------------------------------------------

        try {

            let respuesta;


            if (
                window.electronAPI &&
                typeof window.electronAPI.registrarMensaje ===
                    "function"
            ) {

                respuesta =
                    await window.electronAPI.registrarMensaje(
                        nuevoMensaje
                    );

            } else {

                const resultadoFetch =
                    await fetch(
                        "/api/mensajes",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    nuevoMensaje
                                )
                        }
                    );


                if (!resultadoFetch.ok) {

                    throw new Error(
                        "No se pudo enviar el mensaje."
                    );
                }


                respuesta =
                    await resultadoFetch.json();
            }


            console.log(
                "Respuesta envío:",
                respuesta
            );


            if (respuesta && respuesta.success) {

                resultado.innerHTML = `
                    <span style="color:#2e7d32;">
                        Mensaje enviado correctamente.
                    </span>
                `;


                limpiarFormulario();


                await cargarMensajes();

            } else {

                resultado.innerHTML = `
                    <span style="color:#d32f2f;">
                        ${
                            respuesta &&
                            respuesta.message
                                ? respuesta.message
                                : "No se pudo enviar el mensaje."
                        }
                    </span>
                `;
            }


        } catch (error) {

            console.error(
                "Error enviando mensaje:",
                error
            );


            resultado.innerHTML = `
                <span style="color:#d32f2f;">
                    Ocurrió un error al enviar el mensaje.
                </span>
            `;
        }
    }


    // =====================================================
    // CARGAR MENSAJES
    // =====================================================

    async function cargarMensajes() {

        if (!usuarioActual) {

            return;
        }


        try {

            if (
                window.electronAPI &&
                typeof window.electronAPI.getMensajes ===
                    "function"
            ) {

                mensajes =
                    await window.electronAPI.getMensajes(
                        Number(usuarioActual.id)
                    );

            } else {

                const respuesta =
                    await fetch(
                        `/api/mensajes/${usuarioActual.id}`
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudieron cargar los mensajes."
                    );
                }


                mensajes =
                    await respuesta.json();
            }


            console.log(
                "Mensajes recibidos:",
                mensajes
            );


            if (!Array.isArray(mensajes)) {

                mensajes = [];
            }


            mostrarMensajes();


        } catch (error) {

            console.error(
                "Error cargando mensajes:",
                error
            );


            listaMensajes.innerHTML = `
                <div class="sin-mensajes">
                    No se pudieron cargar los mensajes.
                </div>
            `;
        }
    }


    // =====================================================
    // CAMBIAR A BANDEJA DE ENTRADA
    // =====================================================

    botonEntrada.addEventListener(
        "click",
        () => {

            bandejaActual =
                "entrada";


            botonEntrada.classList.add(
                "activa"
            );


            botonEnviados.classList.remove(
                "activa"
            );


            mostrarMensajes();
        }
    );


    // =====================================================
    // CAMBIAR A BANDEJA DE ENVIADOS
    // =====================================================

    botonEnviados.addEventListener(
        "click",
        () => {

            bandejaActual =
                "enviados";


            botonEnviados.classList.add(
                "activa"
            );


            botonEntrada.classList.remove(
                "activa"
            );


            mostrarMensajes();
        }
    );


    // =====================================================
    // MOSTRAR MENSAJES
    // =====================================================

    function mostrarMensajes() {

        let mensajesMostrar;


        // -------------------------------------------------
        // BANDEJA DE ENTRADA
        // -------------------------------------------------

        if (bandejaActual === "entrada") {

            mensajesMostrar =
                mensajes.filter(item => {

                    return (
                        Number(item.usuario_destino) ===
                            Number(usuarioActual.id)

                        ||

                        item.usuario_destino === null
                    );
                });


        // -------------------------------------------------
        // BANDEJA DE ENVIADOS
        // -------------------------------------------------

        } else {

            mensajesMostrar =
                mensajes.filter(item => {

                    return (
                        Number(item.usuario_origen) ===
                        Number(usuarioActual.id)
                    );
                });
        }


        // -------------------------------------------------
        // SIN MENSAJES
        // -------------------------------------------------

        if (!mensajesMostrar.length) {

            listaMensajes.innerHTML = `
                <div class="sin-mensajes">
                    No hay mensajes en esta bandeja.
                </div>
            `;

            return;
        }


        listaMensajes.innerHTML = "";


        // -------------------------------------------------
        // GENERAR MENSAJES
        // -------------------------------------------------

        mensajesMostrar.forEach(item => {

            const div =
                document.createElement("div");


            div.className =
                "mensaje-item";


            // -------------------------------------------------
            // NO LEÍDO
            // -------------------------------------------------

            if (
                bandejaActual === "entrada" &&
                item.estado === "PENDIENTE"
            ) {

                div.classList.add(
                    "no-leido"
                );
            }


            // -------------------------------------------------
            // PERSONA
            // -------------------------------------------------

            const persona =
                bandejaActual === "entrada"
                    ? (
                        item.origen ||
                        "Sistema"
                    )
                    : (
                        item.destino ||
                        "Destinatario"
                    );


            // -------------------------------------------------
            // ESTADO
            // -------------------------------------------------

            const estadoNoLeido =
                (
                    bandejaActual === "entrada" &&
                    item.estado === "PENDIENTE"
                )
                    ? `
                        <span class="mensaje-no-leido">
                            NO LEÍDO
                        </span>
                    `
                    : "";


            // -------------------------------------------------
            // HTML DEL MENSAJE
            // -------------------------------------------------

            div.innerHTML = `
                <div class="mensaje-item-cabecera">

                    <div class="mensaje-item-asunto">

                        ${escapeHtml(
                            item.asunto ||
                            "(Sin asunto)"
                        )}

                        ${estadoNoLeido}

                    </div>


                    <div class="mensaje-item-fecha">

                        ${formatearFecha(
                            item.fecha
                        )}

                    </div>

                </div>


                <div class="mensaje-item-persona">

                    ${
                        bandejaActual === "entrada"
                            ? "De: "
                            : "Para: "
                    }

                    ${escapeHtml(persona)}

                </div>


                <div class="mensaje-item-vista">

                    ${escapeHtml(
                        obtenerVistaMensaje(
                            item.mensaje
                        )
                    )}

                </div>
            `;


            div.addEventListener(
                "click",
                () => {

                    abrirMensaje(item);
                }
            );


            listaMensajes.appendChild(div);
        });
    }


    // =====================================================
    // ABRIR MENSAJE
    // =====================================================

    async function abrirMensaje(item) {

        detalleAsunto.textContent =
            item.asunto ||
            "(Sin asunto)";


        detalleOrigen.textContent =
            item.origen ||
            "Sistema";


        detalleDestino.textContent =
            item.destino ||
            "Todos";


        detalleFecha.textContent =
            formatearFecha(
                item.fecha
            );


        detalleContenido.textContent =
            item.mensaje ||
            "";


        detalleMensaje.style.display =
            "block";


        detalleMensaje.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        // -------------------------------------------------
        // MARCAR COMO LEÍDO
        // -------------------------------------------------

        if (
            item.estado === "PENDIENTE" &&
            Number(item.usuario_destino) ===
                Number(usuarioActual.id)
        ) {

            await marcarComoLeido(
                item.id
            );
        }
    }


    // =====================================================
    // MARCAR MENSAJE COMO LEÍDO
    // =====================================================

    async function marcarComoLeido(id) {

        try {

            let respuesta;


            if (
                window.electronAPI &&
                typeof window.electronAPI.marcarMensajeLeido ===
                    "function"
            ) {

                respuesta =
                    await window.electronAPI.marcarMensajeLeido(
                        Number(id),
                        Number(usuarioActual.id)
                    );

            } else {

                const resultadoFetch =
                    await fetch(
                        `/api/mensajes/${id}/leido`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    usuarioId:
                                        Number(
                                            usuarioActual.id
                                        )
                                })
                        }
                    );


                if (!resultadoFetch.ok) {

                    throw new Error(
                        "No se pudo marcar el mensaje como leído."
                    );
                }


                respuesta =
                    await resultadoFetch.json();
            }


            console.log(
                "Mensaje marcado como leído:",
                respuesta
            );


            if (
                respuesta &&
                Number(respuesta.cambios) > 0
            ) {

                const mensajeEncontrado =
                    mensajes.find(
                        mensaje =>
                            Number(mensaje.id) ===
                            Number(id)
                    );


                if (mensajeEncontrado) {

                    mensajeEncontrado.estado =
                        "LEIDO";
                }


                mostrarMensajes();


                if (
                    typeof window.actualizarContadorMensajes ===
                    "function"
                ) {

                    window.actualizarContadorMensajes();
                }
            }


        } catch (error) {

            console.error(
                "Error marcando mensaje como leído:",
                error
            );
        }
    }


    // =====================================================
    // CERRAR DETALLE
    // =====================================================

    botonCerrarDetalle.addEventListener(
        "click",
        () => {

            detalleMensaje.style.display =
                "none";
        }
    );


    // =====================================================
    // UTILIDAD: VISTA PREVIA DEL MENSAJE
    // =====================================================

    function obtenerVistaMensaje(texto) {

        if (!texto) {

            return "";
        }


        const limpio =
            String(texto)
                .replace(/\s+/g, " ")
                .trim();


        if (limpio.length <= 120) {

            return limpio;
        }


        return (
            limpio.substring(0, 120) +
            "..."
        );
    }


    // =====================================================
    // UTILIDAD: FORMATEAR FECHA
    // =====================================================

    function formatearFecha(fecha) {

        if (!fecha) {

            return "";
        }


        try {

            return new Intl.DateTimeFormat(
                "es-PE",
                {
                    dateStyle: "short",
                    timeStyle: "short"
                }
            ).format(
                new Date(fecha)
            );

        } catch (error) {

            return fecha;
        }
    }


    // =====================================================
    // UTILIDAD: ESCAPAR HTML
    // =====================================================

    function escapeHtml(valor) {

        return String(valor ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


})();