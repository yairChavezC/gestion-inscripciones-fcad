const db = require('../config/db');

const getResumen = async (req, res) => {
    try {
        // Consultas a las tablas según el diagrama del enunciado [cite: 34]
        const estudiantesRes = await db.query('SELECT COUNT(*) FROM estudiantes WHERE activo = true');
        const cursosRes = await db.query('SELECT COUNT(*) FROM cursos WHERE id_curso_estado = 1');

        res.json({
            totalEstudiantes: parseInt(estudiantesRes.rows[0].count),
            totalCursos: parseInt(cursosRes.rows[0].count)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener totales" });
    }
};

module.exports = { getResumen };