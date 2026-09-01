class PermissionService {


    puedeVerTodos(rol) {


        const rolesGenerales = [


            "Administrador",

            "Dirección",

            "Subdirección",

            "Secretaría",

            "Coordinación Académica",

            "Convivencia Escolar",

            "Psicología",

            "Enfermería"


        ];



        return rolesGenerales.includes(rol);


    }





    puedeVerSoloAula(rol) {


        const rolesAula = [


            "Docente",

            "Tutor"


        ];



        return rolesAula.includes(rol);


    }





    puedeAdministrarUsuarios(rol) {


        return rol === "Administrador";


    }





    puedeVerReportes(rol) {


        const rolesReportes = [


            "Administrador",

            "Dirección",

            "Coordinación Académica"


        ];



        return rolesReportes.includes(rol);


    }



}



module.exports = new PermissionService();