// ============================================
// Controlador de Autenticación
// Maneja registro, login, logout y perfil
// ============================================

const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Genera un token JWT con los datos del usuario
 * @param {Object} user - Instancia del modelo User
 * @returns {string} Token JWT firmado
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * POST /api/auth/register
 * Registra un nuevo usuario con rol 'client' por defecto
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'Este correo electrónico ya está registrado.'
      });
    }

    // Crear el nuevo usuario (la contraseña se hashea en el hook beforeCreate)
    const newUser = await User.create({
      name,
      email,
      password,
      role: 'client' // Siempre se registra como cliente
    });

    // Generar token
    const token = generateToken(newUser);

    res.status(201).json({
      error: false,
      message: 'Usuario registrado exitosamente.',
      data: {
        user: newUser.toSafeJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al registrar usuario.'
    });
  }
};

/**
 * POST /api/auth/login
 * Autentica un usuario con email y contraseña
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Credenciales inválidas.'
      });
    }

    // Comparar contraseñas
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: 'Credenciales inválidas.'
      });
    }

    // Generar token
    const token = generateToken(user);

    res.status(200).json({
      error: false,
      message: 'Inicio de sesión exitoso.',
      data: {
        user: user.toSafeJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al iniciar sesión.'
    });
  }
};

/**
 * POST /api/auth/logout
 * Cierra sesión (invalida token del lado del cliente)
 */
const logout = async (req, res) => {
  try {
    // En una implementación con blacklist, se agregaría el token aquí
    // Por ahora, el logout se maneja del lado del cliente eliminando el token
    res.status(200).json({
      error: false,
      message: 'Sesión cerrada exitosamente.'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al cerrar sesión.'
    });
  }
};

/**
 * GET /api/auth/me
 * Retorna el perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuario no encontrado.'
      });
    }

    res.status(200).json({
      error: false,
      data: user.toSafeJSON()
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: true,
      message: 'Error interno del servidor al obtener perfil.'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile
};
