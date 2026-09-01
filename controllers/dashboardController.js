const sessionManager = require("../helpers/sessionManager");


class DashboardController {



    getSession() {


        const session =
            sessionManager.get();



        if (!session) {

            return null;

        }



        return {


            id: session.id,


            usuario: session.usuario,


            nombre: session.nombre,


            rol_id: session.rol_id,


            rol: session.rol,



            workstation:
                session.workstation,



            ambiente:
                session.ambiente


        };


    }





    isLogged() {


        return sessionManager.isLogged();


    }



}



module.exports = new DashboardController();