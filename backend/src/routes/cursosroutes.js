const express = require('express');
const router = express.Router();
// Agregamos eliminarCurso a la importación
const { getCursos, getCursoId,crearCurso, actualizarCurso, eliminarCurso } = require('../controllers/cursoscontroller');

router.get('/', getCursos);
router.get('/:id', getCursoId); //También nueva ruta
router.post('/', crearCurso); 
router.put('/:id', actualizarCurso); 
router.delete('/:id', eliminarCurso); // <--- NUEVA RUTA PARA ELIMINAR

module.exports = router;
