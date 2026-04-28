const { query } = require('../config/db');

const getResumen = async (req, res) => {
    try {
        // Cambiamos 'true' por '1' porque la columna es numérica (smallint)
        const estudiantesRes = await query('SELECT COUNT(*) FROM estudiantes WHERE activo = 1');
        
        // El id_curso_estado ya es un número, así que este debería estar bien
        const cursosRes = await query('SELECT COUNT(*) FROM cursos WHERE id_curso_estado = 1');

        res.json({
            totalEstudiantes: parseInt(estudiantesRes.rows[0].count),
            totalCursos: parseInt(cursosRes.rows[0].count)
        });
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error.message);
        res.status(500).json({ mensaje: "Error al obtener totales" });
    }
};

module.exports = { getResumen };