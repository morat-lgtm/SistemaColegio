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

    // ==========================
    // BUSCAR ESTUDIANTES
    // ==========================

    buscarEstudiantes: (texto) =>
        ipcRenderer.invoke(
            "buscar-estudiantes",
            texto
        ),

    getStudentsByAmbiente: (ambienteId) =>
        ipcRenderer.invoke(
            "get-students-by-ambiente",
            ambienteId
        ),

    // ==========================
    // INCIDENCIAS
    // ==========================

    getTiposIncidencia: () =>
        ipcRenderer.invoke(
            "get-tipos-incidencia"
        ),

    registrarIncidencia: (incidencia) =>
        ipcRenderer.invoke(
            "registrar-incidencia",
            incidencia
        ),

    // ==========================
    // REPORTES
    // ==========================

    getReporteEstudiante: (estudianteId) =>
        ipcRenderer.invoke(
            "get-reporte-estudiante",
            estudianteId
        ),

    getReporteIncidenciasEstudiante: (estudianteId) =>
        ipcRenderer.invoke(
            "get-reporte-incidencias-estudiante",
            estudianteId
        ),

    // ==========================
    // EXPORTAR PDF
    // ==========================

    exportarPDF: (html) =>
        ipcRenderer.invoke(
            "exportar-pdf",
            html
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

    getMensajesNoLeidos: (usuarioId) =>
        ipcRenderer.invoke(
            "get-mensajes-no-leidos",
            usuarioId
        ),

    marcarMensajeLeido: (id, usuarioId) =>
        ipcRenderer.invoke(
            "marcar-mensaje-leido",
            id,
            usuarioId
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

console.log(
    "PRELOAD: buscarEstudiantes definida correctamente"
);

console.log(
    "PRELOAD: getReporteEstudiante definida correctamente"
);

console.log(
    "PRELOAD: getReporteIncidenciasEstudiante definida correctamente"
);

console.log(
    "PRELOAD: exportarPDF definida correctamente"
);

console.log(
    "PRELOAD: getTiposIncidencia definida correctamente"
);

console.log(
    "PRELOAD: registrarIncidencia definida correctamente"
);

console.log(
    "PRELOAD: getUsuarios definida correctamente"
);

console.log(
    "PRELOAD: registrarMensaje definida correctamente"
);

console.log(
    "PRELOAD: getMensajes definida correctamente"
);

console.log(
    "PRELOAD: getMensajesNoLeidos definida correctamente"
);

console.log(
    "PRELOAD: marcarMensajeLeido definida correctamente"
);