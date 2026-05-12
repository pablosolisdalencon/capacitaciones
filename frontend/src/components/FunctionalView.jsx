import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function FunctionalView({ navMode, selectedItemId, token }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resolution, setResolution] = useState('1_ANO');

  useEffect(() => {
    if (selectedItemId) {
      fetchDetails();
    } else {
      setDetails(null);
    }
  }, [selectedItemId, navMode]);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = navMode === 'PERSONAS' ? 'workers' : 'trainings';
      const res = await fetch(`$\{API_URL\}/api/${endpoint}/${selectedItemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDetails(data);
      } else {
        setError(data.message || 'Error al cargar detalles');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItemId) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <p className="text-xl">Selecciona un elemento en el panel izquierdo para ver los detalles.</p>
      </div>
    );
  }

  if (loading) return <div>Cargando detalles...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!details) return null;

  return (
    <div className="space-y-6">
      {navMode === 'PERSONAS' ? (
        <PersonView details={details} resolution={resolution} setResolution={setResolution} />
      ) : (
        <TrainingView details={details} resolution={resolution} setResolution={setResolution} />
      )}
    </div>
  );
}

function PersonView({ details, resolution, setResolution }) {
  const { worker, directTrainings, serviceTrainings, corporateTrainings } = details;

  if (!worker) return null;

  // Deduplicate trainings
  const allTrainings = Array.from(new Map([...corporateTrainings, ...serviceTrainings, ...directTrainings].map(item => [item.id, item])).values());

  const totalAsignados = allTrainings.length;
  const completados = allTrainings.filter(t => worker.Requests?.some(r => r.Talk?.TrainingId === t.id && r.status === 'Aprobada')).length;
  const pendientes = totalAsignados - completados;
  const percentCompletados = totalAsignados > 0 ? Math.round((completados / totalAsignados) * 100) : 0;

  const getColumns = () => {
    switch (resolution) {
      case '1_SEMANA': return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      case '1_MES': return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      case '1_TRIMESTRE': return ['Mes 1', 'Mes 2', 'Mes 3'];
      case '1_ANO':
      default: return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
  };

  return (
    <div className="space-y-6">
      {/* Ficha del Trabajador Compacta */}
      <div className="bg-white/70 p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
        {/* Info Básica */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
            {worker.name?.[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold">{worker.name}</h2>
            <p className="text-xs text-gray-600">RUT: {worker.rut} | {worker.Service?.name || 'N/A'}</p>
          </div>
        </div>
        
        {/* KPIs y Gráfico */}
        <div className="flex items-center gap-4">
          {/* Gráfico de Torta */}
          <div className="w-10 h-10 rounded-full border border-gray-200" style={{ 
            background: `conic-gradient(#4ade80 0% ${percentCompletados}%, #facc15 ${percentCompletados}% 100%)` 
          }}></div>
          
          <div className="flex gap-4 text-center text-xs">
            <div>
              <p className="text-gray-500 uppercase">Asignados</p>
              <p className="text-lg font-bold">{totalAsignados}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase">Completados</p>
              <p className="text-lg font-bold text-green-500">{completados}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase">Pendientes</p>
              <p className="text-lg font-bold text-yellow-500">{pendientes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agenda Integrada (Grilla) */}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Agenda de Capacitaciones</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Hoy: {new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            {/* Switch de resolución */}
            <div className="flex gap-1 bg-white/70 p-1 rounded-lg text-xs border border-gray-200">
              {[
              { id: '1_SEMANA', name: '1 Sem' },
              { id: '1_MES', name: '1 Mes' },
              { id: '1_TRIMESTRE', name: '1 Trim' },
              { id: '1_ANO', name: '1 Año' }
            ].map(r => (
              <button 
                key={r.id} 
                onClick={() => setResolution(r.id)}
                className={`px-2 py-1 rounded transition-colors ${resolution === r.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
        </div>
        
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-600 text-white sticky top-0">
              <tr>
                <th className="p-3 border border-gray-300 min-w-[250px]">Capacitación</th>
                {getColumns().map((m, i) => (
                  <th key={i} className="p-2 border border-gray-300 text-center text-xs">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTrainings.map(t => {
                const request = worker.Requests?.find(r => r.Talk?.TrainingId === t.id);
                let activeCellIndex = -1;
                
                if (request && request.Talk?.date) {
                  const date = new Date(request.Talk.date);
                  switch (resolution) {
                    case '1_SEMANA':
                      activeCellIndex = (date.getDay() + 6) % 7; // Mon=0, Sun=6
                      break;
                    case '1_MES':
                      activeCellIndex = Math.floor((date.getDate() - 1) / 7); // Week 0-3
                      break;
                    case '1_TRIMESTRE':
                      activeCellIndex = date.getMonth() % 3; // Month 0-2
                      break;
                    case '1_ANO':
                    default:
                      activeCellIndex = date.getMonth(); // Month 0-11
                      break;
                  }
                }
                
                const columns = getColumns();
                
                return (
                  <tr key={t.id} className="border-t border-gray-200 hover:bg-white/70">
                    <td className="p-3 border border-gray-300">
                      <div className="font-medium text-sm text-gray-800">{t.name}</div>
                      {/* Ficha compacta */}
                      <div className="text-xs text-gray-500 flex gap-2 mt-1">
                        {corporateTrainings.find(ct => ct.id === t.id) && <span className="text-blue-500">Corp</span>}
                        {serviceTrainings.find(st => st.id === t.id) && <span className="text-indigo-500">Serv</span>}
                        {directTrainings.find(dt => dt.id === t.id) && <span className="text-teal-500">Dir</span>}
                      </div>
                    </td>
                    {columns.map((_, i) => (
                      <td key={i} className={`p-1 border border-gray-300 text-center ${activeCellIndex === i ? 'bg-blue-50' : ''}`}>
                        {activeCellIndex === i ? (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium inline-block w-full text-center ${
                            request.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'Aprobada' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {request.Talk?.date ? (() => {
                              const d = new Date(request.Talk.date);
                              return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
                            })() : ''}
                          </span>
                        ) : ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {allTrainings.length === 0 && (
                <tr>
                  <td colSpan={getColumns().length + 1} className="p-4 text-center text-gray-500">No hay capacitaciones asignadas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TrainingView({ details, resolution, setResolution }) {
  const requests = details.Talks?.flatMap(talk => talk.Requests || []) || [];
  const workers = details.AssignedWorkers || [];

  const totalInscritos = workers.length;
  const completados = workers.filter(w => requests.some(r => r.WorkerId === w.id && r.status === 'Aprobada')).length;
  const pendientes = totalInscritos - completados;
  const percentCompletados = totalInscritos > 0 ? Math.round((completados / totalInscritos) * 100) : 0;

  const getColumns = () => {
    switch (resolution) {
      case '1_SEMANA': return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      case '1_MES': return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
      case '1_TRIMESTRE': return ['Mes 1', 'Mes 2', 'Mes 3'];
      case '1_ANO':
      default: return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
  };

  return (
    <div className="space-y-6">
      {/* Ficha de Capacitación Compacta */}
      <div className="bg-white/70 p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
        {/* Info Básica */}
        <div>
          <h2 className="text-lg font-bold">{details.name}</h2>
          <p className="text-xs text-gray-600">{details.description || 'Sin descripción'}</p>
        </div>
        
        {/* KPIs y Gráfico */}
        <div className="flex items-center gap-4">
          {/* Gráfico de Torta */}
          <div className="w-10 h-10 rounded-full border border-gray-200" style={{ 
            background: `conic-gradient(#4ade80 0% ${percentCompletados}%, #facc15 ${percentCompletados}% 100%)` 
          }}></div>
          
          <div className="flex gap-4 text-center text-xs">
            <div>
              <p className="text-gray-500 uppercase">Inscritos</p>
              <p className="text-lg font-bold">{totalInscritos}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase">Charlas</p>
              <p className="text-lg font-bold">{details.Talks?.length || 0}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase">Certificada</p>
              <p className="text-lg font-bold">{details.isCertified ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agenda Integrada (Grilla) */}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Participación de Trabajadores</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Hoy: {new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            {/* Switch de resolución */}
            <div className="flex gap-1 bg-white/70 p-1 rounded-lg text-xs border border-gray-200">
              {[
              { id: '1_SEMANA', name: '1 Sem' },
              { id: '1_MES', name: '1 Mes' },
              { id: '1_TRIMESTRE', name: '1 Trim' },
              { id: '1_ANO', name: '1 Año' }
            ].map(r => (
              <button 
                key={r.id} 
                onClick={() => setResolution(r.id)}
                className={`px-2 py-1 rounded transition-colors ${resolution === r.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
        </div>
        
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-600 text-white sticky top-0">
              <tr>
                <th className="p-3 border border-gray-300 min-w-[200px]">Trabajador</th>
                {getColumns().map((m, i) => (
                  <th key={i} className="p-2 border border-gray-300 text-center text-xs">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.map(w => {
                const req = requests.find(r => r.WorkerId === w.id);
                let activeCellIndex = -1;
                
                if (req && req.Talk?.date) {
                  const date = new Date(req.Talk.date);
                  switch (resolution) {
                    case '1_SEMANA':
                      activeCellIndex = (date.getDay() + 6) % 7; // Mon=0, Sun=6
                      break;
                    case '1_MES':
                      activeCellIndex = Math.floor((date.getDate() - 1) / 7); // Week 0-3
                      break;
                    case '1_TRIMESTRE':
                      activeCellIndex = date.getMonth() % 3; // Month 0-2
                      break;
                    case '1_ANO':
                    default:
                      activeCellIndex = date.getMonth(); // Month 0-11
                      break;
                  }
                }
                
                const columns = getColumns();
                
                return (
                  <tr key={w.id} className="border-t border-gray-200 hover:bg-white/70">
                    <td className="p-3 border border-gray-300">
                      <div className="font-medium text-sm text-gray-800">{w.name}</div>
                      <div className="text-xs text-gray-500">RUT: {w.rut}</div>
                    </td>
                    {columns.map((_, i) => (
                      <td key={i} className={`p-1 border border-gray-300 text-center ${activeCellIndex === i ? 'bg-blue-50' : ''}`}>
                        {activeCellIndex === i ? (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium inline-block w-full text-center ${
                            req.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                            req.status === 'Aprobada' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {req.Talk?.date ? (() => {
                              const d = new Date(req.Talk.date);
                              return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
                            })() : ''}
                          </span>
                        ) : ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={getColumns().length + 1} className="p-4 text-center text-gray-500">No hay trabajadores asignados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FunctionalView;
