const boton = document.getElementById("btnIngresar");

boton.addEventListener("click", async () => {

    const usuario = document.getElementById("txtUsuario").value.trim();

    const password = document.getElementById("txtPassword").value;

    const mensaje = document.getElementById("lblMensaje");

    if (usuario === "" || password === "") {

        mensaje.textContent = "Debe ingresar usuario y contraseña.";

        return;

    }

    const resultado = await window.electronAPI.login(usuario, password);

    if (resultado.success) {

        mensaje.textContent = "";

        window.electronAPI.abrirPrincipal();

    } else {

        mensaje.textContent = resultado.message;

    }

});