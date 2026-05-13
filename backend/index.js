const express = require('express');
const cors = require('cors');
const { testConnection, query } = require('./src/config/db');
require('dotenv').config();

// 1. IMPORTAR TODAS LAS RUTAS ACÁ ARRIBA
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const estudiantesRoutes = require('./src/routes/estudiantesRoutes');
const cursosRoutes = require('./src/routes/cursosroutes'); // <-- Ruta de cursos importada correctamente

const app = express();

app.use(cors());
app.use(express.json());

// 2. VINCULAR LAS RUTAS AL SERVIDOR (Siempre antes del listen)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/cursos', cursosRoutes); // <-- Paréntesis corregido y en el lugar correcto

// Usamos el puerto de tu archivo .env (que sabemos que es el 4000)
const PORT = process.env.PORT || 4000;

// 3. PRENDER EL SERVIDOR
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
});