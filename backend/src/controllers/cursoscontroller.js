import * as cursoService from '../services/cursoService.js';

export const getCursos = async (req, res) => {
    try {
        // 1. Atrapamos el parámetro 'search' además del limit y offset
        const { limit, offset, search } = req.query; 
        
        // 2. Se lo pasamos al servicio
        const resultado = await cursoService.listarCursos(limit, offset, search); 
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar el catálogo' });
    }
};

export const getCursoId = async (req, res) => {
    try {
        const curso = await cursoService.obtenerDetalleCurso(req.params.id);
        res.json(curso);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Curso no encontrado o inactivo' });
        }
        console.error('Error al obtener el detalle del curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const crearCurso = async (req, res) => {
    try {
        // AGREGADO: Capturamos quién está haciendo la acción gracias al token
        const id_usuario = req.usuario.id_usuario; 
        
        // AGREGADO: Pasamos el id_usuario al servicio
        const nuevoCurso = await cursoService.registrarCurso(req.body, id_usuario);
        res.status(201).json(nuevoCurso);
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        console.error('Error al crear curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizarCurso = async (req, res) => {
    try {
        // AGREGADO: Capturamos el usuario desde el token
        const id_usuario = req.usuario.id_usuario;
        
        // AGREGADO: Pasamos el id_usuario al servicio
        const cursoActualizado = await cursoService.actualizarDatosCurso(req.params.id, req.body, id_usuario);
        res.json(cursoActualizado);
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ error: 'Todos los campos son obligatorios para actualizar' });
        }
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        console.error('Error al actualizar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const eliminarCurso = async (req, res) => {
    try {
        // AGREGADO: Capturamos el usuario desde el token
        const id_usuario = req.usuario.id_usuario;
        
        // AGREGADO: Pasamos el id_usuario al servicio
        await cursoService.darDeBajaCurso(req.params.id, id_usuario);
        res.json({ message: 'Curso eliminado correctamente' });
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        console.error('Error al eliminar curso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};