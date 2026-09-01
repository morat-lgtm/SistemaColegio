(() => {

    console.log("Módulo Salidas iniciado.");


    // =========================================================
    // ELEMENTOS DE LA PÁGINA
    // =========================================================

    const lista =
        document.getElementById("listaSalidas");


    const buscar =
        document.getElementById("txtBuscarSalida");


    const comboMotivo =
        document.getElementById("cmbMotivo");


    const observacion =
        document.getElementById("txtObservacion");


    const botonRegistrar =
        document.getElementById("btnRegistrarSalida");


    const resultadoEstudiantes =
        document.getElementById("resultadoEstudiantes");


    // =========================================================
    // VERIFICAR ELEMENTOS
    // =========================================================

    if (!lista) {

        console.error(
            "No se encontró #listaSalidas."
        );

        return;

    }


    if (!buscar) {

        console.error(
            "No se encontró #txtBuscarSalida."
        );

        return;

    }


    if (!comboMotivo) {

        console.error(
            "No se encontró #cmbMotivo."
        );

        return;

    }


    if (!botonRegistrar) {

        console.error(
            "No se encontró #btnRegistrarSalida."
        );

        return;

    }


    // =========================================================
    // VARIABLES
    // =========================================================

    let estudiantes = [];

    let estudianteSeleccionado = null;


    // =========================================================
    // CREAR CONTENEDOR DE RESULTADOS
    // =========================================================

    let contenedorResultados =
        resultadoEstudiantes;


    if (!contenedorResultados) {

        contenedorResultados =
            document.createElement("div");

        contenedorResultados.id =
            "resultadoEstudiantes";


        buscar.parentNode.insertBefore(

            contenedorResultados,

            buscar.nextSibling

        );

    }


    // =========================================================
    // ESTILOS DE RESULTADOS
    // =========================================================

    const estilo =
        document.createElement("style");


    estilo.textContent = `

        #resultadoEstudiantes {

            width: 100%;
            max-width: 350px;

            background: #ffffff;

            border: 1px solid #d0d7de;

            border-radius: 6px;

            box-shadow:
                0 4px 12px rgba(0,0,0,0.15);

            overflow: hidden;

            position: relative;

            z-index: 1000;

        }


        .resultado-estudiante {

            padding: 12px 14px;

            cursor: pointer;

            border-bottom:
                1px solid #eeeeee;

            background: #ffffff;

        }


        .resultado-estudiante:last-child {

            border-bottom: none;

        }


        .resultado-estudiante:hover {

            background: #f1f5f9;

        }


        .resultado-nombre {

            font-weight: 600;

            font-size: 15px;

            color: #222222;

        }


        .resultado-datos {

            margin-top: 4px;

            font-size: 13px;

            color: #666666;

        }


        .resultado-vacio {

            padding: 12px 14px;

            color: #777777;

            font-size: 14px;

        }


        .estudiante-seleccionado {

            border: 2px solid #2e7d32;

            background: #f1f8f2;

        }


        .salida-card {

            padding: 12px;

            margin-bottom: 10px;

            background: white;

            border-radius: 8px;

            border: 1px solid #ddd;

        }


        .btn-retorno {

            margin-top: 10px;

            padding: 8px 12px;

            border: none;

            border-radius: 5px;

            cursor: pointer;

        }

    `;


    document.head.appendChild(estilo);


    // =========================================================
    // INICIAR
    // =========================================================

    iniciar();


    async function iniciar() {

        try {

            console.log(
                "Iniciando módulo Salidas..."
            );


            await cargarMotivos();


            await cargarEstudiantes();


            await cargarSalidas();


            console.log(
                "Módulo Salidas listo."
            );


            buscar.focus();


        } catch (error) {

            console.error(
                "Error iniciando Salidas:",
                error
            );

        }

    }


    // =========================================================
    // CARGAR MOTIVOS
    // =========================================================

    async function cargarMotivos() {

        try {

            console.log(
                "Cargando motivos..."
            );


            const respuesta =
                await fetch(
                    "/api/motivos-salida"
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );

            }


            const motivos =
                await respuesta.json();


            console.log(
                "MOTIVOS:",
                motivos
            );


            comboMotivo.innerHTML = `

                <option value="">
                    Seleccione motivo
                </option>

            `;


            motivos.forEach(
                motivo => {

                    comboMotivo.innerHTML += `

                        <option value="${motivo.id}">

                            ${motivo.nombre}

                        </option>

                    `;

                }
            );


        } catch (error) {

            console.error(
                "Error motivos:",
                error
            );


            comboMotivo.innerHTML = `

                <option value="">
                    Error cargando motivos
                </option>

            `;

        }

    }


    // =========================================================
    // OBTENER WORKSTATION
    // =========================================================

    async function obtenerWorkstation() {

        console.log(
            "Obteniendo configuración de la computadora..."
        );


        const respuesta =
            await fetch(
                "/api/workstation"
            );


        if (!respuesta.ok) {

            throw new Error(
                `Error obteniendo workstation: HTTP ${respuesta.status}`
            );

        }


        const workstation =
            await respuesta.json();


        console.log(
            "WORKSTATION:",
            workstation
        );


        return workstation;

    }


    // =========================================================
    // CARGAR ESTUDIANTES DEL AMBIENTE
    // =========================================================

    async function cargarEstudiantes() {

        try {

            const workstation =
                await obtenerWorkstation();


            if (
                !workstation ||
                !workstation.ambiente_id
            ) {

                console.error(
                    "La computadora no tiene ambiente configurado."
                );


                contenedorResultados.innerHTML = `

                    <div class="resultado-vacio">

                        Esta computadora no tiene
                        un ambiente configurado.

                    </div>

                `;


                return;

            }


            const ambienteId =
                Number(
                    workstation.ambiente_id
                );


            console.log(
                "Ambiente actual:",
                ambienteId
            );


            // =================================================
            // OBTENER ESTUDIANTES
            // =================================================

            const respuesta =
                await fetch(

                    "/api/students/ambiente/" +
                    ambienteId

                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error cargando estudiantes: HTTP ${respuesta.status}`
                );

            }


            estudiantes =
                await respuesta.json();


            console.log(
                "ESTUDIANTES:",
                estudiantes
            );


            console.log(
                "Estudiantes cargados correctamente:",
                estudiantes.length
            );


        } catch (error) {

            console.error(
                "Error cargando estudiantes:",
                error
            );


            contenedorResultados.innerHTML = `

                <div class="resultado-vacio">

                    Error cargando estudiantes.

                </div>

            `;

        }

    }


    // =========================================================
    // BUSCADOR
    // =========================================================

    buscar.addEventListener(
        "input",
        buscarEstudiantes
    );


    function buscarEstudiantes() {

        const texto =
            buscar.value
                .trim()
                .toLowerCase();


        // Limpiar estudiante anterior

        estudianteSeleccionado =
            null;


        contenedorResultados.innerHTML =
            "";


        // No buscar si está vacío

        if (texto === "") {

            return;

        }


        // =====================================================
        // BUSCAR EN NOMBRES Y APELLIDOS
        // =====================================================

        const coincidencias =
            estudiantes.filter(
                estudiante => {

                    const nombres =
                        String(
                            estudiante.nombres || ""
                        )
                        .toLowerCase();


                    const apellidos =
                        String(
                            estudiante.apellidos || ""
                        )
                        .toLowerCase();


                    const nombreCompleto =
                        `${apellidos} ${nombres}`
                            .toLowerCase();


                    return (

                        nombres.includes(texto) ||

                        apellidos.includes(texto) ||

                        nombreCompleto.includes(texto)

                    );

                }
            );


        console.log(
            "COINCIDENCIAS:",
            coincidencias
        );


        // =====================================================
        // SIN RESULTADOS
        // =====================================================

        if (
            coincidencias.length === 0
        ) {

            contenedorResultados.innerHTML = `

                <div class="resultado-vacio">

                    No se encontraron estudiantes.

                </div>

            `;

            return;

        }


        // =====================================================
        // MOSTRAR COINCIDENCIAS
        // =====================================================

        coincidencias.forEach(
            estudiante => {

                const item =
                    document.createElement("div");


                item.className =
                    "resultado-estudiante";


                item.innerHTML = `

                    <div class="resultado-nombre">

                        ${escaparHTML(
                            estudiante.apellidos
                        )}

                        ${escaparHTML(
                            estudiante.nombres
                        )}

                    </div>


                    <div class="resultado-datos">

                        ${escaparHTML(
                            estudiante.grado
                        )}°

                        ${escaparHTML(
                            estudiante.nivel
                        )}

                        -

                        Sección

                        ${escaparHTML(
                            estudiante.seccion
                        )}

                    </div>

                `;


                // =================================================
                // SELECCIONAR ESTUDIANTE
                // =================================================

                item.addEventListener(
                    "click",
                    () => {

                        seleccionarEstudiante(
                            estudiante
                        );

                    }
                );


                contenedorResultados.appendChild(
                    item
                );

            }
        );

    }


    // =========================================================
    // SELECCIONAR ESTUDIANTE
    // =========================================================

    function seleccionarEstudiante(
        estudiante
    ) {

        estudianteSeleccionado =
            estudiante;


        console.log(
            "ESTUDIANTE SELECCIONADO:",
            estudianteSeleccionado
        );


        buscar.value =
            `${estudiante.apellidos} ${estudiante.nombres}`;


        contenedorResultados.innerHTML =
            "";


        // Mostrar visualmente que está seleccionado

        buscar.classList.add(
            "estudiante-seleccionado"
        );


        setTimeout(
            () => {

                buscar.classList.remove(
                    "estudiante-seleccionado"
                );

            },
            1000
        );

    }


    // =========================================================
    // ESCAPAR HTML
    // =========================================================

    function escaparHTML(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(valor)
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


    // =========================================================
    // OBTENER SESIÓN
    // =========================================================

    async function obtenerSesion() {

        /*
         * La sesión se obtiene mediante el sessionId
         * guardado después del login.
         */


        const sessionId =
            localStorage.getItem(
                "sessionId"
            );


        if (!sessionId) {

            console.warn(
                "No existe sessionId en localStorage."
            );


            return null;

        }


        const respuesta =
            await fetch(

                "/api/auth/session/" +
                encodeURIComponent(
                    sessionId
                )

            );


        if (!respuesta.ok) {

            throw new Error(
                `Error obteniendo sesión: HTTP ${respuesta.status}`
            );

        }


        return await respuesta.json();

    }


    // =========================================================
    // REGISTRAR SALIDA
    // =========================================================

    botonRegistrar.addEventListener(
        "click",
        registrarSalida
    );


    async function registrarSalida() {

        // =====================================================
        // VALIDAR ESTUDIANTE
        // =====================================================

        if (!estudianteSeleccionado) {

            alert(
                "Seleccione un estudiante de la lista."
            );


            buscar.focus();


            return;

        }


        // =====================================================
        // VALIDAR MOTIVO
        // =====================================================

        if (!comboMotivo.value) {

            alert(
                "Seleccione un motivo."
            );


            comboMotivo.focus();


            return;

        }


        try {

            botonRegistrar.disabled =
                true;


            // =================================================
            // OBTENER WORKSTATION
            // =================================================

            const workstation =
                await obtenerWorkstation();


            if (
                !workstation ||
                !workstation.id
            ) {

                throw new Error(
                    "No se encontró la workstation de esta computadora."
                );

            }


            // =================================================
            // OBTENER SESIÓN
            // =================================================

            const sesion =
                await obtenerSesion();


            if (!sesion) {

                alert(
                    "No existe una sesión activa."
                );


                return;

            }


            console.log(
                "SESIÓN:",
                sesion
            );


            // =================================================
            // CONSTRUIR SALIDA
            // =================================================

            const salida = {

                estudiante_id:
                    estudianteSeleccionado.id,


                motivo_id:
                    Number(
                        comboMotivo.value
                    ),


                workstation_id:
                    workstation.id,


                usuario_id:
                    sesion.usuario_id ||
                    sesion.id,


                observacion:
                    observacion
                        ? observacion.value.trim()
                        : "",


                confirmarSalida:
                    false

            };


            console.log(
                "SALIDA A REGISTRAR:",
                salida
            );


            // =================================================
            // PRIMER INTENTO
            // =================================================

            let respuestaHTTP =
                await fetch(

                    "/api/salidas",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                salida
                            )

                    }

                );


            let respuesta =
                await respuestaHTTP.json();


            console.log(
                "RESPUESTA SERVIDOR:",
                respuesta
            );


            // =================================================
            // ERROR NORMAL
            // =================================================

            if (
                !respuesta
            ) {

                throw new Error(
                    "El servidor no devolvió respuesta."
                );

            }


            // =================================================
            // SALIDA FRECUENTE
            // =================================================

            if (
                respuesta.requiereConfirmacion
            ) {

                const cantidad =
                    respuesta.cantidad ||
                    4;


                const nombre =
                    `${estudianteSeleccionado.apellidos} ${estudianteSeleccionado.nombres}`;


                const confirmar =
                    window.confirm(

                        `SALIDA FRECUENTE\n\n` +

                        `Estudiante:\n` +

                        `${nombre}\n\n` +

                        `Esta sería su ${cantidad}ª salida ` +

                        `por este motivo durante el día.\n\n` +

                        `¿Desea permitir la salida?`

                    );


                if (!confirmar) {

                    console.log(
                        "Salida cancelada por el docente."
                    );


                    return;

                }


                // =================================================
                // CONFIRMAR SALIDA
                // =================================================

                salida.confirmarSalida =
                    true;


                console.log(
                    "REGISTRANDO SALIDA CONFIRMADA:",
                    salida
                );


                respuestaHTTP =
                    await fetch(

                        "/api/salidas",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    salida
                                )

                        }

                    );


                respuesta =
                    await respuestaHTTP.json();


                console.log(
                    "RESPUESTA CONFIRMACIÓN:",
                    respuesta
                );

            }


            // =================================================
            // VERIFICAR RESULTADO
            // =================================================

            if (
                !respuesta.success
            ) {

                alert(

                    respuesta.message ||

                    respuesta.error ||

                    "No se pudo registrar la salida."

                );


                return;

            }


            // =================================================
            // SALIDA REGISTRADA
            // =================================================

            console.log(
                "Salida registrada correctamente."
            );


            // =================================================
            // LIMPIAR FORMULARIO
            // =================================================

            buscar.value =
                "";


            comboMotivo.value =
                "";


            if (observacion) {

                observacion.value =
                    "";

            }


            estudianteSeleccionado =
                null;


            contenedorResultados.innerHTML =
                "";


            // =================================================
            // ACTUALIZAR SALIDAS ACTIVAS
            // =================================================

            await cargarSalidas();


            // =================================================
            // DEVOLVER FOCO
            // =================================================

            setTimeout(
                () => {

                    buscar.focus();

                },
                100
            );


        } catch (error) {

            console.error(
                "Error registrando salida:",
                error
            );


            alert(
                error.message ||
                "No se pudo registrar la salida."
            );


        } finally {

            botonRegistrar.disabled =
                false;

        }

    }


    // =========================================================
    // CARGAR SALIDAS ACTIVAS
    // =========================================================

    async function cargarSalidas() {

        try {

            console.log(
                "Cargando salidas activas..."
            );


            const respuesta =
                await fetch(
                    "/api/salidas/activas"
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );

            }


            const salidas =
                await respuesta.json();


            console.log(
                "SALIDAS ACTIVAS:",
                salidas
            );


            // =================================================
            // NO HAY SALIDAS
            // =================================================

            if (
                !salidas ||
                salidas.length === 0
            ) {

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


            // =================================================
            // MOSTRAR SALIDAS
            // =================================================

            lista.innerHTML =
                "";


            salidas.forEach(
                salida => {

                    lista.innerHTML += `

                        <div
                            class="salida-card"
                        >

                            <strong>

                                ${escaparHTML(
                                    salida.apellidos
                                )}

                                ${escaparHTML(
                                    salida.nombres
                                )}

                            </strong>


                            <br>


                            <small>

                                ${escaparHTML(
                                    salida.grado
                                )}°

                                ${escaparHTML(
                                    salida.nivel
                                )}

                                -

                                Sección

                                ${escaparHTML(
                                    salida.seccion
                                )}

                            </small>


                            <br><br>


                            <div>

                                Motivo:

                                ${escaparHTML(
                                    salida.motivo
                                )}

                            </div>


                            <div>

                                Hora:

                                ${escaparHTML(
                                    salida.hora_salida
                                )}

                            </div>


                            <button

                                class="btn-retorno"

                                data-id="${salida.id}"

                            >

                                Registrar retorno

                            </button>


                        </div>

                    `;

                }
            );


            // =================================================
            // BOTONES DE RETORNO
            // =================================================

            document
                .querySelectorAll(
                    ".btn-retorno"
                )
                .forEach(
                    boton => {

                        boton.addEventListener(
                            "click",
                            async () => {

                                await registrarRetorno(
                                    Number(
                                        boton.dataset.id
                                    )
                                );

                            }
                        );

                    }
                );


        } catch (error) {

            console.error(
                "Error cargando salidas:",
                error
            );


            lista.innerHTML = `

                <div>

                    Error cargando salidas activas.

                </div>

            `;

        }

    }


    // =========================================================
    // REGISTRAR RETORNO
    // =========================================================

    async function registrarRetorno(id) {

        try {

            console.log(
                "Registrando retorno:",
                id
            );


            const respuesta =
                await fetch(

                    "/api/salidas/retorno/" +
                    id,

                    {

                        method: "PUT"

                    }

                );


            const resultado =
                await respuesta.json();


            console.log(
                "RESPUESTA RETORNO:",
                resultado
            );


            if (
                !resultado.success
            ) {

                alert(

                    resultado.message ||

                    resultado.error ||

                    "No se pudo registrar el retorno."

                );


                return;

            }


            await cargarSalidas();


            buscar.focus();


        } catch (error) {

            console.error(
                "Error registrando retorno:",
                error
            );


            alert(
                "No se pudo registrar el retorno."
            );

        }

    }


})();