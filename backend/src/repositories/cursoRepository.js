import { query } from '../config/db.js';

// 1. AGREGADO: Parámetro search y conteo total
export const obtenerCursos = async (limit, offset, search = '') => {
    // Le agregamos los % para que funcione como un buscador "contiene"
    const searchParam = `%${search}%`;
    
    // Consulta principal: Agregamos el ILIKE $3
    const sqlText = `
        SELECT c.*, ce.descripcion as estado_nombre 
        FROM cursos c 
        INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado 
        WHERE ce.es_activo = 1 AND c.nombre ILIKE $3
        ORDER BY c.id_curso ASC
        LIMIT $1 OFFSET $2
    `;
    const result = await query(sqlText, [limit, offset, searchParam]);

    // Consulta para contar el total (necesario para que la paginación no se rompa al buscar)
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

// 2. AGREGADO: Parámetro id_usuario para reemplazar el "1" hardcodeado
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

// 3. AGREGADO: Registrar quién modificó el curso
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

// 4. AGREGADO: Registrar quién dio de baja el curso
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