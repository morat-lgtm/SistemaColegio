const userService = require("../services/userService");


class UserController {


    // ==========================
    // OBTENER USUARIOS
    // ==========================

    getUsuarios() {


        return userService.getUsuarios();


    }


}


module.exports = new UserController();