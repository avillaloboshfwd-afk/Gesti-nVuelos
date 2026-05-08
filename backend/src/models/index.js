// ============================================
// Índice de Modelos
// Registra las asociaciones entre modelos
// ============================================

const sequelize = require('../config/database');
const User = require('./User');
const Flight = require('./Flight');
const Booking = require('./Booking');

// ── Asociaciones ──

// Un usuario puede tener muchas reservas
User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'bookings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Una reserva pertenece a un usuario
Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Un vuelo puede tener muchas reservas
Flight.hasMany(Booking, {
  foreignKey: 'flightId',
  as: 'bookings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Una reserva pertenece a un vuelo
Booking.belongsTo(Flight, {
  foreignKey: 'flightId',
  as: 'flight'
});

module.exports = {
  sequelize,
  User,
  Flight,
  Booking
};
