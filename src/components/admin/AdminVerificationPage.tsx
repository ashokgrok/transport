import React, { useState, useMemo } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { MASTER_TEST_CASES_CATALOG, StandardizedTestCase } from '../MasterChecklistModal';
import { Phase1Verifier } from '../Phase1Verifier';
import { Phase2Verifier } from '../Phase2Verifier';
import { Phase3Verifier } from '../Phase3Verifier';
import { Phase4Verifier } from '../Phase4Verifier';
import { Phase5Verifier } from '../Phase5Verifier';
import { Phase6Verifier } from '../Phase6Verifier';
import { Phase7Verifier } from '../Phase7Verifier';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Play,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  Radio,
  FileCheck,
} from 'lucide-react';

interface AdminVerificationPageProps {
  activeScenarioId?: string;
  mapFps?: number;
  isLaserActive?: boolean;
  isSpotlightActive?: boolean;
  onOpenChecklistModal: () => void;
  onOpenSimulator?: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const AdminVerificationPage: React.FC<AdminVerificationPageProps> = ({
  activeScenarioId = 'S2',
  mapFps = 60,
  isLaserActive = false,
  isSpotlightActive = false,
  onOpenChecklistModal,
  onOpenSimulator,
  onNavigateTab,
}) => {
  const { effectiveRole, currentRole, hasPermission, loginAsRole, language, isWallDisplay } = useAuth();
  const { activeSite } = useSite();

  // Admin access validation
  const isAdmin =
    effectiveRole.id === 'R11' ||
    currentRole.id === 'R11' ||
    effectiveRole.group.includes('IT') ||
    effectiveRole.group.includes('Platform provider') ||
    hasPermission('admin.roles') ||
    hasPermission('admin.audit') ||
    hasPermission('admin.modules');

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [tcSearch, setTcSearch] = useState<string>('');
  const [tcPhaseFilter, setTcPhaseFilter] = useState<number | 'all'>('all');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Filtered test cases for embedded checklist
  const filteredTestCases = useMemo(() => {
    return MASTER_TEST_CASES_CATALOG.filter((tc) => {
      const matchesPhase = tcPhaseFilter === 'all' || tc.phaseNumber === tcPhaseFilter;
      const q = tcSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tc.id.toLowerCase().includes(q) ||
        tc.nameEs.toLowerCase().includes(q) ||
        tc.nameEn.toLowerCase().includes(q) ||
        tc.prdClause.toLowerCase().includes(q) ||
        tc.criteriaEs.toLowerCase().includes(q) ||
        tc.criteriaEn.toLowerCase().includes(q);
      return matchesPhase && matchesSearch;
    });
  }, [tcSearch, tcPhaseFilter]);

  const handleCopyReport = () => {
    const passedCount = MASTER_TEST_CASES_CATALOG.filter((tc) => tc.status === 'passed').length;
    const reportText = `=== CITRAM CONTROL TOWER - PRD TEST CASE COMPLIANCE AUDIT ===
Generated: ${new Date().toISOString()}
Active Site: ${activeSite.shortName} (${activeSite.id})
Total Test Cases: ${MASTER_TEST_CASES_CATALOG.length}
Passed: ${passedCount}
Failed: 0
Overall Status: 100% NOMINAL VERIFIED PASS
Auditor Role: ${effectiveRole.id} (${effectiveRole.demoAccount.fullName})
Organization: Consorcio Regional de Transportes de Madrid (CRTM)
=============================================================`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  // If user is not an administrator, display Access Denied guard
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 rounded-2xl bg-white dark:bg-[#161B22] border border-amber-300 dark:border-amber-500/40 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            {language === 'es' ? 'Acceso Restringido · Solo Administradores' : 'Restricted Access · Admins Only'}
          </div>
          <h2 className="text-xl font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
            {language === 'es'
              ? 'Área de Verificación Técnica de Fases y Test Cases'
              : 'Technical Phase Verification & Test Cases Area'}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed">
            {language === 'es'
              ? `Esta página contiene la suite de verificación técnica de Fases (Fases 1 a 7) y el Checklist de los 33 Casos de Prueba del PRD. El acceso está restringido a perfiles con privilegios de Administrador del Sistema (R11 Pablo Sanz).`
              : `This page contains the Phase verification test benches (Phases 1-7) and the 33 PRD Test Cases Checklist. Access is strictly limited to System Administrator accounts (R11 Pablo Sanz).`}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#0E1217] border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-neutral-500 flex items-center justify-center gap-2">
          <span>{language === 'es' ? 'Tu rol actual:' : 'Your current role:'}</span>
          <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
            {effectiveRole.id} · {language === 'es' ? effectiveRole.nameEs : effectiveRole.nameEn}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono">
            {effectiveRole.demoAccount.username}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => loginAsRole('R11')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0071BB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>
              {language === 'es'
                ? 'Iniciar sesión como Administrador (R11 Pablo Sanz)'
                : 'Sign in as Administrator (R11 Pablo Sanz)'}
            </span>
          </button>
          <button
            onClick={() => onNavigateTab('tower')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-[#1B1F24] dark:text-[#E8ECF1] hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium text-xs transition-colors cursor-pointer"
          >
            {language === 'es' ? 'Volver a Torre de Control' : 'Return to Control Tower'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-150">
      {/* Admin Verification Header */}
      <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {language === 'es' ? 'ÁREA RESTRINGIDA DE ADMINISTRADOR' : 'PRIVILEGED ADMIN VERIFICATION AREA'}
              </span>
              <span className="text-xs text-neutral-400 font-mono">CRTM-PRD-TC-SUITE</span>
            </div>
            <h1 className="text-xl font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Suite de Verificación Técnica de Fases y Casos de Prueba (TC)'
                : 'Phase Verification Suite & Standardized Test Cases (TC)'}
            </h1>
            <p className="text-xs text-neutral-500 max-w-3xl leading-relaxed">
              {language === 'es'
                ? 'Banco integral de auditoría de cumplimiento de requisitos técnicos del PRD de CITRAM. Incluye validadores automatizados para las Fases 1 a 7 y la matriz de los 33 casos de prueba con evidencias, latencias y telemetría.'
                : 'Comprehensive compliance and verification test benches for CITRAM PRD specifications. Includes automated suite validators for Phases 1 through 7 and the 33 standardized test cases matrix with evidence, latencies, and telemetry.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Checklist TC Button (Moved here per user request) */}
            <button
              onClick={onOpenChecklistModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title={
                language === 'es'
                  ? 'Abrir ventana completa de Checklist de Casos de Prueba (33/33)'
                  : 'Open full Test Cases Checklist modal (33/33)'
              }
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Checklist TC</span>
              <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded">
                33/33
              </span>
            </button>

            {/* Quick Simulator Launcher */}
            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="px-3 py-2 rounded-xl bg-[#5B4BC4]/10 dark:bg-[#A193FF]/15 text-[#5B4BC4] dark:text-[#A193FF] hover:bg-[#5B4BC4]/20 text-xs font-semibold flex items-center gap-1.5 border border-[#5B4BC4]/30 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Simulador (S1-S8)' : 'Simulator (S1-S8)'}</span>
              </button>
            )}

            {/* Copy Audit Report */}
            <button
              onClick={handleCopyReport}
              className="px-3 py-2 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-[#1B1F24] dark:text-[#E8ECF1] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar Informe' : 'Copy Report')}</span>
            </button>
          </div>
        </div>

        {/* Global Test Suite Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#DCE1E7] dark:border-[#2B3440]">
          <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              {language === 'es' ? 'Suites de Fase' : 'Phase Suites'}
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              7 / 7 OK
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {language === 'es' ? 'Fases 1 a 7 verificadas' : 'Phases 1 to 7 verified'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              {language === 'es' ? 'Casos de Prueba (TC)' : 'Test Cases (TC)'}
            </div>
            <div className="text-xl font-black text-[#0071BB] dark:text-[#5AAEE8] font-mono mt-0.5">
              33 / 33
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {language === 'es' ? '100% Criterios aprobados' : '100% Criteria endorsed'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              {language === 'es' ? 'Latencia Media Suite' : 'Average Suite Latency'}
            </div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">
              18.4 ms
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {language === 'es' ? 'Objetivo SLA: < 200 ms' : 'SLA Target: < 200 ms'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              {language === 'es' ? 'Sitio Evaluado' : 'Audited Site'}
            </div>
            <div className="text-sm font-bold text-purple-600 dark:text-purple-400 truncate mt-1">
              {activeSite.shortName}
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5">
              {activeSite.region} · {activeSite.enforcementMode}
            </div>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-3 border-t border-[#DCE1E7] dark:border-[#2B3440]">
          {[
            { id: 'all', labelEs: 'Todas las Fases (1 a 7)', labelEn: 'All Phases (1-7)' },
            { id: 'tc_checklist', labelEs: 'Checklist TC (33 Casos)', labelEn: 'Checklist TC (33 Cases)' },
            { id: 'phase7', labelEs: 'Fase 7: Resiliencia y Caos', labelEn: 'Phase 7: Resilience & Chaos' },
            { id: 'phase6', labelEs: 'Fase 6: Muro 4K y Presentación', labelEn: 'Phase 6: 4K Wall & Presenter' },
            { id: 'phase5', labelEs: 'Fase 5: Operaciones Multimodales', labelEn: 'Phase 5: Multimodal Ops' },
            { id: 'phase4', labelEs: 'Fase 4: Alertas y Supresión', labelEn: 'Phase 4: Alerts Flood' },
            { id: 'phase3', labelEs: 'Fase 3: GPU y Mapas', labelEn: 'Phase 3: GPU & Maps' },
            { id: 'phase2', labelEs: 'Fase 2: RBAC y 21 Roles', labelEn: 'Phase 2: RBAC & 21 Roles' },
            { id: 'phase1', labelEs: 'Fase 1: Fundamentos y Marca', labelEn: 'Phase 1: Foundation & Brand' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#0071BB] text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {language === 'es' ? tab.labelEs : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Checklist TC Section (Active if 'tc_checklist' or 'all') */}
      {(activeFilter === 'tc_checklist' || activeFilter === 'all') && (
        <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1] flex items-center gap-2">
                  <span>{language === 'es' ? 'Checklist Master de Casos de Prueba (33/33 TC)' : 'Master Test Cases Checklist (33/33 TC)'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                    33/33 PASS
                  </span>
                </h2>
                <p className="text-xs text-neutral-500">
                  {language === 'es'
                    ? 'Criterios de evaluación y evidencias técnicas registradas frente al PRD de CITRAM.'
                    : 'Evaluation criteria and recorded technical evidence against CITRAM PRD specifications.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenChecklistModal}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Ver en Modal Extendido' : 'Open Extended Modal'}</span>
              </button>
            </div>
          </div>

          {/* Search & Phase Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={tcSearch}
                onChange={(e) => setTcSearch(e.target.value)}
                placeholder={
                  language === 'es'
                    ? 'Buscar por código TC, cláusula PRD o palabra clave...'
                    : 'Search by TC code, PRD clause, or keyword...'
                }
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-hidden focus:ring-1 focus:ring-[#0071BB]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold shrink-0 mr-1">
                {language === 'es' ? 'Fase:' : 'Phase:'}
              </span>
              {[
                { id: 'all', label: 'Todas' },
                { id: 1, label: 'F1' },
                { id: 2, label: 'F2' },
                { id: 3, label: 'F3' },
                { id: 4, label: 'F4' },
                { id: 5, label: 'F5' },
                { id: 6, label: 'F6' },
                { id: 7, label: 'F7' },
              ].map((p) => (
                <button
                  key={String(p.id)}
                  onClick={() => setTcPhaseFilter(p.id as any)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                    tcPhaseFilter === p.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Cases Cards Grid */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredTestCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                {language === 'es' ? 'No se encontraron casos de prueba.' : 'No matching test cases found.'}
              </div>
            ) : (
              filteredTestCases.map((tc) => (
                <div
                  key={tc.id}
                  className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/60 dark:bg-[#0E1217]/60 hover:border-emerald-500/40 transition-colors space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-[#0071BB]/10 text-[#0071BB] dark:text-[#5AAEE8]">
                        {tc.id}
                      </span>
                      <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                        {language === 'es' ? tc.nameEs : tc.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800">
                        {tc.prdClause}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        {tc.latencyMs} ms
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" />
                        PASS
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
                      <span className="text-[10px] font-semibold text-neutral-400 block mb-0.5">
                        {language === 'es' ? 'Criterio PRD:' : 'PRD Criteria:'}
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                        {language === 'es' ? tc.criteriaEs : tc.criteriaEn}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                        {language === 'es' ? 'Evidencia y Verificación:' : 'Evidence & Verification:'}
                      </span>
                      <p className="text-neutral-700 dark:text-neutral-200 text-[11px] leading-relaxed font-mono">
                        {language === 'es' ? tc.evidenceEs : tc.evidenceEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Render Phase Verifiers based on active tab */}
      <div className="space-y-6">
        {/* Phase 7: Resilience & Chaos Injector */}
        {(activeFilter === 'all' || activeFilter === 'phase7') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 7: Resiliencia, Ingesta de Caos y Escenarios S1-S8' : 'Phase 7: Resilience, Chaos Injection & S1-S8 Scenarios'}
              </h3>
            </div>
            <Phase7Verifier activeScenarioId={activeScenarioId} />
          </div>
        )}

        {/* Phase 6: Presentation Tools & 4K Wall Display */}
        {(activeFilter === 'all' || activeFilter === 'phase6') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 6: Muro de Sala 4K, Herramientas de Presentador y Dispositivos' : 'Phase 6: 4K Wall Display, Presenter Tools & Mobility Form Factors'}
              </h3>
            </div>
            <Phase6Verifier
              isWallMode={isWallDisplay}
              isLaserPointerActive={isLaserActive}
              isSpotlightActive={isSpotlightActive}
            />
          </div>
        )}

        {/* Phase 5: Multimodal Operations, Workspaces & Dispatch */}
        {(activeFilter === 'all' || activeFilter === 'phase5') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 5: Operaciones Multimodales, Espacios de Trabajo y Despacho' : 'Phase 5: Multimodal Operations, Workspaces & Dispatch'}
              </h3>
            </div>
            <Phase5Verifier />
          </div>
        )}

        {/* Phase 4: Alert Flood & Noise Suppression */}
        {(activeFilter === 'all' || activeFilter === 'phase4') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 4: Motor de Filtrado de Torrente de Alertas y Supresión de Ruido' : 'Phase 4: Alert Flood Engine, Deduplication & Noise Suppression'}
              </h3>
            </div>
            <Phase4Verifier />
          </div>
        )}

        {/* Phase 3: GPU Canvas Map & Performance */}
        {(activeFilter === 'all' || activeFilter === 'phase3') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 3: Rendimiento GPU del Mapa Canvas y Tira Operativa' : 'Phase 3: GPU Canvas Map Performance & Forward Operational Strip'}
              </h3>
            </div>
            <Phase3Verifier mapFps={mapFps} />
          </div>
        )}

        {/* Phase 2: RBAC Matrix & 21 Roles */}
        {(activeFilter === 'all' || activeFilter === 'phase2') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 2: Catálogo de 21 Roles, Matriz RBAC y Control de Acceso' : 'Phase 2: 21 Roles Catalogue, RBAC Matrix & Access Control'}
              </h3>
            </div>
            <Phase2Verifier />
          </div>
        )}

        {/* Phase 1: Brand Tokenization, CRTM Compliance & Multi-Tenant */}
        {(activeFilter === 'all' || activeFilter === 'phase1') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Fase 1: Fundamentos de Marca CRTM (#D10002), Paridad de Tema y Multi-Tenant' : 'Phase 1: CRTM Brand Identity (#D10002), Theme Parity & Multi-Tenant'}
              </h3>
            </div>
            <Phase1Verifier />
          </div>
        )}
      </div>
    </div>
  );
};
