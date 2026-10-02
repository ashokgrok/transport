import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import {
  X,
  Sliders,
  Bell,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Activity,
  Flame,
  BrainCircuit,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface KpiThresholds {
  maxLatencyWarning: number; // in ms
  maxLatencyCritical: number; // in ms
  maxIncidentsWarning: number;
  maxIncidentsCritical: number;
  minHealthWarning: number; // in %
  minHealthCritical: number; // in %
}

export const DEFAULT_KPI_THRESHOLDS: KpiThresholds = {
  maxLatencyWarning: 35,
  maxLatencyCritical: 50,
  maxIncidentsWarning: 3,
  maxIncidentsCritical: 5,
  minHealthWarning: 99.8,
  minHealthCritical: 99.0,
};

export interface ThresholdAlertEvent {
  id: string;
  metric: 'latency' | 'incidents' | 'health';
  severity: 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface PredictiveAlert {
  id: string;
  horizonMinutes: number;
  predictedTime: string;
  metric: 'crowd' | 'latency' | 'intermodal';
  severity: 'warning' | 'critical';
  confidence: number;
  titleEs: string;
  titleEn: string;
  messageEs: string;
  messageEn: string;
  mitigationRecommendationEs: string;
  mitigationRecommendationEn: string;
  mitigationActionLabelEs: string;
  mitigationActionLabelEn: string;
  status: 'pending' | 'mitigated';
}

export const INITIAL_PREDICTIVE_ALERTS: PredictiveAlert[] = [
  {
    id: 'PRED-01',
    horizonMinutes: 15,
    predictedTime: '08:50',
    metric: 'crowd',
    severity: 'critical',
    confidence: 94.2,
    titleEs: 'Saturación de Andén Prevista en Vías 3-4 Atocha (+15m)',
    titleEn: 'Projected Platform Saturation on Tracks 3-4 Atocha (+15m)',
    messageEs: 'La demanda de viajeros superará el 85% de capacidad de andén en 15 minutos debido al retraso acumulado del convoy C-3.',
    messageEn: 'Passenger demand will exceed 85% platform capacity in 15 minutes due to accumulated delay on train C-3.',
    mitigationRecommendationEs: 'Despachar 6 autobuses lanzadera EMT desde Fuencarral para aliviar el andén.',
    mitigationRecommendationEn: 'Dispatch 6 EMT shuttle buses from Fuencarral depot to relieve platform crowd.',
    mitigationActionLabelEs: 'Despachar Lanzaderas EMT',
    mitigationActionLabelEn: 'Dispatch EMT Shuttles',
    status: 'pending',
  },
  {
    id: 'PRED-02',
    horizonMinutes: 25,
    predictedTime: '09:00',
    metric: 'latency',
    severity: 'warning',
    confidence: 91.5,
    titleEs: 'Riesgo de Cuello de Botella SIRI en Chamartín (+25m)',
    titleEn: 'Risk of SIRI Bottleneck at Chamartín (+25m)',
    messageEs: 'Tráfico de telemetría proyecta un pico de 44ms de latencia por concurrencia en la cabecera norte.',
    messageEn: 'Telemetry traffic projects a 44ms latency spike due to northern terminal concurrency.',
    mitigationRecommendationEs: 'Activar particionado y balanceo en concentrador Kafka N05.',
    mitigationRecommendationEn: 'Enable partitioning and balancing on Kafka collector N05.',
    mitigationActionLabelEs: 'Activar Particionado N05',
    mitigationActionLabelEn: 'Activate N05 Partitioning',
    status: 'pending',
  },
  {
    id: 'PRED-03',
    horizonMinutes: 40,
    predictedTime: '09:15',
    metric: 'intermodal',
    severity: 'warning',
    confidence: 89.0,
    titleEs: 'Riesgo de Rotura de Enlace Intermodal en Sol (+40m)',
    titleEn: 'Risk of Intermodal Transfer Breakage at Sol (+40m)',
    messageEs: 'Ventana de trasbordo entre Metro L1 y L3 se reducirá a menos de 90 segundos para 850 pasajeros.',
    messageEn: 'Transfer window between Metro L1 and L3 will narrow to under 90 seconds for 850 passengers.',
    mitigationRecommendationEs: 'Emitir orden de retención preventiva de 180s al convoy 1142.',
    mitigationRecommendationEn: 'Issue preventive 180s holding order to convoy 1142.',
    mitigationActionLabelEs: 'Retener Convoy 1142 (+180s)',
    mitigationActionLabelEn: 'Hold Convoy 1142 (+180s)',
    status: 'pending',
  },
];

interface ThresholdAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholds: KpiThresholds;
  onSaveThresholds: (newThresholds: KpiThresholds) => void;
  activeAlerts: ThresholdAlertEvent[];
  onAcknowledgeAlert: (alertId: string) => void;
  onSimulateAlert: () => void;
  initialTab?: 'config' | 'predictive' | 'history';
}

export const ThresholdAlertsModal: React.FC<ThresholdAlertsModalProps> = ({
  isOpen,
  onClose,
  thresholds,
  onSaveThresholds,
  activeAlerts,
  onAcknowledgeAlert,
  onSimulateAlert,
  initialTab = 'config',
}) => {
  const { language } = useAuth();

  const [formValues, setFormValues] = useState<KpiThresholds>(thresholds);
  const [activeTab, setActiveTab] = useState<'config' | 'predictive' | 'history'>(initialTab);
  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>(INITIAL_PREDICTIVE_ALERTS);

  const handleMitigatePredictiveAlert = (alertId: string) => {
    setPredictiveAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'mitigated' } : a))
    );
  };

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    setFormValues(DEFAULT_KPI_THRESHOLDS);
    onSaveThresholds(DEFAULT_KPI_THRESHOLDS);
  };

  const handleSave = () => {
    onSaveThresholds(formValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DCE1E7] dark:border-[#2B3440]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Alertas y Umbrales de KPIs Operativos' : 'Operational KPI Threshold Alerts'}
              </h3>
              <p className="text-[11px] text-neutral-500">
                {language === 'es'
                  ? 'Configuración de tolerancias preventivas y SLAs de la sala de control'
                  : 'Configure preventive tolerances and control room SLA limits'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#DCE1E7] dark:border-[#2B3440] px-5 bg-neutral-50/60 dark:bg-neutral-900/40">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'config'
                ? 'border-[#0071BB] text-[#0071BB] dark:text-[#5AAEE8]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            {language === 'es' ? 'Reglas de Umbral' : 'Threshold Rules'}
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'predictive'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>{language === 'es' ? 'Pre-Alertas IA' : 'Predictive Alerts'}</span>
            {predictiveAlerts.filter((p) => p.status === 'pending').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                {predictiveAlerts.filter((p) => p.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#0071BB] text-[#0071BB] dark:text-[#5AAEE8]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span>{language === 'es' ? 'Registro de Disparos' : 'Trigger Log'}</span>
            {activeAlerts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeAlerts.filter((a) => !a.acknowledged).length}
              </span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'config' ? (
            <div className="space-y-4">
              {/* Latency Thresholds */}
              <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#0071BB] dark:text-[#5AAEE8]" />
                    <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Latencia de Telemetría (ms)' : 'Telemetry Latency (ms)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    SLA Base: &lt; 50ms
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {language === 'es' ? 'Advertencia (Warning)' : 'Warning Threshold'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={formValues.maxLatencyWarning}
                        onChange={(e) =>
                          setFormValues({ ...formValues, maxLatencyWarning: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]"
                      />
                      <span className="text-xs font-mono text-neutral-400">ms</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {language === 'es' ? 'Crítico (SLA Breach)' : 'Critical SLA Breach'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={20}
                        max={150}
                        value={formValues.maxLatencyCritical}
                        onChange={(e) =>
                          setFormValues({ ...formValues, maxLatencyCritical: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]"
                      />
                      <span className="text-xs font-mono text-neutral-400">ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incidents Thresholds */}
              <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Incidencias Activas Simultáneas' : 'Active Simultaneous Incidents'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {language === 'es' ? 'Capacidad Máx: 5' : 'Max Capacity: 5'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {language === 'es' ? 'Advertencia (Warning)' : 'Warning Threshold'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formValues.maxIncidentsWarning}
                      onChange={(e) =>
                        setFormValues({ ...formValues, maxIncidentsWarning: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {language === 'es' ? 'Crítico (Saturación)' : 'Critical Saturation'}
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={15}
                      value={formValues.maxIncidentsCritical}
                      onChange={(e) =>
                        setFormValues({ ...formValues, maxIncidentsCritical: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]"
                    />
                  </div>
                </div>
              </div>

              {/* Health Score Thresholds */}
              <div className="p-4 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-[#1B222D]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {language === 'es' ? 'Salud Mínima del Sistema (%)' : 'Minimum System Health (%)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Objetivo: 99.80%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {language === 'es' ? 'Advertencia (Warning)' : 'Warning Threshold'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        min={90}
                        max={100}
                        value={formValues.minHealthWarning}
                        onChange={(e) =>
                          setFormValues({ ...formValues, minHealthWarning: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]"
                      />
                      <span className="text-xs font-mono text-neutral-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">
                      {language === 'es' ? 'Crítico (Degradación)' : 'Critical Degradation'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        min={80}
                        max={100}
                        value={formValues.minHealthCritical}
                        onChange={(e) =>
                          setFormValues({ ...formValues, minHealthCritical: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] text-xs font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]"
                      />
                      <span className="text-xs font-mono text-neutral-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation test tool */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 text-[11px]">
                  {language === 'es' ? 'Simular disparo de alerta para ensayo:' : 'Simulate alert trigger for drills:'}
                </span>
                <button
                  type="button"
                  onClick={onSimulateAlert}
                  className="px-3 py-1 text-xs font-semibold rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors"
                >
                  ⚡ {language === 'es' ? 'Disparar Alerta de Prueba' : 'Trigger Test Alert'}
                </button>
              </div>
            </div>
          ) : activeTab === 'predictive' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-300 flex items-center justify-between">
                <span>
                  {language === 'es'
                    ? 'Pre-alertas inferidas por el gemelo digital de movilidad con horizonte temporal de 15 a 60 minutos.'
                    : 'Pre-alerts inferred by the digital mobility twin across a 15 to 60-minute predictive horizon.'}
                </span>
                <span className="font-mono font-bold text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded">
                  IA CRTM-ML
                </span>
              </div>

              {predictiveAlerts.map((pAlert) => (
                <div
                  key={pAlert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    pAlert.status === 'mitigated'
                      ? 'border-emerald-500/30 bg-emerald-50/15 dark:bg-emerald-950/15 opacity-75'
                      : pAlert.severity === 'critical'
                      ? 'border-red-500/40 bg-red-50/20 dark:bg-red-950/20'
                      : 'border-purple-500/40 bg-purple-50/20 dark:bg-purple-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          pAlert.status === 'mitigated'
                            ? 'bg-emerald-500'
                            : pAlert.severity === 'critical'
                            ? 'bg-red-500'
                            : 'bg-purple-500'
                        }`}
                      />
                      <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                        {language === 'es' ? pAlert.titleEs : pAlert.titleEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        +{pAlert.horizonMinutes}m ({pAlert.predictedTime})
                      </span>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                        {pAlert.confidence}% {language === 'es' ? 'conf.' : 'conf.'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                    {language === 'es' ? pAlert.messageEs : pAlert.messageEn}
                  </p>

                  <div className="mt-2.5 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        {language === 'es' ? 'Mitigación:' : 'Mitigation:'}
                      </span>
                      <span>{language === 'es' ? pAlert.mitigationRecommendationEs : pAlert.mitigationRecommendationEn}</span>
                    </div>
                    {pAlert.status === 'mitigated' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] whitespace-nowrap">
                        ✓ {language === 'es' ? 'Mitigada' : 'Mitigated'}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setPredictiveAlerts((prev) =>
                            prev.map((pa) => (pa.id === pAlert.id ? { ...pa, status: 'mitigated' } : pa))
                          );
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-colors whitespace-nowrap"
                      >
                        {language === 'es' ? pAlert.mitigationActionLabelEs : pAlert.mitigationActionLabelEn}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="py-8 text-center text-neutral-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p>{language === 'es' ? 'No hay alertas de umbral registradas en el turno.' : 'No threshold alerts recorded in this shift.'}</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      alert.severity === 'critical'
                        ? 'border-red-500/40 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                          {alert.title}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                      {alert.message}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-neutral-200/50 dark:border-neutral-800">
                      <span className="text-[10px] text-neutral-400">
                        {alert.acknowledged
                          ? language === 'es' ? 'Reconocida por Operador' : 'Acknowledged by Operator'
                          : language === 'es' ? 'Pendiente de Reconocimiento' : 'Pending Acknowledgment'}
                      </span>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#0071BB] text-white hover:bg-blue-700 cursor-pointer transition-colors"
                        >
                          {language === 'es' ? 'Reconocer' : 'Acknowledge'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1B222D] flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Valores por Defecto' : 'Reset Defaults'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              {language === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              {language === 'es' ? 'Guardar Cambios' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
