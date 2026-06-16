import * as estudianteService from '../services/estudianteService.js';

// B - Browse: listado paginado con búsqueda
export const getEstudiantes = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;
        const resultado = await estudianteService.listarEstudiantes(page, search);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error.message);
        res.status(500).json({ mensaje: "Error al obtener listado de estudiantes" });
    }
};

// R - Read: detalle de un estudiante
export const getEstudianteById = async (req, res) => {
    try {
        const estudiante = await estudianteService.obtenerDetalleEstudiante(req.params.id);
        res.json(estudiante);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o inactivo" });
        }
        console.error('Error al obtener el detalle del estudiante:', error.message);
        res.status(500).json({ mensaje: "Error al obtener el detalle del estudiante" });
    }
};

// A - Add: crear un nuevo estudiante
export const createEstudiante = async (req, res) => {
    try {
        const nuevoEstudiante = await estudianteService.registrarEstudiante(req.body);
        res.status(201).json({ mensaje: "Estudiante creado con éxito", estudiante: nuevoEstudiante });
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ mensaje: "DNI, Apellido y Nombres son obligatorios" });
        }
        if (error.message === 'DOCUMENTO_DUPLICADO') {
            return res.status(400).json({ mensaje: "Ya existe un estudiante activo con ese documento" });
        }
        console.error('Error al crear estudiante:', error.message);
        res.status(500).json({ mensaje: "Error al crear el estudiante" });
    }
};

// E - Edit: actualizar un estudiante existente
export const updateEstudiante = async (req, res) => {
    try {
        const estudianteActualizado = await estudianteService.actualizarDatosEstudiante(req.params.id, req.body);
        res.json({ mensaje: "Estudiante actualizado con éxito", estudiante: estudianteActualizado });
    } catch (error) {
        if (error.message === 'VALIDATION_ERROR') {
            return res.status(400).json({ mensaje: "DNI, Apellido y Nombres son obligatorios" });
        }
        if (error.message === 'DOCUMENTO_DUPLICADO') {
            return res.status(400).json({ mensaje: "Otro estudiante activo ya tiene ese documento" });
        }
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o inactivo" });
        }
        console.error('Error al actualizar estudiante:', error.message);
        res.status(500).json({ mensaje: "Error al actualizar el estudiante" });
    }
};

// D - Delete: soft delete de un estudiante
export const deleteEstudiante = async (req, res) => {
    try {
        await estudianteService.darDeBajaEstudiante(req.params.id);
        res.json({ mensaje: "Estudiante eliminado correctamente" });
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ mensaje: "Estudiante no encontrado o ya inactivo" });
        }
        console.error('Error al eliminar estudiante:', error.message);
        res.status(500).json({ mensaje: "Error al eliminar el estudiante" });
    }
};