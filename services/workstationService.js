const os = require("os");

const workstationRepository =
require("../repositories/workstationRepository");


class WorkstationService {


// ==========================
// OBTENER HOSTNAME LOCAL
// ==========================

getHostname(){

    return os.hostname();

}


// ==========================
// VERIFICAR CONFIGURACIÓN
// ==========================

async isConfigured(hostname){

    // Si no llega hostname,
    // usamos el hostname local
    // como respaldo.

    if(!hostname){

        hostname =
        this.getHostname();

    }


    const workstation =
    await workstationRepository
    .getByHostname(

        hostname

    );


    return !!workstation;

}


// ==========================
// OBTENER WORKSTATION
// ==========================

async getWorkstation(hostname){

    // Si no llega hostname,
    // usamos el hostname local
    // como respaldo.

    if(!hostname){

        hostname =
        this.getHostname();

    }


    const workstation =
    await workstationRepository
    .getByHostname(

        hostname

    );


    return workstation;

}


// ==========================
// LISTAR AMBIENTES
// ==========================

async getAmbientes(){

    const ambientes =
    await workstationRepository
    .getAllAmbientes();


    console.log(

        "AMBIENTES DESDE BD:",

        ambientes

    );


    return ambientes;

}


// ==========================
// GUARDAR CONFIGURACIÓN
// ==========================

async saveWorkstation(
    hostname,
    ambienteId
){

    // Si por alguna razón
    // no llega hostname,
    // usamos el hostname local
    // del servidor como respaldo.

    if(!hostname){

        hostname =
        this.getHostname();

    }


    await workstationRepository.save(

        hostname,

        ambienteId

    );


    return await workstationRepository
    .getByHostname(

        hostname

    );

}


}


// ==========================
// EXPORTAR
// ==========================

module.exports =
new WorkstationService();