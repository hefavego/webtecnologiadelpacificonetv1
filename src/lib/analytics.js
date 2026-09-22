
import { API, apiFetch } from '@/lib/api';

// ─────────────────────────────────────────────
// Helpers de parseo (user-agent)
// ─────────────────────────────────────────────

export const parseBrowser = (ua = '') => {
  if (!ua) return 'Desconocido';
  if (ua.includes('Edg/') || ua.includes('Edge/'))        return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera/'))       return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Chromium/')) return 'Chrome';
  if (ua.includes('Firefox/'))                            return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Chromium/'))                           return 'Chromium';
  if (ua.includes('MSIE') || ua.includes('Trident/'))    return 'IE';
  return 'Otro';
};

export const parseDevice = (ua = '') => {
  if (!ua) return 'desktop';
  if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    if (/iPad|Tablet/i.test(ua)) return 'tablet';
    return 'mobile';
  }
  return 'desktop';
};

export const getPageLabel = (path = '') => {
  const map = {
    '/':         'Inicio',
    '/about':    'Nosotros',
    '/services': 'Servicios',
    '/products': 'Productos',
    '/contact':  'Contacto',
    '/admin':    'Admin',
    '/download': 'Descargas',
  };
  if (path.startsWith('/service/')) return `Servicio: ${path.split('/service/')[1]}`;
  return map[path] || path;
};

// ─────────────────────────────────────────────
// Track a page visit → Node.js / MySQL
// ─────────────────────────────────────────────

export const trackPageVisit = async (page) => {
  try {
    const ua           = navigator.userAgent || '';
    const browser      = parseBrowser(ua);
    const device_type  = parseDevice(ua);
    const referrer     = document.referrer || null;
    const screen_width = window.screen?.width || null;
    const session_id   = getOrCreateSessionId();

    await apiFetch(API.visits, {
      method: 'POST',
      body: {
        page,
        page_title: getPageLabel(page),
        browser,
        device_type,
        referrer,
        screen_width,
        session_id,
      },
    });
  } catch (err) {
    // Fallo silencioso — el tracking nunca debe romper la UX
    console.warn('[Analytics] trackPageVisit error:', err.message);
  }
};

// ─────────────────────────────────────────────
// Session ID  (sessionStorage UUID)
// ─────────────────────────────────────────────

const getOrCreateSessionId = () => {
  try {
    const key = 'tp_session_id';
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID?.() || `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `sess-${Date.now()}`;
  }
};

// ─────────────────────────────────────────────
// Fetch datos de visitas desde Node/MySQL
// ─────────────────────────────────────────────

export const fetchVisitStats = async () => {
  const data = await apiFetch(API.visits);
  return Array.isArray(data) ? data : [];
};

// ─────────────────────────────────────────────
// Agregaciones en cliente (igual que antes)
// ─────────────────────────────────────────────

export const countToday = (visits) => {
  const today = new Date().toISOString().slice(0, 10);
  return visits.filter(v => (v.created_at || '').startsWith(today)).length;
};

export const countThisWeek = (visits) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return visits.filter(v => new Date(v.created_at) >= weekAgo).length;
};

export const countUniqueSessions = (visits) =>
  new Set(visits.map(v => v.session_id)).size;

export const getTopPages = (visits, limit = 8) => {
  const map = {};
  visits.forEach(v => {
    if (!map[v.page]) map[v.page] = { page: v.page, page_title: v.page_title || v.page, count: 0 };
    map[v.page].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count).slice(0, limit);
};

export const getDeviceBreakdown = (visits) => {
  const map = { desktop: 0, mobile: 0, tablet: 0 };
  visits.forEach(v => { map[v.device_type || 'desktop'] = (map[v.device_type || 'desktop'] || 0) + 1; });
  const total = visits.length || 1;
  return Object.entries(map).map(([type, count]) => ({
    type, count, pct: Math.round((count / total) * 100),
  }));
};

export const getBrowserBreakdown = (visits) => {
  const map = {};
  visits.forEach(v => { const b = v.browser || 'Otro'; map[b] = (map[b] || 0) + 1; });
  const total = visits.length || 1;
  return Object.entries(map)
    .map(([browser, count]) => ({ browser, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
};

export const getVisitsByDay = (visits) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso   = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' });
    days.push({ date: iso, label, count: 0 });
  }
  visits.forEach(v => {
    const day   = (v.created_at || '').slice(0, 10);
    const found = days.find(d => d.date === day);
    if (found) found.count++;
  });
  return days;
};

export const getTopReferrers = (visits) => {
  const map = {};
  visits.forEach(v => {
    let source = 'Directo';
    try { if (v.referrer) source = new URL(v.referrer).hostname; } catch {}
    map[source] = (map[source] || 0) + 1;
  });
  const total = visits.length || 1;
  return Object.entries(map)
    .map(([source, count]) => ({ source, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
};
