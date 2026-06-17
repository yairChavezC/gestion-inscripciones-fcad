import * as cursoRepository from '../repositories/cursoRepository.js';

// Devuelve el listado de cursos formateado con los datos de paginación y búsqueda
export const listarCursos = async (limit, offset, search = '') => {
    const limitNum = limit || 10;
    const offsetNum = offset || 0;
    
    const { rows, count } = await cursoRepository.obtenerCursos(limitNum, offsetNum, search);
    
    return {
        cursos: rows,
        pagination: {
            limit: parseInt(limitNum),
            offset: parseInt(offsetNum),
            count: parseInt(count) 
        }
    };
};

// Busca un curso por ID y lanza un error si no existe
export const obtenerDetalleCurso = async (id) => {
    const curso = await cursoRepository.obtenerCursoPorId(id);
    if (!curso) {
        throw new Error('NOT_FOUND');
    }
    return curso;
};

// Valida que estén todos los datos requeridos antes de mandar a crear el curso
export const registrarCurso = async (cursoData, id_usuario) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    
    if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
        throw new Error('VALIDATION_ERROR');
    }
    
    return await cursoRepository.insertarCurso(cursoData, id_usuario);
};

// Verifica que la información esté completa antes de actualizar un curso existente
export const actualizarDatosCurso = async (id, cursoData, id_usuario) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    
    if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
        throw new Error('VALIDATION_ERROR');
    }
    
    const cursoActualizado = await cursoRepository.modificarCursoDB(id, cursoData, id_usuario);
    if (!cursoActualizado) {
        throw new Error('NOT_FOUND');
    }
    
    return cursoActualizado;
};

// Ejecuta la baja lógica del curso y confirma si se realizó con éxito
export const darDeBajaCurso = async (id, id_usuario) => {
    const fueEliminado = await cursoRepository.eliminarCursoDB(id, id_usuario);
    if (!fueEliminado) {
        throw new Error('NOT_FOUND');
    }
    return true;
};