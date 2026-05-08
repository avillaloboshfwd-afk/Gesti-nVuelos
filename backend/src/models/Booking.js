// ============================================
// Modelo de Reserva (Booking)
// Define la estructura de la tabla 'Bookings' en la base de datos
// ============================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la reserva'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'FK → Usuario que realizó la reserva'
  },
  flightId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Flights',
      key: 'id'
    },
    comment: 'FK → Vuelo reservado'
  },
  seatsReserved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Debe reservar al menos 1 asiento' },
      isInt: { msg: 'La cantidad de asientos debe ser un número entero' }
    },
    comment: 'Cantidad de asientos reservados'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Precio total calculado (precio × asientos)'
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled', 'pending'),
    defaultValue: 'confirmed',
    allowNull: false,
    comment: 'Estado de la reserva: confirmed, cancelled o pending'
  }
}, {
  tableName: 'Bookings',
  timestamps: true
});

module.exports = Booking;
