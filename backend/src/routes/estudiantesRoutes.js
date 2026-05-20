const express = require('express');
const router = express.Router();

const { 
        getEstudiantes, 
        getEstudianteById, 
        createEstudiante, 
        updateEstudiante, 
        deleteEstudiante 
    } = require('../controllers/estudiantesController');


// La ruta será GET /api/estudiantes

router.get('/', getEstudiantes);
router.get('/:id', getEstudianteById);
router.post('/', createEstudiante);
router.put('/:id', updateEstudiante);       // Para editar
router.delete('/:id', deleteEstudiante);


module.exports = router;



