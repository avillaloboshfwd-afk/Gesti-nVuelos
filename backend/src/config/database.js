// ============================================
// Configuración de la conexión a la base de datos
// Utiliza Sequelize como ORM para MySQL
// ============================================

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Crear instancia de Sequelize con las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME || 'antigravity_flights',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,       // Máximo de conexiones en el pool
      min: 0,        // Mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo para obtener conexión (ms)
      idle: 10000     // Tiempo máximo de inactividad (ms)
    },
    define: {
      timestamps: true, // Agrega createdAt y updatedAt automáticamente
      underscored: false // Usar camelCase para los nombres de columnas
    }
  }
);

module.exports = sequelize;
