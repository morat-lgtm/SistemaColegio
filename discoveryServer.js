const dgram = require("dgram");
const os = require("os");

const DISCOVERY_PORT = 41234;
const HTTP_PORT = 3000;

const socket = dgram.createSocket("udp4");


// ==========================
// OBTENER IP LOCAL
// ==========================

function obtenerIPLocal(){

    const interfaces =
    os.networkInterfaces();


    for(
        const nombre in interfaces
    ){

        for(
            const interfaz
            of interfaces[nombre]
        ){

            if(
                interfaz.family === "IPv4" &&
                !interfaz.internal
            ){

                return interfaz.address;

            }

        }

    }


    return null;

}


// ==========================
// RECIBIR DESCUBRIMIENTO
// ==========================

socket.on(
    "message",
    (mensaje, rinfo)=>{

        const texto =
        mensaje.toString().trim();


        console.log(
            "Solicitud de descubrimiento recibida desde:",
            rinfo.address
        );


        if(
            texto !== "SGCE_DISCOVERY"
        ){

            return;

        }


        const ip =
        obtenerIPLocal();


        if(!ip){

            console.error(
                "No se pudo determinar la IP del servidor."
            );

            return;

        }


        const respuesta = {

            tipo:
            "SGCE_SERVER",

            ip:
            ip,

            puerto:
            HTTP_PORT

        };


        const buffer =
        Buffer.from(
            JSON.stringify(respuesta)
        );


        socket.send(

            buffer,

            0,

            buffer.length,

            rinfo.port,

            rinfo.address,

            (error)=>{

                if(error){

                    console.error(
                        "Error enviando respuesta de descubrimiento:",
                        error
                    );

                    return;

                }


                console.log(
                    "Respuesta enviada a:",
                    rinfo.address,
                    "→",
                    ip
                );

            }

        );

    }
);


// ==========================
// ERROR
// ==========================

socket.on(
    "error",
    (error)=>{

        console.error(
            "Error del servidor de descubrimiento:",
            error
        );

    }
);


// ==========================
// INICIAR
// ==========================

socket.bind(
    DISCOVERY_PORT,
    "0.0.0.0",
    ()=>{

        console.log(
            `Descubrimiento SGCE activo en UDP ${DISCOVERY_PORT}`
        );

    }
);