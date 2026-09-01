const { contextBridge, ipcRenderer } = require("electron");

console.log("=================================");
console.log("PRELOAD CARGADO");
console.log("ARCHIVO PRELOAD:", __filename);
console.log("=================================");


contextBridge.exposeInMainWorld("electronAPI", {

    // ==========================
    // ABRIR PRINCIPAL
    // ==========================

    abrirPrincipal: () =>
        ipcRenderer.send(
            "abrir-principal"
        ),


    // ==========================
    // LOGIN / SESIÓN
    // ==========================

    login: (usuario, password) =>
        ipcRenderer.invoke(
            "login",
            usuario,
            password
        ),


    getSession: () =>
        ipcRenderer.invoke(
            "get-session"
        ),


    // ==========================
    // WORKSTATIONS
    // ==========================

    getHostname: () =>
        ipcRenderer.invoke(
            "get-hostname"
        ),


    getAmbientes: () =>
        ipcRenderer.invoke(
            "get-ambientes"
        ),


    saveWorkstation: (ambienteId) =>
        ipcRenderer.invoke(
            "save-workstation",
            ambienteId
        ),


    getWorkstation: () =>
        ipcRenderer.invoke(
            "get-workstation"
        ),


    // ==========================
    // ESTUDIANTES
    // ==========================

    importarEstudiantes: () =>
        ipcRenderer.invoke(
            "import-students"
        ),


    getStudents: () =>
        ipcRenderer.invoke(
            "get-students"
        ),


    getStudentsByAmbiente: (ambienteId) =>
        ipcRenderer.invoke(
            "get-students-by-ambiente",
            ambienteId
        ),


    // ==========================
    // SALIDAS
    // ==========================

    registrarSalida: (salida) =>
        ipcRenderer.invoke(
            "registrar-salida",
            salida
        ),


    getSalidasActivas: () =>
        ipcRenderer.invoke(
            "get-salidas-activas"
        ),


    registrarRetorno: (id) =>
        ipcRenderer.invoke(
            "registrar-retorno",
            id
        ),


    // ==========================
    // HISTORIAL DE SALIDAS
    // ==========================

    getHistorialSalidas: () =>
        ipcRenderer.invoke(
            "get-historial-salidas"
        ),


    getHistorialSalidasByAmbiente: (ambienteId) =>
        ipcRenderer.invoke(
            "get-historial-salidas-by-ambiente",
            ambienteId
        ),


    // ==========================
    // MOTIVOS DE SALIDA
    // ==========================

    getMotivosSalida: () =>
        ipcRenderer.invoke(
            "get-motivos-salida"
        ),


    // ==========================
    // MENSAJES INTERNOS
    // ==========================

    registrarMensaje: (mensaje) =>
        ipcRenderer.invoke(
            "registrar-mensaje",
            mensaje
        ),


    getMensajes: (usuarioId) =>
        ipcRenderer.invoke(
            "get-mensajes",
            usuarioId
        ),


    marcarMensajeLeido: (id) =>
        ipcRenderer.invoke(
            "marcar-mensaje-leido",
            id
        ),


    // ==========================
    // USUARIOS
    // ==========================

    getUsuarios: () =>
        ipcRenderer.invoke(
            "get-usuarios"
        )

});


console.log(
    "PRELOAD: getHistorialSalidas definida correctamente"
);