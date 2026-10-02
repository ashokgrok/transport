import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { useSite } from '../services/siteContext';
import { RoleId, RoleGroup } from '../types';
import { ALL_ROLES } from '../data/rolesData';
import { Shield, KeyRound, Building2, Check, ArrowRight, UserCheck, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsRole, effectiveRole, language } = useAuth();
  const { activeSite, sites, setActiveSiteId } = useSite();

  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('••••••••');

  if (!isOpen) return null;

  const groups: RoleGroup[] = [
    'Authority staff (contractor)',
    'Authority staff (CRTM)',
    'Operators',
    'Interchange entities',
    'Operators and maintainers',
    'Emergency services',
    'City councils, DGT',
    'Public',
    'Third parties',
    'Platform provider',
  ];

  const filteredRoles =
    selectedGroup === 'All'
      ? ALL_ROLES
      : ALL_ROLES.filter((r) => r.group === selectedGroup);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = ALL_ROLES.find(
      (r) => r.demoAccount.username.toLowerCase() === usernameInput.trim().toLowerCase()
    );
    if (matched) {
      loginAsRole(matched.id);
      onClose();
    } else {
      // Default to R01
      loginAsRole('R01');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between bg-neutral-50 dark:bg-[#1E252E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D10002] flex items-center justify-center text-white font-bold text-base shadow-sm">
              CR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                  CITRAM Access Gateway
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {activeSite.shortName}
                </span>
              </div>
              <p className="text-xs text-neutral-500 italic">"{activeSite.tagline}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Site Selection Selector inside login */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                {language === 'es' ? 'Entorno / Sitio Operativo:' : 'Operational Environment / Site:'}
              </span>
              <span className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Cada sitio aísla completamente redes, contratos y reglas.'
                  : 'Each site completely isolates network lines, contracts, and rules.'}
              </span>
            </div>
            <div className="flex gap-2">
              {sites.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSiteId(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                    s.id === activeSite.id
                      ? 'border-[#0071BB] bg-blue-500/10 text-[#0071BB] font-semibold'
                      : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {s.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Manual Login Form */}
          <div className="border border-[#DCE1E7] dark:border-[#2B3440] rounded-xl p-4 bg-white dark:bg-[#161B22]">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block mb-3">
              {language === 'es' ? 'Acceso Manual con Credenciales' : 'Direct Credentials Login'}
            </span>
            <form onSubmit={handleCustomLogin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder={language === 'es' ? "Usuario (ej: lferrer, amolina)" : "Username (e.g. lferrer, amolina)"}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] rounded-lg text-[#1B1F24] dark:text-[#E8ECF1]"
              />
              <input
                type="password"
                placeholder={language === 'es' ? "Contraseña" : "Password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] rounded-lg text-[#1B1F24] dark:text-[#E8ECF1]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* 1-Click Role Cards Filtered by Group */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Catálogo de 21 Roles Operativos' : '21 Operational Roles Catalogue'}
                </h4>
                <p className="text-xs text-neutral-500">
                  {language === 'es'
                    ? 'Haz clic en cualquier rol para acceder instantáneamente con su perfil y permisos.'
                    : 'Click any role card to sign in immediately with its profile and scoped permissions.'}
                </p>
              </div>
            </div>

            {/* Filter tags for groups */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              <button
                onClick={() => setSelectedGroup('All')}
                className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                  selectedGroup === 'All'
                    ? 'bg-[#0071BB] text-white font-medium'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {language === 'es' ? 'Todos los Roles' : 'All Roles'} ({ALL_ROLES.length})
              </button>
              {groups.map((grp) => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                    selectedGroup === grp
                      ? 'bg-[#0071BB] text-white font-medium'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRoles.map((role) => {
                const isActive = role.id === effectiveRole.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      loginAsRole(role.id);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md ${
                      isActive
                        ? 'border-[#0071BB] bg-blue-500/5 ring-1 ring-[#0071BB]'
                        : 'border-[#DCE1E7] dark:border-[#2B3440] hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-[#1E252E]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold font-mono text-xs flex items-center justify-center">
                          {role.id}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                            {role.demoAccount.fullName}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            @{role.demoAccount.username}
                          </div>
                        </div>
                      </div>
                      {role.requiresMfa && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]">
                          MFA
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {language === 'es' ? role.nameEs : role.nameEn}
                    </div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                      {role.demoAccount.organization}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440] text-[10px] text-neutral-500 flex items-center justify-between">
                      <span className="truncate max-w-[170px]">Scope: {role.dataScope}</span>
                      <span className="text-[#0071BB] dark:text-[#5AAEE8] flex items-center gap-1 font-semibold">
                        {isActive ? 'Activo' : 'Entrar'} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1E252E] flex items-center justify-between text-xs text-neutral-500">
          <span>{language === 'es' ? 'Simulador de Identidad OIDC / SAML mock' : 'Mock OIDC / SAML Identity Provider'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer font-medium"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
