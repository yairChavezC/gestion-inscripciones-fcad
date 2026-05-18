const { query } = require('../config/db');

// R - Read: Obtener todos los cursos (Paginados y con búsqueda)
const getCursos = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;

        const sqlText = `
            SELECT c.*, ce.descripcion as estado_nombre 
            FROM cursos c 
            INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
            WHERE ce.es_activo = 1 
            ORDER BY c.id_curso ASC
            LIMIT $1 OFFSET $2
        `;
        const values = [limit, offset];
        const result = await query(sqlText, values);

        res.json({
            cursos: result.rows,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                count: result.rowCount 
            }
        });
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el catálogo' });
    }
};

const getCursoId = async (req, res) => {
    try {
        const { id } = req.params;

        const sqlText = `
            SELECT c.*, ce.descripcion as estado_nombre 
            FROM cursos c 
            INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
            WHERE c.id_curso = $1 AND ce.es_activo = 1
        `;
        const result = await query(sqlText, [id]);

        // retorna 404 si el curso no existe o está dado de baja
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Curso no encontrado o inactivo' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el detalle del curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crea un curso nuevo
const crearCurso = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = req.body;

        //Validaciones de campos obligatorios
        if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max)' });
        }

        const sql = `
            INSERT INTO cursos 
            (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion) 
            VALUES ($1, $2, $3, $4, $5, 1, 1, NOW()) 
            RETURNING *
        `;
        const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max];
        const result = await query(sql, values);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualiza un curso existente
const actualizarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = req.body;

        //Validaciones
        if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios para actualizar' });
        }
        
        const sql = `
            UPDATE cursos 
            SET nombre = $1, descripcion = $2, fecha_inicio = $3, cantidad_horas = $4, inscriptos_max = $5, fecha_hora_modificacion = NOW()
            WHERE id_curso = $6 
            RETURNING *
        `;
        const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id];
        const result = await query(sql, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Elimina un curso (Borrado Lógico)
const eliminarCurso = async (req, res) => {
    try {
        const { id } = req.params;

        // En lugar de hacer DELETE, se hacqe un UPDATE cambiando el estado a 4 (ELIMINADO)
        const sql = `
            UPDATE cursos 
            SET id_curso_estado = 4, fecha_hora_modificacion = NOW()
            WHERE id_curso = $1 
            RETURNING *
        `;
        const result = await query(sql, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }

        res.json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Exporta todas las funciones juntas
module.exports = {
    getCursos,
    getCursoId,
    crearCurso,
    actualizarCurso,
    eliminarCurso
};
