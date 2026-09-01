console.log("Módulo Reportes cargado.");

(() => {

    console.log("Sistema de reportes iniciado.");


    // =====================================================
    // ELEMENTOS HTML
    // =====================================================

    const buscar =
        document.getElementById("txtBuscarReporte");

    const listaEstudiantes =
        document.getElementById("listaEstudiantesReporte");

    const resultado =
        document.getElementById("resultadoReporte");

    const btnConsultar =
        document.getElementById("btnReporteEstudiante");

    const btnPDF =
        document.getElementById("btnExportarPDF");

    const ranking =
        document.getElementById("rankingSalidas");


    // =====================================================
    // VERIFICAR ELEMENTOS
    // =====================================================

    if (
        !buscar ||
        !listaEstudiantes ||
        !resultado ||
        !btnConsultar ||
        !btnPDF
    ) {

        console.error(
            "REPORTES: Faltan elementos HTML necesarios."
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

    colocarHistorialAntesDelRanking();

    cargarEstudiantes();

    cargarRanking();



    // =====================================================
    // COLOCAR HISTORIAL ANTES DEL RANKING
    // =====================================================

    function colocarHistorialAntesDelRanking() {

        const contenedorRanking =
            document.getElementById("rankingSalidas");

        const contenedorResultado =
            document.getElementById("resultadoReporte");


        if (
            contenedorRanking &&
            contenedorResultado
        ) {

            const padre =
                contenedorRanking.parentNode;


            if (padre) {

                padre.insertBefore(
                    contenedorResultado,
                    contenedorRanking
                );

                console.log(
                    "REPORTES: Historial colocado antes del ranking."
                );

            }

        }

    }



    // =====================================================
    // CARGAR ESTUDIANTES
    // =====================================================

    async function cargarEstudiantes() {

        try {

            console.log(
                "REPORTES: Cargando estudiantes..."
            );


            // =================================================
            // OPCIÓN 1
            // ELECTRON API
            // =================================================

            if (
                window.electronAPI &&
                typeof window.electronAPI.getStudents === "function"
            ) {

                console.log(
                    "REPORTES: usando electronAPI.getStudents()"
                );


                estudiantes =
                    await window.electronAPI.getStudents();


                if (!Array.isArray(estudiantes)) {

                    throw new Error(
                        "electronAPI.getStudents() no devolvió un arreglo."
                    );

                }


                console.log(
                    "REPORTES: estudiantes cargados:",
                    estudiantes.length
                );


                return;
            }



            // =================================================
            // OPCIÓN 2
            // SERVIDOR
            // =================================================

            console.warn(
                "REPORTES: electronAPI.getStudents no disponible."
            );


            console.log(
                "REPORTES: intentando cargar estudiantes desde API..."
            );


            const urls = [

                "/api/estudiantes",

                "/api/students"

            ];


            let cargado = false;


            for (const url of urls) {

                try {

                    console.log(
                        "REPORTES: probando:",
                        url
                    );


                    const respuesta =
                        await fetch(url);


                    if (!respuesta.ok) {

                        console.warn(
                            "REPORTES:",
                            url,
                            "respondió",
                            respuesta.status
                        );

                        continue;
                    }


                    const datos =
                        await respuesta.json();


                    if (Array.isArray(datos)) {

                        estudiantes = datos;

                        cargado = true;


                        console.log(
                            "REPORTES: estudiantes cargados desde:",
                            url,
                            estudiantes.length
                        );


                        break;
                    }


                } catch (error) {

                    console.warn(
                        "REPORTES: error con",
                        url,
                        error
                    );

                }

            }


            if (!cargado) {

                throw new Error(
                    "No fue posible cargar la lista de estudiantes."
                );

            }


        } catch (error) {

            console.error(
                "REPORTES: Error cargando estudiantes:",
                error
            );


            listaEstudiantes.innerHTML = `

                <div class="resultado-estudiante">

                    No se pudo cargar la lista de estudiantes.

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


        // No borrar el estudiante consultado
        // hasta que realmente se haga una nueva consulta.

        estudianteSeleccionado = null;


        listaEstudiantes.innerHTML = "";


        // =================================================
        // SI ESTÁ VACÍO
        // =================================================

        if (texto === "") {

            return;

        }


        console.log(
            "Buscando estudiante:",
            texto
        );


        // =================================================
        // COMPROBAR ESTUDIANTES
        // =================================================

        if (
            !Array.isArray(estudiantes) ||
            estudiantes.length === 0
        ) {

            console.warn(
                "REPORTES: No hay estudiantes cargados."
            );


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
            estudiantes.filter(estudiante => {


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

                    nombreCompleto.includes(texto) ||

                    nombres.includes(texto) ||

                    apellidos.includes(texto) ||

                    codigo.includes(texto) ||

                    dni.includes(texto)

                );

            });


        console.log(
            "Coincidencias:",
            encontrados.length
        );


        // =================================================
        // SIN RESULTADOS
        // =================================================

        if (encontrados.length === 0) {

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
            .forEach(estudiante => {


                const item =
                    document.createElement("div");


                item.className =
                    "resultado-estudiante";


                item.dataset.id =
                    estudiante.id;


                item.innerHTML = `

                    <strong>

                        ${estudiante.apellidos || ""}

                        ${estudiante.nombres || ""}

                    </strong>

                    <br>

                    <small>

                        ${estudiante.grado || ""}

                        ${estudiante.nivel || ""}

                        -

                        ${estudiante.seccion || ""}

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


                    console.log(
                        "Estudiante seleccionado:",
                        estudianteSeleccionado
                    );

                };


                listaEstudiantes.appendChild(item);

            });

    };



    // =====================================================
    // CONSULTAR HISTORIAL DEL ESTUDIANTE
    // =====================================================

    btnConsultar.onclick = async () => {


        if (!estudianteSeleccionado) {

            alert(
                "Seleccione un estudiante de la lista."
            );

            return;

        }


        try {

            console.log(
                "Consultando reporte del estudiante:",
                estudianteSeleccionado.id
            );


            const respuesta =
                await fetch(
                    `/api/reportes/estudiante/${estudianteSeleccionado.id}`
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );

            }


            const datos =
                await respuesta.json();


            datosReporte =
                Array.isArray(datos)
                    ? datos
                    : [];


            // =================================================
            // GUARDAR ESTUDIANTE CONSULTADO
            // =================================================

            estudianteConsultado =
                estudianteSeleccionado;


            console.log(
                "REPORTES: estudiante consultado:",
                estudianteConsultado
            );


            console.log(
                "REPORTES: registros encontrados:",
                datosReporte.length
            );


            mostrarReporte(
                datosReporte
            );


            // =================================================
            // ACTIVAR PDF
            // =================================================

            btnPDF.disabled = false;


        } catch (error) {

            console.error(
                "Error reporte:",
                error
            );


            resultado.innerHTML = `

                <div class="resultado-estudiante">

                    Error al consultar el historial.

                </div>

            `;

        }

    };



    // =====================================================
    // FORMATEAR FECHA
    // =====================================================

    function formatearFecha(valor) {

        if (!valor) {

            return "-";

        }


        const texto =
            String(valor);


        // ISO:
        // 2026-09-01T15:33:31.122Z

        if (texto.includes("T")) {

            return texto
                .split("T")[0];

        }


        // PostgreSQL:
        // 2026-09-01 15:33:31

        if (texto.includes(" ")) {

            return texto
                .split(" ")[0];

        }


        return texto;

    }



    // =====================================================
    // FORMATEAR HORA
    // =====================================================

    function formatearHora(valor) {

        if (!valor) {

            return null;

        }


        const texto =
            String(valor);


        // ISO

        if (texto.includes("T")) {

            const parteHora =
                texto.split("T")[1];


            if (parteHora) {

                return parteHora
                    .replace("Z", "")
                    .split(".")[0];

            }

        }


        // PostgreSQL

        if (texto.includes(" ")) {

            const partes =
                texto.split(" ");


            if (partes[1]) {

                return partes[1]
                    .split(".")[0];

            }

        }


        return texto;

    }



    // =====================================================
    // MOSTRAR REPORTE
    // =====================================================

    function mostrarReporte(datos) {


        // =================================================
        // SI NO HAY SALIDAS
        // =================================================

        if (
            !datos ||
            datos.length === 0
        ) {

            const estudiante =
                estudianteConsultado ||
                estudianteSeleccionado;


            const nombre =
                estudiante
                    ? `${estudiante.apellidos || ""} ${estudiante.nombres || ""}`
                    : "este estudiante";


            resultado.innerHTML = `

                <div class="resultado-estudiante">

                    <h3>

                        📋 Historial de:

                        ${nombre}

                    </h3>

                    <p>

                        No existen salidas registradas
                        para este estudiante.

                    </p>

                </div>

            `;


            return;

        }


        // =================================================
        // DATOS DEL ESTUDIANTE
        // =================================================

        const estudiante =
            estudianteConsultado ||
            datos[0];


        const nombreCompleto =
            `${estudiante.apellidos || ""} ${estudiante.nombres || ""}`;


        resultado.innerHTML = `

            <h3>

                📋 Historial de:
                ${nombreCompleto}

            </h3>


            <table
                border="1"
                width="100%"
            >

                <thead>

                    <tr>

                        <th>
                            Fecha
                        </th>

                        <th>
                            Hora salida
                        </th>

                        <th>
                            Hora retorno
                        </th>

                        <th>
                            Motivo
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

                        datos.map(item => {


                            const fecha =
                                formatearFecha(
                                    item.hora_salida
                                );


                            const horaSalida =
                                formatearHora(
                                    item.hora_salida
                                ) || "-";


                            const horaRetorno =
                                formatearHora(
                                    item.hora_regreso
                                ) || "Pendiente";


                            return `

                                <tr>

                                    <td>
                                        ${fecha}
                                    </td>

                                    <td>
                                        ${horaSalida}
                                    </td>

                                    <td>
                                        ${horaRetorno}
                                    </td>

                                    <td>
                                        ${item.motivo || "-"}
                                    </td>

                                    <td>
                                        ${item.docente || "-"}
                                    </td>

                                    <td>
                                        ${item.estado || "-"}
                                    </td>

                                </tr>

                            `;

                        }).join("")

                    }

                </tbody>

            </table>

        `;

    }



    // =====================================================
    // RANKING GENERAL
    // =====================================================

    async function cargarRanking() {


        const contenedor =
            document.getElementById(
                "rankingSalidas"
            );


        if (!contenedor) {

            console.log(
                "Elemento rankingSalidas no encontrado."
            );

            return;

        }


        try {

            console.log(
                "Cargando ranking general..."
            );


            const respuesta =
                await fetch(
                    "/api/reportes/ranking"
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );

            }


            const datos =
                await respuesta.json();


            console.log(
                "RANKING GENERAL:",
                datos
            );


            // =================================================
            // GUARDAR RANKING PARA PDF
            // =================================================

            datosRanking =
                Array.isArray(datos)
                    ? datos
                    : [];


            mostrarRanking(
                datosRanking,
                contenedor
            );


        } catch (error) {

            console.error(
                "Error cargando ranking:",
                error
            );


            contenedor.innerHTML = `

                <p>

                    No se pudo cargar el ranking.

                </p>

            `;

        }

    }



    // =====================================================
    // MOSTRAR RANKING
    // =====================================================

    function mostrarRanking(
        datos,
        contenedor
    ) {


        if (
            !datos ||
            datos.length === 0
        ) {

            contenedor.innerHTML = `

                <p>

                    No existen salidas registradas.

                </p>

            `;

            return;

        }


        contenedor.innerHTML = `

            <table
                border="1"
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
                            Total de salidas
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${

                        datos.map(
                            (item, indice) => {

                                return `

                                    <tr>

                                        <td>
                                            ${indice + 1}
                                        </td>

                                        <td>
                                            ${item.apellidos || ""}
                                            ${item.nombres || ""}
                                        </td>

                                        <td>
                                            ${item.grado || ""}
                                            ${item.nivel || ""}
                                        </td>

                                        <td>
                                            ${item.seccion || ""}
                                        </td>

                                        <td>

                                            <strong>
                                                ${item.total_salidas || 0}
                                            </strong>

                                        </td>

                                    </tr>

                                `;

                            }
                        ).join("")

                    }

                </tbody>

            </table>

        `;

    }



    // =====================================================
    // CREAR HTML PARA PDF - ESTUDIANTE
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
                datosReporte.map(item => {


                    const fecha =
                        formatearFecha(
                            item.hora_salida
                        );


                    const salida =
                        formatearHora(
                            item.hora_salida
                        ) || "-";


                    const retorno =
                        formatearHora(
                            item.hora_regreso
                        ) || "Pendiente";


                    return `

                        <tr>

                            <td>
                                ${fecha}
                            </td>

                            <td>
                                ${salida}
                            </td>

                            <td>
                                ${retorno}
                            </td>

                            <td>
                                ${item.motivo || "-"}
                            </td>

                            <td>
                                ${item.docente || "-"}
                            </td>

                            <td>
                                ${item.estado || "-"}
                            </td>

                        </tr>

                    `;

                }).join("");

        } else {

            filas = `

                <tr>

                    <td colspan="6">

                        No existen salidas registradas
                        para este estudiante.

                    </td>

                </tr>

            `;

        }


        return `

            <html>

            <head>

                <meta charset="UTF-8">

                <style>

                    body {

                        font-family: Arial, sans-serif;

                        padding: 30px;

                    }


                    h1,
                    h2 {

                        text-align: center;

                    }


                    h3 {

                        margin-top: 30px;

                    }


                    table {

                        width: 100%;

                        border-collapse: collapse;

                        margin-top: 20px;

                    }


                    th,
                    td {

                        border: 1px solid black;

                        padding: 8px;

                        text-align: center;

                    }


                    th {

                        font-weight: bold;

                    }

                </style>

            </head>


            <body>

                <h1>
                    SGCE
                </h1>


                <h2>
                    Reporte de Salidas
                </h2>


                <h3>
                    Estudiante:
                    ${nombre}
                </h3>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Fecha
                            </th>

                            <th>
                                Hora salida
                            </th>

                            <th>
                                Hora retorno
                            </th>

                            <th>
                                Motivo
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
    // CREAR HTML PARA PDF - RANKING
    // =====================================================

    function crearHTMLRanking() {


        let filas = "";


        if (
            datosRanking &&
            datosRanking.length > 0
        ) {

            filas =
                datosRanking.map(
                    (item, indice) => {

                        return `

                            <tr>

                                <td>
                                    ${indice + 1}
                                </td>

                                <td>
                                    ${item.apellidos || ""}
                                    ${item.nombres || ""}
                                </td>

                                <td>
                                    ${item.grado || ""}
                                    ${item.nivel || ""}
                                </td>

                                <td>
                                    ${item.seccion || ""}
                                </td>

                                <td>
                                    <strong>
                                        ${item.total_salidas || 0}
                                    </strong>
                                </td>

                            </tr>

                        `;

                    }
                ).join("");

        } else {

            filas = `

                <tr>

                    <td colspan="5">

                        No existen salidas registradas.

                    </td>

                </tr>

            `;

        }


        return `

            <html>

            <head>

                <meta charset="UTF-8">

                <style>

                    body {

                        font-family: Arial, sans-serif;

                        padding: 30px;

                    }


                    h1,
                    h2 {

                        text-align: center;

                    }


                    table {

                        width: 100%;

                        border-collapse: collapse;

                        margin-top: 25px;

                    }


                    th,
                    td {

                        border: 1px solid black;

                        padding: 8px;

                        text-align: center;

                    }


                    th {

                        font-weight: bold;

                    }

                </style>

            </head>


            <body>

                <h1>
                    SGCE
                </h1>


                <h2>
                    Ranking de estudiantes
                    con más salidas
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
                                Total de salidas
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
    // EXPORTAR PDF
    // =====================================================

    btnPDF.onclick = async () => {


        let html;


        // =================================================
        // SI EXISTE UNA CONSULTA DE ESTUDIANTE
        // =================================================

        if (estudianteConsultado) {

            console.log(
                "REPORTES: Exportando PDF del estudiante:",
                estudianteConsultado.id
            );


            html =
                crearHTMLReporteEstudiante();

        }


        // =================================================
        // SI NO EXISTE CONSULTA
        // EXPORTAR RANKING
        // =================================================

        else {

            console.log(
                "REPORTES: Exportando PDF del ranking general."
            );


            html =
                crearHTMLRanking();

        }


        // =================================================
        // ELECTRON
        // =================================================

        if (
            window.electronAPI &&
            typeof window.electronAPI.exportarPDF === "function"
        ) {

            try {

                await window.electronAPI.exportarPDF(
                    html
                );


                console.log(
                    "REPORTES: PDF enviado correctamente."
                );


            } catch (error) {

                console.error(
                    "REPORTES: Error exportando PDF:",
                    error
                );


                alert(
                    "No se pudo generar el PDF."
                );

            }

        } else {

            console.error(
                "electronAPI.exportarPDF no está disponible."
            );


            alert(
                "La función de exportar PDF todavía no está conectada."
            );

        }

    };


})();