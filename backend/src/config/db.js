const { Pool } = require('pg'); // Esta es la librería correcta para Postgres
require('dotenv').config();

// En Postgres usamos simplemente new Pool()
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT, // Asegurate que en el .env sea 5432
});

const testConnection = async () => {
    try {
        // SELECT NOW() es perfecto para probar la conexión en Postgres
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Conexión a PostgreSQL exitosa:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
        process.exit(1); 
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    testConnection,
};