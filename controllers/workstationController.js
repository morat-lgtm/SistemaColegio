const workstationService =
require("../services/workstationService");


class WorkstationController {


// ==========================
// VERIFICAR CONFIGURACIÓN
// ==========================

async isConfigured(hostname){

    return await workstationService.isConfigured(
        hostname
    );

}


// ==========================
// OBTENER NOMBRE EQUIPO
// ==========================

getHostname(){

    return workstationService.getHostname();

}


// ==========================
// LISTAR AMBIENTES
// ==========================

async getAmbientes(){

    return await workstationService.getAmbientes();

}


// ==========================
// GUARDAR CONFIGURACIÓN
// ==========================

async saveWorkstation(
    hostname,
    ambienteId
){

    return await workstationService.saveWorkstation(

        hostname,

        ambienteId

    );

}


// ==========================
// OBTENER WORKSTATION
// ==========================

async getWorkstation(hostname){

    return await workstationService.getWorkstation(
        hostname
    );

}


}


// ==========================
// EXPORTAR
// ==========================

module.exports =
new WorkstationController();