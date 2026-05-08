// Test sencillo para verificar que Jest funciona correctamente
describe('Pruebas de lógica básica', () => {
  test('Suma de dos números', () => {
    const sum = (a, b) => a + b;
    expect(sum(2, 2)).toBe(4);
  });

  test('Concatenación de strings', () => {
    const brand = 'Horizon' + ' Air';
    expect(brand).toBe('Horizon Air');
  });
});
