require("dotenv").config();
const { Pool } = require("pg");

class DatabaseManager {
    constructor() {
        this.pool = null;
    }

    connect() {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            console.error(
                "ERROR: No se encontró la variable DATABASE_URL."
            );
            return;
        }

        this.pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });

        this.pool.on("error", (error) => {
            console.error(
                "Error inesperado en el pool de PostgreSQL:",
                error
            );
        });

        this.pool.query("SELECT NOW()", (error, result) => {
            if (error) {
                console.error(
                    "Error conectando con Supabase:",
                    error
                );
                return;
            }

            console.log(
                "Base de datos Supabase conectada correctamente."
            );

            console.log(
                "Hora del servidor PostgreSQL:",
                result.rows[0].now
            );
        });
    }

    getConnection() {
        return this.pool;
    }
}

module.exports = new DatabaseManager();