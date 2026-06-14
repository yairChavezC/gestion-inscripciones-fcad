import * as cursoRepository from '../repositories/cursoRepository.js';

export const listarCursos = async (limit, offset) => {
    const limitNum = limit || 10;
    const offsetNum = offset || 0;
    
    const { rows, rowCount } = await cursoRepository.obtenerCursos(limitNum, offsetNum);
    
    return {
        cursos: rows,
        pagination: {
            limit: parseInt(limitNum),
            offset: parseInt(offsetNum),
            count: rowCount 
        }
    };
};

export const obtenerDetalleCurso = async (id) => {
    const curso = await cursoRepository.obtenerCursoPorId(id);
    if (!curso) {
        throw new Error('NOT_FOUND');
    }
    return curso;
};

export const registrarCurso = async (cursoData) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    
    if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
        throw new Error('VALIDATION_ERROR');
    }
    
    return await cursoRepository.insertarCurso(cursoData);
};

export const actualizarDatosCurso = async (id, cursoData) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    
    if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
        throw new Error('VALIDATION_ERROR');
    }
    
    const cursoActualizado = await cursoRepository.modificarCursoDB(id, cursoData);
    if (!cursoActualizado) {
        throw new Error('NOT_FOUND');
    }
    
    return cursoActualizado;
};

export const darDeBajaCurso = async (id) => {
    const fueEliminado = await cursoRepository.eliminarCursoDB(id);
    if (!fueEliminado) {
        throw new Error('NOT_FOUND');
    }
    return true;
};