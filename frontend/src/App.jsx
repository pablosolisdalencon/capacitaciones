import { useState, useEffect } from 'react'
import API_URL from '../config/api.js';
import ServicesManager from './components/ServicesManager'
import SpecialtiesManager from './components/SpecialtiesManager'
import TrainingsManager from './components/TrainingsManager'
import SpeakersManager from './components/SpeakersManager'
import TalksManager from './components/TalksManager'
import RequestsManager from './components/RequestsManager'
import WorkersManager from './components/WorkersManager'
import OperatorRequests from './components/OperatorRequests'
import Dashboard from './components/Dashboard'
import Agenda from './components/Agenda'
import FunctionalView from './components/FunctionalView'
import logoOval from './assets/logo-oval.png'
import logoAsem from './assets/logo-asem.png'
import logoRyce from './assets/logo-ryce.png'
import logoInntek from './assets/logo-inntek.gif'
import logoIso from './assets/logo-iso.png'

function App() {
  const [count, setCount] = useState(0)
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [currentView, setCurrentView] = useState('welcome');
  const [adminSubView, setAdminSubView] = useState('dashboard');
  const [operatorSubView, setOperatorSubView] = useState('workers');
  const [navMode, setNavMode] = useState('PERSONAS');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [services, setServices] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('$\{API_URL\}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setCurrentView('welcome');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const fetchWorkers = async () => {
    try {
      const res = await fetch('$\{API_URL\}/api/workers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setWorkers(data);
    } catch (err) { console.error('Error fetching workers'); }
  };

  const fetchTrainings = async () => {
    try {
      const res = await fetch('$\{API_URL\}/api/trainings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTrainings(data);
    } catch (err) { console.error('Error fetching trainings'); }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('$\{API_URL\}/api/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setServices(data);
    } catch (err) { console.error('Error fetching services'); }
  };

  useEffect(() => {
    if (token) {
      fetchWorkers();
      fetchTrainings();
      fetchServices();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-slate-100 to-white flex items-center justify-center p-4">
        <div className="aero-card max-w-md w-full text-gray-800">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600">Ingresa tus credenciales</p>
          </header>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500"
                placeholder="admin@test.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-blue-500"
                placeholder="password123"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-slate-100 to-white flex text-gray-800 font-sans pt-16">
      {/* Header Fijo Tipo Móvil */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <img src={logoOval} alt="OVAL" className="h-10" />
          <img src={logoAsem} alt="ASEM" className="h-10" />
          <img src={logoRyce} alt="RYCE" className="h-10" />
          <img src={logoInntek} alt="INNTEK" className="h-10" />
          <img src={logoIso} alt="ISO" className="h-10" />
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg text-2xl text-gray-800"
        >
          ☰
        </button>
      </header>

      {/* Menú Desplegable */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-16 w-64 bg-white/90 backdrop-blur-md border-l border-gray-200 p-6 space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <nav className="space-y-2">
              <button 
                onClick={() => { setCurrentView('welcome'); setSelectedItemId(null); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                🏠 Inicio
              </button>
              
              <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Módulos
              </div>
              
              <button 
                onClick={() => { setCurrentView('admin'); setAdminSubView('dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                🛡️ Admin
              </button>
              
              <button 
                onClick={() => { setCurrentView('operator'); setOperatorSubView('workers'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                👷 Operador
              </button>
            </nav>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="w-64 bg-white/70 border-r border-gray-200 p-6 flex flex-col justify-between backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 mb-8">
            Capacitaciones
          </h1>
          
          {/* Selector de Modo */}
          <div className="flex gap-2 mb-4 bg-white/70 p-1 rounded-lg">
            <button 
              onClick={() => setNavMode('PERSONAS')}
              className={`flex-1 py-1 text-sm rounded-md transition-colors ${navMode === 'PERSONAS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/70 hover:text-white'}`}
            >
              Personas
            </button>
            <button 
              onClick={() => setNavMode('CAPACITACIONES')}
              className={`flex-1 py-1 text-sm rounded-md transition-colors ${navMode === 'CAPACITACIONES' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/70 hover:text-white'}`}
            >
              Capacitaciones
            </button>
          </div>

          {/* Filtro de Servicios */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Servicio</label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">Todos los servicios</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Filtro de Categorías (solo en Capacitaciones) */}
          {navMode === 'CAPACITACIONES' && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Categoría</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/70 border border-gray-200 rounded-lg p-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
              >
                <option value="">Todas las categorías</option>
                {/* Categorías (pueden ser especialidades) */}
              </select>
            </div>
          )}

          {/* Listado */}
          <div className="flex-1 overflow-auto space-y-1 mb-4">
            {navMode === 'PERSONAS' ? (
              workers.filter(w => !selectedService || w.ServiceId === selectedService).map(w => (
                <button 
                  key={w.id}
                  onClick={() => { setSelectedItemId(w.id); setCurrentView('welcome'); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedItemId === w.id ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
                >
                  {w.name}
                </button>
              ))
            ) : (
              trainings.filter(t => !selectedService || t.Services?.some(s => s.id === selectedService)).map(t => (
                <button 
                  key={t.id}
                  onClick={() => { setSelectedItemId(t.id); setCurrentView('welcome'); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedItemId === t.id ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
                >
                  {t.name}
                </button>
              ))
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center font-bold">
              {user?.name?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full text-center py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <main>
          {currentView === 'welcome' && (
            selectedItemId ? (
              <FunctionalView navMode={navMode} selectedItemId={selectedItemId} token={token} />
            ) : (
              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold mb-2">Bienvenido de nuevo</h1>
                <p className="text-gray-600">Selecciona un elemento en el panel izquierdo para comenzar.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white/70 p-6 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Módulo Admin</h2>
                    <p className="text-gray-600 text-sm mb-4">Gestión de cursos, relatores y solicitudes.</p>
                    <button 
                      onClick={() => { setCurrentView('admin'); setAdminSubView('dashboard'); }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Ir a Admin →
                    </button>
                  </div>
                  <div className="bg-white/70 p-6 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Módulo Operador</h2>
                    <p className="text-gray-600 text-sm mb-4">Inscripción de trabajadores y seguimiento.</p>
                    <button 
                      onClick={() => { setCurrentView('operator'); setOperatorSubView('workers'); }}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Ir a Operador →
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {currentView === 'admin' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Módulo de Administración</h2>
                <div className="flex gap-2 flex-wrap bg-white/70 p-1 rounded-lg border border-gray-200">
                  {[
                    { id: 'dashboard', name: 'Dashboard' },
                    { id: 'services', name: 'Servicios' },
                    { id: 'specialties', name: 'Especialidades' },
                    { id: 'trainings', name: 'Capacitaciones' },
                    { id: 'speakers', name: 'Relatores' },
                    { id: 'talks', name: 'Charlas' },
                    { id: 'requests', name: 'Solicitudes' }
                  ].map((view) => (
                    <button 
                      key={view.id}
                      onClick={() => setAdminSubView(view.id)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${adminSubView === view.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-white'}`}
                    >
                      {view.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aero-card p-6">
                {adminSubView === 'dashboard' && <Dashboard token={token} />}
                {adminSubView === 'services' && <ServicesManager token={token} />}
                {adminSubView === 'specialties' && <SpecialtiesManager token={token} />}
                {adminSubView === 'trainings' && <TrainingsManager token={token} />}
                {adminSubView === 'speakers' && <SpeakersManager token={token} />}
                {adminSubView === 'talks' && <TalksManager token={token} />}
                {adminSubView === 'requests' && <RequestsManager token={token} />}
              </div>
            </div>
          )}

          {currentView === 'operator' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Módulo de Operador</h2>
                <div className="flex gap-2 bg-white/70 p-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => setOperatorSubView('workers')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${operatorSubView === 'workers' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-white'}`}
                  >
                    Trabajadores
                  </button>
                  <button 
                    onClick={() => setOperatorSubView('requests')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${operatorSubView === 'requests' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-white'}`}
                  >
                    Solicitudes
                  </button>
                </div>
              </div>

              <div className="aero-card p-6">
                {operatorSubView === 'workers' && <WorkersManager token={token} />}
                {operatorSubView === 'requests' && <OperatorRequests token={token} />}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-8 flex justify-between items-center border-t border-gray-200 pt-6 text-sm text-gray-500">
          <div></div>
          <div className="text-right">
            <p>© 2026 Sistema de Capacitaciones OVAL Ltda Cert ISO27001</p>
            <p>Diseño y Desarrollo: Kamel Jarufe y Pablo Solís.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App











