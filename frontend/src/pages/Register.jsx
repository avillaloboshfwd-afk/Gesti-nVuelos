import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden');
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/flights');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.details?.[0]?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div style={{fontSize:'2.5rem',marginBottom:8}}>✈</div>
          <h1>Horizon Air</h1>
          <p>Crear una cuenta nueva</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
          </div>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" name="password" className="form-input" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input type="password" name="confirm" className="form-input" value={form.confirm} onChange={handleChange} placeholder="Repite la contraseña" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
