import { Router } from 'express';
import { 
    getCursos, 
    getCursoId, 
    crearCurso, 
    actualizarCurso, 
    eliminarCurso 
} from '../controllers/cursoscontroller.js';

const router = Router();

router.get('/', getCursos);
router.get('/:id', getCursoId); 
router.post('/', crearCurso); 
router.put('/:id', actualizarCurso); 
router.delete('/:id', eliminarCurso); 

export default router;