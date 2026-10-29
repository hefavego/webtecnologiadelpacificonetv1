
// ─────────────────────────────────────────────────────────────
//  VARIABLE ÚNICA DE URL BASE DE LA API
//  Para cambiar de entorno edita .env → VITE_API_URL
// ─────────────────────────────────────────────────────────────

/** URL base del servidor Node.js */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Endpoints centralizados ──────────────────────────────────
export const API = {
  health:      `${API_BASE_URL}/api/health`,

  // Auth
  login:       `${API_BASE_URL}/api/auth/login`,
  register:    `${API_BASE_URL}/api/auth/register`,
  logout:      `${API_BASE_URL}/api/auth/logout`,
  forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
  resetPassword:  `${API_BASE_URL}/api/auth/reset-password`,
  changePassword: `${API_BASE_URL}/api/auth/change-password`,

  // Quotations
  quotations:  `${API_BASE_URL}/api/quotations`,
  quotation:   (id) => `${API_BASE_URL}/api/quotations/${id}`,

  // Analytics / Visits
  visits:        `${API_BASE_URL}/api/visits`,
  visitStats:    `${API_BASE_URL}/api/visits/stats`,
  visitsDelete:  `${API_BASE_URL}/api/visits`,   // DELETE (limpiar datos de prueba)

  // Products CRUD
  products:      `${API_BASE_URL}/api/products`,
  product:       (id) => `${API_BASE_URL}/api/products/${id}`,

  // General Site Content
  siteContent:   `${API_BASE_URL}/api/site-content`,
};

// ─────────────────────────────────────────────────────────────
//  Gestión del JWT token (en memoria + sessionStorage)
//  - Memoria: más seguro (no accesible por XSS desde otras tabs)
//  - sessionStorage: persiste mientras la pestaña esté abierta
// ─────────────────────────────────────────────────────────────

const TOKEN_KEY = 'tp_auth_token';

let _memoryToken = null;

/** Guarda el JWT después de login */
export const setAuthToken = (token) => {
  _memoryToken = token;
  try { sessionStorage.setItem(TOKEN_KEY, token); } catch {}
};

/** Obtiene el JWT actual */
export const getAuthToken = () => {
  if (_memoryToken) return _memoryToken;
  try {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) { _memoryToken = stored; }
    return stored;
  } catch { return null; }
};

/** Elimina el JWT al cerrar sesión */
export const clearAuthToken = () => {
  _memoryToken = null;
  try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
};

/** Verifica si hay sesión activa */
export const isAuthenticated = () => Boolean(getAuthToken());

// ─────────────────────────────────────────────────────────────
//  Helper genérico de fetch
//  - Adjunta automáticamente el token JWT si existe
//  - Lanza Error con el mensaje del servidor si !response.ok
// ─────────────────────────────────────────────────────────────

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<any>} data del servidor
 */
export const apiFetch = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Adjuntar token JWT automáticamente si existe
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  // 204 No Content (tracking de visitas) — no parsear body
  if (response.status === 204) return null;

  const json = await response.json();

  if (!response.ok || json.success === false) {
    const err = new Error(json.message || `Error HTTP ${response.status}`);
    err.status = response.status;
    err.errors = json.errors; // Errores de validación
    throw err;
  }

  return json.data ?? json;
};
