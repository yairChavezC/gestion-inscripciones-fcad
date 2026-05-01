const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursoscontroller.js');

// Definimos el endpoint: GET /api/cursos
router.get('/', cursosController.getCursos);

module.exports = router;