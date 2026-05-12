import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function Agenda({ token }) {
  const [talks, setTalks] = useState([]);
  const [resolution, setResolution] = useState('1_MES');

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/talks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTalks(data);
    } catch (err) { }
  };

  const filterTalks = (talks) => {
    const now = new Date();
    const futureLimit = new Date();
    
    switch (resolution) {
      case '1_SEMANA': futureLimit.setDate(now.getDate() + 7); break;
      case '1_MES': futureLimit.setMonth(now.getMonth() + 1); break;
      case '1_TRIMESTRE': futureLimit.setMonth(now.getMonth() + 3); break;
      case '1_SEMESTRE': futureLimit.setMonth(now.getMonth() + 6); break;
      case '1_ANO': futureLimit.setFullYear(now.getFullYear() + 1); break;
      default: return talks;
    }

    return talks.filter(talk => {
      const talkDate = new Date(talk.date);
      return talkDate >= now && talkDate <= futureLimit;
    });
  };

  const filteredTalks = filterTalks(talks);

  return (
    <div className="space-y-4">
      {/* Selector de Resolución */}
      <div className="flex gap-1 bg-white/70 p-1 rounded-lg text-xs overflow-x-auto">
        {[
          { id: '1_SEMANA', name: '1 Sem' },
          { id: '1_MES', name: '1 Mes' },
          { id: '1_TRIMESTRE', name: '1 Trim' },
          { id: '1_SEMESTRE', name: '1 Semest' },
          { id: '1_ANO', name: '1 Año' }
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setResolution(r.id)}
            className={`flex-1 py-1 px-1 rounded transition-colors ${resolution === r.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-white'}`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Listado */}
      <div className="space-y-4">
        {filteredTalks.map(talk => (
          <div key={talk.id} className="bg-white/70 p-4 rounded-lg border border-gray-200 hover:bg-white/10 transition-all">
            <p className="text-xs text-blue-400 font-semibold">{new Date(talk.date).toLocaleDateString()}</p>
            <h3 className="font-medium text-sm mt-1">{talk.Training?.name}</h3>
            <p className="text-xs text-gray-600 mt-1">Relator: {talk.Speaker?.name}</p>
          </div>
        ))}
        {filteredTalks.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No hay charlas en este período</p>
        )}
      </div>
    </div>
  );
}

export default Agenda;
