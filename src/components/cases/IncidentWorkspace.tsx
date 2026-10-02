import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import { IncidentCase, RunbookStep, IncidentLifecycle } from '../../types';
import { INITIAL_HERO_CASE } from '../../data/incidentCasesData';
import { getSiteHeroCase } from '../../data/multiSiteData';
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Bus,
  Users,
  Radio,
  Share2,
  Shield,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  FileText,
  Lock,
  Unlock,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ChevronRight,
  TrendingDown,
  Activity,
  Download,
} from 'lucide-react';
import { ExportIncidentLogsModal } from './ExportIncidentLogsModal';

interface IncidentWorkspaceProps {
  onBackToTower: () => void;
  onOpenTrustDrawer: (title: string) => void;
}

export const IncidentWorkspace: React.FC<IncidentWorkspaceProps> = ({
  onBackToTower,
  onOpenTrustDrawer,
}) => {
  const { currentRole, effectiveRole, language, hasPermission } = useAuth();
  const { activeSite } = useSite();

  const [activeCase, setActiveCase] = useState<IncidentCase>(() => getSiteHeroCase(activeSite.id));
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'runbook' | 'intermodal' | 'reinforcements' | 'comms' | 'timeline'>('runbook');

  useEffect(() => {
    setActiveCase(getSiteHeroCase(activeSite.id));
  }, [activeSite.id]);
  const [attemptedEarlyClose, setAttemptedEarlyClose] = useState(false);
  const [overrideModalStepId, setOverrideModalStepId] = useState<number | null>(null);
  const [overrideReasonInput, setOverrideReasonInput] = useState('');
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);
  const [signoffNotes, setSignoffNotes] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // 9-Step Checklist Completion calculation
  const completedStepsCount = activeCase.runbook.steps.filter(
    (s) => s.status === 'completed' || s.status === 'skipped_with_override'
  ).length;
  const isAllChecklistSatisfied = completedStepsCount === 9;

  // Execute or complete a specific runbook step
  const handleExecuteStep = (stepId: number) => {
    setActiveCase((prev) => {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const updatedSteps = prev.runbook.steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'completed' as const,
            completedAt: now,
            completedBy: `${effectiveRole.demoAccount.fullName} (${effectiveRole.id})`,
          };
        }
        return step;
      });

      // Also trigger side-effects on connected case modules
      let updatedIntermodal = prev.intermodalConnection;
      let updatedReinforcements = prev.reinforcements;
      let updatedComms = prev.passengerCommunications;

      if (stepId === 3 && updatedReinforcements) {
        updatedReinforcements = { ...updatedReinforcements, status: 'on_station' };
      }
      if (stepId === 4 && updatedComms) {
        updatedComms = { ...updatedComms, status: 'published' };
      }
      if (stepId === 5 && updatedIntermodal) {
        updatedIntermodal = { ...updatedIntermodal, status: 'executed' };
      }

      const newTimelineEvent = {
        id: `EVT-${Date.now()}`,
        timestamp: now,
        type: 'action_executed' as const,
        actorId: effectiveRole.id,
        actorName: effectiveRole.demoAccount.fullName,
        actorRole: effectiveRole.nameEs,
        description: `Paso ${stepId} completado: ${updatedSteps.find((s) => s.id === stepId)?.titleEs}`,
      };

      return {
        ...prev,
        runbook: {
          ...prev.runbook,
          steps: updatedSteps,
        },
        intermodalConnection: updatedIntermodal,
        reinforcements: updatedReinforcements,
        passengerCommunications: updatedComms,
        timeline: [newTimelineEvent, ...prev.timeline],
      };
    });
  };

  // Step override action with required justification
  const handleConfirmOverride = () => {
    if (!overrideModalStepId || !overrideReasonInput.trim()) return;

    setActiveCase((prev) => {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const updatedSteps = prev.runbook.steps.map((step) => {
        if (step.id === overrideModalStepId) {
          return {
            ...step,
            status: 'skipped_with_override' as const,
            completedAt: now,
            completedBy: `${effectiveRole.demoAccount.fullName} (${effectiveRole.id})`,
            overrideReason: overrideReasonInput.trim(),
          };
        }
        return step;
      });

      const newTimelineEvent = {
        id: `EVT-${Date.now()}`,
        timestamp: now,
        type: 'decision' as const,
        actorId: effectiveRole.id,
        actorName: effectiveRole.demoAccount.fullName,
        actorRole: language === 'es' ? effectiveRole.nameEs : effectiveRole.nameEn,
        description: language === 'es'
          ? `Paso ${overrideModalStepId} omitido con anulación justificada: "${overrideReasonInput.trim()}"`
          : `Step ${overrideModalStepId} skipped with formal override: "${overrideReasonInput.trim()}"`,
      };

      return {
        ...prev,
        runbook: { ...prev.runbook, steps: updatedSteps },
        timeline: [newTimelineEvent, ...prev.timeline],
      };
    });

    setOverrideModalStepId(null);
    setOverrideReasonInput('');
  };

  // Claim or transfer incident ownership
  const handleClaimCase = () => {
    setActiveCase((prev) => {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newClaimant = {
        userId: effectiveRole.demoAccount.username,
        fullName: effectiveRole.demoAccount.fullName,
        roleId: effectiveRole.id,
        roleName: effectiveRole.nameEs,
        claimedAt: now,
      };

      const newTimelineEvent = {
        id: `EVT-${Date.now()}`,
        timestamp: now,
        type: 'status_change' as const,
        actorId: effectiveRole.id,
        actorName: effectiveRole.demoAccount.fullName,
        actorRole: effectiveRole.nameEs,
        description: `Responsabilidad del incidente transferida a ${newClaimant.fullName} (${newClaimant.roleId})`,
      };

      return {
        ...prev,
        claimedBy: newClaimant,
        timeline: [newTimelineEvent, ...prev.timeline],
      };
    });
  };

  // Attempt to Close Case (Enforcing 9-Step Rule)
  const handleAttemptCloseCase = () => {
    if (!isAllChecklistSatisfied) {
      setAttemptedEarlyClose(true);
      return;
    }
    setIsSignoffModalOpen(true);
  };

  const handleConfirmFinalSignoff = () => {
    setActiveCase((prev) => {
      const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        ...prev,
        dimensions: {
          ...prev.dimensions,
          lifecycle: 'closed',
          operationalStatus: 'normal',
          resolution: 'signoff_complete',
        },
        timeline: [
          {
            id: `EVT-${Date.now()}`,
            timestamp: now,
            type: 'status_change',
            actorId: effectiveRole.id,
            actorName: effectiveRole.demoAccount.fullName,
            actorRole: effectiveRole.nameEs,
            description: `Incidente CERRADO Y RESUELTO formalmente por ${effectiveRole.demoAccount.fullName}. Expediente archivado en sistema legal CRTM.`,
          },
          ...prev.timeline,
        ],
      };
    });
    setIsSignoffModalOpen(false);
  };

  const handleResetRunbook = () => {
    setActiveCase(INITIAL_HERO_CASE);
    setAttemptedEarlyClose(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Case Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#161B22] p-4 md:p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#B42318] dark:text-[#FF6B6B] flex items-center justify-center font-bold">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-neutral-500">{activeCase.id}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-[#B42318] dark:text-[#FF6B6B] uppercase tracking-wide">
                {activeCase.severity.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] uppercase">
                {activeCase.dimensions.lifecycle.toUpperCase()}
              </span>
              {activeCase.dimensions.lifecycle === 'closed' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                  CERRADO
                </span>
              )}
            </div>
            <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
              {language === 'es' ? activeCase.titleEs : activeCase.titleEn}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {activeCase.primaryCorridor} · {activeCase.affectedLines.join(', ')} ·{' '}
              <strong className="text-neutral-700 dark:text-neutral-300">
                {activeCase.affectedPassengersCount.toLocaleString('es-ES')} {language === 'es' ? 'viajeros' : 'passengers'}
              </strong>
            </p>
          </div>
        </div>

        {/* Action Controls & SLA Remaining Clock */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>SLA: <strong>{activeCase.slaTimeRemainingMinutes}m restantes</strong></span>
          </div>

          {/* Claim / Ownership button */}
          <button
            onClick={handleClaimCase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-neutral-900 text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors shadow-xs"
            title="Reclamar o transferir la titularidad de este incidente a su rol actual"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#0071BB]" />
            <span>
              {activeCase.claimedBy?.roleId === effectiveRole.id
                ? `${language === 'es' ? 'Asignado a ti' : 'Assigned to you'} (${effectiveRole.id})`
                : `${language === 'es' ? 'Transferir a mí' : 'Transfer to me'} (${effectiveRole.id})`}
            </span>
          </button>

          {/* Export Incident Dossier Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-neutral-900 text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors shadow-xs"
            title={language === 'es' ? 'Exportar expediente y auditoría de la incidencia' : 'Export incident dossier and audit log'}
          >
            <Download className="w-3.5 h-3.5 text-[#0071BB] dark:text-[#5AAEE8]" />
            <span>{language === 'es' ? 'Exportar Expediente' : 'Export Dossier'}</span>
          </button>

          {/* Close Case Button (Enforces 9-step closure gate) */}
          <button
            onClick={handleAttemptCloseCase}
            disabled={activeCase.dimensions.lifecycle === 'closed'}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-xs ${
              isAllChecklistSatisfied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {activeCase.dimensions.lifecycle === 'closed'
                ? (language === 'es' ? 'Caso Cerrado' : 'Case Closed')
                : (language === 'es' ? 'Cerrar y Certificar Caso' : 'Close & Certify Case')}
            </span>
          </button>

          <button
            onClick={onBackToTower}
            className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            {language === 'es' ? 'Volver a Torre' : 'Back to Tower'}
          </button>
        </div>
      </div>

      {/* 5-Dimensional Incident State Indicator Bar (PRD Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">1. Ciclo de Vida</span>
          <span className="text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8] mt-0.5 block capitalize">
            {activeCase.dimensions.lifecycle}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">2. Urgencia</span>
          <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-0.5 block capitalize">
            {activeCase.dimensions.urgency}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">3. Fiabilidad</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block capitalize">
            {activeCase.dimensions.reliability} (SCADA 99%)
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">4. Estado Operativo</span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 block capitalize">
            {activeCase.dimensions.operationalStatus.replace('_', ' ')}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            {language === 'es' ? '5. Resolución' : '5. Resolution'}
          </span>
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-0.5 block capitalize">
            {activeCase.dimensions.resolution.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Early Close Attempt Warning Banner (Enforcing 9-step closure gate) */}
      {attemptedEarlyClose && !isAllChecklistSatisfied && (
        <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-700 dark:text-red-300 flex items-start gap-3 animate-in shake duration-300">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-red-900 dark:text-red-200">
              {language === 'es'
                ? 'Bloqueo de Seguridad Operativa: No se puede cerrar el caso'
                : 'Operational Safety Gate: Case cannot be closed'}
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              {language === 'es'
                ? `El protocolo CRTM exige completar estrictamente los 9 pasos del Runbook antes de autorizar el cierre formal. Actualmente hay ${9 - completedStepsCount} pasos pendientes. Puede completarlos o documentar una anulación justificada si tiene permisos de coordinador.`
                : `CRTM regulatory policy strictly requires all 9 Runbook steps to be completed or formally overridden before case closure. Currently ${9 - completedStepsCount} steps are pending.`}
            </p>
            <button
              onClick={() => setAttemptedEarlyClose(false)}
              className="mt-2 text-xs font-bold underline hover:text-red-950 cursor-pointer"
            >
              {language === 'es' ? 'Entendido, volver al checklist' : 'Understood, back to checklist'}
            </button>
          </div>
        </div>
      )}

      {/* Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveWorkspaceTab('runbook')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeWorkspaceTab === 'runbook'
              ? 'bg-[#0071BB] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>
            {language === 'es'
              ? `Checklist 9 Pasos (${completedStepsCount}/9)`
              : `9-Step Checklist (${completedStepsCount}/9)`}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('intermodal')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeWorkspaceTab === 'intermodal'
              ? 'bg-[#0071BB] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Protección Conexión Intermodal' : 'Intermodal Connection Hold'}</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('reinforcements')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeWorkspaceTab === 'reinforcements'
              ? 'bg-[#0071BB] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>
            {language === 'es'
              ? `Refuerzo Autobuses (${activeCase.reinforcements?.dispatchedBuses || 0} buses)`
              : `Bus Reinforcements (${activeCase.reinforcements?.dispatchedBuses || 0} buses)`}
          </span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('comms')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeWorkspaceTab === 'comms'
              ? 'bg-[#0071BB] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Mensajería al Pasajero' : 'Passenger Comms'}</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('timeline')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeWorkspaceTab === 'timeline'
              ? 'bg-[#0071BB] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>
            {language === 'es'
              ? `Cronología y Actores (${activeCase.timeline.length})`
              : `Timeline & Actors (${activeCase.timeline.length})`}
          </span>
        </button>
      </div>

      {/* Tab 1: 9-Step Runbook Checklist (Scene 4 Hero Path) */}
      {activeWorkspaceTab === 'runbook' && (
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
                  {activeCase.runbook.code}
                </span>
                <span className="text-xs font-bold text-neutral-400">·</span>
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {activeCase.runbook.name}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Protocolo operativo estandarizado con compuerta de cierre obligatoria. Todos los pasos deben ser completados o anulados con justificación.'
                  : 'Standardized operational protocol with mandatory completion gate. All steps must be fulfilled or formally overridden with justification.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                Progreso: <strong>{completedStepsCount}/9</strong>
              </span>
              <button
                onClick={handleResetRunbook}
                className="p-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                title="Reiniciar checklist a estado inicial de demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {activeCase.runbook.steps.map((step) => {
              const isDone = step.status === 'completed';
              const isOverridden = step.status === 'skipped_with_override';

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10'
                      : isOverridden
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isOverridden
                            ? 'bg-amber-500 text-white'
                            : 'border-2 border-neutral-300 dark:border-neutral-700 text-neutral-400'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : step.id}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                            {language === 'es' ? step.titleEs : step.titleEn}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            Rol: {step.actorRole}
                          </span>
                          {step.nonHumanActor && (
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]">
                              {step.nonHumanActor}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {language === 'es' ? step.descriptionEs : step.descriptionEn}
                        </p>

                        {step.evidenceNotes && (
                          <div className="text-[11px] text-neutral-500 bg-white/70 dark:bg-black/30 p-2 rounded-lg border border-[#DCE1E7]/60 dark:border-[#2B3440]/60 mt-1.5">
                            <strong>{language === 'es' ? 'Evidencia / Registro:' : 'Evidence:'}</strong> {step.evidenceNotes}
                          </div>
                        )}

                        {isOverridden && step.overrideReason && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                            {language === 'es'
                              ? `Anulación justificada: "${step.overrideReason}" (${step.completedBy} a las ${step.completedAt})`
                              : `Formal override: "${step.overrideReason}" (${step.completedBy} at ${step.completedAt})`}
                          </div>
                        )}

                        {isDone && step.completedAt && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>
                              {language === 'es'
                                ? `Completado a las ${step.completedAt} por ${step.completedBy}`
                                : `Completed at ${step.completedAt} by ${step.completedBy}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {!isDone && !isOverridden && (
                        <>
                          <button
                            onClick={() => handleExecuteStep(step.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
                          >
                            {language === 'es' ? 'Ejecutar y Validar' : 'Execute & Validate'}
                          </button>
                          <button
                            onClick={() => setOverrideModalStepId(step.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-medium cursor-pointer"
                            title={language === 'es' ? 'Anular con justificación de coordinador' : 'Override with coordinator justification'}
                          >
                            {language === 'es' ? 'Anular' : 'Override'}
                          </button>
                        </>
                      )}

                      {(isDone || isOverridden) && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'es' ? 'Verificado' : 'Verified'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Intermodal Connection Protection (Scene 4 & PRD Section 12) */}
      {activeWorkspaceTab === 'intermodal' && activeCase.intermodalConnection && (
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Protección de Conexión Intermodal: Retención de Autobús 352'
                : 'Intermodal Connection Protection: Bus 352 Hold'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'es'
                ? 'Arbitraje algorítmico multicriterio para decidir la retención temporal de la salida del autobús interurbano en el intercambiador de Atocha.'
                : 'Multi-criteria algorithmic arbitration to determine temporary departure holding of interurban bus at Atocha interchange.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/15 space-y-2">
              <span className="text-[10px] font-bold text-[#0071BB] dark:text-[#5AAEE8] uppercase">
                {language === 'es' ? 'Tren Alimentador' : 'Feeder Train'}
              </span>
              <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{activeCase.intermodalConnection.trainService}</p>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Demora de llegada a Atocha:' : 'Arrival delay at Atocha:'} <strong>+3m 40s</strong>
              </p>
              <div className="pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440] text-xs">
                {language === 'es'
                  ? <><strong>142 pasajeros</strong> en transbordo directo hacia la dársena de interurbanos.</>
                  : <><strong>142 passengers</strong> in direct transfer to interurban bus bays.</>}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/15 space-y-2">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                {language === 'es' ? 'Línea Conectora Retenida' : 'Held Connecting Line'}
              </span>
              <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{activeCase.intermodalConnection.targetBusLine}</p>
              <p className="text-[11px] text-neutral-500">
                {language === 'es' ? 'Tiempo de espera autorizado:' : 'Authorized holding window:'} <strong>+{activeCase.intermodalConnection.holdingMinutes} {language === 'es' ? 'minutos' : 'minutes'}</strong>
              </p>
              <div className="pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440] text-xs">
                {language === 'es'
                  ? <>Impacto aguas abajo: demora residual en ruta de solo <strong>38 segundos</strong> gracias a colchón de horario.</>
                  : <>Downstream impact: residual route delay of only <strong>38 seconds</strong> thanks to schedule slack.</>}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/15 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {language === 'es' ? 'Dictamen Algorítmico' : 'Algorithmic Verdict'}
                </span>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeCase.intermodalConnection.judgment}
                </p>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                  {language === 'es'
                    ? <>Beneficio neto ponderado: <strong>+142 viajeros atendidos</strong> vs coste estimado de 48€.</>
                    : <>Weighted net benefit: <strong>+142 passengers served</strong> vs estimated cost of 48€.</>}
                </p>
              </div>

              {activeCase.intermodalConnection.status === 'executed' ? (
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'es' ? 'Orden Ejecutada en SAE Embarcado' : 'Order Executed on On-Board CAD/AVL'}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleExecuteStep(5)}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {language === 'es' ? 'Autorizar Retención (4 min)' : 'Authorize Hold (4 min)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bus Reinforcements Dispatch */}
      {activeWorkspaceTab === 'reinforcements' && activeCase.reinforcements && (
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Servicio Especial de Refuerzo (Atocha - Méndez Álvaro)'
                  : 'Special Bus Replacement Service (Atocha - Méndez Álvaro)'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Despliegue de flota de reserva para suplir el tramo ferroviario interrumpido.'
                  : 'Reserve bus fleet deployment bridging the disrupted rail section.'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] capitalize">
              {language === 'es' ? 'Estado:' : 'Status:'} {activeCase.reinforcements.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                {language === 'es' ? 'Flota Requerida' : 'Fleet Required'}
              </span>
              <p className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
                {activeCase.reinforcements.requiredBuses} {language === 'es' ? 'autobuses' : 'buses'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                {language === 'es' ? 'Flota Asignada' : 'Fleet Assigned'}
              </span>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {activeCase.reinforcements.dispatchedBuses} {language === 'es' ? 'articulados' : 'articulated'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                {language === 'es' ? 'Cochera de Origen' : 'Origin Depot'}
              </span>
              <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-1">
                {activeCase.reinforcements.originDepot}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                {language === 'es' ? 'Tiempo de Llegada' : 'Arrival Time'}
              </span>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                {language === 'es' ? '8 min (Primera unidad)' : '8 min (First unit)'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-[#DCE1E7] dark:border-[#2B3440] text-xs space-y-1">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              {language === 'es' ? 'Unidades asignadas en red EMT:' : 'Units deployed across EMT network:'}
            </p>
            <p className="text-neutral-500 font-mono text-[11px]">
              {language === 'es' ? (
                <>
                  • Autobús SE-101 (Scania Articulado GNC) · Conductor: Manuel Prieto · Posición: Av. Ciudad de Barcelona<br />
                  • Autobús SE-102 (Mercedes Citaro) · Conductor: Elena Ruiz · Posición: Calle Comercio<br />
                  • Autobús SE-103 (Solaris Urbino Eléctrico) · Conductor: Carlos Vega · Posición: Méndez Álvaro<br />
                  • Autobús SE-104 (MAN Lion's City) · Conductor: Antonio López · Posición: Ronda de Atocha
                </>
              ) : (
                <>
                  • Bus SE-101 (Scania Articulated CNG) · Driver: Manuel Prieto · Location: Av. Ciudad de Barcelona<br />
                  • Bus SE-102 (Mercedes Citaro) · Driver: Elena Ruiz · Location: Calle Comercio<br />
                  • Bus SE-103 (Solaris Urbino Electric) · Driver: Carlos Vega · Location: Méndez Álvaro<br />
                  • Bus SE-104 (MAN Lion's City) · Driver: Antonio López · Location: Ronda de Atocha
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Passenger Communications */}
      {activeWorkspaceTab === 'comms' && activeCase.passengerCommunications && (
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Avisos Multicanal al Viajero en Tiempo Real'
                  : 'Real-Time Multichannel Passenger Notices'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Mensaje sincronizado en pantallas de andén (PIS), megafonía, App CITRAM y Redes Sociales.'
                  : 'Synchronized notices across platform screens (PIS), PA audio, CITRAM App, and Social Media.'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
              {activeCase.passengerCommunications.status}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/60 dark:bg-neutral-900/40 space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">
              {language === 'es' ? 'Canales de Difusión Conectados' : 'Connected Broadcast Channels'}
            </span>
            <div className="flex flex-wrap gap-2">
              {activeCase.passengerCommunications.channels.map((ch, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                  {ch}
                </span>
              ))}
            </div>

            <div className="pt-3 space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">
                {language === 'es' ? 'Texto Difundido (Castellano / English)' : 'Broadcast Message (Spanish / English)'}
              </span>
              <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] text-xs space-y-1">
                <p className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  📢 {activeCase.passengerCommunications.headlineEs}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {activeCase.passengerCommunications.bodyEs}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] text-xs space-y-1">
                <p className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  📢 {activeCase.passengerCommunications.headlineEn}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {activeCase.passengerCommunications.bodyEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Timeline & Audit Trail */}
      {activeWorkspaceTab === 'timeline' && (
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Cronología de Eventos y Auditoría Operativa' : 'Event Timeline & Operational Audit'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'es'
                ? 'Registro inmutable de decisiones, telemetría y comunicaciones del caso.'
                : 'Immutable audit log of decisions, telemetry, and case communications.'}
            </p>
          </div>

          <div className="space-y-3">
            {activeCase.timeline.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-400">{evt.timestamp}</span>
                    <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{evt.actorName}</span>
                    <span className="text-[10px] text-neutral-500">({evt.actorRole})</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">{evt.description}</p>
                </div>

                {evt.dataBadge && (
                  <button
                    onClick={() => onOpenTrustDrawer(evt.dataBadge?.sourceName || (language === 'es' ? 'Telemetría' : 'Telemetry'))}
                    className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {evt.dataBadge.type} ({evt.dataBadge.confidenceScore}%)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Override Justification Modal */}
      {overrideModalStepId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#161B22] rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'es' ? 'Anulación Justificada de Paso del Runbook' : 'Formal Runbook Step Override'}</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'es'
                  ? 'La política CRTM exige una justificación operativa válida para omitir cualquier paso antes del cierre del caso.'
                  : 'CRTM regulatory policy strictly requires an operational justification to skip any step prior to case closure.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                {language === 'es' ? 'Motivo / Causa de la Excepción:' : 'Reason / Exception Justification:'}
              </label>
              <textarea
                value={overrideReasonInput}
                onChange={(e) => setOverrideReasonInput(e.target.value)}
                placeholder={language === 'es' ? 'Ejemplo: No aplicable porque el corte de vía no afectó a andenes PMR...' : 'Example: Not applicable as track outage did not affect PRM platforms...'}
                className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-2 focus:ring-[#0071BB]"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440]">
              <button
                onClick={() => setOverrideModalStepId(null)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium cursor-pointer"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmOverride}
                disabled={!overrideReasonInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {language === 'es' ? 'Firmar Anulación' : 'Sign Override'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formal Signoff Modal */}
      {isSignoffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#161B22] rounded-2xl border border-emerald-500/40 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Certificación y Cierre Legal del Incidente' : 'Incident Certification & Legal Closure'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'es'
                    ? 'Todos los 9 pasos del Runbook han sido satisfechos formalmente.'
                    : 'All 9 Runbook steps have been formally satisfied.'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] text-xs space-y-1">
              <p><strong>{language === 'es' ? 'Expediente:' : 'Dossier:'}</strong> CRTM-INC-2026-0929-ATO</p>
              <p><strong>{language === 'es' ? 'Coordinador Certificador:' : 'Certifying Coordinator:'}</strong> {effectiveRole.demoAccount.fullName} ({effectiveRole.id})</p>
              <p><strong>{language === 'es' ? 'Afectación Final:' : 'Final Impact:'}</strong> {language === 'es' ? '4.320 viajeros · Cumplimiento de SLA: 100%' : '4,320 passengers · 100% SLA Compliance'}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                {language === 'es' ? 'Observaciones Finales para el Acta de Auditoría:' : 'Final Observations for Audit Minutes:'}
              </label>
              <textarea
                value={signoffNotes}
                onChange={(e) => setSignoffNotes(e.target.value)}
                placeholder={language === 'es' ? 'Incidente resuelto conforme al plan de contingencia intermodal sin heridos ni daños materiales colaterales.' : 'Incident resolved in compliance with the intermodal contingency plan with no injuries or collateral damage.'}
                className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE1E7] dark:border-[#2B3440]">
              <button
                onClick={() => setIsSignoffModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium cursor-pointer"
              >
                {language === 'es' ? 'Volver a Revisar' : 'Review Again'}
              </button>
              <button
                onClick={handleConfirmFinalSignoff}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {language === 'es' ? 'Confirmar y Archivar Caso' : 'Confirm & Archive Case'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Incident Dossier & Logs Modal */}
      <ExportIncidentLogsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        incidentCase={activeCase}
      />
    </div>
  );
};
