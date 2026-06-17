import { query } from '../config/db.js';

export const obtenerTodasLasInscripciones = async () => {
    const sql = `
        SELECT 
            i.id_inscripcion,
            e.nombres || ' ' || e.apellido AS nombre_estudiante,
            c.nombre AS nombre_curso,
            ie.descripcion AS estado_nombre
        FROM public.inscripciones i
        JOIN public.estudiantes e ON i.id_estudiante = e.id_estudiante
        JOIN public.cursos c ON i.id_curso = c.id_curso
        JOIN public.inscripciones_estados ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
        ORDER BY i.id_inscripcion DESC
    `;
    const resultado = await query(sql);
    return resultado.rows;
};

export const verificarEstudianteExistenteYActivo = async (id_estudiante) => {
    const sql = `
        SELECT 1 
        FROM public.estudiantes 
        WHERE id_estudiante = $1 AND activo = 1
    `;
    const resultado = await query(sql, [id_estudiante]);
    return resultado.rows.length > 0;
};

export const buscarInscripcionPorId = async (id) => {
    const sql = 'SELECT * FROM public.inscripciones WHERE id_inscripcion = $1';
    const resultado = await query(sql, [id]);
    return resultado.rows[0];
};

export const buscarInscripcionActiva = async (id_curso, id_estudiante) => {
    const sql = `
        SELECT 1 FROM public.inscripciones 
        WHERE id_curso = $1 AND id_estudiante = $2 AND id_inscripcion_estado = 1
    `;
    const resultado = await query(sql, [id_curso, id_estudiante]);
    return resultado.rows.length > 0;
};

export const obtenerCuposCurso = async (id_curso) => {
    const sql = `
        SELECT 
            c.inscriptos_max,
            COUNT(i.id_inscripcion) as actuales
        FROM public.cursos c
        LEFT JOIN public.inscripciones i ON c.id_curso = i.id_curso AND i.id_inscripcion_estado = 1
        WHERE c.id_curso = $1
        GROUP BY c.inscriptos_max
    `;
    const resultado = await query(sql, [id_curso]);
    if (resultado.rows.length === 0) return null;
    
    return {
        inscriptos_max: resultado.rows[0].inscriptos_max,
        actuales: parseInt(resultado.rows[0].actuales, 10)
    };
};

export const insertarInscripcion = async (datos) => {
    const { id_curso, id_estudiante, id_inscripcion_estado, id_usuario_modificacion } = datos;
    
    const sql = `
        INSERT INTO public.inscripciones (
            id_curso, id_estudiante, fecha_hora_inscripcion, 
            id_inscripcion_estado, id_usuario_modificacion, fecha_hora_modificacion
        )
        VALUES ($1, $2, NOW(), $3, $4, NOW())
        RETURNING id_inscripcion;
    `;
    const resultado = await query(sql, [id_curso, id_estudiante, id_inscripcion_estado, id_usuario_modificacion]);
    return resultado.rows[0].id_inscripcion;
};

export const darDeBajaLogica = async (id_inscripcion, nuevo_estado, id_usuario_modificacion) => {
    const sqlInscripcion = `
        UPDATE public.inscripciones 
        SET id_inscripcion_estado = $2, 
            id_usuario_modificacion = $3, 
            fecha_hora_modificacion = NOW()
        WHERE id_inscripcion = $1
    `;
    await query(sqlInscripcion, [id_inscripcion, nuevo_estado, id_usuario_modificacion]);
};

// Para listar los estudiantes en el desplegable del Popup
export const obtenerListaEstudiantesBypass = async () => {
    const sql = `
        SELECT id_estudiante, nombres || ' ' || apellido AS nombre_completo 
        FROM public.estudiantes 
        WHERE activo = 1 
        ORDER BY apellido, nombres ASC
    `;
    const resultado = await query(sql);
    return resultado.rows;
};

// Para listar los cursos activos en el desplegable del Popup
export const obtenerListaCursosBypass = async () => {
    const sql = `
        SELECT id_curso, nombre, inscriptos_max 
        FROM public.cursos 
        WHERE id_curso_estado = 1 
        ORDER BY nombre ASC
    `;
    const resultado = await query(sql);
    return resultado.rows;
};