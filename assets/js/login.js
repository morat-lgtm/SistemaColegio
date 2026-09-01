const formulario =
    document.getElementById("formLogin");


formulario.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        const usuario =
            document
                .getElementById("usuario")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const mensaje =
            document.getElementById("mensaje");


        if (usuario === "" || password === "") {

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
                            usuario: usuario,
                            password: password
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


                // Ir al menú principal

                window.location.href =
                    "principal.html";


            } else {

                mensaje.textContent =
                    resultado.message ||
                    "Usuario o contraseña incorrectos.";

            }


        } catch (error) {

            console.error(
                "Error realizando login:",
                error
            );


            mensaje.textContent =
                "No se pudo conectar con el servidor.";

        }

    }
);