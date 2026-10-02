import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { useSite } from '../services/siteContext';
import { ALL_ROLES } from '../data/rolesData';
import {
  Search,
  Radio,
  FolderOpen,
  BookOpen,
  User,
  GitBranch,
  Shield,
  ShieldCheck,
  Clock,
  Timer,
  Camera,
  FileCheck,
  Layers,
  Users,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { loginAsRole, language } = useAuth();
  const { activeSite } = useSite();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickItems = [
    {
      type: 'screen',
      id: 'admin_verification',
      title: language === 'es' ? 'Verificación Técnica y Casos de Prueba (Fases 1-7)' : 'Phase Verification & Test Cases (Phases 1-7)',
      subtitle: language === 'es' ? 'Suite de verificación técnica para administradores y Checklist de 33 TC' : 'Admin phase verification test benches and 33 TC checklist',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      action: () => { onNavigateTab('admin_verification'); onClose(); },
    },
    {
      type: 'screen',
      id: 'tower',
      title: language === 'es' ? 'Torre de Control (Glance)' : 'Control Tower (Glance)',
      subtitle: language === 'es' ? 'Salud de red regional y tarjetas de decisión' : 'Regional network health & decision cards',
      icon: <Radio className="w-4 h-4 text-[#0071BB]" />,
      action: () => { onNavigateTab('tower'); onClose(); },
    },
    {
      type: 'screen',
      id: 'alerts',
      title: language === 'es' ? 'Torrente de Alertas (Alert Flood)' : 'Alert Flood Stream',
      subtitle: language === 'es' ? 'Ingesta masiva de señales y correlación 312→41→3→1' : 'Mass signal ingestion and 312→41→3→1 correlation',
      icon: <Radio className="w-4 h-4 text-amber-500" />,
      action: () => { onNavigateTab('alerts'); onClose(); },
    },
    {
      type: 'screen',
      id: 'cases',
      title: language === 'es' ? 'Espacio de Caso: INC-2026-0929' : 'Case Workspace: INC-2026-0929',
      subtitle: language === 'es' ? 'Avería de catenaria en Atocha (Crítico)' : 'Catenary overhead fault at Atocha (Critical)',
      icon: <FolderOpen className="w-4 h-4 text-red-500" />,
      action: () => { onNavigateTab('cases'); onClose(); },
    },
    {
      type: 'screen',
      id: 'punctuality',
      title: language === 'es' ? 'Observatorio de Puntualidad y Regularidad' : 'Punctuality & Headway Observatory',
      subtitle: language === 'es' ? 'Monitorización por modo (Metro, Renfe, EMT, Interurbanos, ML)' : 'Mode-by-mode punctuality, intervals, and SLA target breach risk',
      icon: <Timer className="w-4 h-4 text-emerald-500" />,
      action: () => { onNavigateTab('punctuality'); onClose(); },
    },
    {
      type: 'screen',
      id: 'compliance',
      title: language === 'es' ? 'Supervisión Concesional, SLAs y Penalizaciones' : 'Concessions Compliance & Contract Penalties',
      subtitle: language === 'es' ? 'Liquidación mensual, regularidad contractual y alegaciones' : 'Operator contract settlement, disputes, and penalties accrued',
      icon: <ShieldCheck className="w-4 h-4 text-[#0071BB]" />,
      action: () => { onNavigateTab('compliance'); onClose(); },
    },
    {
      type: 'screen',
      id: 'team_board',
      title: language === 'es' ? 'Panel de Turno de Sala (Shift Lead & Logbook)' : 'Shift Lead & Operations Team Board',
      subtitle: language === 'es' ? 'Consolas activas, libro de incidencias y acta de relevo' : 'Active console staffing, shift log events, and digital handover',
      icon: <Users className="w-4 h-4 text-amber-500" />,
      action: () => { onNavigateTab('team_board'); onClose(); },
    },
    {
      type: 'screen',
      id: 'video',
      title: language === 'es' ? 'Videovigilancia y Cámaras CCTV en Vivo' : 'Live CCTV & Station Video Surveillance',
      subtitle: language === 'es' ? 'Matriz de cámaras en Atocha, Moncloa, Sol y Chamartín' : 'Station camera streams with PTZ controls and concourse view',
      icon: <Camera className="w-4 h-4 text-indigo-500" />,
      action: () => { onNavigateTab('video'); onClose(); },
    },
    {
      type: 'screen',
      id: 'inspections',
      title: language === 'es' ? 'Mis Inspecciones y Hallazgos de Campo' : 'Field Inspections & Quality Findings',
      subtitle: language === 'es' ? 'Actas de auditoría, no conformidades y planes de acción' : 'On-site audit records, non-compliances, and corrective action',
      icon: <FileCheck className="w-4 h-4 text-purple-500" />,
      action: () => { onNavigateTab('inspections'); onClose(); },
    },
    {
      type: 'screen',
      id: 'connections',
      title: language === 'es' ? 'Protección de Enlaces (Cercanías → Bus Interurbano)' : 'Connection Protection (Rail → Bus)',
      subtitle: language === 'es' ? 'Retención de 5 minutos en andén' : '5-minute vehicle hold at platform',
      icon: <GitBranch className="w-4 h-4 text-emerald-500" />,
      action: () => { onNavigateTab('connections'); onClose(); },
    },
    {
      type: 'screen',
      id: 'runbooks',
      title: language === 'es' ? 'Runbook RB-01: Fallo en Catenaria' : 'Runbook RB-01: Catenary Failure',
      subtitle: language === 'es' ? '13 pasos operativos híbridos con trazabilidad' : '13 hybrid operational steps with live trace',
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
      action: () => { onNavigateTab('runbooks'); onClose(); },
    },
    {
      type: 'screen',
      id: 'admin_roles',
      title: language === 'es' ? 'Administración: Matriz de Permisos RBAC' : 'Administration: RBAC Matrix',
      subtitle: language === 'es' ? 'Configuración de permisos en vivo y asignación de 21 roles' : 'Live permission configuration and 21 role assignments',
      icon: <Shield className="w-4 h-4 text-purple-500" />,
      action: () => { onNavigateTab('admin_roles'); onClose(); },
    },
    {
      type: 'screen',
      id: 'admin_params',
      title: language === 'es' ? 'Administración: Parámetros y Umbrales por Sitio' : 'Administration: Site Parameters & SLAs',
      subtitle: language === 'es' ? 'Configurar tolerancias de retraso, retención de enlace y SLAs' : 'Configure delay tolerances, vehicle hold, and SLA clocks',
      icon: <Shield className="w-4 h-4 text-[#0071BB]" />,
      action: () => { onNavigateTab('admin_params'); onClose(); },
    },
    {
      type: 'screen',
      id: 'admin_feeds',
      title: language === 'es' ? 'Administración: Telemetría de Feeds e Integraciones' : 'Administration: Feeds & Integrations Hub',
      subtitle: language === 'es' ? 'GTFS-RT, SIRI, SCADA, tornos Calypso y pasarela CCTV' : 'GTFS-RT, SIRI, SCADA, Calypso turnstiles, and CCTV',
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
      action: () => { onNavigateTab('admin_feeds'); onClose(); },
    },
    {
      type: 'screen',
      id: 'site_onboarding',
      title: language === 'es' ? 'Administración: Asistente de Onboarding de Nuevo Sitio' : 'Administration: New Site Onboarding Wizard',
      subtitle: language === 'es' ? 'Alta de nueva autoridad regional, validación sintáctica y puesta en vivo' : 'Register regional transit authority, validate feeds, and go live',
      icon: <Shield className="w-4 h-4 text-amber-500" />,
      action: () => { onNavigateTab('site_onboarding'); onClose(); },
    },
    {
      type: 'screen',
      id: 'portfolio_sites',
      title: language === 'es' ? 'Administración: Cartera de Sitios Multi-Tenant' : 'Administration: Multi-Tenant Sites Portfolio',
      subtitle: language === 'es' ? 'Supervisión de Madrid, Barcelona, Sevilla y sitios en despliegue' : 'Supervision of Madrid, Barcelona, Seville, and rollouts',
      icon: <Shield className="w-4 h-4 text-indigo-500" />,
      action: () => { onNavigateTab('portfolio_sites'); onClose(); },
    },
  ];

  // Also include role jump results
  const matchingRoles = ALL_ROLES.filter(
    (r) =>
      r.demoAccount.fullName.toLowerCase().includes(query.toLowerCase()) ||
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.nameEs.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredQuick = quickItems.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="px-4 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] flex items-center gap-3">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder={
              language === 'es'
                ? 'Buscar caso, estación, línea, runbook o persona...'
                : 'Search case, station, line, runbook, or person...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm text-[#1B1F24] dark:text-[#E8ECF1] focus:ring-0 focus:outline-none"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-500">
            Esc
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-2 max-h-96 overflow-y-auto space-y-3">
          {/* Navigation / Screen Results */}
          <div>
            <div className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              {language === 'es' ? 'Navegación Rápida' : 'Quick Navigation'}
            </div>
            <div className="space-y-0.5 mt-1">
              {filteredQuick.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <div>
                      <div className="font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-neutral-500">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Role Switching Results */}
          {matchingRoles.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Cambiar a Persona / Rol' : 'Switch Role Account'}
              </div>
              <div className="space-y-0.5 mt-1">
                {matchingRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      loginAsRole(role.id);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-[10px] font-bold flex items-center justify-center">
                        {role.id}
                      </span>
                      <div>
                        <div className="font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                          {role.demoAccount.fullName} ({language === 'es' ? role.nameEs : role.nameEn})
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {role.demoAccount.organization}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#0071BB] dark:text-[#5AAEE8] font-medium">
                      {language === 'es' ? 'Iniciar Sesión' : 'Sign in'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1E252E] flex items-center justify-between text-[11px] text-neutral-400">
          <span>{activeSite.shortName} · {language === 'es' ? 'Telemetría en tiempo real' : 'Real-time telemetry'}</span>
          <span>{language === 'es' ? 'Navegar con ↑ ↓ y Enter' : 'Navigate with ↑ ↓ and Enter'}</span>
        </div>
      </div>
    </div>
  );
};
