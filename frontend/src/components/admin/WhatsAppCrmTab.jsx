import React, { useEffect, useState, useCallback, useRef } from 'react';
import { API_BASE_URL, getAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  MessageCircle, Search, RefreshCw, Loader2, AlertCircle, Phone, Mail,
  User, Calendar, Save, FileText, DollarSign, Clock, ArrowLeft, Users,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
//  CRM de WhatsApp — contactos y conversaciones del bot
//  Backend: server/routes/whatsappCrm.js (/api/whatsapp-crm)
// ─────────────────────────────────────────────────────────────

const CRM_URL = `${API_BASE_URL}/api/whatsapp-crm`;

// Fetch propio: necesitamos también `pagination`, que apiFetch descarta
const crmFetch = async (path, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${CRM_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await response.json();
  if (!response.ok || json.success === false) {
    const detail = json.errors?.map((e) => e.msg).join(' ');
    throw new Error(detail || json.message || `Error HTTP ${response.status}`);
  }
  return json;
};

const STATUSES = [
  { id: 'nuevo',      label: 'Nuevo',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'contactado', label: 'Contactado', cls: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'interesado', label: 'Interesado', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'cotizado',   label: 'Cotizado',   cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'cliente',    label: 'Cliente',    cls: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'descartado', label: 'Descartado', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
];
const statusInfo = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];

const StatusBadge = ({ status }) => {
  const s = statusInfo(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
      {s.label}
    </span>
  );
};

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

// Date → valor para <input type="datetime-local"> en hora local
const toLocalInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const isDue = (value) => {
  if (!value) return false;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return new Date(value) <= endOfToday;
};

const contactName = (c) => c.full_name || c.profile_name || `+${c.phone}`;

const inputCls = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

// ─── Detalle del contacto: ficha editable + conversación ─────────────────────
const ContactDetail = ({ contactId, onBack, onUpdated }) => {
  const { toast } = useToast();
  const [contact, setContact]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [nextBefore, setNextBefore] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({});
  const chatRef = useRef(null);

  const fillForm = (c) => setForm({
    follow_up_status:  c.follow_up_status || 'nuevo',
    full_name:         c.full_name || '',
    email:             c.email || '',
    interest_service:  c.interest_service || '',
    assigned_to:       c.assigned_to || '',
    next_follow_up_at: toLocalInput(c.next_follow_up_at),
    notes:             c.notes || '',
    marketing_opt_in:  Boolean(c.marketing_opt_in),
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [detail, history] = await Promise.all([
        crmFetch(`/contacts/${contactId}`),
        crmFetch(`/contacts/${contactId}/messages?limit=100`),
      ]);
      setContact(detail.data);
      fillForm(detail.data);
      setMessages(history.data);
      setNextBefore(history.pagination?.next_before || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => { load(); }, [load]);

  // Al abrir la conversación, bajar al mensaje más reciente
  useEffect(() => {
    if (!loading && chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [loading]);

  const loadOlder = async () => {
    if (!nextBefore) return;
    setLoadingOlder(true);
    try {
      const history = await crmFetch(`/contacts/${contactId}/messages?limit=100&before=${nextBefore}`);
      setMessages((prev) => [...history.data, ...prev]);
      setNextBefore(history.pagination?.next_before || null);
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await crmFetch(`/contacts/${contactId}`, { method: 'PUT', body: form });
      setContact((prev) => ({ ...prev, ...res.data }));
      fillForm(res.data);
      onUpdated(res.data);
      toast({ title: 'Contacto actualizado', description: 'Los cambios se guardaron correctamente.' });
    } catch (err) {
      toast({ title: 'No se pudo guardar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-gray-500">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-sm">{error}</p>
        <Button onClick={load} variant="outline" className="mt-4">Intentar de nuevo</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="lg:hidden p-1.5 -ml-1 text-gray-500 hover:bg-gray-100 rounded-md" title="Volver">
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{contactName(contact)}</p>
            <p className="text-xs text-gray-500">+{contact.phone}{contact.profile_name && contact.full_name ? ` · ${contact.profile_name}` : ''}</p>
          </div>
        </div>
        <a
          href={`https://wa.me/${contact.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 shrink-0"
        >
          <MessageCircle size={15} /> Abrir chat
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 flex-1 min-h-0">
        {/* Conversación */}
        <div className="xl:col-span-3 flex flex-col border-b xl:border-b-0 xl:border-r border-gray-100 min-h-0">
          <div className="px-5 py-2.5 text-xs text-gray-500 flex items-center justify-between bg-gray-50/60">
            <span>Conversación con el bot</span>
            {contact.within_24h_window
              ? <span className="text-green-600 font-medium">Ventana de 24 h abierta</span>
              : <span className="text-gray-400">Fuera de la ventana de 24 h</span>}
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#f0f2f5] max-h-[560px] min-h-[320px]">
            {nextBefore && (
              <div className="text-center mb-2">
                <button onClick={loadOlder} disabled={loadingOlder} className="text-xs text-[#0066CC] hover:underline disabled:opacity-50">
                  {loadingOlder ? 'Cargando...' : 'Cargar mensajes anteriores'}
                </button>
              </div>
            )}
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-10">Sin mensajes registrados.</p>
            )}
            {messages.map((m) => {
              const outgoing = m.direction === 'out';
              return (
                <div key={m.id} className={`flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm text-sm ${outgoing ? 'bg-[#d9fdd3]' : 'bg-white'}`}>
                    <p className="whitespace-pre-wrap break-words text-gray-800">
                      {m.body || <span className="italic text-gray-400">[{m.message_type}]</span>}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-gray-400">
                      {outgoing && m.status === 'failed' && (
                        <span className="text-red-500 font-medium" title="Meta no aceptó el envío">No enviado</span>
                      )}
                      {formatDateTime(m.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ficha editable */}
        <form onSubmit={handleSave} className="xl:col-span-2 p-5 space-y-4 overflow-y-auto">
          <div className="grid gap-2">
            <label htmlFor="crm-status" className="text-sm font-medium">Estado del seguimiento</label>
            <select
              id="crm-status"
              value={form.follow_up_status}
              onChange={(e) => setForm({ ...form, follow_up_status: e.target.value })}
              className={inputCls}
            >
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <div className="grid gap-2">
              <label htmlFor="crm-name" className="text-sm font-medium">Nombre completo</label>
              <input id="crm-name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputCls} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="crm-email" className="text-sm font-medium">Correo</label>
              <input id="crm-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="crm-service" className="text-sm font-medium">Servicio de interés</label>
              <input id="crm-service" value={form.interest_service} onChange={(e) => setForm({ ...form, interest_service: e.target.value })} className={inputCls} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="crm-assigned" className="text-sm font-medium">Asesor responsable</label>
              <input id="crm-assigned" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="crm-followup" className="text-sm font-medium">Próximo seguimiento</label>
            <input
              id="crm-followup"
              type="datetime-local"
              value={form.next_follow_up_at}
              onChange={(e) => setForm({ ...form, next_follow_up_at: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="crm-notes" className="text-sm font-medium">Notas del asesor</label>
            <textarea
              id="crm-notes"
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.marketing_opt_in}
              onChange={(e) => setForm({ ...form, marketing_opt_in: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            Autorizó recibir mensajes comerciales
          </label>

          <Button type="submit" disabled={saving} className="w-full bg-[#0066CC] hover:bg-[#005bb5]">
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar cambios
          </Button>

          {/* Datos de solo lectura */}
          <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
            <p className="flex items-center gap-1.5"><Clock size={12} /> Primer contacto: {formatDateTime(contact.first_contact_at)}</p>
            <p className="flex items-center gap-1.5"><Clock size={12} /> Último contacto: {formatDateTime(contact.last_contact_at)}</p>
            {contact.budget_range && (
              <p className="flex items-center gap-1.5"><DollarSign size={12} /> Presupuesto: {contact.budget_range}</p>
            )}
          </div>

          {contact.quotations?.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><FileText size={14} /> Cotizaciones de este número</p>
              <div className="space-y-2">
                {contact.quotations.map((q) => (
                  <div key={q.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium text-gray-800">#{q.id} · {q.service}</span>
                      <span className="text-gray-500">{q.status}</span>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{q.description}</p>
                    <p className="text-gray-400 mt-1">{q.budget} · {formatDateTime(q.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// ─── Pestaña principal ───────────────────────────────────────────────────────
const WhatsAppCrmTab = () => {
  const [contacts, setContacts]     = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [query, setQuery]           = useState('');
  const [status, setStatus]         = useState('');
  const [dueOnly, setDueOnly]       = useState(false);
  const [page, setPage]             = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '30' });
      if (query)   params.set('q', query);
      if (status)  params.set('status', status);
      if (dueOnly) params.set('due', '1');
      const res = await crmFetch(`/contacts?${params}`);
      setContacts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, query, status, dueOnly]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  // Búsqueda con pequeña espera para no consultar en cada tecla
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setQuery(search.trim()); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleUpdated = (updated) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o correo..."
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          className={`${inputCls} md:w-48`}
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
          <input
            type="checkbox"
            checked={dueOnly}
            onChange={(e) => { setPage(1); setDueOnly(e.target.checked); }}
            className="h-4 w-4 rounded border-gray-300"
          />
          Seguimientos para hoy o vencidos
        </label>
        <Button onClick={fetchContacts} variant="outline" className="flex items-center gap-2 md:ml-auto">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lista de contactos */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${selectedId ? 'hidden lg:block' : ''}`}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-700 flex items-center gap-2"><Users size={16} /> Contactos</span>
            <span className="text-gray-400">{pagination.total}</span>
          </div>

          {loading && contacts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4 text-gray-500">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm">{error}</p>
              <Button onClick={fetchContacts} variant="outline" className="mt-4">Intentar de nuevo</Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 px-4 text-gray-500">
              <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No hay contactos</p>
              <p className="text-sm">Los clientes que escriban al bot aparecerán aquí.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[680px] overflow-y-auto">
              {contacts.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left px-4 py-3 transition-colors ${selectedId === c.id ? 'bg-[#e6f2ff]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-900 truncate">{contactName(c)}</span>
                      <StatusBadge status={c.follow_up_status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Phone size={11} /> +{c.phone}
                      {c.email && <><span className="text-gray-300">·</span><Mail size={11} /> <span className="truncate">{c.email}</span></>}
                    </div>
                    {c.last_incoming_message && (
                      <p className="text-xs text-gray-500 mt-1 truncate">"{c.last_incoming_message}"</p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                      <span>{formatDateTime(c.last_contact_at)}</span>
                      {c.next_follow_up_at && (
                        <span className={`flex items-center gap-1 ${isDue(c.next_follow_up_at) ? 'text-red-500 font-medium' : ''}`}>
                          <Calendar size={11} /> {formatDateTime(c.next_follow_up_at)}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
              <span className="text-gray-500">{page} / {pagination.pages}</span>
              <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Siguiente</Button>
            </div>
          )}
        </div>

        {/* Detalle */}
        <div className={`lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${selectedId ? '' : 'hidden lg:block'}`}>
          {selectedId ? (
            <ContactDetail
              key={selectedId}
              contactId={selectedId}
              onBack={() => setSelectedId(null)}
              onUpdated={handleUpdated}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400 px-6 text-center">
              <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
              <p className="font-medium text-gray-600">Selecciona un contacto</p>
              <p className="text-sm">Verás su conversación con el bot y podrás registrar el seguimiento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCrmTab;
