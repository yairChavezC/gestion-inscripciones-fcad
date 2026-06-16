import * as estudianteRepository from '../repositories/estudianteRepository.js';

const PAGE_SIZE = 10;

// B - Browse: lista paginada de estudiantes según búsqueda
export const listarEstudiantes = async (page = 1, search = '') => {
    const limit = PAGE_SIZE;
    const offset = (page - 1) * limit;

    const totalEstudiantes = await estudianteRepository.contarEstudiantes(search);
    const totalPages = Math.ceil(totalEstudiantes / limit);
    const estudiantes = await estudianteRepository.obtenerEstudiantes(search, limit, offset);

    return {
        estudiantes,
        pagination: { totalEstudiantes, totalPages, currentPage: parseInt(page) }
    };
};

// R - Read: detalle de un estudiante
export const obtenerDetalleEstudiante = async (id) => {
    const estudiante = await estudianteRepository.obtenerEstudiantePorId(id);
    if (!estudiante) {
        throw new Error('NOT_FOUND');
    }
    return estudiante;
};

// A - Add: validar y crear un estudiante nuevo
export const registrarEstudiante = async (datos) => {
    const { documento, apellido, nombres } = datos;

    if (!documento || !apellido || !nombres) {
        throw new Error('VALIDATION_ERROR');
    }

    const yaExiste = await estudianteRepository.buscarPorDocumento(documento);
    if (yaExiste) {
        throw new Error('DOCUMENTO_DUPLICADO');
    }

    return await estudianteRepository.insertarEstudiante(datos);
};

// E - Edit: validar y actualizar un estudiante existente
export const actualizarDatosEstudiante = async (id, datos) => {
    const { documento, apellido, nombres } = datos;

    if (!documento || !apellido || !nombres) {
        throw new Error('VALIDATION_ERROR');
    }

    const loUsaOtro = await estudianteRepository.buscarPorDocumento(documento, id);
    if (loUsaOtro) {
        throw new Error('DOCUMENTO_DUPLICADO');
    }

    const estudianteActualizado = await estudianteRepository.modificarEstudianteDB(id, datos);
    if (!estudianteActualizado) {
        throw new Error('NOT_FOUND');
    }

    return estudianteActualizado;
};

// D - Delete: soft delete de un estudiante
export const darDeBajaEstudiante = async (id) => {
    const fueEliminado = await estudianteRepository.eliminarEstudianteDB(id);
    if (!fueEliminado) {
        throw new Error('NOT_FOUND');
    }
    return true;
};