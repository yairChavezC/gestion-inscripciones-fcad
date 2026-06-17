import * as service from '../services/inscripcionesService.js';

export const obtenerInscripcionesGestion = async (req, res) => {
    try {
        const data = await service.listarGestionInscripciones();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const crearInscripcionGestion = async (req, res) => {
    try {
        const { id_estudiante, id_curso } = req.body;
        const id_usuario_modificacion = req.usuario?.id_usuario || req.usuario?.id || 1;

        if (!id_estudiante || !id_curso) {
            return res.status(400).json({ error: 'Los campos id_estudiante e id_curso son obligatorios.' });
        }

        const nuevaInscripcion = await service.procesarNuevaInscripcion({
            id_curso,
            id_estudiante,
            id_usuario_modificacion
        });

        return res.status(201).json({
            mensaje: 'Inscripción procesada correctamente.',
            data: nuevaInscripcion
        });
    } catch (error) {
        if (error.message === 'ESTUDIANTE_NO_ENCONTRADO_O_INACTIVO') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'ALUMNO_YA_INSCRITO' || error.message === 'SIN_CUPOS_DISPONIBLES') {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const eliminarInscripcionGestion = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario_modificacion = req.usuario?.id || 1;

        if (!id) {
            return res.status(400).json({ error: 'El ID de la inscripción es requerido.' });
        }

        await service.borrarInscripcion(id, id_usuario_modificacion);

        return res.status(200).json({ mensaje: 'Inscripción cancelada y cupo liberado con éxito.' });
    } catch (error) {
        if (error.message === 'INSCRIPCION_NO_ENCONTRADA_O_INACTIVA') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerEstudiantesAux = async (req, res) => {
    try {
        const data = await service.listarEstudiantesAux();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerCursosAux = async (req, res) => {
    try {
        const data = await service.listarCursosAux();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};