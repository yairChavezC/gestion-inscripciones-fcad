import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './src/config/db.js';
import apiRouter from './src/routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
});