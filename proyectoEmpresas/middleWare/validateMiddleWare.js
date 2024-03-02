import jwt from 'jsonwebtoken'


export const authMiddleware = (req, res, next) => {
    // Obtener el token de los headers de la solicitud
    let token = req.headers.authorization;
    // Verificar si el token existe
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado.' });
    }
    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Añadir el objeto decodificado al objeto de solicitud para uso posterior
        req.user = decoded;
        // Pasar al siguiente middleware
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token de autenticación inválido.' });
    }
  };