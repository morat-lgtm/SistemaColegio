console.log("Módulo Incidencias cargado.");

(() => {

    console.log(
        "Sistema de incidencias iniciado."
    );


    // =========================================================
    // ELEMENTOS
    // =========================================================

    const buscarEstudiante =
        document.getElementById(
            "txtBuscarEstudianteIncidencia"
        );

    const resultadoEstudiante =
        document.getElementById(
            "resultadoEstudianteIncidencia"
        );

    const estudianteSeleccionadoDiv =
        document.getElementById(
            "estudianteSeleccionadoIncidencia"
        );

    const buscarIncidencia =
        document.getElementById(
            "txtBuscarIncidencia"
        );

    const resultadoIncidencia =
        document.getElementById(
            "resultadoTipoIncidencia"
        );

    const incidenciaSeleccionadaDiv =
        document.getElementById(
            "incidenciaSeleccionada"
        );

    const descripcion =
        document.getElementById(
            "txtDescripcionIncidencia"
        );

    const btnRegistrar =
        document.getElementById(
            "btnRegistrarIncidencia"
        );


    if (
        !buscarEstudiante ||
        !buscarIncidencia ||
        !btnRegistrar
    ) {

        console.error(
            "Faltan elementos de incidencias."
        );

        return;
    }


    // =========================================================
    // VARIABLES
    // =========================================================

    let estudiantes = [];

    let tiposIncidencia = [];

    let estudianteSeleccionado = null;

    let incidenciaSeleccionada = null;


    // =========================================================
    // INICIAR
    // =========================================================

    cargarEstudiantes();

    cargarTiposIncidencia();


    // =========================================================
    // CARGAR ESTUDIANTES
    // =========================================================

    async function cargarEstudiantes() {

        try {

            console.log(
                "INCIDENCIAS: Cargando estudiantes..."
            );


            // =================================================
            // ELECTRON
            // =================================================

            if (
                window.electronAPI &&
                typeof window.electronAPI.getStudents === "function"
            ) {

                console.log(
                    "INCIDENCIAS: usando electronAPI.getStudents()"
                );


                estudiantes =
                    await window.electronAPI.getStudents();


                if (!Array.isArray(estudiantes)) {

                    throw new Error(
                        "electronAPI.getStudents() no devolvió un arreglo."
                    );

                }


                console.log(
                    "INCIDENCIAS: estudiantes cargados:",
                    estudiantes.length
                );


                return;
            }


            // =================================================
            // SERVIDOR / CHROME
            // =================================================

            console.warn(
                "INCIDENCIAS: electronAPI.getStudents no disponible."
            );


            console.log(
                "INCIDENCIAS: cargando estudiantes desde API..."
            );


            const respuesta =
                await fetch(
                    "/api/students"
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status} al cargar estudiantes.`
                );

            }


            const datos =
                await respuesta.json();


            if (!Array.isArray(datos)) {

                throw new Error(
                    "La API de estudiantes no devolvió un arreglo."
                );

            }


            estudiantes =
                datos;


            console.log(
                "INCIDENCIAS: estudiantes cargados desde API:",
                estudiantes.length
            );


        } catch (error) {

            console.error(
                "INCIDENCIAS: Error estudiantes:",
                error
            );


            resultadoEstudiante.innerHTML = `
                <div class="resultado-estudiante">
                    No se pudo cargar la lista de estudiantes.
                </div>
            `;

        }

    }


    // =========================================================
    // CARGAR TIPOS DE INCIDENCIA
    // =========================================================

    async function cargarTiposIncidencia() {

        try {

            console.log(
                "INCIDENCIAS: Cargando tipos de incidencia..."
            );


            // =================================================
            // ELECTRON
            // =================================================

            if (
                window.electronAPI &&
                typeof window.electronAPI.getTiposIncidencia === "function"
            ) {

                console.log(
                    "INCIDENCIAS: usando electronAPI.getTiposIncidencia()"
                );


                tiposIncidencia =
                    await window.electronAPI
                    .getTiposIncidencia();


                if (!Array.isArray(tiposIncidencia)) {

                    throw new Error(
                        "electronAPI.getTiposIncidencia() no devolvió un arreglo."
                    );

                }


                console.log(
                    "INCIDENCIAS: tipos cargados:",
                    tiposIncidencia.length
                );


                return;
            }


            // =================================================
            // SERVIDOR / CHROME
            // =================================================

            console.warn(
                "INCIDENCIAS: electronAPI.getTiposIncidencia no disponible."
            );


            console.log(
                "INCIDENCIAS: cargando tipos desde API..."
            );


            const respuesta =
                await fetch(
                    "/api/incidencias/tipos"
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status} al cargar tipos de incidencia.`
                );

            }


            const datos =
                await respuesta.json();


            if (!Array.isArray(datos)) {

                throw new Error(
                    "La API de tipos de incidencia no devolvió un arreglo."
                );

            }


            tiposIncidencia =
                datos;


            console.log(
                "INCIDENCIAS: tipos cargados desde API:",
                tiposIncidencia.length
            );


        } catch (error) {

            console.error(
                "INCIDENCIAS: Error cargando incidencias:",
                error
            );


            resultadoIncidencia.innerHTML = `
                <div class="resultado-estudiante">
                    No se pudieron cargar los tipos de incidencia.
                </div>
            `;

        }

    }


    // =========================================================
    // OBTENER WORKSTATION
    // =========================================================

    async function obtenerWorkstation() {

        console.log(
            "INCIDENCIAS: Obteniendo workstation desde /api/workstation..."
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
            "INCIDENCIAS - WORKSTATION:",
            workstation
        );


        if (
            !workstation ||
            !workstation.id
        ) {

            throw new Error(
                "No se encontró la workstation de esta computadora."
            );

        }


        return workstation;

    }


    // =========================================================
    // BUSCAR ESTUDIANTE
    // =========================================================

    buscarEstudiante.oninput = () => {

        const texto =
            buscarEstudiante.value
                .toLowerCase()
                .trim();


        estudianteSeleccionado =
            null;


        estudianteSeleccionadoDiv.innerHTML =
            "";


        resultadoEstudiante.innerHTML =
            "";


        if (texto === "") {

            return;

        }


        const encontrados =
            estudiantes.filter(
                estudiante => {

                    const apellidos =
                        String(
                            estudiante.apellidos || ""
                        ).toLowerCase();


                    const nombres =
                        String(
                            estudiante.nombres || ""
                        ).toLowerCase();


                    const nombreCompleto =
                        `${apellidos} ${nombres}`;


                    return (
                        apellidos.includes(texto) ||
                        nombres.includes(texto) ||
                        nombreCompleto.includes(texto)
                    );

                }
            );


        if (encontrados.length === 0) {

            resultadoEstudiante.innerHTML = `
                <div class="resultado-estudiante">
                    No se encontraron estudiantes.
                </div>
            `;

            return;

        }


        encontrados.forEach(
            estudiante => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "resultado-estudiante";


                item.dataset.id =
                    estudiante.id;


                item.innerHTML = `
                    <strong>
                        ${escaparHTML(
                            estudiante.apellidos
                        )}
                        ${escaparHTML(
                            estudiante.nombres
                        )}
                    </strong>
                    <br>
                    ${escaparHTML(
                        estudiante.grado
                    )}
                    ${escaparHTML(
                        estudiante.nivel
                    )}
                    -
                    Sección
                    ${escaparHTML(
                        estudiante.seccion
                    )}
                `;


                item.onclick = () => {

                    seleccionarEstudiante(
                        estudiante
                    );

                };


                resultadoEstudiante.appendChild(
                    item
                );

            }
        );

    };


    // =========================================================
    // SELECCIONAR ESTUDIANTE
    // =========================================================

    function seleccionarEstudiante(
        estudiante
    ) {

        estudianteSeleccionado =
            estudiante;


        console.log(
            "Estudiante seleccionado:",
            estudianteSeleccionado
        );


        buscarEstudiante.value =
            `${estudiante.apellidos} ${estudiante.nombres}`;


        resultadoEstudiante.innerHTML =
            "";


        estudianteSeleccionadoDiv.innerHTML = `
            <p>
                <strong>
                    Estudiante seleccionado:
                </strong>
                <br>
                ${escaparHTML(
                    estudiante.apellidos
                )}
                ${escaparHTML(
                    estudiante.nombres
                )}
                <br>
                ${escaparHTML(
                    estudiante.grado
                )}
                ${escaparHTML(
                    estudiante.nivel
                )}
                -
                Sección
                ${escaparHTML(
                    estudiante.seccion
                )}
            </p>
        `;

    }


    // =========================================================
    // BUSCAR INCIDENCIA
    // =========================================================

    buscarIncidencia.oninput = () => {

        const texto =
            buscarIncidencia.value
                .toLowerCase()
                .trim();


        incidenciaSeleccionada =
            null;


        incidenciaSeleccionadaDiv.innerHTML =
            "";


        resultadoIncidencia.innerHTML =
            "";


        if (texto === "") {

            return;

        }


        const encontrados =
            tiposIncidencia.filter(
                item => {

                    const nombre =
                        String(
                            item.nombre || ""
                        ).toLowerCase();


                    return nombre.includes(
                        texto
                    );

                }
            );


        if (encontrados.length === 0) {

            resultadoIncidencia.innerHTML = `
                <div class="resultado-estudiante">
                    No se encontraron incidencias.
                </div>
            `;

            return;

        }


        encontrados.forEach(
            item => {

                const elemento =
                    document.createElement(
                        "div"
                    );


                elemento.className =
                    "resultado-estudiante";


                elemento.dataset.id =
                    item.id;


                elemento.innerHTML =
                    escaparHTML(
                        item.nombre
                    );


                elemento.onclick = () => {

                    seleccionarIncidencia(
                        item
                    );

                };


                resultadoIncidencia.appendChild(
                    elemento
                );

            }
        );

    };


    // =========================================================
    // SELECCIONAR INCIDENCIA
    // =========================================================

    function seleccionarIncidencia(
        incidencia
    ) {

        incidenciaSeleccionada =
            incidencia;


        console.log(
            "Incidencia seleccionada:",
            incidenciaSeleccionada
        );


        buscarIncidencia.value =
            incidencia.nombre;


        resultadoIncidencia.innerHTML =
            "";


        incidenciaSeleccionadaDiv.innerHTML = `
            <p>
                <strong>
                    Incidencia seleccionada:
                </strong>
                <br>
                ${escaparHTML(
                    incidencia.nombre
                )}
            </p>
        `;

    }


    // =========================================================
    // REGISTRAR INCIDENCIA
    // =========================================================

    btnRegistrar.onclick =
        async () => {

            // =================================================
            // VALIDAR ESTUDIANTE
            // =================================================

            if (!estudianteSeleccionado) {

                alert(
                    "Seleccione un estudiante."
                );

                buscarEstudiante.focus();

                return;

            }


            // =================================================
            // VALIDAR INCIDENCIA
            // =================================================

            if (!incidenciaSeleccionada) {

                alert(
                    "Seleccione una incidencia."
                );

                buscarIncidencia.focus();

                return;

            }


            const textoDescripcion =
                descripcion.value.trim();


            try {

                btnRegistrar.disabled =
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


                console.log(
                    "INCIDENCIAS - WORKSTATION PARA REGISTRAR:",
                    workstation
                );


                // =================================================
                // OBTENER SESSION ID
                // =================================================

                const sessionId =
                    localStorage.getItem(
                        "sessionId"
                    );


                if (!sessionId) {

                    throw new Error(
                        "No existe una sesión activa."
                    );

                }


                // =================================================
                // DATOS
                // =================================================

                const datos = {

                    sessionId:
                        sessionId,

                    estudiante_id:
                        estudianteSeleccionado.id,

                    tipo_id:
                        incidenciaSeleccionada.id,

                    descripcion:
                        textoDescripcion,

                    workstation_id:
                        workstation.id

                };


                console.log(
                    "INCIDENCIAS - DATOS A REGISTRAR:",
                    datos
                );


                // =================================================
                // ELECTRON
                // =================================================

                if (
                    window.electronAPI &&
                    typeof window.electronAPI.registrarIncidencia === "function"
                ) {

                    console.log(
                        "INCIDENCIAS: registrando mediante Electron."
                    );


                    const respuesta =
                        await window.electronAPI
                        .registrarIncidencia(
                            datos
                        );


                    console.log(
                        "Incidencia registrada:",
                        respuesta
                    );

                }


                // =================================================
                // SERVIDOR / CHROME
                // =================================================

                else {

                    console.log(
                        "INCIDENCIAS: registrando mediante API."
                    );


                    const respuesta =
                        await fetch(
                            "/api/incidencias",
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        datos
                                    )
                            }
                        );


                    const resultado =
                        await respuesta.json();


                    console.log(
                        "RESPUESTA DEL SERVIDOR:",
                        resultado
                    );


                    if (!respuesta.ok) {

                        throw new Error(
                            resultado.error ||
                            `Error HTTP ${respuesta.status}`
                        );

                    }

                }


                // =================================================
                // ÉXITO
                // =================================================

                alert(
                    "Incidencia registrada correctamente."
                );


                // =================================================
                // LIMPIAR FORMULARIO
                // =================================================

                buscarEstudiante.value =
                    "";


                buscarIncidencia.value =
                    "";


                descripcion.value =
                    "";


                estudianteSeleccionado =
                    null;


                incidenciaSeleccionada =
                    null;


                estudianteSeleccionadoDiv.innerHTML =
                    "";


                incidenciaSeleccionadaDiv.innerHTML =
                    "";


                resultadoEstudiante.innerHTML =
                    "";


                resultadoIncidencia.innerHTML =
                    "";


            } catch (error) {

                console.error(
                    "Error registrando incidencia:",
                    error
                );


                alert(
                    "No se pudo registrar la incidencia.\n\n" +
                    error.message
                );


            } finally {

                btnRegistrar.disabled =
                    false;

            }

        };


    // =========================================================
    // ESCAPAR HTML
    // =========================================================

    function escaparHTML(
        valor
    ) {

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


})();