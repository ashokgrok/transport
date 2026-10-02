import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { ShieldCheck, KeyRound, AlertCircle, X } from 'lucide-react';

export const MfaModal: React.FC = () => {
  const { mfaPendingRoleId, verifyMfa, cancelMfa, allRoles, language } = useAuth();
  const [code, setCode] = useState('849201'); // Pre-filled for effortless demo experience
  const [error, setError] = useState(false);

  if (!mfaPendingRoleId) return null;

  const targetRole = allRoles.find((r) => r.id === mfaPendingRoleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyMfa(code);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl p-6 relative">
        <button
          onClick={cancelMfa}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
          {language === 'es' ? 'Verificación de Seguridad (MFA Requerido)' : 'Security Verification (MFA Required)'}
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          {language === 'es'
            ? `La cuenta ${targetRole?.demoAccount.fullName} (${targetRole?.id}) tiene autenticación en dos pasos obligatoria por política de seguridad CRTM.`
            : `Account ${targetRole?.demoAccount.fullName} (${targetRole?.id}) requires mandatory two-factor authentication under CRTM security policy.`}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
              {language === 'es' ? 'Código de 6 dígitos (App de Autenticación)' : '6-Digit Code (Authenticator App)'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] rounded-lg text-center font-mono text-lg font-bold tracking-widest text-[#1B1F24] dark:text-[#E8ECF1] focus:border-[#0071BB] focus:ring-1 focus:ring-[#0071BB]"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {language === 'es' ? 'Código inválido. Introduce al menos 4 dígitos.' : 'Invalid code. Enter at least 4 digits.'}
              </p>
            )}
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {language === 'es' ? 'Simulación Demostración:' : 'Demo Simulation:'}
            </span>{' '}
            {language === 'es'
              ? 'Código precargado para facilitar la presentación. Pulsa Confirmar para acceder inmediatamente.'
              : 'Pre-filled code for seamless rehearsal. Click Confirm to sign in immediately.'}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={cancelMfa}
              className="flex-1 px-4 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-[#0071BB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
            >
              {language === 'es' ? 'Confirmar Acceso' : 'Confirm Sign-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
