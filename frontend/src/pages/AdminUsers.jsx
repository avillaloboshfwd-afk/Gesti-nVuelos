import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { FiTrash2 } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => { setLoading(true); userService.getAll().then(r => setUsers(r.data.data)).catch(console.error).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try { await userService.delete(id); fetch(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header"><h1 className="page-title">Gestión de Usuarios</h1><p className="page-subtitle">Usuarios registrados en el sistema</p></div>
      <div className="table-container">
        <table>
          <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th><th>Acciones</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td style={{fontWeight:500}}>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role==='admin'?'badge-primary':'badge-info'}`}>{u.role}</span></td>
                <td>{fmt(u.createdAt)}</td>
                <td>{u.role !== 'admin' && <button className="btn btn-danger btn-icon" onClick={() => handleDelete(u.id)}><FiTrash2 /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
