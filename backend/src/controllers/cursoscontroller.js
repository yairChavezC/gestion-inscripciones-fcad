const { query } = require('../config/db');


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
            data: result.rows,
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

// 2. Crear un curso nuevo
const crearCurso = async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = req.body;
        
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

// 3. Actualizar un curso existente
const actualizarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = req.body;

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

// 4. Eliminar un curso (Borrado Lógico)
const eliminarCurso = async (req, res) => {
    try {
        const { id } = req.params;

        // En lugar de hacer DELETE, hacemos un UPDATE cambiando el estado a 4 (ELIMINADO)
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

// Exportamos todas las funciones juntas (¡Asegurate de agregar eliminarCurso acá!)
module.exports = {
    getCursos,
    crearCurso,
    actualizarCurso,
    eliminarCurso
};