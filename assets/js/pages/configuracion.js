(() => {

    console.log("Módulo Configuración iniciado.");


    const hostname =
        document.getElementById("txtHostname");

    const combo =
        document.getElementById("cmbAmbiente");

    const boton =
        document.getElementById("btnGuardarWorkstation");

    const mensaje =
        document.getElementById("mensajeConfiguracion");


    if (!combo || !boton) {

        console.error(
            "No se encontraron los elementos de configuración."
        );

        return;

    }


    iniciar();


    // ==========================
    // INICIAR CONFIGURACIÓN
    // ==========================

    async function iniciar() {

        try {

            console.log(
                "Iniciando configuración..."
            );


            // ==========================
            // OBTENER HOSTNAME
            // ==========================

            if (hostname) {

                hostname.textContent =
                    "Cargando...";


                const respuestaHostname =
                    await fetch(
                        "/api/workstation/hostname"
                    );


                if (!respuestaHostname.ok) {

                    throw new Error(
                        "No se pudo obtener el nombre de la computadora."
                    );

                }


                const datosHostname =
                    await respuestaHostname.json();


                console.log(
                    "HOSTNAME:",
                    datosHostname
                );


                hostname.textContent =
                    datosHostname.hostname || "No disponible";

            }


            // ==========================
            // CARGAR AMBIENTES
            // ==========================

            console.log(
                "Cargando ambientes..."
            );


            const respuestaAmbientes =
                await fetch(
                    "/api/workstation/ambientes"
                );


            if (!respuestaAmbientes.ok) {

                throw new Error(
                    "No se pudieron cargar los ambientes."
                );

            }


            const ambientes =
                await respuestaAmbientes.json();


            console.log(
                "AMBIENTES:",
                ambientes
            );


            // ==========================
            // LIMPIAR COMBO
            // ==========================

            combo.innerHTML = `

                <option value="">
                    Seleccione ambiente
                </option>

            `;


            // ==========================
            // MOSTRAR AMBIENTES
            // ==========================

            if (Array.isArray(ambientes)) {

                ambientes.forEach(item => {

                    const opcion =
                        document.createElement("option");


                    opcion.value =
                        item.id;


                    opcion.textContent =
                        item.nombre;


                    combo.appendChild(
                        opcion
                    );

                });

            }


            // ==========================
            // OBTENER CONFIGURACIÓN ACTUAL
            // ==========================

            console.log(
                "Consultando configuración actual..."
            );


            const respuestaWorkstation =
                await fetch(
                    "/api/workstation"
                );


            if (respuestaWorkstation.ok) {

                const workstation =
                    await respuestaWorkstation.json();


                console.log(
                    "WORKSTATION ACTUAL:",
                    workstation
                );


                if (
                    workstation &&
                    workstation.ambiente_id
                ) {

                    combo.value =
                        workstation.ambiente_id;

                }

            }


            console.log(
                "Configuración cargada correctamente."
            );


        } catch (error) {

            console.error(
                "Error cargando configuración:",
                error
            );


            if (hostname) {

                hostname.textContent =
                    "No disponible";

            }


            combo.innerHTML = `

                <option value="">
                    Error cargando ambientes
                </option>

            `;


            if (mensaje) {

                mensaje.textContent =
                    "No se pudo cargar la configuración.";

            }

        }

    }


    // ==========================
    // GUARDAR CONFIGURACIÓN
    // ==========================

    boton.onclick = async () => {

        if (!combo.value) {

            alert(
                "Seleccione un ambiente."
            );

            return;

        }


        try {

            boton.disabled = true;


            if (mensaje) {

                mensaje.textContent =
                    "Guardando configuración...";

            }


            const ambienteId =
                Number(
                    combo.value
                );


            // ==========================
            // OBTENER HOSTNAME
            // ==========================

            const respuestaHostname =
                await fetch(
                    "/api/workstation/hostname"
                );


            if (!respuestaHostname.ok) {

                throw new Error(
                    "No se pudo obtener el hostname."
                );

            }


            const datosHostname =
                await respuestaHostname.json();


            const nombreComputadora =
                datosHostname.hostname;


            console.log(
                "GUARDANDO:",
                {
                    hostname:
                        nombreComputadora,

                    ambiente_id:
                        ambienteId
                }
            );


            // ==========================
            // GUARDAR EN SERVIDOR
            // ==========================

            const respuesta =
                await fetch(
                    "/api/workstation",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                hostname:
                                    nombreComputadora,

                                ambiente_id:
                                    ambienteId

                            })

                    }
                );


            const resultado =
                await respuesta.json();


            console.log(
                "RESPUESTA SERVIDOR:",
                resultado
            );


            if (!respuesta.ok || !resultado.success) {

                throw new Error(
                    resultado.error ||
                    "No se pudo guardar la configuración."
                );

            }


            // ==========================
            // MENSAJE ÉXITO
            // ==========================

            if (mensaje) {

                mensaje.textContent =
                    "Equipo configurado correctamente.";

            }


            console.log(
                "Configuración guardada correctamente."
            );


        } catch (error) {

            console.error(
                "Error guardando configuración:",
                error
            );


            if (mensaje) {

                mensaje.textContent =
                    "Error al guardar configuración.";

            }


            alert(
                error.message ||
                "Error cambiando ambiente."
            );


        } finally {

            boton.disabled = false;

        }

    };


})();