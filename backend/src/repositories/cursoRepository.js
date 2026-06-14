import { query } from '../config/db.js';

export const obtenerCursos = async (limit, offset) => {
    const sqlText = `
        SELECT c.*, ce.descripcion as estado_nombre 
        FROM cursos c 
        INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
        WHERE ce.es_activo = 1 
        ORDER BY c.id_curso ASC
        LIMIT $1 OFFSET $2
    `;
    const result = await query(sqlText, [limit, offset]);
    return { rows: result.rows, rowCount: result.rowCount };
};

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

export const insertarCurso = async (cursoData) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    const sql = `
        INSERT INTO cursos 
        (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion) 
        VALUES ($1, $2, $3, $4, $5, 1, 1, NOW()) 
        RETURNING *
    `;
    const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max];
    const result = await query(sql, values);
    return result.rows[0];
};

export const modificarCursoDB = async (id, cursoData) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    const sql = `
        UPDATE cursos 
        SET nombre = $1, descripcion = $2, fecha_inicio = $3, cantidad_horas = $4, inscriptos_max = $5, fecha_hora_modificacion = NOW()
        WHERE id_curso = $6 
        RETURNING *
    `;
    const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id];
    const result = await query(sql, values);
    return result.rows[0];
};

export const eliminarCursoDB = async (id) => {
    const sql = `
        UPDATE cursos 
        SET id_curso_estado = 4, fecha_hora_modificacion = NOW()
        WHERE id_curso = $1 
        RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
};