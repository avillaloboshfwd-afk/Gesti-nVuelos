// ============================================
// Seeder — Datos de prueba para AntiGravity
// Crea: 1 admin, 3 clientes y 5 vuelos
// Ejecutar: npm run seed
// ============================================

require('dotenv').config();
const { sequelize, User, Flight, Booking } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Iniciando proceso de seed...\n');

    // Conectar y sincronizar (force: true recrea las tablas)
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada (tablas recreadas).\n');

    // ── Crear Usuarios ──
    console.log('👤 Creando usuarios...');
    const admin = await User.create({
      name: 'Administrador AntiGravity',
      email: 'admin@antigravity.com',
      password: 'admin123',
      role: 'admin'
    });

    const client1 = await User.create({
      name: 'Carlos Mendoza',
      email: 'carlos@email.com',
      password: 'cliente123',
      role: 'client'
    });

    const client2 = await User.create({
      name: 'María García',
      email: 'maria@email.com',
      password: 'cliente123',
      role: 'client'
    });

    const client3 = await User.create({
      name: 'Roberto López',
      email: 'roberto@email.com',
      password: 'cliente123',
      role: 'client'
    });

    console.log('  ✔ Admin: admin@antigravity.com / admin123');
    console.log('  ✔ Cliente 1: carlos@email.com / cliente123');
    console.log('  ✔ Cliente 2: maria@email.com / cliente123');
    console.log('  ✔ Cliente 3: roberto@email.com / cliente123\n');

    // ── Crear Vuelos ──
    console.log('✈️  Creando vuelos...');
    const flights = await Flight.bulkCreate([
      {
        flightNumber: 'AG-001',
        origin: 'Ciudad de México',
        destination: 'Madrid',
        departureDate: new Date('2025-08-15T08:00:00'),
        arrivalDate: new Date('2025-08-15T22:30:00'),
        totalSeats: 180,
        availableSeats: 180,
        price: 8500.00,
        status: 'scheduled'
      },
      {
        flightNumber: 'AG-002',
        origin: 'Bogotá',
        destination: 'Buenos Aires',
        departureDate: new Date('2025-08-20T10:00:00'),
        arrivalDate: new Date('2025-08-20T17:00:00'),
        totalSeats: 150,
        availableSeats: 150,
        price: 6200.50,
        status: 'scheduled'
      },
      {
        flightNumber: 'AG-003',
        origin: 'Lima',
        destination: 'Miami',
        departureDate: new Date('2025-09-01T06:30:00'),
        arrivalDate: new Date('2025-09-01T14:00:00'),
        totalSeats: 200,
        availableSeats: 200,
        price: 7800.00,
        status: 'scheduled'
      },
      {
        flightNumber: 'AG-004',
        origin: 'Santiago',
        destination: 'Nueva York',
        departureDate: new Date('2025-09-10T23:00:00'),
        arrivalDate: new Date('2025-09-11T09:30:00'),
        totalSeats: 220,
        availableSeats: 220,
        price: 12500.00,
        status: 'scheduled'
      },
      {
        flightNumber: 'AG-005',
        origin: 'Madrid',
        destination: 'Tokio',
        departureDate: new Date('2025-10-05T14:00:00'),
        arrivalDate: new Date('2025-10-06T08:00:00'),
        totalSeats: 300,
        availableSeats: 300,
        price: 15000.00,
        status: 'scheduled'
      }
    ]);

    flights.forEach(f => console.log(`  ✔ ${f.flightNumber}: ${f.origin} → ${f.destination}`));

    // ── Crear algunas reservas de ejemplo ──
    console.log('\n📋 Creando reservas de ejemplo...');

    const booking1 = await Booking.create({
      userId: client1.id,
      flightId: flights[0].id,
      seatsReserved: 2,
      totalPrice: 17000.00,
      status: 'confirmed'
    });
    await flights[0].update({ availableSeats: flights[0].availableSeats - 2 });

    const booking2 = await Booking.create({
      userId: client2.id,
      flightId: flights[1].id,
      seatsReserved: 1,
      totalPrice: 6200.50,
      status: 'confirmed'
    });
    await flights[1].update({ availableSeats: flights[1].availableSeats - 1 });

    console.log('  ✔ Carlos: 2 asientos en AG-001');
    console.log('  ✔ María: 1 asiento en AG-002');

    console.log('\n════════════════════════════════════════');
    console.log('🎉 Seed completado exitosamente!');
    console.log('════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};

seed();
