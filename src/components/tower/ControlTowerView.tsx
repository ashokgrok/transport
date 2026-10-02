import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import { MadridCanvasMap, MapLayerPreset } from './MadridCanvasMap';
import { FocusModePanel } from './FocusModePanel';
import { ExploreModePanel } from './ExploreModePanel';
import { SinceYouLastLookedDrawer } from './SinceYouLastLookedDrawer';
import { KpiSummary } from './KpiSummary';
import { InterchangeHub } from '../../data/madridNetworkData';
import { getSiteDecisionCards, getSiteLookaheadEvents } from '../../data/multiSiteData';
import { DecisionCardItem } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Compass,
  CheckCircle2,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  History,
} from 'lucide-react';

interface ControlTowerViewProps {
  onOpenCase: (caseId: string) => void;
  onOpenTrustDrawer: (metricTitle: string) => void;
  onFpsUpdate?: (fps: number) => void;
}

export const ControlTowerView: React.FC<ControlTowerViewProps> = ({
  onOpenCase,
  onOpenTrustDrawer,
  onFpsUpdate,
}) => {
  const { language, effectiveRole } = useAuth();
  const { activeSite } = useSite();

  const [activeLayer, setActiveLayer] = useState<MapLayerPreset>('calm');
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSinceLastLookedOpen, setIsSinceLastLookedOpen] = useState(false);
  const [isAllClearMode, setIsAllClearMode] = useState(false); // CTW-07 toggle
  const [focusedEntity, setFocusedEntity] = useState<{
    type: 'incident' | 'hub' | 'line';
    id: string;
    title: string;
    hubData?: InterchangeHub;
  } | null>(null);

  // Simulated decision cards (PRD CTW-01: max decision cards ordered by urgency)
  const decisionCards: DecisionCardItem[] = getSiteDecisionCards(activeSite.id, language as 'es' | 'en');
  const lookaheadEvents = getSiteLookaheadEvents(activeSite.id, language as 'es' | 'en');

  return (
    <div className="space-y-4">
      {/* Top KPI Summary Component (Real-Time System Metrics: Incidents Active, Average Latency, System Health Score) */}
      <KpiSummary
        isAllClearMode={isAllClearMode}
        onOpenCase={onOpenCase}
        onOpenTrustDrawer={onOpenTrustDrawer}
      />

      {/* Auxiliary Bar: Delta Summary Trigger (CTW-08) & All-Clear Toggle (CTW-07) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSinceLastLookedOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-[#0071BB] dark:text-[#5AAEE8] hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>{t('tower.since_last', language)}</span>
          </button>

          {/* All-Clear State Toggle for Rehearsal (CTW-07) */}
          <button
            onClick={() => setIsAllClearMode(!isAllClearMode)}
            className={`px-3 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              isAllClearMode
                ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                : 'border-[#DCE1E7] dark:border-[#2B3440] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-[#161B22] hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            {isAllClearMode ? '✓ Vista Todo Despejado (All-Clear)' : 'Probar Estado Despejado (CTW-07)'}
          </button>
        </div>

        {/* Explore Mode Modal Trigger (CTW-11) */}
        <button
          onClick={() => setIsExploreOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('tower.explore_toggle', language)} (CTW-11)</span>
        </button>
      </div>

      {/* Main Grid: Decision Cards (Left) & Canvas Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Decision Cards (Ordered by Urgency) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {language === 'es' ? 'Decisiones Prioritarias (Orden por Urgencia)' : 'Top Priority Decisions'}
            </h3>
            <span className="text-[11px] text-neutral-400">
              {isAllClearMode ? '0' : decisionCards.length} {language === 'es' ? 'de' : 'of'} {activeSite.maxDecisionCards} {language === 'es' ? 'máx' : 'max'}
            </span>
          </div>

          {/* Designed All-Clear State (PRD CTW-07) */}
          {isAllClearMode ? (
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                  {t('tower.all_clear.title', language)}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  {t('tower.all_clear.desc', language)}
                </p>
              </div>
              <div className="pt-3 border-t border-emerald-500/20 text-left text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                  {t('tower.all_clear.next', language)}:
                </span>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{language === 'es' ? 'Relevo de turno sala CITRAM' : 'CITRAM room shift handover'}</span>
                  <span className="font-mono">14:00</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>{language === 'es' ? 'Mantenimiento preventivo catenaria C-5' : 'Preventive catenary maintenance C-5'}</span>
                  <span className="font-mono">01:30</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {decisionCards.map((card) => {
                const isCrit = card.severity === 'critical';
                return (
                  <div
                    key={card.id}
                    className={`p-4 rounded-xl border bg-white dark:bg-[#161B22] shadow-xs transition-all ${
                      isCrit
                        ? 'border-[#B42318]/40 dark:border-[#FF6B6B]/40 ring-1 ring-[#B42318]/20'
                        : 'border-[#DCE1E7] dark:border-[#2B3440]'
                    }`}
                  >
                    {/* Card Header: Severity & Clock */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isCrit
                              ? 'bg-[#B42318]/10 text-[#B42318] dark:text-[#FF6B6B]'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {card.severity}
                        </span>
                        <span className="text-xs font-mono font-medium text-neutral-500">
                          {card.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#B54708] dark:text-[#F5A34B] tabular-numbers">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{card.timeLeftMinutes}:00 {language === 'es' ? 'min restante' : 'min remaining'}</span>
                      </div>
                    </div>

                    {/* Title & What Happened */}
                    <h4 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {card.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {card.whatHappened}
                    </p>

                    {/* Impact */}
                    <div className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/60 p-2 rounded-lg border border-neutral-200/60 dark:border-neutral-800">
                      <span className="font-semibold text-neutral-500 text-[10px] block uppercase">
                        {language === 'es' ? 'Impacto Estimado:' : 'Estimated Impact:'}
                      </span>
                      {card.impact}
                    </div>

                    {/* AI Recommended Next Best Action */}
                    <div className="mt-2.5 p-2.5 rounded-lg bg-[#5B4BC4]/5 dark:bg-[#A193FF]/10 border border-[#5B4BC4]/20">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5B4BC4] dark:text-[#A193FF] mb-1">
                        <span>IA Next Best Action:</span>
                      </div>
                      <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                        {card.recommendedAction}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 italic">
                        {language === 'es' ? 'Motivo:' : 'Reason:'} {card.reason}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        {card.affectedLines.map((line) => (
                          <span
                            key={line}
                            className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          >
                            {line}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => onOpenCase(card.id)}
                        className="px-3.5 py-1.5 bg-[#0071BB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <span>{card.primaryActionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: High-Performance GPU Canvas Map */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Map Controls Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-neutral-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {language === 'es'
                  ? `Cartografía Operativa Regional (${activeSite.city || activeSite.shortName})`
                  : `${activeSite.city || activeSite.shortName} Regional Operational Map`}
              </h3>
            </div>

            {/* Layer Presets (PRD CTW-05: Calm, Operations, Interchanges, Everything) */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440]">
              {(['calm', 'ops', 'interchanges', 'everything'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded-md capitalize cursor-pointer transition-colors ${
                    activeLayer === layer
                      ? 'bg-white dark:bg-neutral-900 text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Vector Canvas Map */}
          <MadridCanvasMap
            layerPreset={activeLayer}
            onSelectIncident={(id) => {
              const matchedCard = decisionCards.find((c) => c.id === id);
              setFocusedEntity({
                type: 'incident',
                id,
                title: matchedCard?.title || (language === 'es' ? 'Incidencia Crítica Declarada' : 'Critical Incident Declared'),
              });
            }}
            onSelectInterchange={(hub) => {
              setFocusedEntity({
                type: 'hub',
                id: hub.code,
                title: hub.name,
                hubData: hub,
              });
            }}
            onFpsUpdate={onFpsUpdate}
          />

          {/* 60-Minute Forward Strip (PRD CTW-01) */}
          <div className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-2">
              <span>{language === 'es' ? 'Tira de Previsión Operativa (+60 minutos)' : '60-Minute Lookahead Strip'}</span>
              <span className="text-[10px] text-neutral-400">08:00 - 09:00 {language === 'es' ? 'Hora Punta' : 'Peak Hour'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {lookaheadEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="font-mono text-[10px] text-neutral-400">{evt.time}</div>
                  <div
                    className={`font-bold mt-0.5 ${
                      evt.severity === 'critical'
                        ? 'text-red-600 dark:text-red-400'
                        : evt.severity === 'warning'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {evt.title}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate" title={evt.subtitle}>
                    {evt.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Focus Mode Slide-Over Panel (CTW-10) */}
      <FocusModePanel
        focusedEntity={focusedEntity}
        onClose={() => setFocusedEntity(null)}
        onOpenCase={(id) => onOpenCase(id)}
      />

      {/* Explore Mode Full Screen Modal (CTW-11) */}
      <ExploreModePanel
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
      />

      {/* "Since You Last Looked" Drawer (CTW-08) */}
      <SinceYouLastLookedDrawer
        isOpen={isSinceLastLookedOpen}
        onClose={() => setIsSinceLastLookedOpen(false)}
        onOpenCase={(id) => onOpenCase(id)}
      />
    </div>
  );
};
