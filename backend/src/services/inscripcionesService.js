import * as inscripcionesRepo from '../repositories/inscripcionesRepository.js';

export const listarGestionInscripciones = async () => {
    return await inscripcionesRepo.obtenerTodasLasInscripciones();
};

export const procesarNuevaInscripcion = async (datosInscripcion) => {
    const { id_curso, id_estudiante, id_usuario_modificacion } = datosInscripcion;

    const estudianteValido = await inscripcionesRepo.verificarEstudianteExistenteYActivo(id_estudiante);
    if (!estudianteValido) {
        throw new Error('ESTUDIANTE_NO_ENCONTRADO_O_INACTIVO');
    }

    const existeInscripcion = await inscripcionesRepo.buscarInscripcionActiva(id_curso, id_estudiante);
    if (existeInscripcion) {
        throw new Error('ALUMNO_YA_INSCRITO');
    }

    const cursoInfo = await inscripcionesRepo.obtenerCuposCurso(id_curso);
    if (!cursoInfo || cursoInfo.actuales >= cursoInfo.inscriptos_max) {
        throw new Error('SIN_CUPOS_DISPONIBLES');
    }

    const id_inscripcion_estado = 1;

    const inscripcionId = await inscripcionesRepo.insertarInscripcion({
        id_curso,
        id_estudiante,
        id_inscripcion_estado,
        id_usuario_modificacion
    });

    return { id_inscripcion: inscripcionId, ...datosInscripcion, id_inscripcion_estado };
};

export const borrarInscripcion = async (id_inscripcion, id_usuario_modificacion) => {
    const inscripcion = await inscripcionesRepo.buscarInscripcionPorId(id_inscripcion);
    if (!inscripcion || inscripcion.id_inscripcion_estado !== 1) {
        throw new Error('INSCRIPCION_NO_ENCONTRADA_O_INACTIVA');
    }

    const nuevo_estado = 2;

    await inscripcionesRepo.darDeBajaLogica(id_inscripcion, nuevo_estado, id_usuario_modificacion, inscripcion.id_curso);
};

export const listarEstudiantesAux = async () => {
    return await inscripcionesRepo.obtenerListaEstudiantesBypass();
};

export const listarCursosAux = async () => {
    return await inscripcionesRepo.obtenerListaCursosBypass();
};