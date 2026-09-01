const bcrypt = require("bcryptjs");

const userRepository =
require("../repositories/userRepository");

const sessionManager =
require("../helpers/sessionManager");

const workstationRepository =
require("../repositories/workstationRepository");


class AuthService {


// ==========================
// LOGIN
// ==========================

async login(
    usuario,
    password,
    hostname
){

    // ==========================
    // BUSCAR USUARIO
    // ==========================

    const user =
    await userRepository.findByUsername(

        usuario

    );


    if(!user){

        return {

            success:false,

            message:
            "Usuario no encontrado"

        };

    }


    // ==========================
    // VERIFICAR CONTRASEÑA
    // ==========================

    const ok =
    bcrypt.compareSync(

        password,

        user.password

    );


    if(!ok){

        return {

            success:false,

            message:
            "Contraseña incorrecta"

        };

    }


    // ==========================
    // BUSCAR WORKSTATION
    // DE LA PC CLIENTE
    // ==========================

    let workstation = null;


    if(hostname){

        workstation =
        await workstationRepository
        .getByHostname(

            hostname

        );


        console.log(

            "WORKSTATION DEL CLIENTE:",

            {

                hostname,

                workstation

            }

        );

    }else{

        console.warn(

            "LOGIN SIN HOSTNAME"

        );

    }


    // ==========================
    // CREAR SESIÓN
    // ==========================

    const sessionId =
    sessionManager.create({

        id:user.id,

        usuario:user.usuario,

        nombre:
        `${user.nombres} ${user.apellidos}`,

        rol_id:user.rol_id,

        rol:user.rol

    });


    // ==========================
    // ASIGNAR WORKSTATION
    // ==========================

    if(workstation){

        sessionManager.setWorkstation(

            sessionId,

            workstation

        );


        console.log(

            "WORKSTATION ASIGNADA A SESIÓN:",

            {

                sessionId,

                workstation_id:
                workstation.id,

                hostname:
                workstation.hostname

            }

        );

    }else{

        console.warn(

            "NO SE ENCONTRÓ WORKSTATION PARA:",

            hostname

        );

    }


    // ==========================
    // OBTENER SESIÓN COMPLETA
    // ==========================

    const sesion =
    sessionManager.get(

        sessionId

    );


    console.log(

        "SESIÓN CREADA:",

        sesion

    );


    // ==========================
    // RESPUESTA
    // ==========================

    return {

        success:true,

        user:user,

        sessionId:sessionId,

        session:sesion

    };

}


}


// ==========================
// EXPORTAR
// ==========================

module.exports =
new AuthService();