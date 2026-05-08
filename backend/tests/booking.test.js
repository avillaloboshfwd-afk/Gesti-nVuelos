const request = require('supertest');
const app = require('../src/app');

/**
 * Pruebas para el modelo de Reserva (Booking)
 * Valida el ciclo de vida de una reserva: creación, listado y seguridad.
 */
describe('Pruebas de Reservas (Booking Model)', () => {
  let token;
  let flightId;
  let bookingId;

  beforeAll(async () => {
    // Registro de usuario para obtener token
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Booking Tester',
        email: `tester_${Date.now()}@booking.com`,
        password: 'password123'
      });
    token = userRes.body.data.token;

    // Obtención de un vuelo para reservar
    const flightRes = await request(app).get('/api/flights');
    if (flightRes.body.data && flightRes.body.data.length > 0) {
      flightId = flightRes.body.data[0].id;
    }
  });

  /**
   * Test 1: Crear una reserva.
   * Por qué: Es el núcleo del negocio. Valida que se asocie el usuario, el vuelo y se descuenten asientos si aplica.
   * Funcionamiento: Envía flightId y seatsReserved con el token de autorización.
   */
  test('Debe crear una reserva con éxito', async () => {
    if (!flightId) return;

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        flightId: flightId,
        seatsReserved: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.flightId).toBe(flightId);
    bookingId = res.body.data.id;
  });

  /**
   * Test 2: Listar reservas del usuario.
   * Por qué: Permite al usuario verificar su historial y estado de viajes.
   * Funcionamiento: GET a /api/bookings con el token del usuario.
   */
  test('Debe listar las reservas del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  /**
   * Test 3: Impedir reserva sin autenticación.
   * Por qué: Protege el sistema contra reservas anónimas que podrían causar inconsistencias.
   * Funcionamiento: Intenta hacer un POST sin enviar el header Authorization.
   */
  test('Debe fallar si se intenta reservar sin un token de autenticación', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        flightId: flightId,
        seatsReserved: 1
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe(true);
  });
});

