import { Router } from 'express';
import { 
    getCursos, 
    getCursoId, 
    crearCurso, 
    actualizarCurso, 
    eliminarCurso 
} from '../controllers/cursoscontroller.js';

// 1. Importamos el middleware (asegurate de que la ruta sea la correcta en tu proyecto)
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

// 2. Inyectamos verificarToken antes de llamar al controlador en cada ruta
router.get('/', verificarToken, getCursos);
router.get('/:id', verificarToken, getCursoId); 
router.post('/', verificarToken, crearCurso); 
router.put('/:id', verificarToken, actualizarCurso); 
router.delete('/:id', verificarToken, eliminarCurso); 

export default router;