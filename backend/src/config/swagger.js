// ============================================
// Configuración de Swagger / OpenAPI 3.0
// Documentación automática de la API
// ============================================

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AntiGravity - API de Gestión de Vuelos',
      version: '1.0.0',
      description: 'API RESTful para el sistema de gestión de vuelos aéreos AntiGravity. Permite gestionar usuarios, vuelos y reservas con autenticación JWT y roles diferenciados.',
      contact: {
        name: 'AntiGravity Team',
        email: 'soporte@antigravity.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único del usuario' },
            name: { type: 'string', description: 'Nombre completo' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            role: { type: 'string', enum: ['admin', 'client'], description: 'Rol del usuario' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Flight: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único del vuelo' },
            flightNumber: { type: 'string', description: 'Número de vuelo' },
            origin: { type: 'string', description: 'Ciudad de origen' },
            destination: { type: 'string', description: 'Ciudad de destino' },
            departureDate: { type: 'string', format: 'date-time', description: 'Fecha y hora de salida' },
            arrivalDate: { type: 'string', format: 'date-time', description: 'Fecha y hora de llegada' },
            totalSeats: { type: 'integer', description: 'Asientos totales' },
            availableSeats: { type: 'integer', description: 'Asientos disponibles' },
            price: { type: 'number', format: 'float', description: 'Precio por asiento' },
            status: { type: 'string', enum: ['scheduled', 'cancelled', 'completed'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID único de la reserva' },
            userId: { type: 'integer', description: 'ID del usuario' },
            flightId: { type: 'integer', description: 'ID del vuelo' },
            seatsReserved: { type: 'integer', description: 'Asientos reservados' },
            totalPrice: { type: 'number', format: 'float', description: 'Precio total' },
            status: { type: 'string', enum: ['confirmed', 'cancelled', 'pending'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'boolean', example: true },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'] // Rutas donde buscar anotaciones Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
