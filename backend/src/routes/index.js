import { Router } from 'express';

import dashboardRoutes from './dashboardRoutes.js';
import estudiantesRoutes from './estudiantesRoutes.js';
import cursosRoutes from './cursosroutes.js'; 
import authRoutes from './authRoutes.js'; 

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/estudiantes', estudiantesRoutes);
router.use('/cursos', cursosRoutes); 
router.use('/auth', authRoutes);

export default router;