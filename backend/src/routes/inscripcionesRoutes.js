import { Router } from 'express';
import * as controller from '../controllers/inscripcionesController.js';

const router = Router();

router.get('/', controller.obtenerInscripcionesGestion);
router.post('/', controller.crearInscripcionGestion);
router.delete('/:id', controller.eliminarInscripcionGestion);

// NUEVOS: Endpoints de soporte para los selectores del Modal
router.get('/aux/estudiantes', controller.obtenerEstudiantesAux);
router.get('/aux/cursos', controller.obtenerCursosAux);

export default router;