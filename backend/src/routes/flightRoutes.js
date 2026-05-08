// ============================================
// Rutas de Vuelos — /api/flights
// ============================================

const express = require('express');
const router = express.Router();
const { getAllFlights, getFlightById, createFlight, updateFlight, deleteFlight } = require('../controllers/flightController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validateFlight, validateFlightUpdate } = require('../middlewares/validators');

/**
 * @swagger
 * /api/flights:
 *   get:
 *     tags: [Vuelos]
 *     summary: Listar vuelos disponibles
 *     description: Acceso público. Soporta filtros por origin, destination, date, available
 *     security: []
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Filtrar por ciudad de origen
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Filtrar por ciudad de destino
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha (YYYY-MM-DD)
 *       - in: query
 *         name: available
 *         schema:
 *           type: string
 *           enum: ["true","false"]
 *         description: Solo vuelos con asientos disponibles
 *     responses:
 *       200:
 *         description: Lista de vuelos
 */
router.get('/', getAllFlights);

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     tags: [Vuelos]
 *     summary: Detalle de un vuelo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del vuelo
 *       404:
 *         description: Vuelo no encontrado
 */
router.get('/:id', getFlightById);

/**
 * @swagger
 * /api/flights:
 *   post:
 *     tags: [Vuelos]
 *     summary: Crear vuelo [ADMIN]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flight'
 *     responses:
 *       201:
 *         description: Vuelo creado
 *       403:
 *         description: Acceso denegado
 */
router.post('/', authMiddleware, isAdmin, validateFlight, createFlight);

/**
 * @swagger
 * /api/flights/{id}:
 *   put:
 *     tags: [Vuelos]
 *     summary: Editar vuelo [ADMIN]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vuelo actualizado
 */
router.put('/:id', authMiddleware, isAdmin, validateFlightUpdate, updateFlight);

/**
 * @swagger
 * /api/flights/{id}:
 *   delete:
 *     tags: [Vuelos]
 *     summary: Eliminar vuelo [ADMIN]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vuelo eliminado
 */
router.delete('/:id', authMiddleware, isAdmin, deleteFlight);

module.exports = router;
