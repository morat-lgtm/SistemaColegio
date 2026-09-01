// ==========================
// OBTENER USUARIO
// ==========================

const usuarioGuardado =
    localStorage.getItem("usuario");


// ==========================
// ELEMENTOS
// ==========================

const saludo =
    document.getElementById("saludo");

const mensajeBienvenida =
    document.getElementById("mensajeBienvenida");

const mensajeTrabajo =
    document.getElementById("mensajeTrabajo");


// ==========================
// HORA ACTUAL
// ==========================

const hora =
    new Date().getHours();


// ==========================
// SALUDO SEGÚN LA HORA
// ==========================

let saludoHora = "";

if (hora >= 5 && hora < 12) {

    saludoHora = "Buenos días";

}
else if (hora >= 12 && hora < 19) {

    saludoHora = "Buenas tardes";

}
else {

    saludoHora = "Buenas noches";

}


// ==========================
// MOSTRAR NOMBRE
// ==========================

if (usuarioGuardado) {

    try {

        const usuario =
            JSON.parse(usuarioGuardado);


        console.log(
            "Usuario conectado:",
            usuario
        );


        // Intentamos obtener el nombre
        // independientemente de cómo
        // venga desde PostgreSQL.

        const nombre =
            usuario.nombre ||
            usuario.nombres ||
            usuario.nombre_completo ||
            usuario.nombreCompleto ||
            usuario.usuario ||
            "Usuario";


        saludo.textContent =
            `${saludoHora}, ${nombre}`;


        mensajeBienvenida.textContent =
            "Bienvenido al Sistema de Gestión y Comunicación Escolar.";


        mensajeTrabajo.textContent =
            "Te deseamos una excelente jornada de trabajo.";


    }
    catch (error) {

        console.error(
            "Error leyendo usuario:",
            error
        );

    }

}
else {

    saludo.textContent =
        saludoHora;

}