const boton =
    document.getElementById("btnIngresar");


boton.onclick = async () => {

    const usuario =
        document.getElementById("usuario").value.trim();

    const password =
        document.getElementById("password").value;


    const mensaje =
        document.getElementById("mensaje");


    if (!usuario || !password) {

        mensaje.textContent =
            "Debe ingresar usuario y contraseña.";

        return;

    }


    try {

        const respuesta =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        usuario,
                        password
                    })
                }
            );


        const resultado =
            await respuesta.json();


        if (resultado.success) {

            // Guardar usuario conectado

            localStorage.setItem(
                "usuario",
                JSON.stringify(
                    resultado.user
                )
            );


            // Guardar sesión

            if (resultado.sessionId) {

                localStorage.setItem(
                    "sessionId",
                    resultado.sessionId
                );

            }


            // Ir al menú principal

            window.location.href =
                "principal.html";


        } else {

            mensaje.textContent =
                resultado.message ||
                "No se pudo iniciar sesión.";

        }


    } catch (error) {

        console.error(
            "ERROR LOGIN:",
            error
        );


        mensaje.textContent =
            "No se pudo conectar con el servidor.";

    }

};