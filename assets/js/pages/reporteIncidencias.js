console.log(
    "Módulo Reporte de Incidencias cargado."
);


(() => {

    console.log(
        "Sistema de reporte de incidencias iniciado."
    );


    // =====================================================
    // ELEMENTOS HTML
    // =====================================================

    const buscar =
        document.getElementById(
            "txtBuscarReporteIncidencias"
        );


    const listaEstudiantes =
        document.getElementById(
            "listaEstudiantesReporteIncidencias"
        );


    const estudianteSeleccionadoDiv =
        document.getElementById(
            "estudianteSeleccionadoReporteIncidencias"
        );


    const resultado =
        document.getElementById(
            "resultadoReporteIncidencias"
        );


    const btnConsultar =
        document.getElementById(
            "btnConsultarReporteIncidencias"
        );


    const btnPDF =
        document.getElementById(
            "btnExportarPDFReporteIncidencias"
        );


    const ranking =
        document.getElementById(
            "rankingIncidencias"
        );


    // =====================================================
    // VERIFICAR ELEMENTOS
    // =====================================================

    if (
        !buscar ||
        !listaEstudiantes ||
        !resultado ||
        !btnConsultar ||
        !btnPDF ||
        !ranking
    ) {

        console.error(
            "REPORTE INCIDENCIAS: Faltan elementos HTML necesarios."
        );

        return;

    }


    // =====================================================
    // VARIABLES
    // =====================================================

    let estudiantes = [];

    let estudianteSeleccionado = null;

    let estudianteConsultado = null;

    let datosReporte = [];

    let datosRanking = [];


    // =====================================================
    // INICIO
    // =====================================================

    cargarEstudiantes();

    cargarRanking();


    // =====================================================
    // CARGAR ESTUDIANTES
    // =====================================================

    async function cargarEstudiantes() {

        try {

            console.log(
                "REPORTE INCIDENCIAS: Cargando estudiantes..."
            );


            // =================================================
            // ELECTRON
            // =================================================

            if (
                window.electronAPI &&
                typeof window.electronAPI.getStudents === "function"
            ) {

                console.log(
                    "REPORTE INCIDENCIAS: usando Electron."
                );


                estudiantes =
                    await window.electronAPI.getStudents();


                if (
                    !Array.isArray(estudiantes)
                ) {

                    throw new Error(
                        "Electron no devolvió un arreglo de estudiantes."
                    );

                }


                console.log(
                    "Estudiantes cargados:",
                    estudiantes.length
                );


                return;

            }


            // =================================================
            // NAVEGADOR / RENDER
            // =================================================

            console.log(
                "REPORTE INCIDENCIAS: cargando estudiantes desde API."
            );


            const urls = [
                "/api/estudiantes",
                "/api/students"
            ];


            let cargado = false;


            for (
                const url of urls
            ) {

                try {

                    const respuesta =
                        await fetch(
                            url
                        );


                    if (
                        !respuesta.ok
                    ) {

                        continue;

                    }


                    const datos =
                        await respuesta.json();


                    if (
                        Array.isArray(datos)
                    ) {

                        estudiantes =
                            datos;

                        cargado =
                            true;

                        console.log(
                            "Estudiantes cargados desde:",
                            url,
                            estudiantes.length
                        );

                        break;

                    }

                }
                catch (error) {

                    console.warn(
                        "Error cargando:",
                        url,
                        error
                    );

                }

            }


            if (!cargado) {

                throw new Error(
                    "No fue posible cargar los estudiantes."
                );

            }

        }
        catch (error) {

            console.error(
                "REPORTE INCIDENCIAS: Error cargando estudiantes:",
                error
            );


            listaEstudiantes.innerHTML = `

                <div class="resultado-estudiante">

                    No se pudo cargar la lista
                    de estudiantes.

                </div>

            `;

        }

    }


    // =====================================================
    // BUSCAR ESTUDIANTE
    // =====================================================

    buscar.oninput = () => {

        const texto =
            buscar.value
                .toLowerCase()
                .trim();


        estudianteSeleccionado =
            null;


        estudianteSeleccionadoDiv.innerHTML =
            "";


        listaEstudiantes.innerHTML =
            "";


        btnConsultar.disabled =
            true;


        btnPDF.disabled =
            true;


        if (
            texto === ""
        ) {

            return;

        }


        if (
            !Array.isArray(estudiantes) ||
            estudiantes.length === 0
        ) {

            listaEstudiantes.innerHTML = `

                <div class="resultado-estudiante">

                    No hay estudiantes cargados.

                </div>

            `;

            return;

        }


        // =================================================
        // FILTRAR
        // =================================================

        const encontrados =
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


                    const codigo =
                        String(
                            estudiante.codigo || ""
                        )
                        .toLowerCase();


                    const dni =
                        String(
                            estudiante.dni || ""
                        )
                        .toLowerCase();


                    return (

                        nombreCompleto.includes(
                            texto
                        )

                        ||

                        nombres.includes(
                            texto
                        )

                        ||

                        apellidos.includes(
                            texto
                        )

                        ||

                        codigo.includes(
                            texto
                        )

                        ||

                        dni.includes(
                            texto
                        )

                    );

                }
            );


        console.log(
            "Coincidencias:",
            encontrados.length
        );


        // =================================================
        // SIN RESULTADOS
        // =================================================

        if (
            encontrados.length === 0
        ) {

            listaEstudiantes.innerHTML = `

                <div class="resultado-estudiante">

                    No se encontraron estudiantes.

                </div>

            `;

            return;

        }


        // =================================================
        // MOSTRAR RESULTADOS
        // =================================================

        encontrados
            .slice(0, 15)
            .forEach(
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
                                estudiante.apellidos || ""
                            )}

                            ${escaparHTML(
                                estudiante.nombres || ""
                            )}

                        </strong>

                        <br>

                        <small>

                            ${escaparHTML(
                                estudiante.grado || ""
                            )}

                            ${estudiante.grado ? "°" : ""}

                            ${escaparHTML(
                                estudiante.nivel || ""
                            )}

                            -

                            Sección

                            ${escaparHTML(
                                estudiante.seccion || ""
                            )}

                        </small>

                    `;


                    // =================================================
                    // SELECCIONAR
                    // =================================================

                    item.onclick = () => {

                        estudianteSeleccionado =
                            estudiante;


                        buscar.value =
                            `${estudiante.apellidos || ""} ${estudiante.nombres || ""}`;


                        listaEstudiantes.innerHTML =
                            "";


                        estudianteSeleccionadoDiv.innerHTML = `

                            <div class="resultado-estudiante">

                                <strong>
                                    Estudiante seleccionado:
                                </strong>

                                <br>

                                ${escaparHTML(
                                    estudiante.apellidos || ""
                                )}

                                ${escaparHTML(
                                    estudiante.nombres || ""
                                )}

                                <br>

                                <small>

                                    ${escaparHTML(
                                        estudiante.grado || ""
                                    )}

                                    ${estudiante.grado ? "°" : ""}

                                    ${escaparHTML(
                                        estudiante.nivel || ""
                                    )}

                                    -

                                    Sección

                                    ${escaparHTML(
                                        estudiante.seccion || ""
                                    )}

                                </small>

                            </div>

                        `;


                        btnConsultar.disabled =
                            false;


                        btnPDF.disabled =
                            true;


                        console.log(
                            "Estudiante seleccionado:",
                            estudianteSeleccionado
                        );

                    };


                    listaEstudiantes.appendChild(
                        item
                    );

                }
            );

    };


    // =====================================================
    // CONSULTAR ESTUDIANTE
    // =====================================================

    btnConsultar.onclick =
        async () => {

            if (
                !estudianteSeleccionado
            ) {

                alert(
                    "Seleccione un estudiante de la lista."
                );

                return;

            }


            try {

                btnConsultar.disabled =
                    true;


                resultado.innerHTML = `

                    <p>
                        Consultando incidencias...
                    </p>

                `;


                console.log(
                    "Consultando incidencias del estudiante:",
                    estudianteSeleccionado.id
                );


                let datos;


                // =================================================
                // ELECTRON
                // =================================================

                if (
                    window.electronAPI &&
                    typeof window.electronAPI
                        .getReporteIncidenciasEstudiante
                        === "function"
                ) {

                    datos =
                        await window.electronAPI
                            .getReporteIncidenciasEstudiante(
                                estudianteSeleccionado.id
                            );

                }


                // =================================================
                // NAVEGADOR
                // =================================================

                else {

                    const respuesta =
                        await fetch(
                            `/api/incidencias/reporte/estudiante/${estudianteSeleccionado.id}?x=${Date.now()}`
                        );


                    if (
                        !respuesta.ok
                    ) {

                        throw new Error(
                            `Error HTTP ${respuesta.status}`
                        );

                    }


                    datos =
                        await respuesta.json();

                }


                datosReporte =
                    Array.isArray(datos)
                        ? datos
                        : [];


                estudianteConsultado =
                    estudianteSeleccionado;


                console.log(
                    "Incidencias encontradas:",
                    datosReporte.length
                );


                mostrarReporte(
                    datosReporte
                );


                btnPDF.disabled =
                    false;

            }
            catch (error) {

                console.error(
                    "Error consultando reporte de incidencias:",
                    error
                );


                resultado.innerHTML = `

                    <div class="resultado-estudiante">

                        Error al consultar
                        las incidencias.

                    </div>

                `;

            }
            finally {

                btnConsultar.disabled =
                    false;

            }

        };


    // =====================================================
    // MOSTRAR REPORTE DEL ESTUDIANTE
    // =====================================================

    function mostrarReporte(
        datos
    ) {

        const estudiante =
            estudianteConsultado ||
            estudianteSeleccionado;


        const nombre =
            estudiante
                ? `${estudiante.apellidos || ""} ${estudiante.nombres || ""}`
                : "Estudiante";


        if (
            !datos ||
            datos.length === 0
        ) {

            resultado.innerHTML = `

                <div class="resultado-estudiante">

                    <h3>

                        📋 Historial de:

                        ${escaparHTML(
                            nombre
                        )}

                    </h3>

                    <p>

                        No existen incidencias
                        registradas para este estudiante.

                    </p>

                </div>

            `;

            return;

        }


        resultado.innerHTML = `

            <h3>

                📋 Historial de:

                ${escaparHTML(
                    nombre
                )}

            </h3>


            <p>

                Total de incidencias:

                <strong>
                    ${datos.length}
                </strong>

            </p>


            <div style="overflow-x:auto;">

                <table
                    class="tabla"
                    width="100%"
                >

                    <thead>

                        <tr>

                            <th>
                                Fecha
                            </th>

                            <th>
                                Hora
                            </th>

                            <th>
                                Incidencia
                            </th>

                            <th>
                                Descripción
                            </th>

                            <th>
                                Docente
                            </th>

                            <th>
                                Estado
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            datos
                                .map(
                                    item => {

                                        const fecha =
                                            formatearFecha(
                                                item.fecha
                                            );


                                        const hora =
                                            formatearHora(
                                                item.fecha
                                            );


                                        return `

                                            <tr>

                                                <td>
                                                    ${fecha}
                                                </td>

                                                <td>
                                                    ${hora}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        item.incidencia ||
                                                        item.tipo ||
                                                        "-"
                                                    )}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        item.descripcion ||
                                                        "-"
                                                    )}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        item.docente ||
                                                        "-"
                                                    )}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        item.estado ||
                                                        "-"
                                                    )}
                                                </td>

                                            </tr>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    </tbody>

                </table>

            </div>

        `;

    }


    // =====================================================
    // RANKING GENERAL
    // =====================================================

    async function cargarRanking() {

        try {

            console.log(
                "REPORTE INCIDENCIAS: cargando ranking..."
            );


            const respuesta =
                await fetch(
                    `/api/incidencias/ranking?x=${Date.now()}`
                );


            if (
                !respuesta.ok
            ) {

                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );

            }


            const datos =
                await respuesta.json();


            datosRanking =
                Array.isArray(datos)
                    ? datos
                    : [];


            console.log(
                "RANKING INCIDENCIAS:",
                datosRanking
            );


            mostrarRanking(
                datosRanking
            );

        }
        catch (error) {

            console.error(
                "Error cargando ranking de incidencias:",
                error
            );


            ranking.innerHTML = `

                <p>
                    No se pudo cargar el ranking
                    de incidencias.
                </p>

            `;

        }

    }


    // =====================================================
    // MOSTRAR RANKING
    // =====================================================

    function mostrarRanking(
        datos
    ) {

        if (
            !datos ||
            datos.length === 0
        ) {

            ranking.innerHTML = `

                <p>
                    No existen incidencias registradas.
                </p>

            `;

            return;

        }


        ranking.innerHTML = `

            <div style="overflow-x:auto;">

                <table
                    class="tabla"
                    width="100%"
                >

                    <thead>

                        <tr>

                            <th>
                                Puesto
                            </th>

                            <th>
                                Estudiante
                            </th>

                            <th>
                                Grado
                            </th>

                            <th>
                                Sección
                            </th>

                            <th>
                                Total de incidencias
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            datos
                                .map(
                                    (item, indice) => `

                                        <tr>

                                            <td>
                                                ${indice + 1}
                                            </td>

                                            <td>

                                                ${escaparHTML(
                                                    item.apellidos || ""
                                                )}

                                                ${escaparHTML(
                                                    item.nombres || ""
                                                )}

                                            </td>

                                            <td>

                                                ${escaparHTML(
                                                    item.grado || ""
                                                )}

                                                ${item.grado ? "°" : ""}

                                                ${escaparHTML(
                                                    item.nivel || ""
                                                )}

                                            </td>

                                            <td>

                                                ${escaparHTML(
                                                    item.seccion || ""
                                                )}

                                            </td>

                                            <td>

                                                <strong>

                                                    ${
                                                        Number(
                                                            item.total_incidencias ||
                                                            0
                                                        )
                                                    }

                                                </strong>

                                            </td>

                                        </tr>

                                    `
                                )
                                .join("")
                        }

                    </tbody>

                </table>

            </div>

        `;

    }


    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    function formatearFecha(
        valor
    ) {

        if (!valor) {

            return "-";

        }


        try {

            const fecha =
                new Date(
                    valor
                );


            if (
                isNaN(
                    fecha.getTime()
                )
            ) {

                return String(
                    valor
                ).split(
                    " "
                )[0];

            }


            return new Intl.DateTimeFormat(
                "es-PE",
                {
                    timeZone:
                        "America/Lima",

                    year:
                        "numeric",

                    month:
                        "2-digit",

                    day:
                        "2-digit"
                }
            ).format(
                fecha
            );

        }
        catch (error) {

            return String(
                valor
            );

        }

    }


    // =====================================================
    // FORMATEAR HORA
    // =====================================================

    function formatearHora(
        valor
    ) {

        if (!valor) {

            return "-";

        }


        try {

            const fecha =
                new Date(
                    valor
                );


            if (
                isNaN(
                    fecha.getTime()
                )
            ) {

                const texto =
                    String(
                        valor
                    );


                if (
                    texto.includes(" ")
                ) {

                    return texto
                        .split(" ")[1]
                        .split(".")[0];

                }


                return "-";

            }


            return new Intl.DateTimeFormat(
                "es-PE",
                {
                    timeZone:
                        "America/Lima",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hour12:
                        false
                }
            ).format(
                fecha
            );

        }
        catch (error) {

            return "-";

        }

    }


    // =====================================================
    // CREAR HTML PDF - ESTUDIANTE
    // =====================================================

    function crearHTMLReporteEstudiante() {

        const estudiante =
            estudianteConsultado ||
            estudianteSeleccionado;


        const nombre =
            estudiante
                ? `${estudiante.apellidos || ""} ${estudiante.nombres || ""}`
                : "Estudiante";


        let filas = "";


        if (
            datosReporte &&
            datosReporte.length > 0
        ) {

            filas =
                datosReporte
                    .map(
                        item => {

                            return `

                                <tr>

                                    <td>
                                        ${formatearFecha(
                                            item.fecha
                                        )}
                                    </td>

                                    <td>
                                        ${formatearHora(
                                            item.fecha
                                        )}
                                    </td>

                                    <td>
                                        ${escaparHTML(
                                            item.incidencia ||
                                            item.tipo ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${escaparHTML(
                                            item.descripcion ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${escaparHTML(
                                            item.docente ||
                                            "-"
                                        )}
                                    </td>

                                    <td>
                                        ${escaparHTML(
                                            item.estado ||
                                            "-"
                                        )}
                                    </td>

                                </tr>

                            `;

                        }
                    )
                    .join("");

        }
        else {

            filas = `

                <tr>

                    <td colspan="6">

                        No existen incidencias
                        registradas para este estudiante.

                    </td>

                </tr>

            `;

        }


        return `

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <style>

                    body {

                        font-family:
                            Arial,
                            sans-serif;

                        padding:
                            30px;

                    }


                    h1,
                    h2 {

                        text-align:
                            center;

                    }


                    h3 {

                        margin-top:
                            30px;

                    }


                    table {

                        width:
                            100%;

                        border-collapse:
                            collapse;

                        margin-top:
                            20px;

                    }


                    th,
                    td {

                        border:
                            1px solid black;

                        padding:
                            8px;

                        text-align:
                            center;

                    }


                    th {

                        font-weight:
                            bold;

                    }

                </style>

            </head>


            <body>

                <h1>
                    SGCE
                </h1>


                <h2>
                    Reporte de Incidencias
                </h2>


                <h3>

                    Estudiante:

                    ${escaparHTML(
                        nombre
                    )}

                </h3>


                <p>

                    Total de incidencias:

                    <strong>
                        ${datosReporte.length}
                    </strong>

                </p>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Fecha
                            </th>

                            <th>
                                Hora
                            </th>

                            <th>
                                Incidencia
                            </th>

                            <th>
                                Descripción
                            </th>

                            <th>
                                Docente
                            </th>

                            <th>
                                Estado
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${filas}

                    </tbody>

                </table>

            </body>

            </html>

        `;

    }


    // =====================================================
    // CREAR HTML PDF - RANKING
    // =====================================================

    function crearHTMLRanking() {

        let filas = "";


        if (
            datosRanking &&
            datosRanking.length > 0
        ) {

            filas =
                datosRanking
                    .map(
                        (item, indice) => `

                            <tr>

                                <td>
                                    ${indice + 1}
                                </td>

                                <td>

                                    ${escaparHTML(
                                        item.apellidos || ""
                                    )}

                                    ${escaparHTML(
                                        item.nombres || ""
                                    )}

                                </td>

                                <td>

                                    ${escaparHTML(
                                        item.grado || ""
                                    )}

                                    ${item.grado ? "°" : ""}

                                    ${escaparHTML(
                                        item.nivel || ""
                                    )}

                                </td>

                                <td>

                                    ${escaparHTML(
                                        item.seccion || ""
                                    )}

                                </td>

                                <td>

                                    <strong>

                                        ${
                                            Number(
                                                item.total_incidencias ||
                                                0
                                            )
                                        }

                                    </strong>

                                </td>

                            </tr>

                        `
                    )
                    .join("");

        }
        else {

            filas = `

                <tr>

                    <td colspan="5">

                        No existen incidencias
                        registradas.

                    </td>

                </tr>

            `;

        }


        return `

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <style>

                    body {

                        font-family:
                            Arial,
                            sans-serif;

                        padding:
                            30px;

                    }


                    h1,
                    h2 {

                        text-align:
                            center;

                    }


                    table {

                        width:
                            100%;

                        border-collapse:
                            collapse;

                        margin-top:
                            25px;

                    }


                    th,
                    td {

                        border:
                            1px solid black;

                        padding:
                            8px;

                        text-align:
                            center;

                    }


                    th {

                        font-weight:
                            bold;

                    }

                </style>

            </head>


            <body>

                <h1>
                    SGCE
                </h1>


                <h2>

                    Ranking de estudiantes
                    con más incidencias

                </h2>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Puesto
                            </th>

                            <th>
                                Estudiante
                            </th>

                            <th>
                                Grado
                            </th>

                            <th>
                                Sección
                            </th>

                            <th>
                                Total de incidencias
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${filas}

                    </tbody>

                </table>

            </body>

            </html>

        `;

    }


    // =====================================================
    // GENERAR PDF
    // =====================================================

    btnPDF.onclick =
        async () => {

            let html;


            // =================================================
            // PDF DEL ESTUDIANTE
            // =================================================

            if (
                estudianteConsultado
            ) {

                console.log(
                    "REPORTE INCIDENCIAS: PDF estudiante:",
                    estudianteConsultado.id
                );


                html =
                    crearHTMLReporteEstudiante();

            }


            // =================================================
            // PDF DEL RANKING
            // =================================================

            else {

                console.log(
                    "REPORTE INCIDENCIAS: PDF ranking."
                );


                html =
                    crearHTMLRanking();

            }


            // =================================================
            // ELECTRON
            // =================================================

            if (
                window.electronAPI &&
                typeof window.electronAPI.exportarPDF
                    === "function"
            ) {

                try {

                    await window.electronAPI
                        .exportarPDF(
                            html
                        );


                    console.log(
                        "PDF generado correctamente."
                    );


                }
                catch (error) {

                    console.error(
                        "Error generando PDF:",
                        error
                    );


                    alert(
                        "No se pudo generar el PDF."
                    );

                }


                return;

            }


            // =================================================
            // CHROME / RENDER
            // =================================================

            const ventana =
                window.open(
                    "",
                    "_blank"
                );


            if (!ventana) {

                alert(
                    "El navegador bloqueó la ventana de impresión."
                );

                return;

            }


            ventana.document.write(
                html
            );


            ventana.document.close();


            ventana.focus();


            setTimeout(
                () => {

                    ventana.print();

                },
                500
            );

        };


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

    function escaparHTML(
        valor
    ) {

        if (
            valor === null ||
            valor === undefined
        ) {

            return "";

        }


        return String(
            valor
        )
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