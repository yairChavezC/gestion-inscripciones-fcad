import { Router } from 'express';
import { 
    getCursos, 
    getCursoId, 
    crearCurso, 
    actualizarCurso, 
    eliminarCurso,
    generarDiplomaPdf 
} from '../controllers/cursoscontroller.js';

// Middleware de autenticación y seguridad
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// Rutas públicas de lectura (catálogo y detalles)
router.get('/', getCursos);
router.get('/:id', getCursoId); 

// Rutas protegidas (requieren autenticación para crear, editar o eliminar datos)
router.post('/', verificarToken, crearCurso); 
router.put('/:id', verificarToken, actualizarCurso); 
router.delete('/:id', verificarToken, eliminarCurso); 

// Ruta protegida para la generación y descarga de diplomas PDF
router.get('/diploma/:id', verificarToken, generarDiplomaPdf);

export default router;