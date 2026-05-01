const express = require('express');
const router = express.Router();
const { getEstudiantes, getEstudianteById, createEstudiante} = require('../controllers/estudiantesController');

// La ruta será GET /api/estudiantes
router.get('/', getEstudiantes);
router.get('/:id', getEstudianteById);
router.post('/', createEstudiante);

module.exports = router;