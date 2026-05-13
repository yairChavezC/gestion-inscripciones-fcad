const { query } = require('../config/db');

// R - Read: Obtener todos los cursos (Paginados y con búsqueda)
const getCursos = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Contamos solo los cursos cuyo estado tenga es_activo = 1
        const countRes = await query(
            `SELECT COUNT(*) 
             FROM cursos c
             JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
             WHERE ce.es_activo = 1 AND (c.nombre ILIKE $1 OR c.descripcion ILIKE $1)`,
            [`%${search}%`]
        );

        const totalCursos = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalCursos / limit);

        // Traemos los datos y el nombre del estado para mostrarlo en el front
        const cursosRes = await query(
            `SELECT c.*, ce.descripcion as estado_nombre
             FROM cursos c
             JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
             WHERE ce.es_activo = 1 AND (c.nombre ILIKE $1 OR c.descripcion ILIKE $1)
             ORDER BY c.nombre ASC 
             LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        res.json({
            cursos: cursosRes.rows,
            pagination: {
                totalCursos,
                totalPages,
                currentPage: parseInt(page)
            }
        });
    } catch (error) {
        console.error('Error al obtener cursos:', error.message);
        res.status(500).json({ mensaje: "Error al obtener listado de cursos" });
    }
};

// R - Read: Obtener un solo curso por ID
const getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            `SELECT c.*, ce.descripcion as estado_nombre
             FROM cursos c
             JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
             WHERE c.id_curso = $1 AND ce.es_activo = 1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Curso no encontrado o eliminado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: "Error al obtener el detalle del curso" });
    }
};

// A - Add: Crear un nuevo curso
const createCurso = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado } = req.body;

        if (!nombre || !descripcion || !fecha_inicio) {
            return res.status(400).json({ mensaje: "Nombre, descripción y fecha de inicio son obligatorios" });
        }

        const queryText = `
            INSERT INTO cursos (
                nombre, descripcion, fecha_inicio, cantidad_horas, 
                inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion
            )
            VALUES ($1, $2, $3, $4, $5, $6, 1, NOW()) 
            RETURNING *;
        `;

        const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado || 1];
        const result = await query(queryText, values);

        res.status(201).json({
            mensaje: "Curso creado con éxito",
            curso: result.rows[0]
        });
    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ mensaje: "Error al crear el curso", detalle: error.message });
    }
};

// U - Update: Editar curso
const updateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado } = req.body;

        const queryText = `
            UPDATE cursos 
            SET nombre = $1, descripcion = $2, fecha_inicio = $3, 
                cantidad_horas = $4, inscriptos_max = $5, id_curso_estado = $6,
                fecha_hora_modificacion = NOW()
            WHERE id_curso = $7
            RETURNING *;
        `;

        const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id];
        const result = await query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Curso no encontrado" });
        }

        res.json({ mensaje: "Curso actualizado con éxito", curso: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar curso:', error.message);
        res.status(500).json({ mensaje: "Error al actualizar el curso" });
    }
};

// D - Delete: Soft Delete (Cambio de estado)
const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;

        // Según image_dc4419.png, el estado 4 es ELIMINADO (es_activo = 0)
        const queryText = `
            UPDATE cursos 
            SET id_curso_estado = 4, 
                fecha_hora_modificacion = NOW() 
            WHERE id_curso = $1
            RETURNING id_curso, nombre;
        `;

        const result = await query(queryText, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Curso no encontrado" });
        }

        res.json({ 
            mensaje: "Curso movido a estado ELIMINADO correctamente", 
            curso: result.rows[0] 
        });
    } catch (error) {
        console.error('Error en Soft Delete curso:', error.message);
        res.status(500).json({ mensaje: "Error al eliminar el curso" });
    }
};

module.exports = { getCursos, getCursoById, createCurso, updateCurso, deleteCurso };