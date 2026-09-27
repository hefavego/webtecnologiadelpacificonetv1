import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API, apiFetch, setAuthToken, clearAuthToken, getAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useContent } from '@/context/ContentContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Check, Clock, XCircle, RefreshCw, Mail, Phone, Loader2,
  DollarSign, AlertCircle, Edit2, Lock, LogIn, UserPlus,
  BarChart2, Users, Eye, Monitor, Smartphone, Tablet,
  Globe, TrendingUp, Activity, ArrowUp, ArrowDown, Minus,
  FileText, MousePointerClick, Trash2, MessageCircle, Plus, X, Link as LinkIcon, Image as ImageIcon, Package
} from 'lucide-react';
import {
  fetchVisitStats,
  countToday,
  countThisWeek,
  countUniqueSessions,
  getTopPages,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getVisitsByDay,
  getTopReferrers,
} from '@/lib/analytics';
import WhatsAppCrmTab from '@/components/admin/WhatsAppCrmTab';

// ─── Small reusable components ──────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, sub, color = 'cyan', trend }) => {
  const colors = {
    cyan:   { bg: 'bg-cyan-50',   icon: 'text-cyan-600',   border: 'border-cyan-100' },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
    emerald:{ bg: 'bg-emerald-50',icon: 'text-emerald-600',border: 'border-emerald-100' },
  };
  const c = colors[color] || colors.cyan;
  return (
    <div className={`bg-white border ${c.border} rounded-2xl p-5 flex items-start gap-4 shadow-sm`}>
      <div className={`${c.bg} p-3 rounded-xl`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`text-xs font-semibold flex items-center gap-0.5 mt-1 ${
          trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-gray-400'
        }`}>
          {trend > 0 ? <ArrowUp size={12} /> : trend < 0 ? <ArrowDown size={12} /> : <Minus size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};

const BarRow = ({ label, count, max, color = '#0891b2' }) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-sm text-gray-600 w-36 truncate shrink-0" title={label}>{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8 text-right shrink-0">{count}</span>
    </div>
  );
};

const DayBar = ({ label, count, max }) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-xs font-semibold text-gray-600">{count}</span>
      <div className="w-full bg-gray-100 rounded-full overflow-hidden" style={{ height: '80px' }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full rounded-full bg-gradient-to-t from-cyan-600 to-cyan-400 mt-auto"
          style={{ marginTop: `${100 - pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
};

const DeviceIcon = ({ type }) => {
  if (type === 'mobile') return <Smartphone className="w-4 h-4" />;
  if (type === 'tablet') return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

const deviceLabel = (t) => ({ mobile: 'Móvil', tablet: 'Tablet', desktop: 'Escritorio' }[t] || t);
const deviceColor = (t) => ({ mobile: '#06b6d4', tablet: '#6366f1', desktop: '#2563eb' }[t] || '#94a3b8');
const browserColor = (b) => {
  const map = { Chrome: '#4285F4', Firefox: '#FF7139', Safari: '#007AFF', Edge: '#0078D4', Opera: '#FF1B2D' };
  return map[b] || '#94a3b8';
};

// ─── Analytics Tab ───────────────────────────────────────────────────────────

const AnalyticsTab = ({ refreshKey }) => {
  const [visits, setVisits]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setVisits([]);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVisitStats();
      setVisits(data);
    } catch (err) {
      const msg = err.message || 'Error al cargar analíticas.';
      setError(msg);
      toast({ title: 'Error de analíticas', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Se dispara cada vez que refreshKey cambia (botón Actualizar del header)
  useEffect(() => { load(); }, [load, refreshKey]);

  // Valores directamente desde visits (cuando visits=[] todo es 0 naturalmente)
  const total        = visits.length;
  const today        = countToday(visits);
  const thisWeek     = countThisWeek(visits);
  const sessions     = countUniqueSessions(visits);
  const topPages     = getTopPages(visits);
  const devices      = getDeviceBreakdown(visits);  // siempre desktop/mobile/tablet
  const browsers     = getBrowserBreakdown(visits);
  const byDay        = getVisitsByDay(visits);      // siempre 7 dias con count=0
  const referrers    = getTopReferrers(visits);
  const maxPage      = topPages[0]?.count || 1;
  const maxDay       = Math.max(...byDay.map(d => d.count), 1);
  const recentVisits = visits.slice(0, 25);

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mb-4 bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <p className="text-lg font-semibold text-gray-800 mb-2">Error al cargar analíticas</p>
        <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">{error}</p>
        <Button onClick={load} variant="outline" className="gap-2">
          <RefreshCw size={15} /> Reintentar
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Barra de progreso fina — unico indicador de carga */}
      <div className="relative h-0.5 bg-gray-100 rounded-full overflow-hidden -mt-2 mb-1">
        {loading && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-cyan-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '85%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye}        label="Total visitas"   value={total}    sub={loading ? 'Actualizando...' : 'Desde el inicio'}    color="cyan"    />
        <StatCard icon={Activity}   label="Hoy"             value={today}    sub={loading ? 'Actualizando...' : 'En las últimas 24h'} color="emerald" />
        <StatCard icon={TrendingUp} label="Esta semana"     value={thisWeek} sub={loading ? 'Actualizando...' : 'Últimos 7 días'}     color="blue"    />
        <StatCard icon={Users}      label="Sesiones únicas" value={sessions} sub={loading ? 'Actualizando...' : 'Visitantes únicos'}  color="violet"  />
      </div>

      {/* Visitas por día — barras colapsan a 0 con setVisits([]) y animan al subir */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-600" /> Visitas últimos 7 días
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-auto" />}
        </h3>
        <div className="flex items-end gap-2 h-28">
          {byDay.map(d => (
            <DayBar key={d.date} label={d.label} count={d.count} max={maxDay} />
          ))}
        </div>
      </div>

      {/* Top pages + Devices */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top pages */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-cyan-600" /> Páginas más visitadas
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-auto" />}
          </h3>
          {topPages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {loading ? 'Cargando páginas...' : 'Sin visitas aún'}
            </p>
          ) : (
            <div className="space-y-3">
              {topPages.map(p => (
                <BarRow key={p.page} label={p.page_title || p.page} count={p.count} max={maxPage} color="#0891b2" />
              ))}
            </div>
          )}
        </div>

        {/* Devices + Browsers */}
        <div className="space-y-6">
          {/* Devices */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-cyan-600" /> Dispositivos
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-auto" />}
            </h3>
            <div className="flex gap-4">
              {devices.map(d => (
                <div key={d.type} className="flex-1 text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white"
                    style={{ backgroundColor: deviceColor(d.type) }}
                  >
                    <DeviceIcon type={d.type} />
                  </div>
                  <div className={`text-lg font-bold text-gray-800 transition-opacity ${loading ? 'opacity-25' : ''}`}>
                    {d.pct}%
                  </div>
                  <div className="text-xs text-gray-500">{deviceLabel(d.type)}</div>
                  <div className={`text-xs text-gray-400 transition-opacity ${loading ? 'opacity-25' : ''}`}>
                    {d.count} visitas
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-600" /> Navegadores
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-auto" />}
            </h3>
            <div className="space-y-2.5">
              {browsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  {loading ? 'Cargando...' : 'Sin visitas aún'}
                </p>
              ) : (
                browsers.slice(0, 5).map(b => (
                  <BarRow key={b.browser} label={b.browser} count={b.count} max={browsers[0]?.count || 1} color={browserColor(b.browser)} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Referrers + Registro reciente */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Referrers */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-600" /> Fuentes de tráfico
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-auto" />}
          </h3>
          {referrers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              {loading ? 'Cargando...' : 'Sin datos aún'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {referrers.map(r => (
                <BarRow key={r.source} label={r.source} count={r.count} max={referrers[0]?.count || 1} color="#6366f1" />
              ))}
            </div>
          )}
        </div>

        {/* Registro reciente */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-600" /> Registro reciente
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 ml-auto" />}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {recentVisits.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                {loading ? 'Cargando registros...' : 'Sin visitas registradas'}
              </p>
            ) : (
              recentVisits.map(v => (
                <div key={v.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="shrink-0 text-gray-400"><DeviceIcon type={v.device_type} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{v.page_title || v.page}</p>
                    <p className="text-xs text-gray-400">{v.browser} · {deviceLabel(v.device_type)}</p>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0 text-right">
                    {new Date(v.created_at).toLocaleString('es-CO', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Site Content Administration Tab ─────────────────────────────────────────

const SiteContentTab = () => {
  const { siteContent, updateSiteContent } = useContent();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (siteContent) {
      setForm(siteContent);
    }
  }, [siteContent]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (key, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(key, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteContent(form);
      toast({
        title: '✅ Contenido Guardado',
        description: 'La información se ha actualizado y se verá reflejada en el frontend de forma inmediata.'
      });
    } catch (err) {
      toast({
        title: 'Error al guardar',
        description: err.message || 'No se pudo actualizar el contenido.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Section Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
          <Monitor className="text-[#0066CC] w-5 h-5" /> Banner Principal (Hero)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge de Inicio</label>
            <input 
              type="text" 
              value={form['hero_badge'] || ''} 
              onChange={e => handleChange('hero_badge', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título Inicial</label>
            <input 
              type="text" 
              value={form['hero_title'] || ''} 
              onChange={e => handleChange('hero_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título Resaltado (Texto Colorido)</label>
            <input 
              type="text" 
              value={form['hero_title_highlight'] || ''} 
              onChange={e => handleChange('hero_title_highlight', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
            <textarea 
              rows={3}
              value={form['hero_description'] || ''} 
              onChange={e => handleChange('hero_description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Imagen de Fondo del Hero</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {form['hero_image'] && (
                <img 
                  src={form['hero_image']} 
                  alt="Hero Preview" 
                  className="w-36 h-20 object-cover rounded-xl border border-gray-200 shadow-sm" 
                />
              )}
              <div className="flex flex-col gap-1">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleImageUpload('hero_image', e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
                />
                <span className="text-xs text-gray-400">Formatos recomendados: JPG, PNG. Máx 3MB.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Who We Are Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
          <Users className="text-[#0066CC] w-5 h-5" /> Quiénes Somos (Página Inicio)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge</label>
            <input 
              type="text" 
              value={form['home_whoweare_badge'] || ''} 
              onChange={e => handleChange('home_whoweare_badge', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título</label>
            <input 
              type="text" 
              value={form['home_whoweare_title'] || ''} 
              onChange={e => handleChange('home_whoweare_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción - Párrafo 1</label>
            <textarea 
              rows={3}
              value={form['home_whoweare_desc1'] || ''} 
              onChange={e => handleChange('home_whoweare_desc1', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción - Párrafo 2</label>
            <textarea 
              rows={3}
              value={form['home_whoweare_desc2'] || ''} 
              onChange={e => handleChange('home_whoweare_desc2', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Imagen de la Sección</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {form['home_whoweare_image'] && (
                <img 
                  src={form['home_whoweare_image']} 
                  alt="Who We Are Preview" 
                  className="w-36 h-20 object-cover rounded-xl border border-gray-200 shadow-sm" 
                />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleImageUpload('home_whoweare_image', e.target.files[0])}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Us Page Content */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
          <FileText className="text-[#0066CC] w-5 h-5" /> Contenido de Página "Nosotros"
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge de Página</label>
            <input 
              type="text" 
              value={form['about_page_badge'] || ''} 
              onChange={e => handleChange('about_page_badge', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título de Página</label>
            <input 
              type="text" 
              value={form['about_page_title'] || ''} 
              onChange={e => handleChange('about_page_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción General</label>
            <textarea 
              rows={2}
              value={form['about_page_description'] || ''} 
              onChange={e => handleChange('about_page_description', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Título Sección Experiencia</label>
            <input 
              type="text" 
              value={form['about_page_exp_title'] || ''} 
              onChange={e => handleChange('about_page_exp_title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Detalles de Experiencia 1</label>
            <textarea 
              rows={2}
              value={form['about_page_exp_desc1'] || ''} 
              onChange={e => handleChange('about_page_exp_desc1', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Detalles de Experiencia 2</label>
            <textarea 
              rows={2}
              value={form['about_page_exp_desc2'] || ''} 
              onChange={e => handleChange('about_page_exp_desc2', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Imagen Principal Nosotros</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {form['about_page_image'] && (
                <img 
                  src={form['about_page_image']} 
                  alt="About Us Preview" 
                  className="w-36 h-20 object-cover rounded-xl border border-gray-200 shadow-sm" 
                />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleImageUpload('about_page_image', e.target.files[0])}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* General Contact Info Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
          <Phone className="text-[#0066CC] w-5 h-5" /> Información de Contacto
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Correo Electrónico Comercial</label>
            <input 
              type="email" 
              value={form['contact_email'] || ''} 
              onChange={e => handleChange('contact_email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono Fijo / Celular</label>
            <input 
              type="text" 
              value={form['contact_phone'] || ''} 
              onChange={e => handleChange('contact_phone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp (con indicativo, ej: +57 311 234 5678)</label>
            <input 
              type="text" 
              value={form['contact_whatsapp'] || ''} 
              onChange={e => handleChange('contact_whatsapp', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección de Oficina</label>
            <input 
              type="text" 
              value={form['contact_address'] || ''} 
              onChange={e => handleChange('contact_address', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={saving} 
          className="bg-[#0066CC] hover:bg-[#005bb5] text-white px-8 py-3 rounded-xl h-auto font-semibold text-base shadow-lg"
        >
          {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Guardar Cambios del Sitio
        </Button>
      </div>
    </form>
  );
};

// ─── Products Catalogue Administration Tab ───────────────────────────────────

const ProductsMgmtTab = () => {
  const { products, createProduct, updateProduct, deleteProduct } = useContent();
  const { toast } = useToast();
  
  // Modal & Form State
  const [isOpen, setIsOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    features: [],
    image_url: '',
    screenshots: [],
    links: []
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic input items helpers
  const [featureInput, setFeatureInput] = useState('');
  const [linkLabelInput, setLinkLabelInput] = useState('');
  const [linkUrlInput, setLinkUrlInput] = useState('');

  const handleOpenNew = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      features: [],
      image_url: '',
      screenshots: [],
      links: []
    });
    setEditingId(null);
    setFeatureInput('');
    setLinkLabelInput('');
    setLinkUrlInput('');
    setIsOpen(true);
  };

  const handleOpenEdit = (p) => {
    setProductForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || 0,
      features: p.features || [],
      image_url: p.image_url || '',
      screenshots: p.screenshots || [],
      links: p.links || []
    });
    setEditingId(p.id);
    setFeatureInput('');
    setLinkLabelInput('');
    setLinkUrlInput('');
    setIsOpen(true);
  };

  const handleMainImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm(prev => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotUpload = (files) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({
          ...prev,
          screenshots: [...prev.screenshots, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveScreenshot = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setProductForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleAddLink = () => {
    if (!linkLabelInput.trim() || !linkUrlInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      links: [...prev.links, { label: linkLabelInput.trim(), url: linkUrlInput.trim() }]
    }));
    setLinkLabelInput('');
    setLinkUrlInput('');
  };

  const handleRemoveLink = (idx) => {
    setProductForm(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== idx)
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      toast({ title: '✅ Producto eliminado', description: 'El producto se eliminó del catálogo correctamente.' });
    } catch (err) {
      toast({ 
        title: 'Error al eliminar', 
        description: err.message || 'No se pudo eliminar el producto.', 
        variant: 'destructive' 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name) {
      toast({ title: 'Campo obligatorio', description: 'El nombre es obligatorio.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, productForm);
        toast({ title: '✅ Producto actualizado', description: 'El producto se ha modificado correctamente.' });
      } else {
        await createProduct(productForm);
        toast({ title: '✅ Producto creado', description: 'El producto se ha añadido al catálogo.' });
      }
      setIsOpen(false);
    } catch (err) {
      toast({ 
        title: 'Error al guardar', 
        description: err.message || 'No se pudo guardar el producto.', 
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Catálogo de Productos</h3>
          <p className="text-gray-500 text-xs mt-0.5">Sube imágenes de portada, pantallazos del software y añade enlaces a demostraciones.</p>
        </div>
        <Button 
          onClick={handleOpenNew} 
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-md px-5"
        >
          <Plus size={16} className="mr-1.5" /> Agregar Producto
        </Button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Portada</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capturas / Enlaces</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img 
                      src={p.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'} 
                      alt={p.name} 
                      className="w-16 h-10 object-cover rounded-lg border border-gray-200" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 max-w-sm">{p.description}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">${p.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <ImageIcon size={14} className="text-gray-400" /> {p.screenshots?.length || 0} Capturas
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <LinkIcon size={14} className="text-gray-400" /> {p.links?.length || 0} Enlaces
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(p)} 
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" 
                        title="Editar Producto"
                      >
                        <Edit2 size={16} />
                      </button>
                      <div className="h-4 w-px bg-gray-200"></div>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="Eliminar Producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    No hay productos registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar/Editar Producto */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {editingId ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              Añade detalles, sube pantallazos y agrega enlaces externos que faciliten al cliente conocer el software.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Nombre del Producto *</label>
                <input 
                  type="text" 
                  value={productForm.name} 
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-[#0066CC]" 
                  placeholder="Ej: ERP Financiero Cloud"
                  required 
                />
              </div>
              {/* Precio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Precio Estimado ($ USD) *</label>
                <input 
                  type="number" 
                  value={productForm.price} 
                  onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} 
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-[#0066CC]" 
                  placeholder="Ej: 1500"
                  required 
                />
              </div>
            </div>

            {/* Descripcion */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Descripción del Producto</label>
              <textarea 
                rows={3} 
                value={productForm.description} 
                onChange={e => setProductForm({ ...productForm, description: e.target.value })} 
                className="w-full px-4 py-2.5 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-[#0066CC]" 
                placeholder="Describe brevemente las funcionalidades principales del software..."
              />
            </div>

            {/* Imagen Principal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Imagen Principal de Portada</label>
              <div className="flex gap-4 items-center">
                {productForm.image_url && (
                  <img 
                    src={productForm.image_url} 
                    alt="Portada preview" 
                    className="w-24 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" 
                  />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => handleMainImageUpload(e.target.files[0])} 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer" 
                />
              </div>
            </div>

            {/* Capturas de Pantalla (Captures) */}
            <div className="flex flex-col gap-2 border-t pt-4">
              <label className="text-xs font-semibold text-gray-700">Subir Capturas de Pantalla (Soporta múltiples imágenes)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={e => handleScreenshotUpload(e.target.files)} 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer" 
              />
              
              {productForm.screenshots?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  {productForm.screenshots.map((screen, idx) => (
                    <div key={idx} className="relative w-24 aspect-video rounded-xl overflow-hidden border bg-white shadow-sm group">
                      <img src={screen} alt={`Captura ${idx + 1}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveScreenshot(idx)} 
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-md transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Características */}
            <div className="space-y-3 border-t pt-4">
              <label className="text-xs font-semibold text-gray-700 block">Características Técnicas y Módulos</label>
              
              {productForm.features?.length > 0 && (
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pb-1">
                  {productForm.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-1.5 bg-gray-100/80 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
                    >
                      <span>{feature}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(idx)} 
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ej: Integración con pasarela de pagos" 
                  value={featureInput} 
                  onChange={e => setFeatureInput(e.target.value)} 
                  className="flex-1 px-4 py-2 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-[#0066CC]" 
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <Button type="button" onClick={handleAddFeature} variant="outline" className="rounded-xl">Añadir</Button>
              </div>
            </div>

            {/* Enlaces */}
            <div className="space-y-3 border-t pt-4">
              <label className="text-xs font-semibold text-gray-700 block">Enlaces y Recursos Adicionales</label>
              
              {productForm.links?.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {productForm.links.map((lnk, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between bg-cyan-50/50 px-4 py-2.5 rounded-xl border border-cyan-100 text-xs text-cyan-800"
                    >
                      <span className="font-semibold">{lnk.label} <span className="font-normal text-gray-400 ml-1">({lnk.url})</span></span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveLink(idx)} 
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Nombre Enlace (Ej: Ver Demo)" 
                  value={linkLabelInput} 
                  onChange={e => setLinkLabelInput(e.target.value)} 
                  className="px-4 py-2 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-[#0066CC]" 
                />
                <input 
                  type="text" 
                  placeholder="URL (Ej: https://demo.app.com)" 
                  value={linkUrlInput} 
                  onChange={e => setLinkUrlInput(e.target.value)} 
                  className="px-4 py-2 rounded-xl border outline-none text-sm focus:ring-2 focus:ring-[#0066CC]" 
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                />
              </div>
              <Button type="button" onClick={handleAddLink} variant="outline" className="w-full rounded-xl text-xs py-2 h-auto">
                <Plus size={12} className="mr-1 inline" /> Añadir Enlace de Demostración
              </Button>
            </div>

            {/* Footer Form */}
            <DialogFooter className="pt-4 border-t gap-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button 
                type="submit" 
                disabled={submitting} 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold rounded-xl px-5"
              >
                {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {editingId ? 'Guardar Cambios' : 'Añadir Producto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Main AdminPage component ─────────────────────────────────────────────────

const AdminPage = () => {
  // Auth State — inicialización lazy: lee el JWT una sola vez al montar
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()));
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);

  // Analytics refresh key — al incrementarse, AnalyticsTab se recarga desde cero
  const [analyticsRefreshKey, setAnalyticsRefreshKey] = useState(0);
  const [analyticsLoading, setAnalyticsLoading]       = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('quotations'); // 'quotations' | 'analytics' | 'site_content' | 'products_mgmt'

  const handleAnalyticsRefresh = () => {
    setAnalyticsLoading(true);
    setAnalyticsRefreshKey(k => k + 1);
    setTimeout(() => setAnalyticsLoading(false), 1200);
  };

  // ── Limpiar datos de visitas ────────────────────────────────────────────────
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing]               = useState(false);

  const handleClearVisits = async () => {
    setClearing(true);
    try {
      const result = await apiFetch(API.visitsDelete, { method: 'DELETE' });
      const deleted = result?.deleted ?? 0;
      setClearDialogOpen(false);
      toast({
        title: '✅ Datos eliminados',
        description: `Se borraron ${deleted} registros. El contador empieza en cero.`,
      });
      // Recargar analíticas después de limpiar
      handleAnalyticsRefresh();
    } catch (err) {
      toast({
        title: 'Error al limpiar',
        description: err.message || 'No se pudieron eliminar los datos.',
        variant: 'destructive',
      });
    } finally {
      setClearing(false);
    }
  };

  // Data State
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [editForm, setEditForm] = useState({ budget: '', description: '', status: '' });

  const { toast } = useToast();

  // Un solo efecto: carga cotizaciones si ya hay sesión activa
  useEffect(() => {
    if (isAuthenticated) fetchQuotations();
  }, [isAuthenticated]);

  const fetchQuotations = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const data = await apiFetch(API.quotations);
      setQuotations(Array.isArray(data) ? data : []);
    } catch (error) {
      const msg = error.message || 'No se pudieron cargar las cotizaciones.';
      setErrorState(msg);
      toast({ title: 'Error de conexión', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const data = await apiFetch(API.login, {
          method: 'POST',
          body: { email: authForm.email, password: authForm.password },
        });
        // Guardar JWT — apiFetch lo usará automáticamente en siguientes peticiones
        setAuthToken(data.token);
        setIsAuthenticated(true);
        toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente.' });
      } else {
        await apiFetch(API.register, {
          method: 'POST',
          body: { email: authForm.email, password: authForm.password },
        });
        toast({ title: 'Cuenta creada', description: 'Registro exitoso. Ahora puedes iniciar sesión.' });
        setAuthMode('login');
      }
    } catch (error) {
      toast({
        title: authMode === 'login' ? 'Error de acceso' : 'Error de registro',
        description: error.message || 'Ocurrió un problema inesperado.',
        variant: 'destructive',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const openEditModal = (quote) => {
    setEditingQuote(quote);
    setEditForm({ budget: quote.budget || '', description: quote.description || '', status: quote.status || 'Pending' });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingQuote) return;
    setUpdatingId(editingQuote.id);
    try {
      await apiFetch(API.quotation(editingQuote.id), {
        method: 'PUT',
        body: { budget: editForm.budget, description: editForm.description, status: editForm.status },
      });
      setQuotations(prev => prev.map(q =>
        q.id === editingQuote.id ? { ...q, ...editForm } : q
      ));
      toast({ title: '¡Actualización exitosa!', description: 'Los detalles de la cotización han sido guardados.' });
      setIsEditOpen(false);
    } catch (error) {
      toast({ title: 'Error al actualizar', description: error.message || 'No se pudieron guardar los cambios.', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const quickStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await apiFetch(API.quotation(id), { method: 'PUT', body: { status: newStatus } });
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
      toast({ title: 'Estado actualizado', description: `La cotización ahora está: ${newStatus}` });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo cambiar el estado.', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    if (s === 'in progress' || s === 'in-progress') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };
  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed') return <Check size={14} />;
    if (s === 'rejected') return <XCircle size={14} />;
    if (s === 'in progress' || s === 'in-progress') return <RefreshCw size={14} />;
    return <Clock size={14} />;
  };
  const getStatusLabel = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'completed') return 'Completado';
    if (s === 'rejected') return 'Rechazado';
    if (s === 'in progress' || s === 'in-progress') return 'En Progreso';
    return 'Pendiente';
  };

  // ── LOGIN / REGISTER VIEW ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-[#e6f2ff] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-[#0066CC]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {authMode === 'login' ? 'Acceso Administrativo' : 'Registro de Admin'}
            </h1>
            <p className="text-gray-500 text-center mt-2 text-sm">
              {authMode === 'login'
                ? 'Ingresa tus credenciales para gestionar el panel.'
                : 'Crea una cuenta para acceder al sistema.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
              <input
                id="admin-email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none transition-all"
                placeholder="admin@empresa.com"
                required
              />
            </div>
            <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#0066CC] hover:bg-[#005bb5] h-12 text-base font-semibold"
            >
              {authLoading
                ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                : authMode === 'login' ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />
              }
              {authMode === 'login' ? 'Ingresar' : 'Registrar Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthForm({ email: '', password: '' }); }}
              className="text-sm text-[#0066CC] hover:underline font-medium"
            >
              {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
            <p className="text-xs text-gray-400 mt-4">Solo personal autorizado de Tecnología del Pacífico</p>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD VIEW ─────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Tecnología del Pacífico S.A.S</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => { clearAuthToken(); setIsAuthenticated(false); }}
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Cerrar Sesión
          </Button>
          {activeTab === 'quotations' && (
            <Button onClick={fetchQuotations} variant="outline" className="flex items-center gap-2">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </Button>
          )}
          {activeTab === 'analytics' && (
            <>
              <Button
                onClick={() => setClearDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 size={15} />
                Limpiar datos
              </Button>
              <Button onClick={handleAnalyticsRefresh} variant="outline" className="flex items-center gap-2">
                <RefreshCw size={16} className={analyticsLoading ? 'animate-spin' : ''} />
                Actualizar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Diálogo de confirmación para limpiar datos */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={18} /> Limpiar datos de prueba
            </DialogTitle>
            <DialogDescription className="text-gray-600 pt-2">
              Esta acción eliminará <strong>todos los registros de visitas</strong> de la
              base de datos. Ideal para hacerlo antes de subir a producción.
              <br /><br />
              <span className="text-red-500 font-medium">⚠️ Esta acción es irreversible.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setClearDialogOpen(false)}
              disabled={clearing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleClearVisits}
              disabled={clearing}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              {clearing
                ? <><Loader2 size={14} className="animate-spin" /> Eliminando...</>
                : <><Trash2 size={14} /> Sí, limpiar todo</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { id: 'quotations', label: 'Cotizaciones', icon: FileText },
          { id: 'products_mgmt', label: 'Productos', icon: Package },
          { id: 'site_content', label: 'Contenido Web', icon: Monitor },
          { id: 'analytics',  label: 'Visitantes',   icon: BarChart2 },
          { id: 'whatsapp_crm', label: 'CRM WhatsApp', icon: MessageCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-[#0066CC] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.id === 'quotations' && quotations.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'quotations' ? 'bg-[#e6f2ff] text-[#0066CC]' : 'bg-gray-200 text-gray-500'
              }`}>
                {quotations.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'quotations' && (
          <motion.div
            key="quotations"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                </div>
              ) : errorState ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-lg font-medium text-red-600 mb-2">Error cargando datos</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">{errorState}</p>
                  <Button onClick={fetchQuotations} variant="outline" className="mt-4">Intentar de nuevo</Button>
                </div>
              ) : quotations.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">No hay cotizaciones registradas</p>
                  <p className="text-sm text-gray-500">Las nuevas solicitudes aparecerán aquí.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Servicio</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Presupuesto</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Mensaje</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {quotations.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{quote.name}</span>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                <Mail size={12} /> {quote.email}
                              </div>
                              {quote.phone && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                  <Phone size={12} /> {quote.phone}
                                </div>
                              )}
                              {quote.whatsapp && (
                                <a
                                  href={`https://wa.me/${quote.whatsapp.replace(/[^\d]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 mt-0.5 font-medium group"
                                >
                                  <MessageCircle size={12} className="shrink-0" />
                                  <span className="group-hover:underline">{quote.whatsapp}</span>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">
                              {quote.service}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-700">
                              <DollarSign size={14} className="text-gray-400" />
                              {quote.budget || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 line-clamp-2" title={quote.description}>
                              {quote.description}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                              {getStatusIcon(quote.status)}
                              {getStatusLabel(quote.status)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(quote)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                title="Editar Cotización"
                              >
                                <Edit2 size={18} />
                              </button>
                              <div className="h-4 w-px bg-gray-200 mx-1"></div>
                              <button
                                onClick={() => quickStatusUpdate(quote.id, 'Completed')}
                                disabled={updatingId === quote.id}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                                title="Marcar como Completado"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => quickStatusUpdate(quote.id, 'In Progress')}
                                disabled={updatingId === quote.id}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                                title="Marcar en Progreso"
                              >
                                <RefreshCw size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'products_mgmt' && (
          <motion.div
            key="products_mgmt"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <ProductsMgmtTab />
          </motion.div>
        )}

        {activeTab === 'site_content' && (
          <motion.div
            key="site_content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <SiteContentTab />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <AnalyticsTab refreshKey={analyticsRefreshKey} />
          </motion.div>
        )}

        {activeTab === 'whatsapp_crm' && (
          <motion.div
            key="whatsapp_crm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <WhatsAppCrmTab />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Quotation Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cotización</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la cotización de {editingQuote?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">Estado</label>
              <select
                id="edit-status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="Pending">Pendiente</option>
                <option value="In Progress">En Progreso</option>
                <option value="Completed">Completado</option>
                <option value="Rejected">Rechazado</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-budget" className="text-sm font-medium">Presupuesto</label>
              <input
                id="edit-budget"
                value={editForm.budget}
                onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-desc" className="text-sm font-medium">Descripción/Notas</label>
              <textarea
                id="edit-desc"
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button className="rounded-xl" onClick={handleEditSubmit} disabled={updatingId !== null}>
              {updatingId !== null ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
