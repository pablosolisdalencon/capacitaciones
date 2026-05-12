import { useState, useEffect } from 'react';

function TrainingsManager({ token }) {
  const [trainings, setTrainings] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trainings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTrainings(data);
      } else {
        setError('Error al cargar capacitaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, duration: parseInt(duration), isCertified })
      });
      const data = await res.json();
      if (res.ok) {
        setTrainings([...trainings, data]);
        setName('');
        setDescription('');
        setDuration('');
        setIsCertified(false);
      } else {
        setError('Error al crear capacitación');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Capacitaciones</h2>
      
      {/* Formulario */}
      <form onSubmit={handleCreate} className="bg-white/70 p-4 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duración (horas)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCertified}
            onChange={(e) => setIsCertified(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label className="text-sm font-medium">¿Es Certificada?</label>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Crear Capacitación
        </button>
      </form>

      {/* Tabla */}
      {error && <p className="text-red-400">{error}</p>}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Duración</th>
              <th className="p-3">Certificada</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{training.name}</td>
                <td className="p-3 text-gray-600">{training.description}</td>
                <td className="p-3">{training.duration}h</td>
                <td className="p-3">{training.isCertified ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrainingsManager;
