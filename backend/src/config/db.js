import pkg from 'pg';
const { Pool } = pkg;

// Ya no necesitamos dotenv aquí, porque usamos --env-file en el package.json
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

export const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Conexión a PostgreSQL exitosa:', res.rows[0].now);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); 
    }
};

// Exportamos de forma moderna
export const query = (text, params) => pool.query(text, params);