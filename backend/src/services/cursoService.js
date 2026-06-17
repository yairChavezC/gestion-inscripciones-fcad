import * as cursoRepository from '../repositories/cursoRepository.js';

// Agregamos search con un valor por defecto vacío ('') por si el usuario no busca nada
export const listarCursos = async (limit, offset, search = '') => {
    const limitNum = limit || 10;
    const offsetNum = offset || 0;
    
    // Pasamos el search al repositorio
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

export const obtenerDetalleCurso = async (id) => {
    const curso = await cursoRepository.obtenerCursoPorId(id);
    if (!curso) {
        throw new Error('NOT_FOUND');
    }
    return curso;
};

// AGREGADO: Recibe id_usuario
export const registrarCurso = async (cursoData, id_usuario) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    
    if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
        throw new Error('VALIDATION_ERROR');
    }
    
    // AGREGADO: Pasa id_usuario al Repositorio
    return await cursoRepository.insertarCurso(cursoData, id_usuario);
};

// AGREGADO: Recibe id_usuario
export const actualizarDatosCurso = async (id, cursoData, id_usuario) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max } = cursoData;
    
    if (!nombre || !descripcion || !fecha_inicio || !cantidad_horas || !inscriptos_max) {
        throw new Error('VALIDATION_ERROR');
    }
    
    // AGREGADO: Pasa id_usuario al Repositorio
    const cursoActualizado = await cursoRepository.modificarCursoDB(id, cursoData, id_usuario);
    if (!cursoActualizado) {
        throw new Error('NOT_FOUND');
    }
    
    return cursoActualizado;
};

// AGREGADO: Recibe id_usuario
export const darDeBajaCurso = async (id, id_usuario) => {
    // AGREGADO: Pasa id_usuario al Repositorio
    const fueEliminado = await cursoRepository.eliminarCursoDB(id, id_usuario);
    if (!fueEliminado) {
        throw new Error('NOT_FOUND');
    }
    return true;
};