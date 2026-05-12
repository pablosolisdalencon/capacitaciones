import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function OperatorRequests({ token }) {
  const [requests, setRequests] = useState([]);
  const [type, setType] = useState('Creacion_Especialidad');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (err) { setError('Error de conexión'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, comment })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Solicitud creada con éxito');
        fetchRequests();
        setComment('');
      } else {
        setError('Error al crear solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Solicitudes de Creación</h2>
      
      {/* Formulario */}
      <form onSubmit={handleCreate} className="bg-white/70 p-4 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Solicitud</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="Creacion_Especialidad">Crear Especialidad</option>
            <option value="Creacion_Capacitacion">Crear Capacitación</option>
            <option value="Creacion_Agendamiento">Crear Agendamiento</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Detalles / Comentario</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="Describe lo que necesitas crear..."
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Enviar Solicitud
        </button>
      </form>

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      {/* Tabla */}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Tipo</th>
              <th className="p-3">Detalles</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{req.type}</td>
                <td className="p-3 text-gray-600">{req.comment}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    req.status === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-300' :
                    req.status === 'Aprobada' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OperatorRequests;
