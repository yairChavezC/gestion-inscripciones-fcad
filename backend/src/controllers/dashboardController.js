import * as dashboardService from '../services/dashboardService.js';

export const getResumen = async (req, res) => { 
    try {
        // El controlador ya no sabe nada de SQL, solo delega al servicio
        const resumen = await dashboardService.obtenerResumenDashboard();
        
        // Envia la respuesta al frontend
        res.json(resumen);
    } catch (error) {
        console.error("Error en dashboardController:", error.message);
        res.status(500).json({ error: "Error interno al obtener datos del dashboard" });
    }
};