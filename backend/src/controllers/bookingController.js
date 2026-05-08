// ============================================
// Controlador de Reservas (Bookings)
// Lógica de negocio para reservas de vuelos
// ============================================

const { Op } = require('sequelize');
const { Booking, Flight, User, sequelize } = require('../models');

// GET /api/bookings - Mis reservas [cliente autenticado]
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Flight, as: 'flight' }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ error: false, data: bookings, total: bookings.length });
  } catch (err) {
    console.error('Error al obtener reservas:', err);
    res.status(500).json({ error: true, message: 'Error al obtener reservas.' });
  }
};

// GET /api/bookings/all - Todas las reservas [solo ADMIN]
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Flight, as: 'flight' },
        { model: User, as: 'user', attributes: { exclude: ['password'] } }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ error: false, data: bookings, total: bookings.length });
  } catch (err) {
    console.error('Error al listar reservas:', err);
    res.status(500).json({ error: true, message: 'Error al listar reservas.' });
  }
};

// GET /api/bookings/:id - Detalle de reserva [dueño o ADMIN]
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Flight, as: 'flight' },
        { model: User, as: 'user', attributes: { exclude: ['password'] } }
      ]
    });
    if (!booking) return res.status(404).json({ error: true, message: 'Reserva no encontrada.' });

    // Verificar que sea el dueño o admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: true, message: 'No tiene permisos para ver esta reserva.' });
    }

    res.json({ error: false, data: booking });
  } catch (err) {
    console.error('Error al obtener reserva:', err);
    res.status(500).json({ error: true, message: 'Error al obtener reserva.' });
  }
};

// POST /api/bookings - Crear reserva [solo CLIENTE]
const createBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { flightId, seatsReserved } = req.body;

    // Buscar el vuelo con bloqueo para evitar condiciones de carrera
    const flight = await Flight.findByPk(flightId, { transaction: t, lock: true });
    if (!flight) {
      await t.rollback();
      return res.status(404).json({ error: true, message: 'Vuelo no encontrado.' });
    }

    // Verificar estado del vuelo
    if (flight.status !== 'scheduled') {
      await t.rollback();
      return res.status(400).json({ error: true, message: 'Solo se pueden reservar vuelos con estado "scheduled".' });
    }

    // Verificar disponibilidad de asientos
    if (flight.availableSeats < seatsReserved) {
      await t.rollback();
      return res.status(400).json({
        error: true,
        message: `No hay suficientes asientos. Disponibles: ${flight.availableSeats}, solicitados: ${seatsReserved}.`
      });
    }

    // Calcular precio total
    const totalPrice = parseFloat(flight.price) * parseInt(seatsReserved);

    // Crear la reserva
    const booking = await Booking.create({
      userId: req.user.id,
      flightId,
      seatsReserved,
      totalPrice,
      status: 'confirmed'
    }, { transaction: t });

    // Decrementar asientos disponibles
    await flight.update({
      availableSeats: flight.availableSeats - seatsReserved
    }, { transaction: t });

    await t.commit();

    // Recargar con relaciones
    const fullBooking = await Booking.findByPk(booking.id, {
      include: [{ model: Flight, as: 'flight' }]
    });

    res.status(201).json({ error: false, message: 'Reserva creada exitosamente.', data: fullBooking });
  } catch (err) {
    await t.rollback();
    console.error('Error al crear reserva:', err);
    res.status(500).json({ error: true, message: 'Error al crear reserva.' });
  }
};

// PUT /api/bookings/:id - Actualizar reserva
const updateBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Flight, as: 'flight' }],
      transaction: t,
      lock: true
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: true, message: 'Reserva no encontrada.' });
    }

    // Verificar permisos
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({ error: true, message: 'No tiene permisos.' });
    }

    if (booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ error: true, message: 'No se puede modificar una reserva cancelada.' });
    }

    const { seatsReserved } = req.body;
    if (seatsReserved) {
      const seats = parseInt(seatsReserved);
      const diff = seats - booking.seatsReserved;
      const flight = await Flight.findByPk(booking.flightId, { transaction: t, lock: true });

      if (diff > 0 && flight.availableSeats < diff) {
        await t.rollback();
        return res.status(400).json({
          error: true,
          message: `No hay suficientes asientos adicionales. Disponibles: ${flight.availableSeats}.`
        });
      }

      await flight.update({ availableSeats: flight.availableSeats - diff }, { transaction: t });
      const totalPrice = parseFloat(flight.price) * seats;
      await booking.update({ seatsReserved: seats, totalPrice }, { transaction: t });
    }

    await t.commit();

    const updated = await Booking.findByPk(booking.id, {
      include: [{ model: Flight, as: 'flight' }]
    });

    res.json({ error: false, message: 'Reserva actualizada.', data: updated });
  } catch (err) {
    await t.rollback();
    console.error('Error al actualizar reserva:', err);
    res.status(500).json({ error: true, message: 'Error al actualizar reserva.' });
  }
};

// DELETE /api/bookings/:id - Cancelar reserva [dueño o ADMIN]
const cancelBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction: t, lock: true });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: true, message: 'Reserva no encontrada.' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({ error: true, message: 'No tiene permisos.' });
    }

    if (booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ error: true, message: 'La reserva ya está cancelada.' });
    }

    // Devolver asientos al vuelo
    const flight = await Flight.findByPk(booking.flightId, { transaction: t, lock: true });
    await flight.update({
      availableSeats: flight.availableSeats + booking.seatsReserved
    }, { transaction: t });

    // Marcar como cancelada
    await booking.update({ status: 'cancelled' }, { transaction: t });

    await t.commit();
    res.json({ error: false, message: 'Reserva cancelada exitosamente.' });
  } catch (err) {
    await t.rollback();
    console.error('Error al cancelar reserva:', err);
    res.status(500).json({ error: true, message: 'Error al cancelar reserva.' });
  }
};

module.exports = { getMyBookings, getAllBookings, getBookingById, createBooking, updateBooking, cancelBooking };
