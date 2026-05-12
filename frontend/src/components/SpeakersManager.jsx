import { useState, useEffect } from 'react';

function SpeakersManager({ token }) {
  const [speakers, setSpeakers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/speakers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSpeakers(data);
      } else {
        setError('Error al cargar relatores');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/speakers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await res.json();
      if (res.ok) {
        setSpeakers([...speakers, data]);
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setError('Error al crear relator');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Relatores</h2>
      
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
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          Crear Relator
        </button>
      </form>

      {/* Tabla */}
      {error && <p className="text-red-400">{error}</p>}
      <div className="bg-white/70 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((speaker) => (
              <tr key={speaker.id} className="border-t border-gray-200 hover:bg-white/70">
                <td className="p-3">{speaker.name}</td>
                <td className="p-3 text-gray-600">{speaker.email}</td>
                <td className="p-3 text-gray-600">{speaker.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpeakersManager;
