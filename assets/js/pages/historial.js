(() => {

    console.log("Módulo Historial iniciado.");

    const tabla =
        document.getElementById("tablaHistorial");

    const buscar =
        document.getElementById("txtBuscarHistorial");


    if (!tabla) {

        console.log(
            "Elemento tablaHistorial no encontrado."
        );

        return;

    }


    let registros = [];


    // ==========================
    // INICIO
    // ==========================

    cargarHistorial();


    // ==========================
    // CARGAR HISTORIAL
    // ==========================

    async function cargarHistorial() {

        try {

            console.log(
                "Cargando historial de salidas..."
            );


            const respuesta =
                await fetch(
                    "/api/salidas/historial"
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );

            }


            registros =
                await respuesta.json();


            console.log(
                "HISTORIAL CARGADO:",
                registros
            );


            if (!Array.isArray(registros)) {

                console.error(
                    "El historial recibido no es un arreglo:",
                    registros
                );

                registros = [];

            }


            mostrarHistorial(
                registros
            );


        }
        catch (error) {

            console.error(
                "Error cargando historial:",
                error
            );


            tabla.innerHTML = `

                <div class="empty">

                    <h3>
                        Error cargando historial.
                    </h3>

                    <p>
                        No se pudieron obtener
                        las salidas registradas.
                    </p>

                </div>

            `;

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

            tabla.innerHTML = `

                <div class="empty">

                    <h3>
                        No existen registros.
                    </h3>

                    <p>
                        Aquí aparecerán las salidas registradas.
                    </p>

                </div>

            `;

            return;

        }


        // ==========================
        // PENDIENTES PRIMERO
        // ==========================

        const ordenados =
            [...datos].sort(
                (a, b) => {

                    const aActiva =
                        a.estado === "ACTIVA";

                    const bActiva =
                        b.estado === "ACTIVA";


                    // Las activas van primero

                    if (
                        aActiva &&
                        !bActiva
                    ) {

                        return -1;

                    }


                    if (
                        !aActiva &&
                        bActiva
                    ) {

                        return 1;

                    }


                    // Si tienen el mismo estado,
                    // las más recientes primero

                    return new Date(
                        b.hora_salida
                    ) -
                    new Date(
                        a.hora_salida
                    );

                }
            );


        tabla.innerHTML = "";


        ordenados.forEach(
            salida => {


                let claseEstado;

                let textoEstado;


                // ==========================
                // ESTADO
                // ==========================

                if (
                    salida.estado === "ACTIVA"
                ) {

                    claseEstado =
                        "estado-activa";

                    textoEstado =
                        "🔴 Fuera del aula";

                }
                else {

                    claseEstado =
                        "estado-retornado";

                    textoEstado =
                        "🟢 Retornó al aula";

                }


                // ==========================
                // TARJETA
                // ==========================

                tabla.innerHTML += `

                    <div class="historial-card ${claseEstado}">

                        <h3>

                            ${salida.apellidos ?? ""}
                            ${salida.nombres ?? ""}

                        </h3>


                        <p>

                            📚

                            ${salida.grado ?? ""}°

                            ${salida.nivel ?? ""}

                            -

                            Sección
                            ${salida.seccion ?? ""}

                        </p>


                        <p>

                            🚻 Motivo:

                            ${salida.motivo ?? ""}

                        </p>


                        <p>

                            👤 Registrado por:

                            ${salida.usuario ?? ""}

                        </p>


                        ${
                            salida.observacion
                            ?
                            `
                            <p>
                                📝 Observación:

                                ${salida.observacion}
                            </p>
                            `
                            :
                            ""
                        }


                        <div class="estado">

                            ${textoEstado}

                        </div>


                        <small>

                            🕒 Salida:

                            ${salida.hora_salida ?? ""}

                            <br>


                            🔄 Retorno:

                            ${
                                salida.hora_regreso
                                ??
                                "Pendiente"
                            }

                        </small>


                    </div>

                `;

            }
        );

    }


    // ==========================
    // BUSCAR
    // ==========================

    if (buscar) {

        buscar.oninput = () => {


            const texto =
                buscar.value
                    .toLowerCase()
                    .trim();


            const filtrados =
                registros.filter(
                    salida => {


                        const nombreCompleto =

                            `
                            ${salida.apellidos ?? ""}
                            ${salida.nombres ?? ""}
                            `
                            .toLowerCase();


                        const coincideNombre =
                            nombreCompleto.includes(
                                texto
                            );


                        const coincideMotivo =
                            (
                                salida.motivo ?? ""
                            )
                            .toLowerCase()
                            .includes(
                                texto
                            );


                        const coincideObservacion =
                            (
                                salida.observacion ?? ""
                            )
                            .toLowerCase()
                            .includes(
                                texto
                            );


                        return (

                            coincideNombre ||

                            coincideMotivo ||

                            coincideObservacion

                        );

                    }
                );


            mostrarHistorial(
                filtrados
            );

        };

    }


})();