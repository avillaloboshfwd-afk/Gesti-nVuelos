// ============================================
// Modelo de Vuelo (Flight)
// Define la estructura de la tabla 'Flights' en la base de datos
// ============================================

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del vuelo'
  },
  flightNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      msg: 'Este número de vuelo ya existe'
    },
    validate: {
      notEmpty: { msg: 'El número de vuelo no puede estar vacío' }
    },
    comment: 'Número único de vuelo (ej: AG-001)'
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La ciudad de origen no puede estar vacía' }
    },
    comment: 'Ciudad de origen del vuelo'
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La ciudad de destino no puede estar vacía' }
    },
    comment: 'Ciudad de destino del vuelo'
  },
  departureDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: 'La fecha de salida debe ser válida' },
      notEmpty: { msg: 'La fecha de salida es obligatoria' }
    },
    comment: 'Fecha y hora de salida del vuelo'
  },
  arrivalDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: 'La fecha de llegada debe ser válida' },
      notEmpty: { msg: 'La fecha de llegada es obligatoria' }
    },
    comment: 'Fecha y hora de llegada del vuelo'
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'El total de asientos debe ser al menos 1' },
      isInt: { msg: 'El total de asientos debe ser un número entero' }
    },
    comment: 'Cantidad total de asientos del avión'
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Los asientos disponibles no pueden ser negativos' },
      isInt: { msg: 'Los asientos disponibles deben ser un número entero' }
    },
    comment: 'Cantidad de asientos disponibles para reservar'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'El precio no puede ser negativo' },
      isDecimal: { msg: 'El precio debe ser un número decimal válido' }
    },
    comment: 'Precio por asiento en la moneda local'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'),
    defaultValue: 'scheduled',
    allowNull: false,
    comment: 'Estado del vuelo: scheduled, cancelled o completed'
  }
}, {
  tableName: 'Flights',
  timestamps: true
});

module.exports = Flight;
