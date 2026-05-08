const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

/**
 * Pruebas para el modelo de Usuario y Autenticación
 * Se prueban los flujos de registro, login y validaciones de seguridad.
 */
describe('Pruebas de Autenticación (User Model)', () => {
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!'
  };

  /**
   * Test 1: Registro de un nuevo usuario.
   * Por qué: Valida que el sistema puede persistir nuevos usuarios y hashear sus contraseñas.
   * Funcionamiento: Envía una petición POST con datos válidos y espera un status 201 y un token.
   */
  test('Debe registrar un nuevo usuario con éxito', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data).toHaveProperty('token');
  });

  /**
   * Test 2: Inicio de sesión de usuario existente.
   * Por qué: Valida que el proceso de comparación de hashes de contraseñas y generación de JWT funcione.
   * Funcionamiento: Intenta loguear con las credenciales creadas en el test anterior.
   */
  test('Debe iniciar sesión correctamente con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  /**
   * Test 3: Validación de unicidad de correo electrónico.
   * Por qué: Asegura que las restricciones del modelo (unique: true) se cumplan a nivel de API.
   * Funcionamiento: Intenta registrar un usuario con el mismo email que ya existe en la base de datos.
   */
  test('No debe permitir el registro de un email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(true);
  });
});
