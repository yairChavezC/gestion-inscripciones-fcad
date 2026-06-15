import { Router } from 'express';
import { 
    getEstudiantes, 
    getEstudianteById, 
    createEstudiante, 
    updateEstudiante, 
    deleteEstudiante 
} from '../controllers/estudiantesController.js';

const router = Router();

router.get('/', getEstudiantes);
router.get('/:id', getEstudianteById);
router.post('/', createEstudiante);
router.put('/:id', updateEstudiante);       
router.delete('/:id', deleteEstudiante);

export default router;


