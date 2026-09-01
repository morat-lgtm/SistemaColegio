class SessionManager {


constructor(){


    // Varias sesiones simultáneas

    this.sessions = {};


}







// ==========================
// CREAR SESIÓN
// ==========================

create(user){


    const sessionId =
    String(user.id);





    this.sessions[sessionId] = {


        id:user.id,


        usuario:user.usuario,


        nombre:user.nombre,


        rol_id:user.rol_id,


        rol:user.rol,



        // PC desde donde trabaja

        workstation:null,



        // Ambiente propio de esta sesión

        ambiente:null,



        loginTime:new Date()


    };





    return sessionId;


}







// ==========================
// OBTENER SESIÓN
// ==========================

get(sessionId){


    return this.sessions[sessionId];


}







// ==========================
// USUARIO
// ==========================

getUser(sessionId){


    return this.sessions[sessionId]?.usuario;


}







// ==========================
// ROL
// ==========================

getRole(sessionId){


    return this.sessions[sessionId]?.rol;


}








// ==========================
// COMPUTADORA ACTUAL
// ==========================

setWorkstation(
    sessionId,
    workstation
){



    if(!this.sessions[sessionId]){

        return;

    }




    this.sessions[sessionId].workstation =
    workstation;



}









// ==========================
// AMBIENTE DE LA SESIÓN
// ==========================

setAmbiente(
    sessionId,
    ambiente
){



    if(!this.sessions[sessionId]){

        return;

    }





    this.sessions[sessionId].ambiente = {


        id:ambiente.id,


        nombre:ambiente.nombre,


        nivel:ambiente.nivel,


        grado:ambiente.grado,


        seccion:ambiente.seccion


    };



}







// ==========================
// OBTENER AMBIENTE
// ==========================

getAmbiente(sessionId){


    return this.sessions[sessionId]?.ambiente;


}







// ==========================
// CERRAR SESIÓN
// ==========================

clear(sessionId){


    delete this.sessions[sessionId];


}







// ==========================
// VALIDAR SESIÓN
// ==========================

isLogged(sessionId){


    return !!this.sessions[sessionId];


}





}



module.exports =
new SessionManager();