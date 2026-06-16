import { query } from '../config/db.js';

// Cuenta cuántos estudiantes activos cumplen el criterio de búsqueda
export const contarEstudiantes = async (search) => {
    const result = await query(
        'SELECT COUNT(*) FROM estudiantes WHERE activo = 1 AND (apellido ILIKE $1 OR nombres ILIKE $1 OR documento ILIKE $1)',
        [`%${search}%`]
    );
    return parseInt(result.rows[0].count);
};

// Obtiene una página de estudiantes activos según el criterio de búsqueda
export const obtenerEstudiantes = async (search, limit, offset) => {
    const result = await query(
        `SELECT id_estudiante, documento, apellido, nombres, email, fecha_nacimiento, activo 
         FROM estudiantes 
         WHERE activo = 1 AND (apellido ILIKE $1 OR nombres ILIKE $1 OR documento ILIKE $1)
         ORDER BY apellido ASC 
         LIMIT $2 OFFSET $3`,
        [`%${search}%`, limit, offset]
    );
    return result.rows;
};

// Obtiene un estudiante activo por su ID
export const obtenerEstudiantePorId = async (id) => {
    const result = await query(
        'SELECT * FROM estudiantes WHERE id_estudiante = $1 AND activo = 1',
        [id]
    );
    return result.rows[0];
};

// Busca un estudiante activo por documento, excluyendo opcionalmente un ID (útil en edición)
export const buscarPorDocumento = async (documento, excluirId = null) => {
    const sql = excluirId
        ? 'SELECT id_estudiante FROM estudiantes WHERE documento = $1 AND activo = 1 AND id_estudiante != $2'
        : 'SELECT id_estudiante FROM estudiantes WHERE documento = $1 AND activo = 1';
    const params = excluirId ? [documento, excluirId] : [documento];
    const result = await query(sql, params);
    return result.rowCount > 0;
};

// Inserta un nuevo estudiante
export const insertarEstudiante = async (datos) => {
    const { documento, apellido, nombres, email, fecha_nacimiento } = datos;
    const result = await query(
        `INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion)
         VALUES ($1, $2, $3, $4, $5, 1, 1, NOW()) RETURNING *`,
        [documento, apellido, nombres, email, fecha_nacimiento]
    );
    return result.rows[0];
};

// Actualiza un estudiante activo existente
export const modificarEstudianteDB = async (id, datos) => {
    const { documento, apellido, nombres, email, fecha_nacimiento } = datos;
    const result = await query(
        `UPDATE estudiantes 
         SET documento = $1, apellido = $2, nombres = $3, email = $4, fecha_nacimiento = $5, fecha_hora_modificacion = NOW()
         WHERE id_estudiante = $6 AND activo = 1 RETURNING *`,
        [documento, apellido, nombres, email, fecha_nacimiento, id]
    );
    return result.rows[0];
};

// Soft delete: marca al estudiante como inactivo
export const eliminarEstudianteDB = async (id) => {
    const result = await query(
        `UPDATE estudiantes SET activo = 0, fecha_hora_modificacion = NOW()
         WHERE id_estudiante = $1 AND activo = 1 RETURNING id_estudiante`,
        [id]
    );
    return result.rowCount > 0;
};