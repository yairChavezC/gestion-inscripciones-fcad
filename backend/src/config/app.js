// Punto de entrada al servidor

// server.js
const express = require('express');
const { testConnection } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Verificamos la DB antes de levantar el servidor
testConnection().then(() => {
    app.listen(3000, () => {
        console.log("🚀 Servidor en puerto 3000 y DB conectada correctamente");
    });
}).catch(err => {
    console.error("❌ Error crítico: No se pudo conectar a la DB. El servidor no iniciará.");
    process.exit(1); // Esto cierra el proceso si la DB no responde
});


app.get('/health', async (req, res) => {
    res.json({ status: 'Servidor funcionando', database: 'Conectada' });
});