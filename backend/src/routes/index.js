import { Router } from 'express';

import dashboardRoutes from './dashboardRoutes.js';
import estudiantesRoutes from './estudiantesRoutes.js';
import cursosRoutes from './cursosroutes.js'; 
import authRoutes from './authRoutes.js'; 
import inscripcionesRoutes from './inscripcionesRoutes.js'; 

import { verificarToken } from '../middlewares/verificarToken.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/estudiantes', estudiantesRoutes);
router.use('/cursos', cursosRoutes); 
router.use('/auth', authRoutes);

router.use(verificarToken);
router.use('/inscripciones', inscripcionesRoutes);

export default router;