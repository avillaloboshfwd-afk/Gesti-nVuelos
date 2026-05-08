// ============================================
// Rutas de Autenticación — /api/auth
// ============================================

const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validators');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registro de nuevo usuario
 *     description: Registra un nuevo usuario con rol de cliente
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@email.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Errores de validación
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Inicio de sesión
 *     description: Autentica un usuario y retorna un JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@antigravity.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Autenticación]
 *     summary: Cerrar sesión
 *     description: Invalida la sesión actual
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
router.post('/logout', authMiddleware, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Autenticación]
 *     summary: Perfil del usuario
 *     description: Retorna datos del usuario autenticado
 *     responses:
 *       200:
 *         description: Datos del perfil
 *       401:
 *         description: No autenticado
 */
router.get('/me', authMiddleware, getProfile);

module.exports = router;
