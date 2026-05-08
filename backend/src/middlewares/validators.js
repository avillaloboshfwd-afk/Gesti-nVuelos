// ============================================
// Middleware de Validaciones de Entrada
// Valida los campos de los formularios antes de procesarlos
// ============================================

const { body, validationResult } = require('express-validator');

/**
 * Función auxiliar para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: 'Errores de validación',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validación de registro de usuario
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  handleValidationErrors
];

/**
 * Validación de login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  handleValidationErrors
];

/**
 * Validación al crear o editar un vuelo
 */
const validateFlight = [
  body('flightNumber')
    .trim()
    .notEmpty().withMessage('El número de vuelo es obligatorio'),
  body('origin')
    .trim()
    .notEmpty().withMessage('La ciudad de origen es obligatoria'),
  body('destination')
    .trim()
    .notEmpty().withMessage('La ciudad de destino es obligatoria'),
  body('departureDate')
    .notEmpty().withMessage('La fecha de salida es obligatoria')
    .isISO8601().withMessage('La fecha de salida debe ser una fecha válida'),
  body('arrivalDate')
    .notEmpty().withMessage('La fecha de llegada es obligatoria')
    .isISO8601().withMessage('La fecha de llegada debe ser una fecha válida'),
  body('totalSeats')
    .notEmpty().withMessage('El total de asientos es obligatorio')
    .isInt({ min: 1 }).withMessage('El total de asientos debe ser al menos 1'),
  body('availableSeats')
    .notEmpty().withMessage('Los asientos disponibles son obligatorios')
    .isInt({ min: 0 }).withMessage('Los asientos disponibles no pueden ser negativos'),
  body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  handleValidationErrors
];

/**
 * Validación al actualizar un vuelo (campos opcionales)
 */
const validateFlightUpdate = [
  body('flightNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('El número de vuelo no puede estar vacío'),
  body('origin')
    .optional()
    .trim()
    .notEmpty().withMessage('La ciudad de origen no puede estar vacía'),
  body('destination')
    .optional()
    .trim()
    .notEmpty().withMessage('La ciudad de destino no puede estar vacía'),
  body('departureDate')
    .optional()
    .isISO8601().withMessage('La fecha de salida debe ser una fecha válida'),
  body('arrivalDate')
    .optional()
    .isISO8601().withMessage('La fecha de llegada debe ser una fecha válida'),
  body('totalSeats')
    .optional()
    .isInt({ min: 1 }).withMessage('El total de asientos debe ser al menos 1'),
  body('availableSeats')
    .optional()
    .isInt({ min: 0 }).withMessage('Los asientos disponibles no pueden ser negativos'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('status')
    .optional()
    .isIn(['scheduled', 'cancelled', 'completed']).withMessage('Estado inválido'),
  handleValidationErrors
];

/**
 * Validación al crear una reserva
 */
const validateBooking = [
  body('flightId')
    .notEmpty().withMessage('El ID del vuelo es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del vuelo debe ser un número entero válido'),
  body('seatsReserved')
    .notEmpty().withMessage('La cantidad de asientos es obligatoria')
    .isInt({ min: 1 }).withMessage('Debe reservar al menos 1 asiento'),
  handleValidationErrors
];

/**
 * Validación al actualizar una reserva
 */
const validateBookingUpdate = [
  body('seatsReserved')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe reservar al menos 1 asiento'),
  body('status')
    .optional()
    .isIn(['confirmed', 'cancelled', 'pending']).withMessage('Estado de reserva inválido'),
  handleValidationErrors
];

/**
 * Validación al actualizar datos de usuario
 */
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido'),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateFlight,
  validateFlightUpdate,
  validateBooking,
  validateBookingUpdate,
  validateUserUpdate
};
