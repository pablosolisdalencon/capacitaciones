import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function RequestsManager({ token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

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

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchRequests(); // Refresh list
      } else {
        setError('Error al actualizar solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Solicitudes</h2>
      
      {error && <p className="text-red-400">{error}</p>}
      
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Tipo</th>
              <th className="p-3">Trabajador</th>
              <th className="p-3">Charla</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{req.type}</td>
                <td className="p-3">{req.Worker?.name || 'N/A'}</td>
                <td className="p-3">{req.Talk?.Training?.name || 'N/A'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    req.status === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-300' :
                    req.status === 'Aprobada' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {req.status === 'Pendiente' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'Aprobada')}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'Rechazada')}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestsManager;
