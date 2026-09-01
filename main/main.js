const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const databaseManager = require("../database/databaseManager");
const authService = require("../services/authService");

const dashboardController = require("../controllers/dashboardController");
const workstationController = require("../controllers/workstationController");
const importController = require("../controllers/importController");
const studentController = require("../controllers/studentController");
const salidaController = require("../controllers/salidaController");
const motivoSalidaController = require("../controllers/motivoSalidaController");
const mensajeController = require("../controllers/mensajeController");
const userController = require("../controllers/userController");


let loginWindow;
let principalWindow;
let configurarWindow;



function crearLogin() {


    loginWindow = new BrowserWindow({

        width:500,

        height:400,

        resizable:false,

        title:"SGCE - Inicio de Sesión",

        webPreferences:{

            preload:path.join(__dirname,"../preload.js"),

            contextIsolation:true,

            nodeIntegration:false

        }

    });


    loginWindow.loadFile(
        path.join(__dirname,"../views/login.html")
    );


}





function crearPrincipal(){


    principalWindow = new BrowserWindow({

        width:1200,

        height:700,

        title:"SGCE - Sistema de Gestión Escolar",

        webPreferences:{

            preload:path.join(__dirname,"../preload.js"),

            contextIsolation:true,

            nodeIntegration:false

        }

    });


    principalWindow.loadFile(
        path.join(__dirname,"../views/principal.html")
    );


}





function crearConfigurarEquipo(){


    configurarWindow = new BrowserWindow({

        width:650,

        height:500,

        resizable:false,

        title:"Configuración Inicial",

        webPreferences:{

            preload:path.join(__dirname,"../preload.js"),

            contextIsolation:true,

            nodeIntegration:false

        }

    });


    configurarWindow.loadFile(
        path.join(__dirname,"../views/configurarEquipo.html")
    );


}





app.whenReady().then(()=>{


    databaseManager.connect();



    if(workstationController.isConfigured()){


        console.log("✔ Equipo configurado.");

        crearLogin();


    }else{


        console.log("⚠ Equipo sin configurar.");

        crearConfigurarEquipo();


    }


});





// ==========================
// ABRIR PRINCIPAL
// ==========================


ipcMain.on("abrir-principal",()=>{


    crearPrincipal();


    if(loginWindow){

        loginWindow.close();

        loginWindow=null;

    }


});





// ==========================
// LOGIN
// ==========================


ipcMain.handle(
    "login",
    async(event,usuario,password)=>{


        return authService.login(
            usuario,
            password
        );


    }
);




ipcMain.handle(
    "get-session",
    async()=>{


        return dashboardController.getSession();


    }
);





// ==========================
// ESTUDIANTES
// ==========================


ipcMain.handle(
    "get-students",
    async()=>{


        return studentController.getAll();


    }
);




// ==========================
// ESTUDIANTES POR AMBIENTE
// ==========================


ipcMain.handle(
    "get-students-by-ambiente",
    async(event,ambienteId)=>{


        return studentController.getByAmbiente(
            ambienteId
        );


    }
);





// ==========================
// SALIDAS
// ==========================


ipcMain.handle(
    "registrar-salida",
    async(event,salida)=>{


        return salidaController.registrarSalida(
            salida
        );


    }
);




ipcMain.handle(
    "get-salidas-activas",
    async()=>{


        return salidaController.getSalidasActivas();


    }
);





// ==========================
// RETORNO
// ==========================


ipcMain.handle(
    "registrar-retorno",
    async(event,id)=>{


        return salidaController.registrarRetorno(
            id
        );


    }
);




// ==========================
// HISTORIAL SALIDAS
// ==========================

ipcMain.handle(
"get-historial-salidas",
async()=>{

    return salidaController.getHistorial();


}
);



// ==========================
// HISTORIAL SALIDAS POR AMBIENTE
// ==========================

ipcMain.handle(
"get-historial-salidas-by-ambiente",
async(event, ambienteId)=>{


    return salidaController.getHistorialByAmbiente(
        ambienteId
    );


}
);



// ==========================
// MOTIVOS SALIDA
// ==========================


ipcMain.handle(
    "get-motivos-salida",
    async()=>{


        return motivoSalidaController.getAll();


    }
);





// ==========================
// WORKSTATIONS
// ==========================


ipcMain.handle(
    "get-hostname",
    async()=>{


        return workstationController.getHostname();


    }
);




ipcMain.handle(
    "get-ambientes",
    async()=>{


        return workstationController.getAmbientes();


    }
);




ipcMain.handle(
    "save-workstation",
    async(event,ambienteId)=>{


        return workstationController.saveWorkstation(
            ambienteId
        );


    }
);




ipcMain.handle(
    "get-workstation",
    async()=>{


        return workstationController.getWorkstation();


    }
);





// ==========================
// MENSAJES
// ==========================


ipcMain.handle(
    "registrar-mensaje",
    async(event,mensaje)=>{


        return mensajeController.registrarMensaje(
            mensaje
        );


    }
);




ipcMain.handle(
    "get-mensajes",
    async(event,usuarioId)=>{


        return mensajeController.getMensajes(
            usuarioId
        );


    }
);




ipcMain.handle(
    "marcar-mensaje-leido",
    async(event,id)=>{


        return mensajeController.marcarLeido(
            id
        );


    }
);





// ==========================
// USUARIOS
// ==========================


ipcMain.handle(
    "get-usuarios",
    async()=>{


        return userController.getUsuarios();


    }
);





// ==========================
// IMPORTAR ESTUDIANTES
// ==========================


ipcMain.handle(
    "import-students",
    async()=>{


        return importController.importStudents();


    }
);





// ==========================
// CERRAR APP
// ==========================


app.on(
    "window-all-closed",
    ()=>{


        if(process.platform !== "darwin"){

            app.quit();

        }


    }
);