import { query } from '../config/db.js';

export const obtenerTotalEstudiantes = async () => {
    const res = await query('SELECT COUNT(*) FROM estudiantes WHERE activo = 1');
    return parseInt(res.rows[0].count);
};

export const obtenerTotalCursos = async () => {
    const res = await query('SELECT COUNT(*) FROM cursos WHERE id_curso_estado = 1');
    return parseInt(res.rows[0].count);
};

export const obtenerCursosActivos = async (limite = 5) => {
    const res = await query('SELECT id_curso, nombre FROM cursos WHERE id_curso_estado = 1 LIMIT $1', [limite]);
    return res.rows;
};