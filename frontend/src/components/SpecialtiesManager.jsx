import { useState, useEffect } from 'react';

function SpecialtiesManager({ token }) {
  const [specialties, setSpecialties] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/specialties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSpecialties(data);
      } else {
        setError('Error al cargar especialidades');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/specialties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      const data = await res.json();
      if (res.ok) {
        setSpecialties([...specialties, data]);
        setName('');
        setDescription('');
      } else {
        setError('Error al crear especialidad');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Especialidades</h2>
      
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
          Crear Especialidad
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
            </tr>
          </thead>
          <tbody>
            {specialties.map((specialty) => (
              <tr key={specialty.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{specialty.name}</td>
                <td className="p-3 text-gray-600">{specialty.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpecialtiesManager;
