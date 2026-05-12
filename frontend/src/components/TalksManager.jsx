import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function TalksManager({ token }) {
  const [talks, setTalks] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [date, setDate] = useState('');
  const [spots, setSpots] = useState('');
  const [trainingId, setTrainingId] = useState('');
  const [speakerId, setSpeakerId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTalks();
    fetchTrainings();
    fetchSpeakers();
  }, []);

  const fetchTalks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/talks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTalks(data);
    } catch (err) { setError('Error de conexión'); }
  };

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/trainings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTrainings(data);
    } catch (err) { }
  };

  const fetchSpeakers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/speakers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSpeakers(data);
    } catch (err) { }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/talks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          date, 
          spots: parseInt(spots), 
          TrainingId: trainingId, 
          SpeakerId: speakerId 
        })
      });
      const data = await res.json();
      if (res.ok) {
        fetchTalks(); // Refresh list to get populated data
        setDate('');
        setSpots('');
        setTrainingId('');
        setSpeakerId('');
      } else {
        setError('Error al agendar charla');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sistema de Agendamiento de Charlas</h2>
      
      {/* Formulario */}
      <form onSubmit={handleCreate} className="bg-white/70 p-4 rounded-lg border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha y Hora</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cupos</label>
          <input
            type="number"
            value={spots}
            onChange={(e) => setSpots(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Capacitación</label>
          <select
            value={trainingId}
            onChange={(e) => setTrainingId(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Selecciona una capacitación</option>
            {trainings.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Relator</label>
          <select
            value={speakerId}
            onChange={(e) => setSpeakerId(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Selecciona un relator</option>
            {speakers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Agendar Charla
        </button>
      </form>

      {/* Tabla */}
      {error && <p className="text-red-400">{error}</p>}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Capacitación</th>
              <th className="p-3">Relator</th>
              <th className="p-3">Cupos</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {talks.map((talk) => (
              <tr key={talk.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{new Date(talk.date).toLocaleString()}</td>
                <td className="p-3">{talk.Training?.name || 'N/A'}</td>
                <td className="p-3 text-gray-600">{talk.Speaker?.name || 'N/A'}</td>
                <td className="p-3">{talk.spots}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${talk.status === 'Programada' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20'}`}>
                    {talk.status}
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

export default TalksManager;
