const express = require('express');
const router = express.Router();

const { 
    getCursos, 
    getCursoById, 
    createCurso, 
    updateCurso, 
    deleteCurso 
} = require('../controllers/cursosController'); // Cambiado a cursosController

router.get('/', getCursos);
router.get('/:id', getCursoById);
router.post('/', createCurso);
router.put('/:id', updateCurso);       
router.delete('/:id', deleteCurso);

module.exports = router;




