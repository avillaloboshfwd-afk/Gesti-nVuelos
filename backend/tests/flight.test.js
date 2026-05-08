const request = require('supertest');
const app = require('../src/app');

/**
 * Pruebas para el modelo de Vuelo (Flight)
 * Valida la visualización, detalle y restricciones de acceso para la gestión de vuelos.
 */
describe('Pruebas de Vuelos (Flight Model)', () => {
  let flightId;

  /**
   * Test 1: Obtener todos los vuelos.
   * Por qué: Es fundamental que los clientes puedan consultar la disponibilidad de vuelos.
   * Funcionamiento: Realiza un GET a /api/flights y verifica que la respuesta sea un array.
   */
  test('Debe listar todos los vuelos disponibles', async () => {
    const res = await request(app).get('/api/flights');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      flightId = res.body.data[0].id;
    }
  });

  /**
   * Test 2: Obtener detalle de un vuelo específico.
   * Por qué: Verifica que la búsqueda por ID funcione correctamente para mostrar información detallada.
   * Funcionamiento: Usa un ID obtenido en el test anterior para consultar un solo vuelo.
   */
  test('Debe obtener los detalles de un vuelo por ID', async () => {
    if (!flightId) {
      console.warn('Saltando test: No hay vuelos para probar el detalle');
      return;
    }
    const res = await request(app).get(`/api/flights/${flightId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(flightId);
    expect(res.body.data).toHaveProperty('flightNumber');
  });

  /**
   * Test 3: Restricción de creación de vuelos para usuarios no administradores.
   * Por qué: Protege la integridad de los datos asegurando que solo el personal autorizado (Admin) gestione la oferta.
   * Funcionamiento: Intenta crear un vuelo sin token o con un token de cliente, esperando un rechazo (401 o 403).
   */
  test('Debe denegar la creación de vuelos sin autorización de administrador', async () => {
    const res = await request(app)
      .post('/api/flights')
      .send({
        flightNumber: 'NA-999',
        origin: 'Bogotá',
        destination: 'Miami',
        departureDate: new Date(),
        arrivalDate: new Date(),
        totalSeats: 100,
        availableSeats: 100,
        price: 350.00
      });

    // Sin token debe dar 401
    expect(res.statusCode).toBe(401);
  });
});
