class SchemaManager {


constructor(db){

    this.db = db;

}




createTables(){



// ==========================
// ROLES
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS roles (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,

    descripcion TEXT,

    activo INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);

`);

console.log(
"✔ Tabla roles verificada."
);







// ==========================
// USUARIOS
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS usuarios (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    usuario TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    nombres TEXT NOT NULL,

    apellidos TEXT NOT NULL,

    rol_id INTEGER NOT NULL,

    activo INTEGER DEFAULT 1,

    ultimo_acceso DATETIME,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (rol_id)

    REFERENCES roles(id)

);

`);

console.log(
"✔ Tabla usuarios verificada."
);







// ==========================
// AMBIENTES
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS ambientes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,

    tipo TEXT NOT NULL,

    nivel TEXT,

    grado TEXT,

    seccion TEXT

);

`);

console.log(
"✔ Tabla ambientes verificada."
);








// ==========================
// WORKSTATIONS
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS workstations (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    hostname TEXT NOT NULL UNIQUE,

    ambiente_id INTEGER NOT NULL,

    activo INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (ambiente_id)

    REFERENCES ambientes(id)

);

`);

console.log(
"✔ Tabla workstations verificada."
);







// ==========================
// ESTUDIANTES
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS estudiantes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    codigo TEXT UNIQUE,

    dni TEXT UNIQUE,

    apellidos TEXT NOT NULL,

    nombres TEXT NOT NULL,

    nivel TEXT NOT NULL,

    grado TEXT NOT NULL,

    seccion TEXT NOT NULL,

    ambiente_id INTEGER,

    activo INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (ambiente_id)

    REFERENCES ambientes(id)

);

`);

console.log(
"✔ Tabla estudiantes verificada."
);







// ==========================
// MOTIVOS DE SALIDA
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS motivos_salida (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,

    activo INTEGER DEFAULT 1

);

`);

console.log(
"✔ Tabla motivos_salida verificada."
);
// ==========================
// TIPOS DE INCIDENCIA
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS tipos_incidencia (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,

    activo INTEGER DEFAULT 1

);

`);

console.log(
"✔ Tabla tipos_incidencia verificada."
);








// ==========================
// INCIDENCIAS
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS incidencias (

    id INTEGER PRIMARY KEY AUTOINCREMENT,


    estudiante_id INTEGER NOT NULL,


    tipo_id INTEGER NOT NULL,


    descripcion TEXT,


    usuario_id INTEGER NOT NULL,


    workstation_id INTEGER NOT NULL,


    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,


    estado TEXT NOT NULL DEFAULT 'REGISTRADA',


    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,



    FOREIGN KEY (estudiante_id)

    REFERENCES estudiantes(id),



    FOREIGN KEY (tipo_id)

    REFERENCES tipos_incidencia(id),



    FOREIGN KEY (usuario_id)

    REFERENCES usuarios(id),



    FOREIGN KEY (workstation_id)

    REFERENCES workstations(id)

);

`);

console.log(
"✔ Tabla incidencias verificada."
);









// ==========================
// SALIDAS
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS salidas (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    estudiante_id INTEGER NOT NULL,

    motivo_id INTEGER NOT NULL,

    usuario_id INTEGER NOT NULL,

    workstation_id INTEGER NOT NULL,

    hora_salida DATETIME NOT NULL,

    hora_regreso DATETIME,

    observacion TEXT,

    estado TEXT NOT NULL DEFAULT 'ACTIVA',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (estudiante_id)

    REFERENCES estudiantes(id),



    FOREIGN KEY (motivo_id)

    REFERENCES motivos_salida(id),



    FOREIGN KEY (usuario_id)

    REFERENCES usuarios(id),



    FOREIGN KEY (workstation_id)

    REFERENCES workstations(id)

);

`);

console.log(
"✔ Tabla salidas verificada."
);
// ==========================
// MENSAJES INTERNOS
// ==========================

this.db.exec(`

CREATE TABLE IF NOT EXISTS mensajes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    usuario_origen INTEGER NOT NULL,

    usuario_destino INTEGER,

    asunto TEXT NOT NULL,

    mensaje TEXT NOT NULL,

    estado TEXT NOT NULL DEFAULT 'PENDIENTE',

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(usuario_origen)

    REFERENCES usuarios(id),



    FOREIGN KEY(usuario_destino)

    REFERENCES usuarios(id)

);

`);

console.log(
"✔ Tabla mensajes verificada."
);





}



}



module.exports = SchemaManager;