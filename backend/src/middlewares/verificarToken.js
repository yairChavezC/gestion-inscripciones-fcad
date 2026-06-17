import jwt from 'jsonwebtoken';

/**
 * Middleware: verificarToken
 * Se ejecuta en el pipeline antes de llegar a los controladores protegidos.
 */
export const verificarToken = (req, res, next) => {
    // 1. Buscamos el encabezado 'Authorization' en la solicitud HTTP
    const authHeader = req.headers['authorization'];
    
    // El formato estándar es "Bearer <TOKEN>". Sacamos el string del token:
    const token = authHeader && authHeader.split(' ')[1];

    // Si el cliente no mandó ningún token, le cerramos la puerta de una
    if (!token) {
        return res.status(401).json({ 
            error: 'Acceso denegado. Se requiere un token de autenticación.' 
        });
    }

    try {
        // 2. Verificamos la veracidad y vigencia de la firma usando la clave secreta
        // Si el token expiró o la firma fue alterada, esto salta directo al catch
        const usuarioVerificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. ¡La matemática dio perfecta! 
        // Inyectamos los datos decodificados del usuario (id, nombre) adentro del objeto 'req'
        req.usuario = usuarioVerificado;
        
        // 4. Le damos el pase al siguiente eslabón del pipeline (el controlador correspondiente)
        next();
        
    } catch (error) {
        // Si falló jwt.verify (token vencido, firma falsa, palabra secreta incorrecta)
        return res.status(403).json({ 
            error: 'Token inválido o expirado. Acceso prohibido.' 
        });
    }
};