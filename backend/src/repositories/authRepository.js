import { query } from '../config/db.js';

export const buscarUsuarioPorNombre = async (nombre_usuario) => {
    const sql = `
        SELECT id_usuario, apellido, nombre, nombre_usuario, contrasenia 
        FROM usuarios 
        WHERE nombre_usuario = $1 AND activo = 1
    `;
    const result = await query(sql, [nombre_usuario]);
    return result.rows[0];
};