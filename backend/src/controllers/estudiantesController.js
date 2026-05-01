const { query } = require('../config/db');

const getEstudiantes = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const countRes = await query(
            'SELECT COUNT(*) FROM estudiantes WHERE activo = 1 AND (apellido ILIKE $1 OR nombres ILIKE $1)',
            [`%${search}%`]
        );

        const totalEstudiantes = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalEstudiantes / limit);

        // Agregamos fecha_nacimiento y mantenemos el id_estudiante
        const estudiantesRes = await query(
            `SELECT 
                id_estudiante, 
                documento, 
                apellido, 
                nombres, 
                email, 
                fecha_nacimiento, -- Agregado
                activo 
             FROM estudiantes 
             WHERE activo = 1 AND (apellido ILIKE $1 OR nombres ILIKE $1)
             ORDER BY apellido ASC 
             LIMIT $2 OFFSET $3`,
            [`%${search}%`, limit, offset]
        );

        res.json({
            estudiantes: estudiantesRes.rows,
            pagination: {
                totalEstudiantes,
                totalPages,
                currentPage: parseInt(page)
            }
        });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error.message);
        res.status(500).json({ mensaje: "Error al obtener listado de estudiantes" });
    }
};

// R - Read: Obtener un solo estudiante por su ID
const getEstudianteById = async (req, res) => {
    try {
        // req.params.id captura el número que pongamos en la URL
        const { id } = req.params;

        const result = await query(
            'SELECT * FROM estudiantes WHERE id_estudiante = $1 AND activo = 1',
            [id]
        );

        // Si no hay resultados, avisamos que no existe
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o inactivo" });
        }

        // Enviamos solo el primer resultado (el único que debería haber)
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ mensaje: "Error al obtener el detalle del estudiante" });
    }
};

// A - Add: Crear un nuevo estudiante
const createEstudiante = async (req, res) => {
    try {
        const { documento, apellido, nombres, email, fecha_nacimiento } = req.body;

        if (!documento || !apellido || !nombres) {
            return res.status(400).json({ mensaje: "DNI, Apellido y Nombres son obligatorios" });
        }

        const queryText = `
            INSERT INTO estudiantes (
                documento, 
                apellido, 
                nombres, 
                email, 
                fecha_nacimiento, 
                activo,
                id_usuario_modificacion, -- Agregamos esta columna
                fecha_hora_modificacion  -- Y esta también por las dudas
            )
            VALUES ($1, $2, $3, $4, $5, 1, 1, NOW()) -- Ponemos 1 y la hora actual
            RETURNING *;
        `;

        const values = [documento, apellido, nombres, email, fecha_nacimiento];
        const result = await query(queryText, values);

        res.status(201).json({
            mensaje: "Estudiante creado con éxito",
            estudiante: result.rows[0]
        });
    } catch (error) {
        console.error("ERROR REAL:", error.message); // Esto te ayuda a ver fallos en la terminal
        res.status(500).json({ mensaje: "Error al crear el estudiante", detalle: error.message });
    }
};

module.exports = { getEstudiantes, getEstudianteById, createEstudiante };
