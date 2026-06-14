import * as authService from '../services/authService.js';

export const login = async (req, res) => {
    try {
        const { nombre_usuario, contrasenia } = req.body;
        const resultado = await authService.realizarLogin(nombre_usuario, contrasenia);
        res.json({ mensaje: 'Login exitoso', ...resultado });
    } catch (error) {
        if (error.message === 'AUTH_FAILED') {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};