import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function Dashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('$\{API_URL\}/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) { setError('Error de conexión'); }
  };

  if (!stats) return <div className="text-white">Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
        Panel de Control
      </h2>
      
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white/70 p-6 rounded-xl border border-gray-200 hover:bg-white/10 transition-all">
          <h3 className="text-gray-600 text-sm font-medium">Total Trabajadores</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalWorkers}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/70 p-6 rounded-xl border border-gray-200 hover:bg-white/10 transition-all">
          <h3 className="text-gray-600 text-sm font-medium">Capacitaciones</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalTrainings}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/70 p-6 rounded-xl border border-gray-200 hover:bg-white/10 transition-all">
          <h3 className="text-gray-600 text-sm font-medium">Charlas Agendadas</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalTalks}</p>
        </div>
      </div>

      <div className="bg-white/70 p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Estado de Solicitudes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <p className="text-gray-600 text-sm">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.requests.pending}</p>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <p className="text-gray-600 text-sm">Aprobadas</p>
            <p className="text-2xl font-bold text-green-400">{stats.requests.approved}</p>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <p className="text-gray-600 text-sm">Rechazadas</p>
            <p className="text-2xl font-bold text-red-400">{stats.requests.rejected}</p>
          </div>
          <div className="text-center p-4 bg-white/70 rounded-lg">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold">{stats.requests.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
