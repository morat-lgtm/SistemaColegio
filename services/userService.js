const userRepository = require("../repositories/userRepository");


class UserService {


    // ==========================
    // OBTENER USUARIOS
    // ==========================

    getUsuarios() {


        return userRepository.getUsuarios();


    }



}


module.exports = new UserService();