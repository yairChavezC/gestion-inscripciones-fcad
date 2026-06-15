import { query } from '../config/db.js';

// B - Browse: Obtener todos los estudiantes con búsqueda y paginación
export const getEstudiantes = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const countRes = await query(
            'SELECT COUNT(*) FROM estudiantes WHERE activo = 1 AND (apellido ILIKE $1 OR nombres ILIKE $1 OR documento ILIKE $1)',
            [`%${search}%`]
        );

        const totalEstudiantes = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalEstudiantes / limit);

        const estudiantesRes = await query(
            `SELECT id_estudiante, documento, apellido, nombres, email, fecha_nacimiento, activo 
             FROM estudiantes 
             WHERE activo = 1 AND (apellido ILIKE $1 OR nombres ILIKE $1 OR documento ILIKE $1)
             ORDER BY apellido ASC 
             LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        res.json({
            estudiantes: estudiantesRes.rows,
            pagination: { totalEstudiantes, totalPages, currentPage: parseInt(page) }
        });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error.message);
        res.status(500).json({ mensaje: "Error al obtener listado de estudiantes" });
    }
};

// R - Read: Obtener un solo estudiante por su ID
export const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT * FROM estudiantes WHERE id_estudiante = $1 AND activo = 1',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o inactivo" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: "Error al obtener el detalle del estudiante" });
    }
};

// A - Add: Crear un nuevo estudiante
export const createEstudiante = async (req, res) => {
    try {
        const { documento, apellido, nombres, email, fecha_nacimiento } = req.body;

        if (!documento || !apellido || !nombres) {
            return res.status(400).json({ mensaje: "DNI, Apellido y Nombres son obligatorios" });
        }

        const duplicado = await query(
            'SELECT id_estudiante FROM estudiantes WHERE documento = $1 AND activo = 1',
            [documento]
        );
        if (duplicado.rowCount > 0) {
            return res.status(400).json({ mensaje: "Ya existe un estudiante activo con ese documento" });
        }

        const result = await query(
            `INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion)
             VALUES ($1, $2, $3, $4, $5, 1, 1, NOW()) RETURNING *`,
            [documento, apellido, nombres, email, fecha_nacimiento]
        );

        res.status(201).json({ mensaje: "Estudiante creado con éxito", estudiante: result.rows[0] });
    } catch (error) {
        console.error("Error al crear estudiante:", error.message);
        res.status(500).json({ mensaje: "Error al crear el estudiante", detalle: error.message });
    }
};

// E - Edit: Actualizar un estudiante existente
export const updateEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { documento, apellido, nombres, email, fecha_nacimiento } = req.body;

        if (!documento || !apellido || !nombres) {
            return res.status(400).json({ mensaje: "DNI, Apellido y Nombres son obligatorios" });
        }

        const duplicado = await query(
            'SELECT id_estudiante FROM estudiantes WHERE documento = $1 AND activo = 1 AND id_estudiante != $2',
            [documento, id]
        );
        if (duplicado.rowCount > 0) {
            return res.status(400).json({ mensaje: "Otro estudiante activo ya tiene ese documento" });
        }

        const result = await query(
            `UPDATE estudiantes 
             SET documento = $1, apellido = $2, nombres = $3, email = $4, fecha_nacimiento = $5, fecha_hora_modificacion = NOW()
             WHERE id_estudiante = $6 AND activo = 1 RETURNING *`,
            [documento, apellido, nombres, email, fecha_nacimiento, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o inactivo" });
        }

        res.json({ mensaje: "Estudiante actualizado con éxito", estudiante: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar estudiante:", error.message);
        res.status(500).json({ mensaje: "Error al actualizar el estudiante", detalle: error.message });
    }
};

// D - Delete: Borrado lógico (soft delete)
export const deleteEstudiante = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(
            `UPDATE estudiantes SET activo = 0, fecha_hora_modificacion = NOW()
             WHERE id_estudiante = $1 AND activo = 1 RETURNING id_estudiante`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o ya inactivo" });
        }

        res.json({ mensaje: "Estudiante eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar estudiante:", error.message);
        res.status(500).json({ mensaje: "Error al eliminar el estudiante" });
    }
};