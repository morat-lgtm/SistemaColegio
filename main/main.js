const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require("electron");

const path = require("path");
const fs = require("fs");


const databaseManager =
    require("../database/databaseManager");

const authService =
    require("../services/authService");


const dashboardController =
    require("../controllers/dashboardController");

const workstationController =
    require("../controllers/workstationController");

const importController =
    require("../controllers/importController");

const studentController =
    require("../controllers/studentController");

const salidaController =
    require("../controllers/salidaController");

const motivoSalidaController =
    require("../controllers/motivoSalidaController");
const incidenciaController =
    require("../controllers/incidenciaController");
    
const mensajeController =
    require("../controllers/mensajeController");

const userController =
    require("../controllers/userController");



let loginWindow;
let principalWindow;
let configurarWindow;





// ======================================================
// CREAR LOGIN
// ======================================================

function crearLogin() {

    loginWindow = new BrowserWindow({

        width: 500,

        height: 400,

        resizable: false,

        title: "SGCE - Inicio de Sesión",

        webPreferences: {

            preload: path.join(
                __dirname,
                "../preload.js"
            ),

            contextIsolation: true,

            nodeIntegration: false

        }

    });


    loginWindow.loadFile(
        path.join(
            __dirname,
            "../views/login.html"
        )
    );

}





// ======================================================
// CREAR PRINCIPAL
// ======================================================

function crearPrincipal() {

    principalWindow = new BrowserWindow({

        width: 1200,

        height: 700,

        title: "SGCE - Sistema de Gestión Escolar",

        webPreferences: {

            preload: path.join(
                __dirname,
                "../preload.js"
            ),

            contextIsolation: true,

            nodeIntegration: false

        }

    });


    principalWindow.loadFile(
        path.join(
            __dirname,
            "../views/principal.html"
        )
    );

}





// ======================================================
// CONFIGURAR EQUIPO
// ======================================================

function crearConfigurarEquipo() {

    configurarWindow =
        new BrowserWindow({

            width: 650,

            height: 500,

            resizable: false,

            title: "Configuración Inicial",

            webPreferences: {

                preload: path.join(
                    __dirname,
                    "../preload.js"
                ),

                contextIsolation: true,

                nodeIntegration: false

            }

        });


    configurarWindow.loadFile(
        path.join(
            __dirname,
            "../views/configurarEquipo.html"
        )
    );

}





// ======================================================
// INICIO DE ELECTRON
// ======================================================

app.whenReady().then(() => {

    try {

        databaseManager.connect();


        if (
            workstationController.isConfigured()
        ) {

            console.log(
                "✔ Equipo configurado."
            );

            crearLogin();

        } else {

            console.log(
                "⚠ Equipo sin configurar."
            );

            crearConfigurarEquipo();

        }

    } catch (error) {

        console.error(
            "ERROR AL INICIAR LA APLICACIÓN:",
            error
        );

    }

});





// ======================================================
// ABRIR PRINCIPAL
// ======================================================

ipcMain.on(
    "abrir-principal",
    () => {

        crearPrincipal();


        if (loginWindow) {

            loginWindow.close();

            loginWindow = null;

        }

    }
);





// ======================================================
// LOGIN
// ======================================================

ipcMain.handle(
    "login",
    async (
        event,
        usuario,
        password
    ) => {

        return await authService.login(
            usuario,
            password
        );

    }
);





// ======================================================
// SESIÓN
// ======================================================

ipcMain.handle(
    "get-session",
    async () => {

        return await dashboardController.getSession();

    }
);





// ======================================================
// ESTUDIANTES
// ======================================================


// OBTENER TODOS

ipcMain.handle(
    "get-students",
    async () => {

        return await studentController.getAll();

    }
);





// BUSCAR ESTUDIANTES

ipcMain.handle(
    "buscar-estudiantes",
    async (
        event,
        texto
    ) => {

        return await studentController.search(
            texto
        );

    }
);





// ESTUDIANTES POR AMBIENTE

ipcMain.handle(
    "get-students-by-ambiente",
    async (
        event,
        ambienteId
    ) => {

        return await studentController.getByAmbiente(
            ambienteId
        );

    }
);





// ======================================================
// REPORTE POR ESTUDIANTE
// ======================================================

ipcMain.handle(
    "get-reporte-estudiante",
    async (
        event,
        estudianteId
    ) => {

        try {

            console.log(
                "MAIN: Consultando reporte del estudiante:",
                estudianteId
            );


            /*
             * Primero intentamos utilizar el método
             * específico del controlador.
             */

            if (
                typeof salidaController.getHistorialByEstudiante ===
                "function"
            ) {

                const resultado =
                    await salidaController.getHistorialByEstudiante(
                        estudianteId
                    );


                console.log(
                    "MAIN: Registros encontrados:",
                    Array.isArray(resultado)
                        ? resultado.length
                        : 0
                );


                return resultado;

            }



            /*
             * Compatibilidad con la versión actual.
             *
             * Si todavía no existe getHistorialByEstudiante()
             * obtenemos el historial general y filtramos.
             */

            console.warn(
                "MAIN: getHistorialByEstudiante no existe."
            );


            const historial =
                await salidaController.getHistorial();


            if (!Array.isArray(historial)) {

                return [];

            }


            const resultado =
                historial.filter(
                    registro => {

                        const id =
                            registro.estudiante_id ??
                            registro.estudianteId ??
                            registro.id_estudiante;


                        return String(id) ===
                            String(estudianteId);

                    }
                );


            console.log(
                "MAIN: Registros filtrados:",
                resultado.length
            );


            return resultado;


        } catch (error) {

            console.error(
                "ERROR REPORTE ESTUDIANTE:",
                error
            );


            throw error;

        }

    }
);





// ======================================================
// EXPORTAR PDF
// ======================================================

ipcMain.handle(
    "exportar-pdf",
    async (
        event,
        html
    ) => {

        try {

            console.log(
                "MAIN: Iniciando exportación PDF..."
            );


            if (
                !html ||
                typeof html !== "string"
            ) {

                throw new Error(
                    "No se recibió contenido HTML para generar el PDF."
                );

            }



            // --------------------------------------------------
            // CREAR VENTANA TEMPORAL
            // --------------------------------------------------

            const ventanaPDF =
                new BrowserWindow({

                    show: false,

                    width: 1200,

                    height: 900,

                    webPreferences: {

                        contextIsolation: true,

                        nodeIntegration: false

                    }

                });



            // --------------------------------------------------
            // CARGAR HTML
            // --------------------------------------------------

            await ventanaPDF.loadURL(

                "data:text/html;charset=utf-8," +

                encodeURIComponent(html)

            );



            // --------------------------------------------------
            // ESPERAR UN MOMENTO PARA QUE RENDERICE
            // --------------------------------------------------

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        500
                    )
            );



            // --------------------------------------------------
            // GENERAR PDF
            // --------------------------------------------------

            const pdf =
                await ventanaPDF.webContents.printToPDF({

                    printBackground: true,

                    pageSize: "A4",

                    margins: {

                        top: 0.4,

                        bottom: 0.4,

                        left: 0.4,

                        right: 0.4

                    }

                });



            // --------------------------------------------------
            // CERRAR VENTANA TEMPORAL
            // --------------------------------------------------

            ventanaPDF.close();



            // --------------------------------------------------
            // MOSTRAR DIÁLOGO PARA GUARDAR
            // --------------------------------------------------

            const resultado =
                await dialog.showSaveDialog({

                    title:
                        "Guardar reporte PDF",

                    defaultPath:
                        "Reporte_SGCE.pdf",

                    filters: [

                        {

                            name:
                                "Documento PDF",

                            extensions:
                                ["pdf"]

                        }

                    ]

                });



            // --------------------------------------------------
            // USUARIO CANCELÓ
            // --------------------------------------------------

            if (
                resultado.canceled
            ) {

                console.log(
                    "MAIN: Exportación cancelada."
                );


                return {

                    success: false,

                    cancelado: true

                };

            }



            // --------------------------------------------------
            // GUARDAR ARCHIVO
            // --------------------------------------------------

            fs.writeFileSync(

                resultado.filePath,

                pdf

            );



            console.log(
                "MAIN: PDF guardado en:",
                resultado.filePath
            );


            return {

                success: true,

                ruta:
                    resultado.filePath

            };


        } catch (error) {

            console.error(
                "ERROR AL EXPORTAR PDF:",
                error
            );


            return {

                success: false,

                error:
                    error.message

            };

        }

    }
);





// ======================================================
// SALIDAS
// ======================================================


// REGISTRAR SALIDA

ipcMain.handle(
    "registrar-salida",
    async (
        event,
        salida
    ) => {

        return await salidaController.registrarSalida(
            salida
        );

    }
);





// SALIDAS ACTIVAS

ipcMain.handle(
    "get-salidas-activas",
    async () => {

        return await salidaController.getSalidasActivas();

    }
);





// ======================================================
// RETORNO
// ======================================================

ipcMain.handle(
    "registrar-retorno",
    async (
        event,
        id
    ) => {

        return await salidaController.registrarRetorno(
            id
        );

    }
);





// ======================================================
// HISTORIAL DE SALIDAS
// ======================================================


// HISTORIAL COMPLETO

ipcMain.handle(
    "get-historial-salidas",
    async () => {

        return await salidaController.getHistorial();

    }
);





// HISTORIAL POR AMBIENTE

ipcMain.handle(
    "get-historial-salidas-by-ambiente",
    async (
        event,
        ambienteId
    ) => {

        return await salidaController.getHistorialByAmbiente(
            ambienteId
        );

    }
);





// ======================================================
// MOTIVOS DE SALIDA
// ======================================================

ipcMain.handle(
    "get-motivos-salida",
    async () => {

        return await motivoSalidaController.getAll();

    }
);


// ======================================================
// INCIDENCIAS
// ======================================================


// OBTENER TIPOS DE INCIDENCIA

ipcMain.handle(
    "get-tipos-incidencia",
    async () => {

        return await incidenciaController
            .getTiposIncidencia();

    }
);


// REGISTRAR INCIDENCIA

ipcMain.handle(
    "registrar-incidencia",
    async (
        event,
        incidencia
    ) => {

        return await incidenciaController
            .registrarIncidencia(
                incidencia
            );

    }
);

// ==========================
// REPORTE DE INCIDENCIAS
// POR ESTUDIANTE
// ==========================

ipcMain.handle(
    "get-reporte-incidencias-estudiante",
    async (
        event,
        estudianteId
    ) => {

        try {

            return await apiClient.get(
                `/api/incidencias/reporte/estudiante/${estudianteId}`
            );

        } catch (error) {

            console.error(
                "Error obteniendo reporte de incidencias:",
                error
            );

            throw error;

        }

    }
);
// ======================================================
// WORKSTATION
// ======================================================


// HOSTNAME

ipcMain.handle(
    "get-hostname",
    async () => {

        return await workstationController.getHostname();

    }
);





// AMBIENTES

ipcMain.handle(
    "get-ambientes",
    async () => {

        return await workstationController.getAmbientes();

    }
);





// GUARDAR WORKSTATION

ipcMain.handle(
    "save-workstation",
    async (
        event,
        ambienteId
    ) => {

        return await workstationController.saveWorkstation(
            ambienteId
        );

    }
);





// OBTENER WORKSTATION

ipcMain.handle(
    "get-workstation",
    async () => {

        return await workstationController.getWorkstation();

    }
);





// ======================================================
// MENSAJES
// ======================================================


// REGISTRAR MENSAJE

ipcMain.handle(
    "registrar-mensaje",
    async (
        event,
        mensaje
    ) => {

        return await mensajeController.registrarMensaje(
            mensaje
        );

    }
);





// OBTENER MENSAJES

ipcMain.handle(
    "get-mensajes",
    async (
        event,
        usuarioId
    ) => {

        return await mensajeController.getMensajes(
            usuarioId
        );

    }
);





// MARCAR MENSAJE LEÍDO

ipcMain.handle(
    "marcar-mensaje-leido",
    async (
        event,
        id
    ) => {

        return await mensajeController.marcarLeido(
            id
        );

    }
);





// ======================================================
// USUARIOS
// ======================================================

ipcMain.handle(
    "get-usuarios",
    async () => {

        return await userController.getUsuarios();

    }
);





// ======================================================
// IMPORTAR ESTUDIANTES
// ======================================================

ipcMain.handle(
    "import-students",
    async () => {

        return await importController.importStudents();

    }
);





// ======================================================
// CERRAR APP
// ======================================================

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {

            app.quit();

        }

    }
);