// ============================================
// Rutas de Usuarios — /api/users
// ============================================

const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin, isOwnerOrAdmin } = require('../middlewares/roleMiddleware');
const { validateUserUpdate } = require('../middlewares/validators');

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar todos los usuarios
 *     description: Solo accesible por administradores
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Acceso denegado
 */
router.get('/', authMiddleware, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Detalle de usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', authMiddleware, isOwnerOrAdmin, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:id', authMiddleware, isOwnerOrAdmin, validateUserUpdate, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar usuario
 *     description: Solo administradores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

module.exports = router;
