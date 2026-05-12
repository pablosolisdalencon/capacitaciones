import { useState, useEffect } from 'react';
import API_URL from '../config/api.js';

function ServicesManager({ token }) {
  const [services, setServices] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
    fetchTrainings();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setServices(data);
      } else {
        setError('Error al cargar servicios');
      }
    } catch (err) {
      setError('Error de conexión');
    }
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
      const res = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      const data = await res.json();
      if (res.ok) {
        setServices([...services, data]);
        setName('');
        setDescription('');
      } else {
        setError('Error al crear servicio');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleAssignTrainings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/services/${selectedServiceId}/trainings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trainingIds: selectedTrainings })
      });
      if (res.ok) {
        alert('Capacitaciones asignadas exitosamente');
        setSelectedServiceId(null);
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
      <h2 className="text-2xl font-bold">Gestión de Servicios</h2>
      
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
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Crear Servicio
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
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{service.name}</td>
                <td className="p-3 text-gray-600">{service.description}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setSelectedTrainings([]); // Ideally pre-populate
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Asignar Cursos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de Asignación */}
      {selectedServiceId && (
        <div className="bg-white/70 p-4 rounded-lg border border-blue-500/30 space-y-4">
          <h3 className="text-lg font-semibold">
            Asignar Capacitaciones al Servicio: {services.find(s => s.id === selectedServiceId)?.name}
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
              onClick={() => setSelectedServiceId(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesManager;
