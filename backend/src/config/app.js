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
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
});