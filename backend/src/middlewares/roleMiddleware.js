// ============================================
// Middleware de Control de Roles
// Verifica permisos según el rol del usuario
// ============================================

/**
 * Verifica que el usuario tenga rol de administrador
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: true,
      message: 'Debe autenticarse primero.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado. Se requiere rol de administrador.'
    });
  }

  next();
};

/**
 * Verifica que el usuario tenga rol de cliente
 */
const isClient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: true,
      message: 'Debe autenticarse primero.'
    });
  }

  if (req.user.role !== 'client') {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado. Se requiere rol de cliente.'
    });
  }

  next();
};

/**
 * Verifica que el usuario sea el dueño del recurso o un administrador
 * Requiere que el parámetro de la ruta sea :id (userId)
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: true,
      message: 'Debe autenticarse primero.'
    });
  }

  const resourceId = parseInt(req.params.id);
  const userId = req.user.id;
  const isAdminUser = req.user.role === 'admin';

  if (userId !== resourceId && !isAdminUser) {
    return res.status(403).json({
      error: true,
      message: 'Acceso denegado. No tiene permisos para acceder a este recurso.'
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isClient,
  isOwnerOrAdmin
};
