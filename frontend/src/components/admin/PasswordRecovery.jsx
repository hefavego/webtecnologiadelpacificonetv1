import React, { useState } from 'react';
import { API, apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { KeyRound, Loader2, Mail, ArrowLeft, Eye, EyeOff, CheckCircle2, Check } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0066CC] focus:border-transparent outline-none transition-all';

// Mismas reglas que valida el servidor
const passwordRules = [
  { label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { label: 'Una mayúscula',       test: (p) => /[A-Z]/.test(p) },
  { label: 'Una minúscula',       test: (p) => /[a-z]/.test(p) },
  { label: 'Un número',           test: (p) => /\d/.test(p) },
];
const isStrong = (p) => passwordRules.every((r) => r.test(p));

// ─── Campo de contraseña con botón mostrar/ocultar ────────────────────────────
const PasswordInput = ({ id, value, onChange, placeholder = '••••••••', autoComplete }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-12`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

const PasswordChecklist = ({ password }) => (
  <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
    {passwordRules.map((r) => {
      const ok = r.test(password);
      return (
        <li key={r.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
          <Check className="w-3.5 h-3.5 shrink-0" /> {r.label}
        </li>
      );
    })}
  </ul>
);

// ─── Vista: "¿Olvidaste tu contraseña?" y "Crear nueva contraseña" ────────────
export const PasswordRecoveryView = ({ resetToken, onBack }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const isReset = Boolean(resetToken);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch(API.forgotPassword, { method: 'POST', body: { email } });
      setDone(true);
    } catch (error) {
      toast({ title: 'No se pudo enviar', description: error.message || 'Intenta más tarde.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!isStrong(password)) {
      toast({ title: 'Contraseña débil', description: 'Cumple todos los requisitos indicados.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Las contraseñas no coinciden', description: 'Verifica la confirmación.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await apiFetch(API.resetPassword, { method: 'POST', body: { token: resetToken, password } });
      toast({ title: 'Contraseña actualizada', description: 'Ya puedes iniciar sesión con tu nueva contraseña.' });
      onBack();
    } catch (error) {
      toast({ title: 'No se pudo restablecer', description: error.message || 'Solicita un nuevo enlace.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#e6f2ff] rounded-full flex items-center justify-center mb-4">
            {done ? <CheckCircle2 className="w-8 h-8 text-green-600" /> : <KeyRound className="w-8 h-8 text-[#0066CC]" />}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
            {isReset ? 'Crear nueva contraseña' : done ? 'Revisa tu correo' : '¿Olvidaste tu contraseña?'}
          </h1>
          <p className="text-gray-500 text-center mt-2 text-sm">
            {isReset
              ? 'Elige una contraseña segura que no hayas usado antes.'
              : done
                ? `Si ${email} está registrado, te enviamos un enlace para restablecer tu contraseña. Es válido por 30 minutos.`
                : 'Ingresa tu email corporativo y te enviaremos un enlace para restablecerla.'}
          </p>
        </div>

        {!done && !isReset && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
              <input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@empresa.com"
                autoComplete="email"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#0066CC] hover:bg-[#005bb5] h-12 text-base font-semibold">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
              Enviar enlace
            </Button>
          </form>
        )}

        {isReset && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="reset-password" className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
              <PasswordInput id="reset-password" value={password} onChange={setPassword} autoComplete="new-password" />
              <PasswordChecklist password={password} />
            </div>
            <div>
              <label htmlFor="reset-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <PasswordInput id="reset-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#0066CC] hover:bg-[#005bb5] h-12 text-base font-semibold">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
              Guardar contraseña
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-[#0066CC] hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
          </button>
          <p className="text-xs text-gray-400 mt-4">Solo personal autorizado de Tecnología del Pacífico</p>
        </div>
      </div>
    </div>
  );
};

// ─── Diálogo: cambiar contraseña con sesión iniciada ──────────────────────────
export const ChangePasswordDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const close = (value) => {
    if (!value) setForm({ current: '', next: '', confirm: '' });
    onOpenChange(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrong(form.next)) {
      toast({ title: 'Contraseña débil', description: 'Cumple todos los requisitos indicados.', variant: 'destructive' });
      return;
    }
    if (form.next !== form.confirm) {
      toast({ title: 'Las contraseñas no coinciden', description: 'Verifica la confirmación.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await apiFetch(API.changePassword, {
        method: 'POST',
        body: { currentPassword: form.current, newPassword: form.next },
      });
      toast({ title: 'Contraseña cambiada', description: 'Usa la nueva contraseña en tu próximo inicio de sesión.' });
      close(false);
    } catch (error) {
      toast({ title: 'No se pudo cambiar', description: error.message || 'Intenta de nuevo.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound size={18} className="text-[#0066CC]" /> Cambiar contraseña
          </DialogTitle>
          <DialogDescription>Ingresa tu contraseña actual y elige una nueva.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label htmlFor="change-current" className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
            <PasswordInput id="change-current" value={form.current} onChange={(v) => setForm({ ...form, current: v })} autoComplete="current-password" />
          </div>
          <div>
            <label htmlFor="change-next" className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <PasswordInput id="change-next" value={form.next} onChange={(v) => setForm({ ...form, next: v })} autoComplete="new-password" />
            <PasswordChecklist password={form.next} />
          </div>
          <div>
            <label htmlFor="change-confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
            <PasswordInput id="change-confirm" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} autoComplete="new-password" />
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => close(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-[#0066CC] hover:bg-[#005bb5]">
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
