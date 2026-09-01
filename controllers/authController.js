const authService =
    require("../services/authService");


class AuthController {

    // ==========================
    // LOGIN
    // ==========================

    async login(
        usuario,
        password,
        workstationKey
    ) {

        const resultado =
            await authService.login(
                usuario,
                password,
                workstationKey
            );

        return resultado;

    }

}


// ==========================
// EXPORTAR
// ==========================

module.exports =
    new AuthController();