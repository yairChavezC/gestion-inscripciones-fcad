import { query } from '../config/db.js';

// Obtiene la lista de cursos activos aplicando paginación y filtro de búsqueda por nombre. 
// Devuelve también el total de registros para armar el paginador en el frontend.
export const obtenerCursos = async (limit, offset, search = '') => {
    const searchParam = `%${search}%`;
    
    const sqlText = `
        SELECT c.*, ce.descripcion as estado_nombre 
        FROM cursos c 
        INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
        WHERE ce.es_activo = 1 AND c.nombre ILIKE $3
        ORDER BY c.id_curso ASC
        LIMIT $1 OFFSET $2
    `;
    const result = await query(sqlText, [limit, offset, searchParam]);

    const countSql = `
        SELECT COUNT(*) 
        FROM cursos c 
        INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
        WHERE ce.es_activo = 1 AND c.nombre ILIKE $1
    `;
    const countResult = await query(countSql, [searchParam]);

    return { 
        rows: result.rows, 
        count: countResult.rows[0].count 
    };
};

// Busca un curso específico por su ID asegurando que esté en estado activo
export const obtenerCursoPorId = async (id) => {
    const sqlText = `
        SELECT c.*, ce.descripcion as estado_nombre 
        FROM cursos c 
        INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
        WHERE c.id_curso = $1 AND ce.es_activo = 1
    `;
    const result = await query(sqlText, [id]);
    return result.rows[0];
};

// Crea un nuevo curso en la base de datos y registra qué usuario realizó la inserción
export const insertarCurso = async (cursoData, id_usuario) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    const sql = `
        INSERT INTO cursos 
        (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion) 
        VALUES ($1, $2, $3, $4, $5, 1, $6, NOW()) 
        RETURNING *
    `;
    const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_usuario];
    const result = await query(sql, values);
    return result.rows[0];
};

// Actualiza los datos de un curso existente y guarda el usuario que hizo la modificación
export const modificarCursoDB = async (id, cursoData, id_usuario) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    const sql = `
        UPDATE cursos 
        SET nombre = $1, descripcion = $2, fecha_inicio = $3, cantidad_horas = $4, inscriptos_max = $5, 
            id_usuario_modificacion = $6, fecha_hora_modificacion = NOW()
        WHERE id_curso = $7 
        RETURNING *
    `;
    const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_usuario, id];
    const result = await query(sql, values);
    return result.rows[0];
};

// Realiza una baja lógica del curso (cambia su estado) registrando qué usuario lo eliminó
export const eliminarCursoDB = async (id, id_usuario) => {
    const sql = `
        UPDATE cursos 
        SET id_curso_estado = 4, 
            id_usuario_modificacion = $2, 
            fecha_hora_modificacion = NOW()
        WHERE id_curso = $1 
        RETURNING *
    `;
    const result = await query(sql, [id, id_usuario]);
    return result.rowCount > 0;
};