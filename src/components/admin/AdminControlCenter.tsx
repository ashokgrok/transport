import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { RbacMatrixEditor } from './RbacMatrixEditor';
import { SiteConfig, SiteFeedConfig, SiteParameters, SiteModuleConfig } from '../../types';
import {
  Shield,
  Sliders,
  Database,
  Building2,
  Sparkles,
  Users,
  Settings,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Trash2,
  Save,
  Check,
  Zap,
  Activity,
  ArrowRight,
  Radio,
  Clock,
  KeyRound,
  FileCheck,
} from 'lucide-react';

import { AdminVerificationPage } from './AdminVerificationPage';

interface AdminControlCenterProps {
  initialSubTab?: 'roles' | 'sites' | 'onboarding' | 'parameters' | 'feeds' | 'modules' | 'users' | 'verification';
  onOpenChecklistModal?: () => void;
  onOpenSimulator?: () => void;
  onNavigateTab?: (tabId: string) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  initialSubTab = 'roles',
  onOpenChecklistModal,
  onOpenSimulator,
  onNavigateTab,
}) => {
  const { language, effectiveRole, loginAsRole, allRoles } = useAuth();
  const { sites, activeSite, setActiveSiteId, updateSiteConfig, createSite, deleteSite, resetSitesToDefault } = useSite();

  const [activeSubTab, setActiveSubTab] = useState<'roles' | 'sites' | 'onboarding' | 'parameters' | 'feeds' | 'modules' | 'users' | 'verification'>(
    initialSubTab
  );

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Selected site for per-site configuration (defaults to active site)
  const [selectedSiteId, setSelectedSiteId] = useState<string>(activeSite.id);
  const targetSite = sites.find((s) => s.id === selectedSiteId) || activeSite;

  // Local state for Parameters editing
  const [paramsState, setParamsState] = useState<SiteParameters>({
    incidentAutoDeclareDelayMinutes: targetSite.parameters?.incidentAutoDeclareDelayMinutes ?? 8,
    connectionHoldMaxMinutes: targetSite.parameters?.connectionHoldMaxMinutes ?? 5,
    headwayToleranceSeconds: targetSite.parameters?.headwayToleranceSeconds ?? 120,
    overcrowdingThresholdPaxPerM2: targetSite.parameters?.overcrowdingThresholdPaxPerM2 ?? 3.5,
    criticalSlaTargetMinutes: targetSite.parameters?.criticalSlaTargetMinutes ?? 45,
    liftUnavailabilityEscalationMinutes: targetSite.parameters?.liftUnavailabilityEscalationMinutes ?? 15,
    autoReplayBufferHours: targetSite.parameters?.autoReplayBufferHours ?? 24,
    retentionDays: targetSite.parameters?.retentionDays ?? 90,
  });

  const [operatingDayStart, setOperatingDayStart] = useState<string>(targetSite.operatingDayStart || '04:30');
  const [maxDecisionCards, setMaxDecisionCards] = useState<number>(targetSite.maxDecisionCards || 5);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // When changing targetSite, synchronize paramsState
  React.useEffect(() => {
    if (targetSite) {
      setParamsState({
        incidentAutoDeclareDelayMinutes: targetSite.parameters?.incidentAutoDeclareDelayMinutes ?? 8,
        connectionHoldMaxMinutes: targetSite.parameters?.connectionHoldMaxMinutes ?? 5,
        headwayToleranceSeconds: targetSite.parameters?.headwayToleranceSeconds ?? 120,
        overcrowdingThresholdPaxPerM2: targetSite.parameters?.overcrowdingThresholdPaxPerM2 ?? 3.5,
        criticalSlaTargetMinutes: targetSite.parameters?.criticalSlaTargetMinutes ?? 45,
        liftUnavailabilityEscalationMinutes: targetSite.parameters?.liftUnavailabilityEscalationMinutes ?? 15,
        autoReplayBufferHours: targetSite.parameters?.autoReplayBufferHours ?? 24,
        retentionDays: targetSite.parameters?.retentionDays ?? 90,
      });
      setOperatingDayStart(targetSite.operatingDayStart || '04:30');
      setMaxDecisionCards(targetSite.maxDecisionCards || 5);
    }
  }, [selectedSiteId, targetSite]);

  // Feed testing state
  const [testingFeedId, setTestingFeedId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ feedId: string; message: string; ok: boolean } | null>(null);

  // New Feed Modal
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false);
  const [newFeed, setNewFeed] = useState<Partial<SiteFeedConfig>>({
    name: '',
    type: 'GTFS-RT',
    endpoint: 'https://',
    authMode: 'bearer',
    apiKeyMasked: 'token_sec_key_****',
    refreshIntervalSeconds: 10,
    protocolVersion: 'GTFS-RT 2.0',
  });

  // Onboarding Wizard state
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState<Partial<SiteConfig>>({
    id: 'valencia',
    name: 'Autoritat del Transport Metropolità de València (ATMV)',
    shortName: 'CITRAM València',
    tagline: 'Moure\'s per València i la seua àrea metropolitana',
    region: 'Comunitat Valenciana',
    country: 'España',
    status: 'draft',
    primaryColor: '#F58220', // Valencia Orange
    timeZone: 'Europe/Madrid',
    units: 'metric',
    language: 'es',
    operatingDayStart: '05:00',
    enforcementMode: 'enforced',
    headlineIndicators: ['Disponibilidad de Red 99.80%', 'Validaciones Metrovalencia', 'Operadores Integrados'],
    maxDecisionCards: 4,
    operatorsCount: 16,
    linesCount: 142,
    stationsCount: 460,
  });
  const [dryRunRunning, setDryRunRunning] = useState(false);
  const [dryRunPassed, setDryRunPassed] = useState(false);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3500);
  };

  const handleSaveParameters = () => {
    updateSiteConfig(targetSite.id, {
      operatingDayStart,
      maxDecisionCards,
      parameters: paramsState,
    });
    showToast(
      language === 'es'
        ? `Parámetros guardados exitosamente para ${targetSite.shortName}`
        : `Parameters successfully saved for ${targetSite.shortName}`
    );
  };

  const handleTestFeed = (feed: SiteFeedConfig) => {
    setTestingFeedId(feed.id);
    setTestResult(null);
    setTimeout(() => {
      setTestingFeedId(null);
      const isOnline = feed.status !== 'offline';
      setTestResult({
        feedId: feed.id,
        ok: isOnline,
        message: isOnline
          ? (language === 'es'
              ? `Ping 200 OK — Latencia ${feed.latencyMs}ms. Ingesta a ${feed.recordsPerSec} reg/s activa.`
              : `Ping 200 OK — Latency ${feed.latencyMs}ms. Active ingestion at ${feed.recordsPerSec} rec/s.`)
          : (language === 'es'
              ? 'Error de conexión: Certificado TLS o endpoint inalcanzable.'
              : 'Connection error: TLS certificate or endpoint unreachable.'),
      });
    }, 800);
  };

  const handleToggleFeed = (feedId: string) => {
    const currentFeeds = targetSite.feeds || [];
    const updatedFeeds = currentFeeds.map((f) =>
      f.id === feedId ? { ...f, enabled: !f.enabled, status: (!f.enabled ? 'healthy' : 'offline') as any } : f
    );
    updateSiteConfig(targetSite.id, { feeds: updatedFeeds });
    showToast(
      language === 'es' ? 'Estado del conector actualizado' : 'Feed connector status updated'
    );
  };

  const handleAddFeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.name || !newFeed.endpoint) return;

    const fullFeed: SiteFeedConfig = {
      id: `feed-${targetSite.id}-${Date.now().toString(36)}`,
      name: newFeed.name,
      type: newFeed.type as any || 'GTFS-RT',
      endpoint: newFeed.endpoint,
      status: 'healthy',
      latencyMs: 120,
      recordsPerSec: 450,
      lastIngestion: language === 'es' ? 'Recién conectado' : 'Just connected',
      authMode: newFeed.authMode as any || 'bearer',
      apiKeyMasked: newFeed.apiKeyMasked || 'token_sec_key_****',
      enabled: true,
      refreshIntervalSeconds: Number(newFeed.refreshIntervalSeconds) || 10,
      targetOperators: [targetSite.shortName],
      protocolVersion: newFeed.protocolVersion || 'REST v2 / JSON',
    };

    const currentFeeds = targetSite.feeds || [];
    updateSiteConfig(targetSite.id, { feeds: [...currentFeeds, fullFeed] });
    setIsAddFeedModalOpen(false);
    setNewFeed({
      name: '',
      type: 'GTFS-RT',
      endpoint: 'https://',
      authMode: 'bearer',
      apiKeyMasked: 'token_sec_key_****',
      refreshIntervalSeconds: 10,
      protocolVersion: 'GTFS-RT 2.0',
    });
    showToast(language === 'es' ? `Conector "${fullFeed.name}" añadido con éxito` : `Feed connector "${fullFeed.name}" added successfully`);
  };

  const handleToggleModule = (modKey: keyof SiteModuleConfig) => {
    const currentModules = targetSite.modules || {
      control_tower: true,
      intermodal_connections: true,
      accessible_routing: true,
      passenger_comms: true,
      runbook_automation: true,
      alert_flood_engine: true,
      simulator_rehearsal: true,
    };
    const updated = { ...currentModules, [modKey]: !currentModules[modKey] };
    updateSiteConfig(targetSite.id, { modules: updated });
    showToast(language === 'es' ? 'Módulo actualizado' : 'Module configuration updated');
  };

  const handleRunOnboardingDryRun = () => {
    setDryRunRunning(true);
    setDryRunPassed(false);
    setTimeout(() => {
      setDryRunRunning(false);
      setDryRunPassed(true);
    }, 1200);
  };

  const handleCompleteOnboarding = () => {
    if (!wizardData.name || !wizardData.id) return;
    const finalNewSite: SiteConfig = {
      id: wizardData.id,
      name: wizardData.name,
      shortName: wizardData.shortName || wizardData.name,
      tagline: wizardData.tagline || 'Transporte público integrado',
      region: wizardData.region || 'Región',
      country: wizardData.country || 'España',
      status: 'live',
      primaryColor: wizardData.primaryColor || '#0071BB',
      timeZone: wizardData.timeZone || 'Europe/Madrid',
      units: wizardData.units || 'metric',
      language: wizardData.language || 'es',
      operatingDayStart: wizardData.operatingDayStart || '05:00',
      enforcementMode: wizardData.enforcementMode || 'enforced',
      headlineIndicators: wizardData.headlineIndicators || ['Disponibilidad de Red 99.9%', 'Operadores Conectados'],
      maxDecisionCards: wizardData.maxDecisionCards || 4,
      operatorsCount: wizardData.operatorsCount || 12,
      linesCount: wizardData.linesCount || 85,
      stationsCount: wizardData.stationsCount || 340,
      parameters: {
        incidentAutoDeclareDelayMinutes: 8,
        connectionHoldMaxMinutes: 5,
        headwayToleranceSeconds: 120,
        overcrowdingThresholdPaxPerM2: 3.5,
        criticalSlaTargetMinutes: 45,
        liftUnavailabilityEscalationMinutes: 15,
        autoReplayBufferHours: 24,
        retentionDays: 90,
      },
      modules: {
        control_tower: true,
        intermodal_connections: true,
        accessible_routing: true,
        passenger_comms: true,
        runbook_automation: true,
        alert_flood_engine: true,
        simulator_rehearsal: true,
      },
      feeds: [
        {
          id: `feed-${wizardData.id}-gtfs-01`,
          name: `${wizardData.shortName} GTFS-Realtime Central`,
          type: 'GTFS-RT',
          endpoint: `https://dades.${wizardData.id}.es/gtfs-rt/live.pb`,
          status: 'healthy',
          latencyMs: 130,
          recordsPerSec: 890,
          lastIngestion: 'Hace 5 seg',
          authMode: 'bearer',
          apiKeyMasked: `${wizardData.id}_live_prod_****_88aa`,
          enabled: true,
          refreshIntervalSeconds: 10,
          targetOperators: ['Red Regional Integrada'],
          protocolVersion: 'GTFS-RT 2.0',
        },
      ],
    };

    createSite(finalNewSite);
    setActiveSiteId(finalNewSite.id);
    setSelectedSiteId(finalNewSite.id);
    setActiveSubTab('sites');
    showToast(
      language === 'es'
        ? `¡Nuevo sitio ${finalNewSite.shortName} puesto en producción y activado!`
        : `New site ${finalNewSite.shortName} promoted to live and activated!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#161B22] text-white border border-emerald-500/50 shadow-xl px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Main Admin Suite Header */}
      <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0071BB]/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Suite de Administración y Control CITRAM' : 'CITRAM Platform Administration Suite'}
                </h1>
                <p className="text-xs text-neutral-500">
                  {language === 'es'
                    ? 'Control de acceso RBAC, gestión y creación de sitios, configuración de parámetros y telemetría de feeds por sitio.'
                    : 'RBAC access control, multi-tenant site onboarding, per-site parameters, and telemetry feed integration.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context & Site Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-xs">
              <Building2 className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-500">{language === 'es' ? 'Configurar Sitio:' : 'Configuring Site:'}</span>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="font-bold bg-transparent border-0 cursor-pointer text-[#0071BB] dark:text-[#5AAEE8] focus:ring-0 text-xs py-0"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id} className="text-black dark:text-white dark:bg-[#161B22]">
                    {s.shortName} {s.id === activeSite.id ? (language === 'es' ? '(Activo)' : '(Active)') : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveSubTab('onboarding')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071BB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Onboarding Nuevo Sitio' : 'Onboard New Site'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1 border-t border-[#DCE1E7] dark:border-[#2B3440] mt-5 pt-3">
          {[
            { id: 'roles', labelEs: 'Roles y Matriz RBAC', labelEn: 'Roles & RBAC Matrix', icon: <Shield className="w-3.5 h-3.5" /> },
            { id: 'verification', labelEs: 'Verificación Fases & TC', labelEn: 'Phases & TC Verification', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
            { id: 'sites', labelEs: 'Cartera de Sitios', labelEn: 'Sites Portfolio', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'onboarding', labelEs: 'Asistente de Onboarding', labelEn: 'Onboarding Wizard', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'parameters', labelEs: 'Parámetros por Sitio', labelEn: 'Site Parameters & SLAs', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'feeds', labelEs: 'Feeds e Integración', labelEn: 'Feeds & Integrations', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'modules', labelEs: 'Módulos Habilitados', labelEn: 'Module Flags', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'users', labelEs: 'Usuarios y Cuentas', labelEn: 'Users & Accounts', icon: <Users className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-[#0071BB] text-white font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.icon}
              <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: RBAC & Role Matrix */}
      {activeSubTab === 'roles' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
          <RbacMatrixEditor />
        </div>
      )}

      {/* SUB-TAB: Technical Phase Verification & Test Cases Suite */}
      {activeSubTab === 'verification' && (
        <AdminVerificationPage
          onOpenChecklistModal={onOpenChecklistModal || (() => {})}
          onOpenSimulator={onOpenSimulator}
          onNavigateTab={onNavigateTab || (() => {})}
        />
      )}

      {/* SUB-TAB 2: Sites Portfolio */}
      {activeSubTab === 'sites' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sites.map((site) => {
              const isCurrent = site.id === activeSite.id;
              const isConfigured = site.id === selectedSiteId;
              return (
                <div
                  key={site.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'border-[#0071BB] ring-1 ring-[#0071BB]/30 bg-blue-50/10 dark:bg-blue-950/10 shadow-sm'
                      : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs"
                          style={{ backgroundColor: site.primaryColor }}
                        />
                        <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                          {site.shortName}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          site.status === 'live'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {site.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 italic mb-3">"{site.tagline}"</p>

                    <div className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400 mb-4 border-t border-[#DCE1E7] dark:border-[#2B3440] pt-3">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">{language === 'es' ? 'Región:' : 'Region:'}</span>
                        <span className="font-semibold text-right">{site.region}, {site.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">{language === 'es' ? 'Modo Cumplimiento:' : 'Enforcement:'}</span>
                        <span className="font-mono uppercase font-bold text-[11px]">{site.enforcementMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">{language === 'es' ? 'Inicio Operativo:' : 'Day Start:'}</span>
                        <span className="font-mono font-bold">{site.operatingDayStart}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">{language === 'es' ? 'Operadores / Líneas:' : 'Operators / Lines:'}</span>
                        <span className="font-semibold">{site.operatorsCount ?? 24} ops · {site.linesCount ?? 180} líneas</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">{language === 'es' ? 'Feeds Activos:' : 'Active Feeds:'}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{site.feeds?.length ?? 3} feeds</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440]">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setActiveSubTab('parameters');
                        }}
                        className="py-1.5 px-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        {language === 'es' ? 'Parámetros' : 'Parameters'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setActiveSubTab('feeds');
                        }}
                        className="py-1.5 px-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        {language === 'es' ? 'Ver Feeds' : 'View Feeds'}
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveSiteId(site.id)}
                      disabled={isCurrent}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-default'
                          : 'bg-[#0071BB] hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isCurrent
                        ? (language === 'es' ? '✓ Sitio Activo en Sesión' : '✓ Current Active Site')
                        : (language === 'es' ? `Conmutar a ${site.shortName}` : `Switch to ${site.shortName}`)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Platform Provider Actions */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              {language === 'es'
                ? '¿Deseas restaurar la configuración original de fábrica de todos los sitios multi-tenant?'
                : 'Restore original multi-tenant factory configuration for all regional authority sites?'}
            </span>
            <button
              onClick={() => {
                if (window.confirm(language === 'es' ? '¿Restaurar sitios a valores predeterminados?' : 'Reset sites to default?')) {
                  resetSitesToDefault();
                  showToast(language === 'es' ? 'Sitios restaurados' : 'Sites reset to factory defaults');
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              {language === 'es' ? 'Restablecer Valores Iniciales' : 'Reset Factory Defaults'}
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Onboarding Wizard */}
      {activeSubTab === 'onboarding' && (
        <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0071BB]" />
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es'
                    ? 'Asistente de Onboarding de Nueva Autoridad Regional'
                    : 'Regional Transport Authority Onboarding Wizard'}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'es'
                  ? 'Guía asistida de 5 fases para dar de alta un nuevo consorcio metropolitano con validación sintáctica de feeds y ensayo general.'
                  : '5-phase guided workflow to register, connect feeds, and validate a new regional transit authority.'}
              </p>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  onClick={() => setOnboardingStep(step)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    onboardingStep === step
                      ? 'bg-[#0071BB] text-white shadow-xs'
                      : onboardingStep > step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {onboardingStep > step ? '✓' : step}
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Step 1: Regional Identity */}
          {onboardingStep === 1 && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 1: Identidad y Jurisdicción Territorial' : 'Phase 1: Regional Identity & Jurisdiction'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Nombre Institucional de la Autoridad' : 'Authority Legal Name'}
                  </label>
                  <input
                    type="text"
                    value={wizardData.name}
                    onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-neutral-900 dark:text-neutral-100 font-medium"
                    placeholder="e.g. Autoritat del Transport Metropolità de València (ATMV)"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Nombre Breve / Badge Portal' : 'Short Display Name'}
                  </label>
                  <input
                    type="text"
                    value={wizardData.shortName}
                    onChange={(e) => setWizardData({ ...wizardData, shortName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-neutral-900 dark:text-neutral-100 font-medium"
                    placeholder="e.g. CITRAM València"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Comunidad Autónoma / Región' : 'Region / Metropolitan Area'}
                  </label>
                  <input
                    type="text"
                    value={wizardData.region}
                    onChange={(e) => setWizardData({ ...wizardData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-neutral-900 dark:text-neutral-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Color Corporativo Institucional' : 'Brand Primary Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={wizardData.primaryColor}
                      onChange={(e) => setWizardData({ ...wizardData, primaryColor: e.target.value })}
                      className="w-10 h-9 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={wizardData.primaryColor}
                      onChange={(e) => setWizardData({ ...wizardData, primaryColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Lema o Tagline' : 'Tagline'}
                  </label>
                  <input
                    type="text"
                    value={wizardData.tagline}
                    onChange={(e) => setWizardData({ ...wizardData, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    {language === 'es' ? 'Hora de Inicio de Día de Operación' : 'Operational Day Boundary'}
                  </label>
                  <input
                    type="time"
                    value={wizardData.operatingDayStart}
                    onChange={(e) => setWizardData({ ...wizardData, operatingDayStart: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wizard Step 2: Transport Modes */}
          {onboardingStep === 2 && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 2: Modos de Transporte y Concesiones' : 'Phase 2: Transport Modes & Operator Concessions'}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'es'
                  ? 'Define el alcance multimodal y número estimado de operadores concesionales a integrar.'
                  : 'Define multimodal scope and estimated number of franchised operators.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {['Metro Subterráneo', 'Autobús Urbano', 'Autobús Interurbano', 'Cercanías Ferroviarias', 'Tranvía / Metro Ligero', 'Intercambiadores Multimodales'].map((mode) => (
                  <div key={mode} className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] flex items-center justify-between">
                    <span className="font-semibold">{mode}</span>
                    <input type="checkbox" defaultChecked className="rounded text-[#0071BB] focus:ring-0" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs pt-2">
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Nº de Operadores' : 'Operators Count'}
                  </label>
                  <input
                    type="number"
                    value={wizardData.operatorsCount}
                    onChange={(e) => setWizardData({ ...wizardData, operatorsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Líneas Totales' : 'Total Lines'}
                  </label>
                  <input
                    type="number"
                    value={wizardData.linesCount}
                    onChange={(e) => setWizardData({ ...wizardData, linesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Estaciones / Paradas' : 'Stations / Stops'}
                  </label>
                  <input
                    type="number"
                    value={wizardData.stationsCount}
                    onChange={(e) => setWizardData({ ...wizardData, stationsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wizard Step 3: Feeds & Ingestion */}
          {onboardingStep === 3 && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 3: Conexión de Feeds en Tiempo Real (GTFS-RT, SIRI, SCADA)' : 'Phase 3: Real-Time Feeds Ingestion'}
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>1. Endpoint GTFS-RT (TripUpdates & VehiclePositions)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Requerido</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="https://dades.atmv.gva.es/api/gtfs-rt/feed.pb"
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono text-xs"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>2. Pasarela SIRI-SX / SIRI-ET (Avisos de Servicio e Incidencias)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold">CEN/TS 15531</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="https://siri.atmv.gva.es/services/siri-xml"
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono text-xs"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>3. Telemetría de Accesibilidad SCADA (Ascensores y Salvaescaleras)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-bold">IoT MQTT</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="mqtts://scada.metrovalencia.es:8883/telemetry/lifts"
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wizard Step 4: Operational Thresholds */}
          {onboardingStep === 4 && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 4: Parámetros Operativos y Tolerancias SLA' : 'Phase 4: Operational Parameters & SLA Tolerances'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]">
                  <label className="font-semibold block mb-1">
                    {language === 'es' ? 'Tiempo de Declaración de Incidencia Automática' : 'Auto Incident Declaration Delay'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={8} className="w-20 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono" />
                    <span className="text-neutral-500">{language === 'es' ? 'minutos de retraso continuo' : 'minutes sustained delay'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]">
                  <label className="font-semibold block mb-1">
                    {language === 'es' ? 'Máxima Retención de Enlace Vehicular' : 'Max Connection Hold Platform Time'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={5} className="w-20 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono" />
                    <span className="text-neutral-500">{language === 'es' ? 'minutos de espera de autobús' : 'minutes platform hold'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]">
                  <label className="font-semibold block mb-1">
                    {language === 'es' ? 'Meta Reloj de Resolución SLA Crítico' : 'Critical Case Resolution SLA Target'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={45} className="w-20 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono" />
                    <span className="text-neutral-500">{language === 'es' ? 'minutos máx. resolución' : 'minutes max resolution'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]">
                  <label className="font-semibold block mb-1">
                    {language === 'es' ? 'Umbral de Alerta de Aglomeración' : 'Platform Overcrowding Threshold'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="number" step="0.1" defaultValue={3.5} className="w-20 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono" />
                    <span className="text-neutral-500">{language === 'es' ? 'pasajeros / m²' : 'passengers / m²'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Step 5: Dry-Run Simulation & Promotion */}
          {onboardingStep === 5 && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 5: Ensayo General (Dry-Run) y Puesta en Producción' : 'Phase 5: Dry-Run Validation & Live Promotion'}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'es'
                  ? 'Ejecuta la batería de pruebas de conectividad de feeds, esquemas de datos y validación geográfica antes de conmutar a producción.'
                  : 'Execute dry-run verification across feed syntax, geographic bounds, and schema integrity.'}
              </p>

              <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${dryRunPassed ? 'text-emerald-500' : 'text-neutral-400'}`} />
                    <span className="font-semibold">1. Comprobación sintáctica Protobuf GTFS-RT y frecuencias</span>
                  </div>
                  <span className="font-mono text-neutral-500">{dryRunPassed ? '100% OK' : 'Pendiente'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${dryRunPassed ? 'text-emerald-500' : 'text-neutral-400'}`} />
                    <span className="font-semibold">2. Handshake mTLS y validación de endpoints SIRI / SCADA</span>
                  </div>
                  <span className="font-mono text-neutral-500">{dryRunPassed ? 'Latencia < 150ms' : 'Pendiente'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${dryRunPassed ? 'text-emerald-500' : 'text-neutral-400'}`} />
                    <span className="font-semibold">3. Integridad de matriz RBAC y cuentas de operador asignadas</span>
                  </div>
                  <span className="font-mono text-neutral-500">{dryRunPassed ? '21 Roles OK' : 'Pendiente'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunOnboardingDryRun}
                  disabled={dryRunRunning}
                  className="px-4 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dryRunRunning ? 'animate-spin text-[#0071BB]' : ''}`} />
                  <span>{dryRunRunning ? (language === 'es' ? 'Validando...' : 'Validating...') : (language === 'es' ? 'Ejecutar Ensayo General' : 'Run Dry-Run Verification')}</span>
                </button>

                {dryRunPassed && (
                  <button
                    onClick={handleCompleteOnboarding}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 animate-in fade-in"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'es' ? 'Promover a Producción (Live Site)' : 'Promote to Live Production'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#DCE1E7] dark:border-[#2B3440]">
            <button
              onClick={() => setOnboardingStep((prev) => Math.max(1, prev - 1))}
              disabled={onboardingStep === 1}
              className="px-3.5 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium disabled:opacity-40 cursor-pointer"
            >
              {language === 'es' ? 'Anterior' : 'Previous'}
            </button>
            <div className="text-xs text-neutral-500">
              {language === 'es' ? `Paso ${onboardingStep} de 5` : `Step ${onboardingStep} of 5`}
            </div>
            {onboardingStep < 5 && (
              <button
                onClick={() => setOnboardingStep((prev) => Math.min(5, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-[#0071BB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                {language === 'es' ? 'Siguiente' : 'Next'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Site Parameters & Thresholds */}
      {activeSubTab === 'parameters' && (
        <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#0071BB]" />
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es'
                    ? `Configuración de Parámetros y Umbrales: ${targetSite.shortName}`
                    : `Operational Parameters & Thresholds: ${targetSite.shortName}`}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'es'
                  ? 'Ajusta los umbrales de automatización, tolerancias de regularidad y tiempos de retención específicos para este sitio.'
                  : 'Configure automation thresholds, headway jitter tolerances, and vehicle hold durations for this site.'}
              </p>
            </div>

            <button
              onClick={handleSaveParameters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0071BB] text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'es' ? 'Guardar Cambios del Sitio' : 'Save Site Parameters'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Param 1: Incident Auto-declaration Delay */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Retraso Declaración Incidencia' : 'Auto Incident Declaration'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] font-bold">
                  {paramsState.incidentAutoDeclareDelayMinutes} min
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Minutos continuos de retraso detectado en convoy antes de sugerir apertura de caso crítico.'
                  : 'Sustained delay minutes detected on corridor before recommending critical case declaration.'}
              </p>
              <input
                type="range"
                min="3"
                max="25"
                value={paramsState.incidentAutoDeclareDelayMinutes}
                onChange={(e) =>
                  setParamsState({ ...paramsState, incidentAutoDeclareDelayMinutes: Number(e.target.value) })
                }
                className="w-full accent-[#0071BB] cursor-pointer"
              />
            </div>

            {/* Param 2: Connection Hold Max Duration */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Retención Máxima de Enlace' : 'Max Connection Hold Duration'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                  {paramsState.connectionHoldMaxMinutes} min
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Tiempo máximo que un autobús o tren de enlace puede ser retenido en andén para viajeros en transbordo.'
                  : 'Maximum minutes a connecting vehicle may be held at platform for transfer passengers.'}
              </p>
              <input
                type="range"
                min="2"
                max="12"
                value={paramsState.connectionHoldMaxMinutes}
                onChange={(e) =>
                  setParamsState({ ...paramsState, connectionHoldMaxMinutes: Number(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Param 3: Headway Regularity Tolerance */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Tolerancia de Intervalo (Jitter)' : 'Headway Jitter Tolerance'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 font-bold">
                  ±{paramsState.headwayToleranceSeconds} seg
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Desviación permitida respecto al intervalo programado en líneas de alta frecuencia (Metro/EMT).'
                  : 'Allowable seconds deviation from scheduled headway on high-frequency transit lines.'}
              </p>
              <input
                type="range"
                min="45"
                max="300"
                step="15"
                value={paramsState.headwayToleranceSeconds}
                onChange={(e) =>
                  setParamsState({ ...paramsState, headwayToleranceSeconds: Number(e.target.value) })
                }
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Param 4: Overcrowding Threshold */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Alerta Aglomeración Andén' : 'Platform Overcrowding Alert'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">
                  {paramsState.overcrowdingThresholdPaxPerM2} pax/m²
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Densidad calculada mediante tornos y CCTV para activar protocolos de retención en vestíbulos.'
                  : 'Computed passenger density triggering vestibule station gate throttling protocols.'}
              </p>
              <input
                type="range"
                min="2.0"
                max="5.0"
                step="0.1"
                value={paramsState.overcrowdingThresholdPaxPerM2}
                onChange={(e) =>
                  setParamsState({ ...paramsState, overcrowdingThresholdPaxPerM2: Number(e.target.value) })
                }
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Param 5: Critical SLA Countdown */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Objetivo Resolución SLA Crítico' : 'Critical SLA Target Clock'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-600 font-bold">
                  {paramsState.criticalSlaTargetMinutes} min
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Reloj reglamentario para cierre o informe preliminar de incidentes mayores (PRD Sección 9).'
                  : 'Mandatory resolution clock for major incidents before contractual penalty accrual.'}
              </p>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={paramsState.criticalSlaTargetMinutes}
                onChange={(e) =>
                  setParamsState({ ...paramsState, criticalSlaTargetMinutes: Number(e.target.value) })
                }
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Param 6: PMR Lift Escalation Delay */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Escalado Inoperatividad PMR' : 'PMR Lift Outage Escalation'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 font-bold">
                  {paramsState.liftUnavailabilityEscalationMinutes} min
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Tiempo de indisponibilidad de ascensor para despachar itinerario alternativo accesible obligatorio.'
                  : 'Duration of lift downtime before triggering mandatory accessible alternative route notices.'}
              </p>
              <input
                type="range"
                min="5"
                max="45"
                step="5"
                value={paramsState.liftUnavailabilityEscalationMinutes}
                onChange={(e) =>
                  setParamsState({ ...paramsState, liftUnavailabilityEscalationMinutes: Number(e.target.value) })
                }
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Param 7: Operating Day Start */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Límite Día Operativo (Corte)' : 'Operating Day Cutover'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">
                  {operatingDayStart}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Hora en la que el turno nocturno cambia de fecha operativa (04:30 en Madrid).'
                  : 'Time of day where overnight shift rotates to next operational service day.'}
              </p>
              <input
                type="time"
                value={operatingDayStart}
                onChange={(e) => setOperatingDayStart(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] font-mono text-xs"
              />
            </div>

            {/* Param 8: Max Decision Cards */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Máx Tarjetas de Decisión (Glance)' : 'Max Decision Cards'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">
                  {maxDecisionCards}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Límite estricto de tarjetas de decisión visibles en la pantalla principal (PRD Sección 2).'
                  : 'Strict cap on decision cards displayed on Tower Glance view to avoid cognitive overload.'}
              </p>
              <input
                type="range"
                min="3"
                max="6"
                value={maxDecisionCards}
                onChange={(e) => setMaxDecisionCards(Number(e.target.value))}
                className="w-full accent-[#0071BB] cursor-pointer"
              />
            </div>

            {/* Param 9: History Data Retention */}
            <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2">
              <div className="flex items-center justify-between font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                <span>{language === 'es' ? 'Retención de Telemetría e Historial' : 'Audit Data Retention'}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">
                  {paramsState.retentionDays} días
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Días de retención obligatoria para auditoría contractual y análisis forense de incidentes.'
                  : 'Mandatory telemetry retention days for contractual audit and forensic replay.'}
              </p>
              <input
                type="range"
                min="30"
                max="365"
                step="30"
                value={paramsState.retentionDays}
                onChange={(e) =>
                  setParamsState({ ...paramsState, retentionDays: Number(e.target.value) })
                }
                className="w-full accent-neutral-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Feeds & Integrations */}
      {activeSubTab === 'feeds' && (
        <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#0071BB]" />
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es'
                    ? `Conectores e Integración de Feeds: ${targetSite.shortName}`
                    : `Telemetry Feeds & Integration Hub: ${targetSite.shortName}`}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'es'
                  ? 'Supervisa la salud, latencia e ingesta de feeds en tiempo real (GTFS-RT, SIRI, SCADA, Tornos, CCTV, 112).'
                  : 'Monitor real-time feed health, latency, and ingestion throughput per site.'}
              </p>
            </div>

            <button
              onClick={() => setIsAddFeedModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Añadir Conector de Feed' : 'Add Feed Connector'}</span>
            </button>
          </div>

          {/* Test Result Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between animate-in fade-in ${
                testResult.ok
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Feed List Cards */}
          <div className="space-y-4">
            {(targetSite.feeds || []).map((feed) => {
              const isTesting = testingFeedId === feed.id;
              return (
                <div
                  key={feed.id}
                  className={`p-4 rounded-xl border transition-all ${
                    feed.enabled
                      ? 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#0E1217]'
                      : 'border-dashed border-neutral-300 dark:border-neutral-700 opacity-60 bg-neutral-100/30 dark:bg-neutral-900/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            !feed.enabled
                              ? 'bg-neutral-400'
                              : feed.status === 'healthy'
                              ? 'bg-emerald-500 animate-pulse'
                              : feed.status === 'degraded'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                          {feed.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                          {feed.type}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {feed.protocolVersion}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500">
                        <span className="font-mono truncate max-w-md text-neutral-700 dark:text-neutral-300">
                          {feed.endpoint}
                        </span>
                        <span>•</span>
                        <span>{language === 'es' ? 'Autenticación:' : 'Auth:'} <strong className="font-mono uppercase">{feed.authMode}</strong> ({feed.apiKeyMasked})</span>
                        <span>•</span>
                        <span>{language === 'es' ? 'Intervalo:' : 'Interval:'} <strong>{feed.refreshIntervalSeconds}s</strong></span>
                      </div>
                    </div>

                    {/* Metrics and Actions */}
                    <div className="flex items-center gap-4">
                      {feed.enabled && (
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">{language === 'es' ? 'Latencia' : 'Latency'}</div>
                            <div className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">{feed.latencyMs} ms</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">{language === 'es' ? 'Caudal' : 'Rate'}</div>
                            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{feed.recordsPerSec} reg/s</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestFeed(feed)}
                          disabled={isTesting || !feed.enabled}
                          className="px-2.5 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                        >
                          <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#0071BB]' : 'text-neutral-500'}`} />
                          <span>{isTesting ? (language === 'es' ? 'Probando...' : 'Testing...') : (language === 'es' ? 'Probar Ping' : 'Test Ping')}</span>
                        </button>

                        <button
                          onClick={() => handleToggleFeed(feed.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                            feed.enabled
                              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {feed.enabled ? (language === 'es' ? 'Desactivar' : 'Disable') : (language === 'es' ? 'Habilitar' : 'Enable')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: Module Flags */}
      {activeSubTab === 'modules' && (
        <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-6">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0071BB]" />
              <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? `Módulos Funcionales Activos para: ${targetSite.shortName}`
                  : `Active Feature Modules: ${targetSite.shortName}`}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {language === 'es'
                ? 'Habilita o deshabilita subsistemas de la plataforma según el contrato y fase de madurez del consorcio.'
                : 'Toggle platform subsystems based on regional authority tier and operational contract.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              {
                key: 'control_tower' as const,
                titleEs: 'Torre de Control (Glance & Explore)',
                titleEn: 'Control Tower (Glance & Explore)',
                descEs: 'Cartografía en tiempo real, tarjetas de decisión y KPIs prioritarios de red.',
                descEn: 'Real-time interactive canvas map, decision cards, and headline health KPIs.',
              },
              {
                key: 'intermodal_connections' as const,
                titleEs: 'Protección de Enlaces Intermodales (Transfer Hold)',
                titleEn: 'Intermodal Connection Protection (Transfer Hold)',
                descEs: 'Gestión de retención de vehículos para asegurar correspondencias entre Cercanías y Autobús.',
                descEn: 'Vehicle hold gates at platforms ensuring passenger transfer connections.',
              },
              {
                key: 'accessible_routing' as const,
                titleEs: 'Enrutamiento Accesible y Gestión de Ascensores (PMR)',
                titleEn: 'Accessible Routing & Elevator Status (PMR)',
                descEs: 'Monitorización SCADA de ascensores, alertas de barreras arquitectónicas y desvíos PMR.',
                descEn: 'SCADA lift monitoring, barrier alerts, and step-free alternative routing.',
              },
              {
                key: 'passenger_comms' as const,
                titleEs: 'Estudio de Información al Pasajero (Comms Studio)',
                titleEn: 'Passenger Communications Studio (Comms)',
                descEs: 'Generación, aprobación y publicación multicanal (App, Web, Paneles, megafonía).',
                descEn: 'Drafting, approval, and publishing disruption notices to apps and displays.',
              },
              {
                key: 'runbook_automation' as const,
                titleEs: 'Ejecución y Automatización de Runbooks Operativos',
                titleEn: 'Operational Runbooks Execution Engine',
                descEs: 'Guías de paso a paso con kill-switch de emergencia y auditoría de firmas.',
                descEn: 'Step-by-step hybrid procedures with automated action kill switches.',
              },
              {
                key: 'alert_flood_engine' as const,
                titleEs: 'Motor de Correlación y Supresión de Inundación de Alertas',
                titleEn: 'Alert Flood Correlation & Suppression Engine',
                descEs: 'Agrupamiento de cientos de alarmas simultáneas en clusters procesables.',
                descEn: 'Stream ingestion compressing raw sensor alarms into promoted cases.',
              },
              {
                key: 'simulator_rehearsal' as const,
                titleEs: 'Simulador de Ensayos y Banco de Pruebas (Chaos Injector)',
                titleEn: 'Show & Tell Rehearsal Simulator & Chaos Injector',
                descEs: 'Inyector de perturbaciones, multiplicador de reloj y ensayos conmemorativos.',
                descEn: 'Scenario rehearsal runner with variable clock multiplier and chaos toggles.',
              },
            ].map((m) => {
              const currentMods = targetSite.modules || {
                control_tower: true,
                intermodal_connections: true,
                accessible_routing: true,
                passenger_comms: true,
                runbook_automation: true,
                alert_flood_engine: true,
                simulator_rehearsal: true,
              };
              const isEnabled = currentMods[m.key];
              return (
                <div
                  key={m.key}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isEnabled
                      ? 'border-[#0071BB]/40 bg-blue-50/10 dark:bg-blue-950/10'
                      : 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? m.titleEs : m.titleEn}
                    </h4>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      {language === 'es' ? m.descEs : m.descEn}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggleModule(m.key)}
                    className="w-4 h-4 rounded text-[#0071BB] focus:ring-0 cursor-pointer mt-1"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: User Accounts & MFA Directory */}
      {activeSubTab === 'users' && (
        <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-6">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0071BB]" />
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es'
                    ? 'Directorio de Usuarios y Control de Identidad'
                    : 'User Directory & Authentication Controls'}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'es'
                  ? 'Gestión de cuentas demo para los 21 roles certificados, obligatoriedad de MFA y cambio rápido de perfil.'
                  : 'Manage accounts for the 21 certified roles, enforcement of MFA, and instant session switcher.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {allRoles.map((role) => (
              <div
                key={role.id}
                className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0071BB]/10 text-[#0071BB]">
                      {role.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      role.requiresMfa
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {role.requiresMfa ? 'MFA Requerido' : 'Contraseña Básica'}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-2">
                    {language === 'es' ? role.nameEs : role.nameEn}
                  </h4>
                  <p className="text-neutral-500 text-[11px]">
                    {role.demoAccount.fullName} ({role.demoAccount.organization})
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-mono">
                    user: {role.demoAccount.username}
                  </span>
                  <button
                    onClick={() => {
                      loginAsRole(role.id);
                      showToast(language === 'es' ? `Sesión cambiada a ${role.nameEs}` : `Session switched to ${role.nameEn}`);
                    }}
                    className="px-2.5 py-1 rounded bg-[#0071BB] hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
                  >
                    {language === 'es' ? 'Simular Perfil' : 'Switch Profile'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Feed Modal */}
      {isAddFeedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Añadir Conector de Telemetría al Sitio' : 'Add Telemetry Feed Connector'}
              </h3>
              <button
                onClick={() => setIsAddFeedModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFeedSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">
                  {language === 'es' ? 'Nombre Descriptivo del Feed' : 'Feed Descriptive Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metrovalencia GTFS-RT TripUpdates"
                  value={newFeed.name}
                  onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Tipo de Protocolo' : 'Protocol Type'}
                  </label>
                  <select
                    value={newFeed.type}
                    onChange={(e) => setNewFeed({ ...newFeed, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]"
                  >
                    <option value="GTFS-RT">GTFS-Realtime (Protobuf)</option>
                    <option value="SIRI-SX">SIRI-SX (XML / CEN 15531)</option>
                    <option value="SIRI-ET">SIRI-ET (Estimated Timetable)</option>
                    <option value="SCADA-LIFTS">SCADA Lifts (MQTT / IoT)</option>
                    <option value="TURNSTILE-TAP">Turnstiles Tap Stream (WebSocket)</option>
                    <option value="CCTV-STREAM">CCTV RTSP / WebRTC Gateway</option>
                    <option value="112-EMERGENCY">112 Emergency CAP Webhook</option>
                    <option value="DGT-TRAFFIC">DATEX II Road Traffic</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Modo Autenticación' : 'Authentication Mode'}
                  </label>
                  <select
                    value={newFeed.authMode}
                    onChange={(e) => setNewFeed({ ...newFeed, authMode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217]"
                  >
                    <option value="bearer">Bearer Token</option>
                    <option value="api_key">API Key (X-Api-Key)</option>
                    <option value="mutual_tls">Mutual TLS (mTLS)</option>
                    <option value="oauth2">OAuth 2.0 Client Credentials</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  {language === 'es' ? 'URL Endpoint del Feed' : 'Feed Endpoint URL'}
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newFeed.endpoint}
                  onChange={(e) => setNewFeed({ ...newFeed, endpoint: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Frecuencia de Polling (segundos)' : 'Polling Interval (seconds)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={newFeed.refreshIntervalSeconds}
                    onChange={(e) => setNewFeed({ ...newFeed, refreshIntervalSeconds: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    {language === 'es' ? 'Clave de Acceso (Enmascarada)' : 'Access Key Mask'}
                  </label>
                  <input
                    type="text"
                    value={newFeed.apiKeyMasked}
                    onChange={(e) => setNewFeed({ ...newFeed, apiKeyMasked: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE1E7] dark:border-[#2B3440]">
                <button
                  type="button"
                  onClick={() => setIsAddFeedModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0071BB] text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  {language === 'es' ? 'Guardar Conector' : 'Save Connector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
