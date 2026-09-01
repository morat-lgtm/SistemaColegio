const bcrypt =
    require("bcryptjs");


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
        workstationKey
    ) {


        // ==========================
        // BUSCAR USUARIO
        // ==========================

        const user =
            await userRepository.findByUsername(
                usuario
            );


        if (!user) {

            return {

                success: false,

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


        if (!ok) {

            return {

                success: false,

                message:
                    "Contraseña incorrecta"

            };

        }


        // ==========================
        // BUSCAR WORKSTATION
        // ==========================

        let workstation = null;


        if (workstationKey) {

            console.log(
                "WORKSTATION KEY DEL CLIENTE:",
                workstationKey
            );


            workstation =
                await workstationRepository
                    .getByWorkstationKey(
                        workstationKey
                    );


            if (workstation) {

                console.log(
                    "WORKSTATION ENCONTRADA:",
                    workstation
                );

            } else {

                console.warn(
                    "NO SE ENCONTRÓ WORKSTATION PARA:",
                    workstationKey
                );

            }

        } else {

            console.warn(
                "LOGIN SIN WORKSTATION KEY"
            );

        }


        // ==========================
        // CREAR SESIÓN
        // ==========================

        const sessionId =
            sessionManager.create({

                id:
                    user.id,

                usuario:
                    user.usuario,

                nombre:
                    `${user.nombres} ${user.apellidos}`,

                rol_id:
                    user.rol_id,

                rol:
                    user.rol

            });


        // ==========================
        // ASIGNAR WORKSTATION
        // ==========================

        if (workstation) {

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

                    workstationKey:
                        workstation.workstation_key,

                    hostname:
                        workstation.hostname,

                    ambiente_id:
                        workstation.ambiente_id

                }
            );


            // ==========================
            // BUSCAR AMBIENTE
            // ==========================

            if (workstation.ambiente_id) {

                const ambiente =
                    await workstationRepository
                        .getAmbienteById(
                            workstation.ambiente_id
                        );


                if (ambiente) {

                    // ==========================
                    // ASIGNAR AMBIENTE A SESIÓN
                    // ==========================

                    sessionManager.setAmbiente(
                        sessionId,
                        ambiente
                    );


                    console.log(
                        "AMBIENTE ASIGNADO A SESIÓN:",
                        ambiente
                    );

                } else {

                    console.warn(
                        "NO SE ENCONTRÓ AMBIENTE PARA ID:",
                        workstation.ambiente_id
                    );

                }

            } else {

                console.warn(
                    "LA WORKSTATION NO TIENE AMBIENTE ASIGNADO."
                );

            }

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

            success: true,

            user:
                user,

            sessionId:
                sessionId,

            session:
                sesion

        };

    }

}


// ==========================
// EXPORTAR
// ==========================

module.exports =
    new AuthService();