// ============================================
// Controlador de Vuelos
// CRUD de vuelos con filtros de búsqueda
// ============================================

const { Op } = require('sequelize');
const { Flight, Booking } = require('../models');

// GET /api/flights - Lista vuelos con filtros opcionales
const getAllFlights = async (req, res) => {
  try {
    const { origin, destination, date, available } = req.query;
    const where = {};
    if (origin) where.origin = { [Op.like]: `%${origin}%` };
    if (destination) where.destination = { [Op.like]: `%${destination}%` };
    if (date) {
      const s = new Date(date); s.setHours(0,0,0,0);
      const e = new Date(date); e.setHours(23,59,59,999);
      where.departureDate = { [Op.between]: [s, e] };
    }
    if (available === 'true') {
      where.availableSeats = { [Op.gt]: 0 };
      where.status = 'scheduled';
    }
    const flights = await Flight.findAll({ where, order: [['departureDate','ASC']] });
    res.json({ error: false, data: flights, total: flights.length });
  } catch (err) {
    console.error('Error al listar vuelos:', err);
    res.status(500).json({ error: true, message: 'Error al listar vuelos.' });
  }
};

// GET /api/flights/:id
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [{ model: Booking, as: 'bookings', attributes: ['id','userId','seatsReserved','totalPrice','status','createdAt'] }]
    });
    if (!flight) return res.status(404).json({ error: true, message: 'Vuelo no encontrado.' });
    res.json({ error: false, data: flight });
  } catch (err) {
    console.error('Error al obtener vuelo:', err);
    res.status(500).json({ error: true, message: 'Error al obtener vuelo.' });
  }
};

// POST /api/flights [solo ADMIN]
const createFlight = async (req, res) => {
  try {
    const { flightNumber, origin, destination, departureDate, arrivalDate, totalSeats, availableSeats, price, status } = req.body;
    if (new Date(arrivalDate) <= new Date(departureDate))
      return res.status(400).json({ error: true, message: 'La fecha de llegada debe ser posterior a la de salida.' });
    if (parseInt(availableSeats) > parseInt(totalSeats))
      return res.status(400).json({ error: true, message: 'Asientos disponibles no pueden superar el total.' });
    const flight = await Flight.create({ flightNumber, origin, destination, departureDate, arrivalDate, totalSeats, availableSeats: availableSeats || totalSeats, price, status: status || 'scheduled' });
    res.status(201).json({ error: false, message: 'Vuelo creado exitosamente.', data: flight });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ error: true, message: 'El número de vuelo ya existe.' });
    console.error('Error al crear vuelo:', err);
    res.status(500).json({ error: true, message: 'Error al crear vuelo.' });
  }
};

// PUT /api/flights/:id [solo ADMIN]
const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: true, message: 'Vuelo no encontrado.' });
    const dep = req.body.departureDate || flight.departureDate;
    const arr = req.body.arrivalDate || flight.arrivalDate;
    if (new Date(arr) <= new Date(dep))
      return res.status(400).json({ error: true, message: 'La fecha de llegada debe ser posterior a la de salida.' });
    await flight.update(req.body);
    res.json({ error: false, message: 'Vuelo actualizado.', data: flight });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ error: true, message: 'El número de vuelo ya está en uso.' });
    console.error('Error al actualizar vuelo:', err);
    res.status(500).json({ error: true, message: 'Error al actualizar vuelo.' });
  }
};

// DELETE /api/flights/:id [solo ADMIN]
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: true, message: 'Vuelo no encontrado.' });
    const active = await Booking.count({ where: { flightId: req.params.id, status: { [Op.ne]: 'cancelled' } } });
    if (active > 0) return res.status(400).json({ error: true, message: `No se puede eliminar. Tiene ${active} reserva(s) activa(s).` });
    await flight.destroy();
    res.json({ error: false, message: 'Vuelo eliminado exitosamente.' });
  } catch (err) {
    console.error('Error al eliminar vuelo:', err);
    res.status(500).json({ error: true, message: 'Error al eliminar vuelo.' });
  }
};

module.exports = { getAllFlights, getFlightById, createFlight, updateFlight, deleteFlight };
