import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import * as authRepo from '../repositories/authRepository.js';

export const realizarLogin = async (nombre_usuario, contrasenia) => {
    // 1. Buscamos el usuario
    const usuario = await authRepo.buscarUsuarioPorNombre(nombre_usuario);
    
    // 2. Validamos la contraseña usando la función digest de postgresql
    const sqlCheck = 'SELECT encode(digest($1, \'sha256\'), \'hex\') = $2 AS es_valida';
    const result = await query(sqlCheck, [contrasenia, usuario?.contrasenia || '']);
    
    if (!usuario || !result.rows[0].es_valida) {
        throw new Error('AUTH_FAILED'); // Error genérico para seguridad
    }

    // 3. Generamos Token
    const token = jwt.sign(
        { id: usuario.id_usuario, nombre: usuario.nombre_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '4h' }
    );

    return { token, usuario: { nombre: usuario.nombre, apellido: usuario.apellido } };
};