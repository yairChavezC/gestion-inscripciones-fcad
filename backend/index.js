import express from 'express';
import cors from 'cors';
import { testConnection } from './src/config/db.js';

// 1. IMPORTAR TODAS LAS RUTAS ACÁ ARRIBA (Agregando siempre la extensión .js)
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import estudiantesRoutes from './src/routes/estudiantesRoutes.js';
import cursosRoutes from './src/routes/cursosroutes.js'; 
import authRoutes from './src/routes/authRoutes.js'; 

const app = express();

app.use(cors());
app.use(express.json());

// 2. VINCULAR LAS RUTAS AL SERVIDOR (Siempre antes del listen)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/cursos', cursosRoutes); 
app.use('/api/auth', authRoutes);

// Usamos el puerto de tu archivo .env
const PORT = process.env.PORT || 4000;

// 3. PRENDER EL SERVIDOR
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
});