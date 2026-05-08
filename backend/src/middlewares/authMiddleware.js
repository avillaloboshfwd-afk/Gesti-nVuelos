// ============================================
// Middleware de Autenticación JWT
// Verifica que el token sea válido y no haya expirado
// ============================================

const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware que verifica el token JWT en el header Authorization
 * Formato esperado: "Bearer <token>"
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: true,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Acceso denegado. Token no válido.'
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'El usuario asociado al token ya no existe.'
      });
    }

    // Adjuntar datos del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'El token ha expirado. Por favor, inicia sesión nuevamente.'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: true,
        message: 'Token inválido.'
      });
    }
    return res.status(500).json({
      error: true,
      message: 'Error interno al verificar autenticación.'
    });
  }
};

module.exports = authMiddleware;
