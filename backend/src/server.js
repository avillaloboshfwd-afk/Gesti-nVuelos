// ============================================
// Servidor Principal — AntiGravity
// Inicia la conexión a la BD y levanta Express
// ============================================

require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

// Función principal para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos con la BD (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════╗');
      console.log('║       🚀 AntiGravity Flight System          ║');
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║  Servidor:  http://localhost:${PORT}            ║`);
      console.log(`║  API:       http://localhost:${PORT}/api         ║`);
      console.log(`║  Docs:      http://localhost:${PORT}/api-docs    ║`);
      console.log(`║  Frontend:  http://localhost:${PORT}            ║`);
      console.log('╚══════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
