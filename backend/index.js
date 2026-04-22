const express = require('express');
const cors = require('cors');
const { testConnection, query } = require('./src/config/db'); // Traemos tu config
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de Salud: Ahora verifica Servidor + Base de Datos
app.get('/api/status', async (req, res) => {
    try {
        // Una consulta rápida para ver si la DB responde
        await query('SELECT 1'); 
        res.json({ 
            mensaje: "API Rest funcionando", 
            database: "Conectada" 
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: "API funcionando, pero la DB no responde", 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;

// Arrancamos solo si la DB conecta (Requerimiento de robustez)
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
});