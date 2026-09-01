const express = require("express");
const cors = require("cors");
const path = require("path");

const databaseManager =
    require("./database/databaseManager");


// ==========================
// RUTAS
// ==========================

const authRoutes =
    require("./routes/authRoutes");

const studentRoutes =
    require("./routes/studentRoutes");

const salidaRoutes =
    require("./routes/salidaRoutes");

const importRoutes =
    require("./routes/importRoutes");

const workstationRoutes =
    require("./routes/workstationRoutes");

const motivoSalidaRoutes =
    require("./routes/motivoSalidaRoutes");

const reporteRoutes =
    require("./routes/reporteRoutes");

const incidenciaRoutes =
    require("./routes/incidenciaRoutes");


// ==========================
// COMPROBAR RUTAS
// ==========================

console.log(
    "authRoutes:",
    typeof authRoutes
);

console.log(
    "studentRoutes:",
    typeof studentRoutes
);

console.log(
    "salidaRoutes:",
    typeof salidaRoutes
);

console.log(
    "importRoutes:",
    typeof importRoutes
);

console.log(
    "workstationRoutes:",
    typeof workstationRoutes
);

console.log(
    "motivoSalidaRoutes:",
    typeof motivoSalidaRoutes
);

console.log(
    "reporteRoutes:",
    typeof reporteRoutes
);

console.log(
    "incidenciaRoutes:",
    typeof incidenciaRoutes
);


// ==========================
// APLICACIÓN
// ==========================

const app =
    express();


// ==========================
// CONFIGURACIÓN
// ==========================

app.use(
    cors()
);

app.use(
    express.json()
);


// ==========================
// CLIENTE WEB
// ==========================

app.use(
    express.static(
        path.join(
            __dirname,
            "web"
        )
    )
);


// ==========================
// PÁGINA PRINCIPAL
// ==========================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "web",
                "index.html"
            )
        );

    }
);


// ==========================
// BASE DE DATOS
// ==========================

databaseManager.connect();


// ==========================
// RUTAS API
// ==========================

console.log(
    "Cargando /api/auth..."
);

app.use(
    "/api/auth",
    authRoutes
);


console.log(
    "Cargando /api/students..."
);

app.use(
    "/api/students",
    studentRoutes
);


console.log(
    "Cargando /api/salidas..."
);

app.use(
    "/api/salidas",
    salidaRoutes
);


console.log(
    "Cargando /api/reportes..."
);

app.use(
    "/api/reportes",
    reporteRoutes
);


console.log(
    "Cargando /api/incidencias..."
);

app.use(
    "/api/incidencias",
    incidenciaRoutes
);


console.log(
    "Cargando /api/motivos-salida..."
);

app.use(
    "/api/motivos-salida",
    motivoSalidaRoutes
);


console.log(
    "Cargando /api/import..."
);

app.use(
    "/api/import",
    importRoutes
);


console.log(
    "Cargando /api/workstation..."
);

app.use(
    "/api/workstation",
    workstationRoutes
);


// ==========================
// PUERTO
// ==========================

// Render proporciona process.env.PORT.
// En desarrollo local utilizaremos 3000.

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Servidor SGCE iniciado en puerto ${PORT}`
        );

    }
);