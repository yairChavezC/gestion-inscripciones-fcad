import { Router } from 'express';
import { getResumen } from '../controllers/dashboardController.js';

const router = Router();

router.get('/resumen', getResumen); 

export default router;