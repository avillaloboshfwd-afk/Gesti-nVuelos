// ============================================
// Controlador de Usuarios
// CRUD de usuarios con control de acceso por roles
// ============================================

const { User, Booking } = require('../models');

/**
 * GET /api/users
 * Lista todos los usuarios [solo ADMIN]
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      error: false,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al listar usuarios.'
    });
  }
};

/**
 * GET /api/users/:id
 * Obtiene detalle de un usuario [ADMIN o propio usuario]
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Booking,
        as: 'bookings',
        attributes: ['id', 'flightId', 'seatsReserved', 'totalPrice', 'status', 'createdAt']
      }]
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado.'
      });
    }

    res.status(200).json({
      error: false,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al obtener usuario.'
    });
  }
};

/**
 * PUT /api/users/:id
 * Actualiza datos de un usuario [ADMIN o propio usuario]
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado.'
      });
    }

    // Solo el admin puede cambiar el rol
    const updateData = { name, email };
    if (password) updateData.password = password;
    if (role && req.user.role === 'admin') updateData.role = role;

    await user.update(updateData);

    res.status(200).json({
      error: false,
      message: 'Usuario actualizado exitosamente.',
      data: user.toSafeJSON()
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);

    // Error de unicidad del email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: true,
        message: 'El correo electrónico ya está en uso por otro usuario.'
      });
    }

    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al actualizar usuario.'
    });
  }
};

/**
 * DELETE /api/users/:id
 * Elimina un usuario [solo ADMIN]
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado.'
      });
    }

    // No permitir que un admin se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({
        error: true,
        message: 'No puede eliminar su propia cuenta de administrador.'
      });
    }

    await user.destroy();

    res.status(200).json({
      error: false,
      message: 'Usuario eliminado exitosamente.'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al eliminar usuario.'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
