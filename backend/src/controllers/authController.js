const { query } = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { nombre_usuario, contrasenia } = req.body;

        // Usamos EXACTAMENTE la lógica del profe para validar el sha256 en la base de datos
        const sql = `
            SELECT id_usuario, apellido, nombre, nombre_usuario 
            FROM usuarios 
            WHERE nombre_usuario = $1 
            AND contrasenia = encode(digest($2, 'sha256'), 'hex') 
            AND activo = 1
        `;
        
        // $1 será el usuario que tipeen, y $2 la contraseña
        const result = await query(sql, [nombre_usuario, contrasenia]);

        // Si la consulta devuelve 0 filas, significa que el usuario o la clave (con sha256) están mal
        if (result.rowCount === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const usuario = result.rows[0];

        // ¡Login exitoso! Generamos el Token
        const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario, 
                nombre_usuario: usuario.nombre_usuario 
            },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                nombre: usuario.nombre,
                apellido: usuario.apellido
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { login };