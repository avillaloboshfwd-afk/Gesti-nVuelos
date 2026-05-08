// ============================================
// Aplicación Express Principal (app.js)
// Configuración de middlewares, rutas y Swagger
// ============================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// ── Middlewares Globales ──

// Habilitar CORS para el frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de peticiones HTTP (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// ── Documentación Swagger ──
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AntiGravity API Docs'
}));

// ── Rutas de la API ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// ── Ruta de estado de la API ──
app.get('/api', (req, res) => {
  res.json({
    error: false,
    message: 'API AntiGravity - Sistema de Gestión de Vuelos',
    version: '1.0.0',
    docs: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      flights: '/api/flights',
      bookings: '/api/bookings'
    }
  });
});

// ── Servir el frontend para rutas SPA ──
app.get('/{*path}', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Si no hay frontend, devolver info de la API
    res.status(404).json({
      error: true,
      message: 'Ruta no encontrada. Usa /api para ver los endpoints disponibles.'
    });
  }
});

module.exports = app;
