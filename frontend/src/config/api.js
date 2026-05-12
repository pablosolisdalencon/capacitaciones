// Configuración central de la API
// En producción (Render), usa la variable VITE_API_URL
// En local, cae a localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
