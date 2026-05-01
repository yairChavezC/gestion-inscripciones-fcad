const express = require('express');
const cors = require('cors');
const { testConnection, query } = require('./src/config/db');
require('dotenv').config();

// 1. IMPORTAR las rutas del dashboard (¡Fijate si te falta esta!)
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 2. VINCULAR las rutas al servidor 
app.use('/api/dashboard', dashboardRoutes);


const PORT = process.env.PORT || 3000;

testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
});





const cursosRoutes = require('./src/routes/cursosroutes'); // 1. Importás las rutas

app.use('/api/cursos', cursosRoutes);