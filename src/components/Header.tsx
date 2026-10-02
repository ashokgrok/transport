import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { useSite } from '../services/siteContext';
import { t } from '../services/localization';
import {
  Sun,
  Moon,
  Tv,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  Shield,
  UserCheck,
  Building2,
  LogOut,
  AlertCircle,
  Eye,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenSimulator?: () => void;
  onOpenLoginModal?: () => void;
  onOpenDemoScript?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onOpenSimulator,
  onOpenLoginModal,
  onOpenDemoScript,
}) => {
  const {
    currentRole,
    effectiveRole,
    previewRoleId,
    setPreviewRoleId,
    logout,
    theme,
    toggleTheme,
    isWallDisplay,
    toggleWallDisplay,
    soundEnabled,
    toggleSound,
    language,
    setLanguage,
    allRoles,
    loginAsRole,
  } = useAuth();

  const { activeSite, sites, setActiveSiteId, isSwitchingSite } = useSite();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);

  return (
    <>
      {/* Top Warning Banner for Open Demo Mode or Admin Preview */}
      {activeSite.enforcementMode === 'open_demo' && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t('open_mode.banner', language)}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-300">
            Waiver Active
          </span>
        </div>
      )}

      {previewRoleId && (
        <div className="bg-indigo-600 text-white px-4 py-1 text-xs flex items-center justify-between font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" />
            <span>
              {language === 'es'
                ? `Vista previa de Administrador activa: Estás viendo el portal como ${effectiveRole.nameEs}`
                : `Administrator Preview Active: Viewing portal as ${effectiveRole.nameEn}`}
            </span>
          </div>
          <button
            onClick={() => setPreviewRoleId(null)}
            className="text-[11px] underline hover:text-indigo-200 cursor-pointer font-semibold ml-4"
          >
            {language === 'es' ? 'Salir de la vista previa' : 'Exit preview'}
          </button>
        </div>
      )}

      {/* Main Top Header */}
      <header className="h-14 border-b border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] px-4 flex items-center justify-between relative z-40 transition-colors duration-200">
        {/* Zone 1: CRTM Brand Wordmark & Active Site Selector */}
        <div className="flex items-center gap-3">
          {/* CRTM Brand Badge (Rojo Consorcio #D10002 strictly on brand mark) */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D10002] flex items-center justify-center text-white font-bold tracking-tighter text-sm shadow-sm">
              <span className="font-display">CR</span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold tracking-tight text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                  CITRAM
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4F5B67] dark:text-[#A3AEBB]">
                  Control Tower
                </span>
              </div>
              <div className="text-[10px] text-[#4F5B67] dark:text-[#A3AEBB] truncate max-w-[160px] md:max-w-none">
                {activeSite.shortName}
              </div>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#DCE1E7] dark:bg-[#2B3440] hidden sm:block" />

          {/* Site Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSiteMenuOpen(!siteMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#1B1F24] dark:text-[#E8ECF1] cursor-pointer transition-colors"
              title={t('action.switch_site', language)}
            >
              <Building2 className="w-3.5 h-3.5 text-neutral-500" />
              <span className="truncate max-w-[110px] sm:max-w-[150px]">{activeSite.shortName}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeSite.status === 'live' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {siteMenuOpen && (
              <div className="absolute left-0 mt-1 w-64 rounded-lg bg-white dark:bg-[#1E252E] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-[#DCE1E7] dark:border-[#2B3440] text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  {language === 'es' ? 'Seleccionar Sitio Activo' : 'Select Active Site'}
                </div>
                {sites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      setActiveSiteId(site.id);
                      setSiteMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                      site.id === activeSite.id ? 'bg-neutral-50 dark:bg-neutral-800/60 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <div className="text-[#1B1F24] dark:text-[#E8ECF1]">{site.shortName}</div>
                      <div className="text-[10px] text-neutral-500">{site.region}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.5 rounded capitalize ${
                          site.status === 'live'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {site.status}
                      </span>
                      {site.id === activeSite.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#0071BB] dark:text-[#5AAEE8]" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Search Affordance & Demo Notice */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-[#F5F6F8] dark:bg-[#0E1217] text-xs text-[#4F5B67] dark:text-[#A3AEBB] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors cursor-pointer w-64 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Buscar en CITRAM...' : 'Search CITRAM...'}</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded shadow-xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Discreet Demo-Mode Marker (Honesty Rule PRD 1) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border border-neutral-300/40 dark:border-neutral-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('demo.badge', language)}</span>
          </div>
        </div>

        {/* Zone 3: System Utilities & Role Profile */}
        <div className="flex items-center gap-2">
          {/* Master Demo Script Guide */}
          {onOpenDemoScript && (
            <button
              onClick={onOpenDemoScript}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#0071BB]/10 dark:bg-[#5AAEE8]/15 text-[#0071BB] dark:text-[#5AAEE8] hover:bg-[#0071BB]/20 transition-colors cursor-pointer flex items-center gap-1.5 border border-[#0071BB]/30 shadow-2xs"
              title={language === 'es' ? 'Guion de Demostración para CITRAM' : 'CITRAM Live Demo Master Script'}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0071BB] dark:text-[#5AAEE8] shrink-0" />
              <span className="hidden sm:inline font-bold">{language === 'es' ? 'Guion Demo' : 'Demo Script'}</span>
            </button>
          )}

          {/* Quick simulator launcher button */}
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#5B4BC4]/10 dark:bg-[#A193FF]/15 text-[#5B4BC4] dark:text-[#A193FF] hover:bg-[#5B4BC4]/20 transition-colors cursor-pointer flex items-center gap-1.5 border border-[#5B4BC4]/30"
              title="Disruption Simulator (S1-S8)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B4BC4] dark:bg-[#A193FF]" />
              <span className="hidden sm:inline">Simulador</span>
            </button>
          )}

          {/* Wall display mode toggle */}
          <button
            onClick={toggleWallDisplay}
            className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
              isWallDisplay
                ? 'bg-[#0071BB] text-white border-[#0071BB]'
                : 'border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={t('theme.wall', language)}
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white border-neutral-300'
                : 'border-[#DCE1E7] dark:border-[#2B3440] text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={t('theme.sound', language)}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Theme switch button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title={theme === 'light' ? t('theme.dark', language) : t('theme.light', language)}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Language toggle button */}
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="px-2 py-1 text-xs font-semibold rounded-md border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Language"
          >
            {language.toUpperCase()}
          </button>

          {/* User & Role Switcher Popover */}
          <div className="relative ml-1">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <div className="text-right hidden md:block">
                <div className="text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] leading-tight">
                  {effectiveRole.demoAccount.fullName}
                </div>
                <div className="text-[10px] text-neutral-500 font-medium">
                  {effectiveRole.id} · {language === 'es' ? effectiveRole.nameEs : effectiveRole.nameEn}
                </div>
              </div>
              <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center">
                {effectiveRole.id}
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400 mr-1" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-80 rounded-xl bg-white dark:bg-[#1E252E] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl py-2 z-50 max-h-[80vh] overflow-y-auto">
                <div className="px-3 pb-2 border-b border-[#DCE1E7] dark:border-[#2B3440]">
                  <div className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                    {effectiveRole.demoAccount.fullName}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {effectiveRole.demoAccount.organization}
                  </div>
                  <div className="mt-1 text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                    Scope: {effectiveRole.dataScope}
                  </div>
                </div>

                {/* 21 Demo Roles fast selection */}
                <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'es' ? 'Cambiar a otra cuenta (21 roles)' : 'Switch demo account (21 roles)'}</span>
                  {onOpenLoginModal && (
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onOpenLoginModal();
                      }}
                      className="text-[#0071BB] dark:text-[#5AAEE8] hover:underline cursor-pointer"
                    >
                      {language === 'es' ? 'Ver catálogo' : 'View catalogue'}
                    </button>
                  )}
                </div>

                <div className="space-y-0.5 px-1 max-h-60 overflow-y-auto">
                  {allRoles.slice(0, 10).map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        loginAsRole(role.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                        role.id === currentRole.id ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold' : ''
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="font-mono font-bold text-neutral-500 mr-1.5">{role.id}</span>
                        <span>{role.demoAccount.fullName}</span>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {language === 'es' ? role.nameEs : role.nameEn}
                        </div>
                      </div>
                      {role.requiresMfa && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                          MFA
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between text-xs">
                  {onOpenLoginModal && (
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onOpenLoginModal();
                      }}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Todos los 21 roles' : 'All 21 roles'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      logout();
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('action.signout', language)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
