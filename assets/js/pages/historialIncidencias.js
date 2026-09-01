console.log("Módulo Historial Incidencias cargado.");


(() => {

    console.log(
        "Sistema historial de incidencias iniciado."
    );


    const resultado =
        document.getElementById(
            "resultadoHistorialIncidencias"
        );


    const btnActualizar =
        document.getElementById(
            "btnActualizarIncidencias"
        );


    if (!resultado) {

        console.log(
            "Faltan elementos historial incidencias"
        );

        return;

    }


    // ==========================
    // INICIO
    // ==========================

    cargarHistorial();


    // ==========================
    // BOTÓN ACTUALIZAR
    // ==========================

    if (btnActualizar) {

        btnActualizar.onclick = () => {

            cargarHistorial();

        };

    }


    // ==========================
    // CARGAR HISTORIAL
    // ==========================

    async function cargarHistorial() {

        try {

            resultado.innerHTML = `

                <p>
                    Cargando incidencias...
                </p>

            `;


            let datos;


            // ==========================
            // ELECTRON
            // ==========================

            if (
                window.electronAPI &&
                typeof window.electronAPI
                    .getIncidenciasHoy === "function"
            ) {

                console.log(
                    "HISTORIAL INCIDENCIAS: cargando mediante Electron."
                );


                datos =
                    await window.electronAPI
                        .getIncidenciasHoy();

            }


            // ==========================
            // NAVEGADOR / API
            // ==========================

            else {

                console.log(
                    "HISTORIAL INCIDENCIAS: cargando mediante API."
                );


                const respuesta =
                    await fetch(
                        "/api/incidencias/hoy"
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "Error HTTP: " +
                        respuesta.status
                    );

                }


                datos =
                    await respuesta.json();

            }


            console.log(
                "Incidencias recibidas:",
                datos
            );


            mostrarHistorial(datos);


        } catch (error) {

            console.error(
                "Error cargando historial:",
                error
            );


            resultado.innerHTML = `

                <p>
                    Error al cargar incidencias.
                </p>

            `;

        }

    }


    // ==========================
    // CONVERTIR FECHA A
    // HORA DE PERÚ
    // ==========================

    function obtenerFechaHoraPeru(fecha) {

        if (!fecha) {

            return {
                fecha: "-",
                hora: "-"
            };

        }


        try {

            const fechaObjeto =
                new Date(fecha);


            if (isNaN(fechaObjeto.getTime())) {

                console.warn(
                    "Fecha inválida:",
                    fecha
                );


                return {
                    fecha: "-",
                    hora: "-"
                };

            }


            const partes =
                new Intl.DateTimeFormat(
                    "es-PE",
                    {
                        timeZone:
                            "America/Lima",

                        year:
                            "numeric",

                        month:
                            "2-digit",

                        day:
                            "2-digit",

                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        second:
                            "2-digit",

                        hour12:
                            false
                    }
                ).formatToParts(
                    fechaObjeto
                );


            const valores = {};


            partes.forEach(parte => {

                if (
                    parte.type !== "literal"
                ) {

                    valores[parte.type] =
                        parte.value;

                }

            });


            return {

                fecha:
                    `${valores.day}/${valores.month}/${valores.year}`,

                hora:
                    `${valores.hour}:${valores.minute}:${valores.second}`

            };


        } catch (error) {

            console.error(
                "Error convirtiendo fecha:",
                error
            );


            return {
                fecha: "-",
                hora: "-"
            };

        }

    }


    // ==========================
    // MOSTRAR HISTORIAL
    // ==========================

    function mostrarHistorial(datos) {


        if (
            !datos ||
            datos.length === 0
        ) {

            resultado.innerHTML = `

                <p>
                    No existen incidencias registradas hoy.
                </p>

            `;

            return;

        }


        let html = `

            <table class="tabla">

                <thead>

                    <tr>

                        <th>
                            Hora
                        </th>

                        <th>
                            Estudiante
                        </th>

                        <th>
                            Grado
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

        `;


        datos.forEach(item => {


            // ==========================
            // FECHA/HORA PERÚ
            // ==========================

            const fechaHora =
                obtenerFechaHoraPeru(
                    item.fecha
                );


            // ==========================
            // ESTUDIANTE
            // ==========================

            const estudiante =
                `${item.apellidos || ""} ${item.nombres || ""}`
                    .trim();


            // ==========================
            // GRADO Y SECCIÓN
            // ==========================

            const grado =
                `${item.grado || ""} ${item.seccion || ""}`
                    .trim();


            html += `

                <tr>

                    <td>
                        ${fechaHora.hora}
                    </td>


                    <td>
                        ${escapeHtml(estudiante)}
                    </td>


                    <td>
                        ${escapeHtml(grado)}
                    </td>


                    <td>
                        ${escapeHtml(
                            item.incidencia || "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            item.descripcion || "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            item.docente || "-"
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            item.estado || "-"
                        )}
                    </td>

                </tr>

            `;

        });


        html += `

                </tbody>

            </table>

        `;


        resultado.innerHTML = html;

    }


    // ==========================
    // PROTEGER HTML
    // ==========================

    function escapeHtml(valor) {

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


})();