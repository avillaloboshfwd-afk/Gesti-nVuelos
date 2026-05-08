// ============================================
// Rutas de Reservas — /api/bookings
// ============================================

const express = require('express');
const router = express.Router();
const { getMyBookings, getAllBookings, getBookingById, createBooking, updateBooking, cancelBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin, isClient } = require('../middlewares/roleMiddleware');
const { validateBooking, validateBookingUpdate } = require('../middlewares/validators');

/**
 * @swagger
 * /api/bookings/all:
 *   get:
 *     tags: [Reservas]
 *     summary: Todas las reservas del sistema [ADMIN]
 *     responses:
 *       200:
 *         description: Lista completa de reservas
 */
router.get('/all', authMiddleware, isAdmin, getAllBookings);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     tags: [Reservas]
 *     summary: Mis reservas [cliente autenticado]
 *     responses:
 *       200:
 *         description: Reservas del usuario autenticado
 */
router.get('/', authMiddleware, getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     tags: [Reservas]
 *     summary: Detalle de reserva
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la reserva
 */
router.get('/:id', authMiddleware, getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     tags: [Reservas]
 *     summary: Crear reserva [solo CLIENTE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flightId, seatsReserved]
 *             properties:
 *               flightId:
 *                 type: integer
 *                 example: 1
 *               seatsReserved:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Reserva creada
 */
router.post('/', authMiddleware, isClient, validateBooking, createBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     tags: [Reservas]
 *     summary: Actualizar reserva
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva actualizada
 */
router.put('/:id', authMiddleware, validateBookingUpdate, updateBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     tags: [Reservas]
 *     summary: Cancelar reserva
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada
 */
router.delete('/:id', authMiddleware, cancelBooking);

module.exports = router;
