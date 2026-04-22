const { Pool } = require('pg');
require('dotenv').config(); // Carga las variables del archivo .env

// Creamos el pool de conexiones usando las variables del .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Función para probar la conexión y exportar el pool
const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Conexión a PostgreSQL exitosa:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err.stack);
        process.exit(1); // Detiene la aplicación si la conexión falla
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    testConnection,
};