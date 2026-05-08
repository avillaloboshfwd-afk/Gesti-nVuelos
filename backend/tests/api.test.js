const request = require('supertest');
const app = require('../src/app');

describe('Pruebas de Integración - API Horizon Air', () => {
  // Test para el endpoint raíz de la API
  test('GET /api debe retornar información de la versión', async () => {
    const response = await request(app).get('/api');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body).toHaveProperty('version');
    expect(response.body.message).toContain('API');
  });

  // Test para listar vuelos (público)
  test('GET /api/flights debe retornar una lista de vuelos', async () => {
    const response = await request(app).get('/api/flights');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
