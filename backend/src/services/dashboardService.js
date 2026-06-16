import * as dashboardRepository from '../repositories/dashboardRepository.js';

export const obtenerResumenDashboard = async () => {
    // Pide los datos al repositorio
    const totalEstudiantes = await dashboardRepository.obtenerTotalEstudiantes();
    const totalCursos = await dashboardRepository.obtenerTotalCursos();
    const cursosActivos = await dashboardRepository.obtenerCursosActivos(5);

    //empaqueta en el objeto JSON que espera el frontend
    return {
        totalEstudiantes,
        totalCursos,
        cursosActivos
    };
};