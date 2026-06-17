import { Router } from 'express';
import { 
    getCursos, 
    getCursoId, 
    crearCurso, 
    actualizarCurso, 
    eliminarCurso,
    generarDiplomaPdf 
} from '../controllers/cursoscontroller.js';

// Tu middleware de seguridad
import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

// Rutas públicas de lectura (Si querés que solo los logueados vean el catálogo, agregales el verificarToken también)
router.get('/', getCursos);
router.get('/:id', getCursoId); 

// RUTAS PROTEGIDAS: Ahora sí, el middleware intercepta la petición y arma el req.usuario
router.post('/', verificarToken, crearCurso); 
router.put('/:id', verificarToken, actualizarCurso); 
router.delete('/:id', verificarToken, eliminarCurso); 

// TU NUEVA RUTA PARA EL PDF
router.get('/diploma/:id', verificarToken, generarDiplomaPdf);

export default router;