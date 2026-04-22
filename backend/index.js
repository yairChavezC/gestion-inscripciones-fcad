const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/api/status', (req, res) => {
    res.json({ mensaje: "API Rest funcionando correctamente" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});