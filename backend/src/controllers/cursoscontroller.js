const pool = require('../config/db');

const getCursos = async (req, res) => {
    try {
        // Paginación: tomamos 'limit' y 'offset' de la URL (ej: ?limit=10&offset=0)
        // Si no vienen, ponemos valores por defecto
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;

        // Consulta SQL con Soft Delete (solo cursos con estado activo)
        // Nota: Ajustá 'id_estado' o 'activo' según el nombre en tu DER
        const query = 'SELECT c.* FROM cursos c INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado WHERE ce.es_activo = 1 LIMIT $1 OFFSET $2';

        const values = [limit, offset];

        const result = await pool.query(query, values);

        res.json({
            data: result.rows,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: result.rowCount
            }
        });
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCursos
};