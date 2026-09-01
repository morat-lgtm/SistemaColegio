(() => {

    console.log("Módulo Estudiantes iniciado.");


    const lista =
        document.getElementById("listaEstudiantes");

    const botonImportar =
        document.getElementById("btnImportar");


    if (!lista) {

        console.error(
            "No se encontró #listaEstudiantes."
        );

        return;

    }


    cargarEstudiantes();


    // ==========================
    // IMPORTAR EXCEL
    // ==========================

    if (botonImportar) {

        botonImportar.addEventListener(
            "click",
            async () => {

                console.log(
                    "Importar Excel seleccionado."
                );


                alert(
                    "La importación de Excel la conectaremos en el siguiente paso."
                );

            }
        );

    }


    // ==========================
    // CARGAR ESTUDIANTES
    // ==========================

    async function cargarEstudiantes() {

        try {

            console.log(
                "Obteniendo configuración de la computadora..."
            );


            // ==========================
            // 1. OBTENER WORKSTATION
            // ==========================

            const respuestaWorkstation =
                await fetch(
                    "/api/workstation"
                );


            if (!respuestaWorkstation.ok) {

                throw new Error(
                    "No se pudo obtener la configuración de la computadora."
                );

            }


            const workstation =
                await respuestaWorkstation.json();


            console.log(
                "WORKSTATION:",
                workstation
            );


            // ==========================
            // 2. VERIFICAR AMBIENTE
            // ==========================

            if (
                !workstation ||
                !workstation.ambiente_id
            ) {

                lista.innerHTML = `

                    <p>
                        No hay un ambiente configurado
                        para esta computadora.
                    </p>

                `;

                return;

            }


            const ambienteId =
                workstation.ambiente_id;


            console.log(
                "Ambiente actual:",
                ambienteId
            );


            // ==========================
            // 3. OBTENER ESTUDIANTES
            // ==========================

            const respuestaEstudiantes =
                await fetch(
                    `/api/students/ambiente/${ambienteId}`
                );


            if (!respuestaEstudiantes.ok) {

                throw new Error(
                    "No se pudieron obtener los estudiantes."
                );

            }


            const estudiantes =
                await respuestaEstudiantes.json();


            console.log(
                "ESTUDIANTES:",
                estudiantes
            );


            // ==========================
            // 4. VERIFICAR RESULTADOS
            // ==========================

            if (
                !Array.isArray(estudiantes) ||
                estudiantes.length === 0
            ) {

                lista.innerHTML = `

                    <p>
                        No hay estudiantes registrados
                        en este ambiente.
                    </p>

                `;

                return;

            }


            // ==========================
            // 5. MOSTRAR ESTUDIANTES
            // ==========================

            lista.innerHTML = "";


            estudiantes.forEach(
                estudiante => {


                    const tarjeta =
                        document.createElement("div");


                    tarjeta.className =
                        "student-card";


                    tarjeta.innerHTML = `

                        <h3>
                            ${escaparHTML(
                                estudiante.apellidos || ""
                            )}
                        </h3>


                        <p>
                            ${escaparHTML(
                                estudiante.nombres || ""
                            )}
                        </p>


                        <small>

                            ${escaparHTML(
                                estudiante.grado || ""
                            )}°

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


                    lista.appendChild(
                        tarjeta
                    );


                }
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


            lista.innerHTML = `

                <p>
                    Error cargando estudiantes.
                </p>

            `;

        }

    }


    // ==========================
    // ESCAPAR HTML
    // ==========================

    function escaparHTML(valor) {

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


})();