const express = require('express');
const router = express.Router();
// Agregamos eliminarCurso a la importación
const { getCursos, crearCurso, actualizarCurso, eliminarCurso } = require('../controllers/cursosController');

router.get('/', getCursos);
router.post('/', crearCurso); 
router.put('/:id', actualizarCurso); 
router.delete('/:id', eliminarCurso); // <--- NUEVA RUTA PARA ELIMINAR

