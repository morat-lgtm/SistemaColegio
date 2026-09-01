const formulario =
    document.getElementById("formLogin");

const mensaje =
    document.getElementById("mensaje");


/* ==========================
   OBTENER IDENTIFICADOR
   DEL EQUIPO
========================== */

function obtenerWorkstationKey() {

    let key =
        localStorage.getItem("workstationKey");


    if (!key) {

        key =
            crypto.randomUUID();


        localStorage.setItem(
            "workstationKey",
            key
        );

    }


    return key;

}


/* ==========================
   LOGIN
========================== */

formulario.addEventListener(
    "submit",
    async function (event) {

        // Evitar el envío normal
        // del formulario

        event.preventDefault();


        const usuario =
            document.getElementById("usuario")
                .value
                .trim();


        const password =
            document.getElementById("password")
                .value;


        /* ==========================
           VALIDAR DATOS
        ========================== */

        if (!usuario || !password) {

            mensaje.textContent =
                "Debe ingresar usuario y contraseña.";

            return;

        }


        try {

            /* ==========================
               DESHABILITAR BOTÓN
            ========================== */

            const boton =
                document.getElementById(
                    "btnIngresar"
                );


            boton.disabled = true;


            mensaje.textContent =
                "Iniciando sesión...";


            /* ==========================
               OBTENER WORKSTATION KEY
            ========================== */

            const workstationKey =
                obtenerWorkstationKey();


            console.log(
                "WORKSTATION KEY:",
                workstationKey
            );


            /* ==========================
               LOGIN
            ========================== */

            const respuesta =
                await fetch(
                    "/api/auth/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                usuario:
                                    usuario,

                                password:
                                    password,

                                workstationKey:
                                    workstationKey

                            })

                    }
                );


            const resultado =
                await respuesta.json();


            console.log(
                "RESPUESTA COMPLETA DEL LOGIN:",
                resultado
            );


            /* ==========================
               LOGIN CORRECTO
            ========================== */

            if (resultado.success) {


                /* ==========================
                   GUARDAR USUARIO
                ========================== */

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(
                        resultado.user
                    )
                );


                /* ==========================
                   GUARDAR SESSION ID
                ========================== */

                if (!resultado.sessionId) {

                    console.error(
                        "EL SERVIDOR NO DEVOLVIÓ sessionId"
                    );


                    mensaje.textContent =
                        "No se pudo crear la sesión.";

                    boton.disabled = false;

                    return;

                }


                localStorage.setItem(
                    "sessionId",
                    String(
                        resultado.sessionId
                    )
                );


                /* ==========================
                   GUARDAR WORKSTATION KEY
                ========================== */

                localStorage.setItem(
                    "workstationKey",
                    workstationKey
                );


                /* ==========================
                   VERIFICAR
                ========================== */

                console.log(
                    "WORKSTATION KEY GUARDADA:",
                    localStorage.getItem(
                        "workstationKey"
                    )
                );


                console.log(
                    "SESSION ID GUARDADO:",
                    localStorage.getItem(
                        "sessionId"
                    )
                );


                /* ==========================
                   IR AL SISTEMA
                ========================== */

                window.location.href =
                    "/principal.html";


            } else {

                mensaje.textContent =
                    resultado.message ||
                    "No se pudo iniciar sesión.";


                boton.disabled = false;

            }


        } catch (error) {

            console.error(
                "ERROR LOGIN:",
                error
            );


            mensaje.textContent =
                error.message ||
                "No se pudo conectar con el servidor.";


            const boton =
                document.getElementById(
                    "btnIngresar"
                );


            boton.disabled = false;

        }

    }
);