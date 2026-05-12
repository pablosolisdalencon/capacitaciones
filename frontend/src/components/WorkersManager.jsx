import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function WorkersManager({ token }) {
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [talks, setTalks] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedWorkerForTrainings, setSelectedWorkerForTrainings] = useState(null);
  const [selectedTalk, setSelectedTalk] = useState('');
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchWorkers();
    fetchServices();
    fetchTalks();
    fetchTrainings();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setWorkers(data);
    } catch (err) { setError('Error de conexión'); }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setServices(data);
    } catch (err) { }
  };

  const fetchTalks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/talks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTalks(data);
    } catch (err) { }
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, rut, ServiceId: serviceId })
      });
      const data = await res.json();
      if (res.ok) {
        fetchWorkers(); // Refresh list
        setName('');
        setRut('');
        setServiceId('');
      } else {
        setError('Error al crear trabajador');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEnroll = async (e) => {
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
        body: JSON.stringify({
          type: 'Inscripcion',
          WorkerId: selectedWorker.id,
          TalkId: selectedTalk,
          comment: `Inscripción solicitada por operador`
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Solicitud de inscripción creada para ${selectedWorker.name}`);
        setSelectedWorker(null);
        setSelectedTalk('');
      } else {
        setError(data.message || 'Error al crear solicitud');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleAssignTrainings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workers/${selectedWorkerForTrainings.id}/trainings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trainingIds: selectedTrainings })
      });
      if (res.ok) {
        setSuccess(`Capacitaciones asignadas exitosamente a ${selectedWorkerForTrainings.name}`);
        setSelectedWorkerForTrainings(null);
        setSelectedTrainings([]);
      } else {
        setError('Error al asignar capacitaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Trabajadores e Inscripción</h2>
      
      {/* Formulario de Creación */}
      <form onSubmit={handleCreate} className="bg-white/70 p-4 rounded-lg border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold">Agregar Trabajador</h3>
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
          <label className="block text-sm font-medium mb-1">RUT</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Servicio</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Selecciona un servicio</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Crear Trabajador
        </button>
      </form>

      {/* Modal/Sección de Inscripción */}
      {selectedWorker && (
        <div className="bg-white/10 p-4 rounded-lg border border-blue-500 space-y-4">
          <h3 className="text-lg font-semibold">Inscribir a {selectedWorker.name}</h3>
          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Seleccionar Charla</label>
              <select
                value={selectedTalk}
                onChange={(e) => setSelectedTalk(e.target.value)}
                className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Selecciona una charla</option>
                {talks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.Training?.name} - {new Date(t.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium">
                Confirmar Inscripción
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sección de Asignación de Cursos Directos */}
      {selectedWorkerForTrainings && (
        <div className="bg-white/70 p-4 rounded-lg border border-blue-500/30 space-y-4">
          <h3 className="text-lg font-semibold">
            Asignar Capacitaciones Directas a: {selectedWorkerForTrainings.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto p-2 bg-white/70 rounded">
            {trainings.map(t => (
              <label key={t.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTrainings.includes(t.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTrainings([...selectedTrainings, t.id]);
                    } else {
                      setSelectedTrainings(selectedTrainings.filter(id => id !== t.id));
                    }
                  }}
                  className="rounded border-gray-200 bg-white/70 text-blue-600 focus:ring-blue-500"
                />
                {t.name}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAssignTrainings}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Guardar Asignaciones
            </button>
            <button
              onClick={() => setSelectedWorkerForTrainings(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-white/20 rounded-lg font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      {/* Tabla */}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">RUT</th>
              <th className="p-3">Servicio</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{worker.name}</td>
                <td className="p-3 text-gray-600">{worker.rut}</td>
                <td className="p-3 text-gray-600">{worker.Service?.name || 'N/A'}</td>
                <td className="p-3">
                  <button 
                    onClick={() => setSelectedWorker(worker)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium mr-2"
                  >
                    Inscribir
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedWorkerForTrainings(worker);
                      setSelectedTrainings([]); // Ideally pre-populate
                    }}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium"
                  >
                    Asignar Cursos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkersManager;
