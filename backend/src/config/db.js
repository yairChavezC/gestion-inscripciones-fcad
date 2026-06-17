import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// Conectamos a la base de datos PostgreSQL con los datos del archivo .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Esta función se ejecuta al arrancar el servidor para avisarnos si la BD conectó bien o falló
export const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Conexión a PostgreSQL exitosa:', res.rows[0].now);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); 
    }
};

// Función rápida para ejecutar las consultas SQL desde los repositorios sin repetir código
export const query = (text, params) => pool.query(text, params);