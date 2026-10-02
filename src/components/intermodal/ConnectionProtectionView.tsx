import React, { useState, useMemo } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import {
  Clock,
  ArrowRight,
  Bus,
  Train,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Send,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface ConnectionProtectionViewProps {
  onOpenTrustDrawer?: (title: string) => void;
}

export const ConnectionProtectionView: React.FC<ConnectionProtectionViewProps> = ({
  onOpenTrustDrawer,
}) => {
  const { language, effectiveRole, hasPermission } = useAuth();
  const { activeSite } = useSite();

  const connectionConfig = useMemo(() => {
    if (activeSite.id === 'site-b') {
      return {
        trainTitle: 'Rodalies R1 · Tren 15420 (Mataró - Sants)',
        arrivalStation: 'Barcelona Sants (Vies 7/8)',
        passengersBenefiting: 85,
        busTitle: 'Línia Exprés.cat e11.1 · Barcelona Sants - Mataró',
        busDeparture: '13:46:00',
        bay: 'Dàrsena 6 Intercanviador de Barcelona Sants',
        headway: 20,
      };
    }
    if (activeSite.id === 'site-c') {
      return {
        trainTitle: 'Cercanías C-1 · Tren 27140 (Lora del Río - Santa Justa)',
        arrivalStation: 'Sevilla Santa Justa / San Bernardo',
        passengersBenefiting: 64,
        busTitle: 'Línea Metropolitana M-160 · Sevilla - Tomares - Bormujos',
        busDeparture: '13:46:00',
        bay: 'Dársena 3 Estación Plaza de Armas',
        headway: 30,
      };
    }
    return {
      trainTitle: 'Cercanías C-3 · Tren 24810 (Aranjuez - Chamartín)',
      arrivalStation: 'Atocha Cercanías',
      passengersBenefiting: 142,
      busTitle: 'Línea Interurbana 352 · Atocha - Fuentidueña',
      busDeparture: '13:46:00',
      bay: 'Dársena 14 Intercambiador Atocha',
      headway: 30,
    };
  }, [activeSite.id]);

  // Multi-criteria Interactive Hold Slider (1 to 10 minutes)
  const [holdingMinutes, setHoldingMinutes] = useState<number>(4);
  const [holdStatus, setHoldStatus] = useState<'pending' | 'authorized' | 'rejected'>('pending');
  const [authorizedTimestamp, setAuthorizedTimestamp] = useState<string | null>(null);

  // Dynamic mathematical model
  const feederDelayMinutes = 3.67; // +3m 40s
  const passengersBenefiting = connectionConfig.passengersBenefiting;
  const nextServiceWaitMinutes = connectionConfig.headway;
  const passengersOnboard = 48; // Already seated on connecting bus
  const scheduleSlackMinutes = 3.5; // Timetable buffer on corridor

  // Calculated variables based on hold minutes slider
  const knockOnDelaySeconds = Math.max(
    0,
    Math.round(Math.max(0, holdingMinutes - scheduleSlackMinutes) * 76)
  );
  const penaltyCostEuros = holdingMinutes <= 5 ? 48 : Math.round(48 + (holdingMinutes - 5) * 65);
  const passengerWaitMinutesSaved = passengersBenefiting * nextServiceWaitMinutes;
  const passengerDelayMinutesImposed = Math.round((passengersOnboard * knockOnDelaySeconds) / 60);
  const netUtilityScore = passengerWaitMinutesSaved - passengerDelayMinutesImposed * 2.5;

  const isRecommended = holdingMinutes <= 6 && feederDelayMinutes <= holdingMinutes + 1;

  const handleAuthorizeHold = () => {
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHoldStatus('authorized');
    setAuthorizedTimestamp(now);
  };

  const handleRejectHold = () => {
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHoldStatus('rejected');
    setAuthorizedTimestamp(now);
  };

  const handleReset = () => {
    setHoldingMinutes(4);
    setHoldStatus('pending');
    setAuthorizedTimestamp(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Motor de Protección de Conexiones Intermodales'
                : 'Intermodal Connection Protection Engine'}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] uppercase">
              {language === 'es' ? 'Algoritmo Multicriterio' : 'Multi-Criteria Algorithm'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {language === 'es'
              ? 'Arbitraje en tiempo real de retención de salidas de autobuses para salvaguardar transbordos de trenes demorados.'
              : 'Real-time multi-criteria arbitration of bus departure holds to protect passenger transfers from delayed trains.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {holdStatus !== 'pending' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Reiniciar Simulación' : 'Reset Simulation'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Connection Protection Pair Card (Scene 5 Hero Path) */}
      <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440]">
          {/* Feeder Train */}
          <div className="flex-1 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Servicio Alimentador (Tren)' : 'Feeder Service (Train)'}
              </span>
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
                {connectionConfig.trainTitle}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {language === 'es' ? 'Llegada a' : 'Arrival at'} {connectionConfig.arrivalStation}: <strong className="text-red-600 dark:text-red-400">13:48:40 ({language === 'es' ? '+3m 40s demora' : '+3m 40s delay'})</strong>
              </p>
              <p className="text-xs text-[#0071BB] dark:text-[#5AAEE8] font-semibold mt-0.5">
                {language === 'es' ? `👥 ${connectionConfig.passengersBenefiting} viajeros con billete combinado para transbordo.` : `👥 ${connectionConfig.passengersBenefiting} passengers with transfer ticket.`}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center px-4 text-neutral-400">
            <ArrowRight className="w-6 h-6 animate-pulse text-[#0071BB]" />
            <span className="text-[10px] font-mono mt-1 font-bold">{connectionConfig.bay}</span>
          </div>

          {/* Connecting Bus */}
          <div className="flex-1 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'es' ? 'Servicio Conector (Autobús)' : 'Connecting Service (Bus)'}
              </span>
              <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1] mt-0.5">
                {connectionConfig.busTitle}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {language === 'es' ? 'Salida Programada:' : 'Scheduled Departure:'} <strong>{connectionConfig.busDeparture}</strong> · {connectionConfig.bay}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                {language === 'es' ? `⏳ Frecuencia de la línea: ${connectionConfig.headway} minutos (Pérdida de enlace = ${connectionConfig.headway}m de espera).` : `⏳ Headway: ${connectionConfig.headway} minutes (Broken transfer = ${connectionConfig.headway} min wait).`}
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Criteria Interactive Hold Slider & Variables */}
        <div className="p-5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0071BB]" />
              <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Ajuste del Tiempo de Retención Autorizado (Holding Window)' : 'Authorized Holding Window Adjustment'}
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">{language === 'es' ? 'Tiempo seleccionado:' : 'Selected window:'}</span>
              <span className="font-mono text-base font-black text-[#0071BB] dark:text-[#5AAEE8] px-2 py-0.5 rounded bg-blue-500/10">
                +{holdingMinutes} min
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={holdingMinutes}
              onChange={(e) => setHoldingMinutes(parseInt(e.target.value, 10))}
              disabled={holdStatus !== 'pending'}
              className="w-full accent-[#0071BB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>{language === 'es' ? '1 min (Mínimo)' : '1 min (Minimum)'}</span>
              <span>{language === 'es' ? '4 min (Óptimo CRTM)' : '4 min (CRTM Optimal)'}</span>
              <span>{language === 'es' ? '7 min (Límite Confort)' : '7 min (Comfort Limit)'}</span>
              <span>{language === 'es' ? '10 min (Ruptura Turno)' : '10 min (Shift Overrun)'}</span>
            </div>
          </div>

          {/* Dynamic Criteria Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] text-neutral-400 block font-medium">{language === 'es' ? 'Viajeros Beneficiados' : 'Benefited Travelers'}</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                +{passengersBenefiting} pax
              </span>
              <span className="text-[10px] text-neutral-500">{language === 'es' ? 'Ahorro: 30 min/viajero' : 'Savings: 30 min/pax'}</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] text-neutral-400 block font-medium">{language === 'es' ? 'Demora Aguas Abajo' : 'Downstream Delay'}</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                +{knockOnDelaySeconds} s
              </span>
              <span className="text-[10px] text-neutral-500">{language === 'es' ? `Colchón en ruta absorbe ${scheduleSlackMinutes}m` : `Route slack absorbs ${scheduleSlackMinutes}m`}</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] text-neutral-400 block font-medium">{language === 'es' ? 'Coste Operativo / Penalización' : 'Operating Cost / Penalty'}</span>
              <span className="text-base font-bold text-neutral-700 dark:text-neutral-300 block mt-0.5">
                {penaltyCostEuros} €
              </span>
              <span className="text-[10px] text-neutral-500">{language === 'es' ? 'Penalización contractual concesión' : 'Contractual concession penalty'}</span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440]">
              <span className="text-[10px] text-neutral-400 block font-medium">{language === 'es' ? 'Puntuación Neta de Utilidad' : 'Net Utility Score'}</span>
              <span className={`text-base font-bold block mt-0.5 ${netUtilityScore > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {netUtilityScore > 0 ? `+${netUtilityScore}` : netUtilityScore} pts
              </span>
              <span className="text-[10px] text-neutral-500">{language === 'es' ? 'Balance satisfacción global' : 'Overall satisfaction balance'}</span>
            </div>
          </div>
        </div>

        {/* Algorithmic Verdict & Action Confirmation Bar */}
        <div className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isRecommended
            ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
            : 'border-red-500/40 bg-red-50/30 dark:bg-red-950/20'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isRecommended
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}>
              {isRecommended ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es'
                    ? `Dictamen del Motor: ${isRecommended ? 'RECOMENDADO (AUTORIZAR RETENCIÓN)' : 'NO RECOMENDADO'}`
                    : `Engine Verdict: ${isRecommended ? 'RECOMMENDED (AUTHORISE HOLD)' : 'NOT RECOMMENDED'}`}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  isRecommended ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'
                }`}>
                  {isRecommended ? (language === 'es' ? 'Balance Positivo' : 'Positive Balance') : (language === 'es' ? 'Impacto Negativo Excesivo' : 'Excessive Negative Impact')}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
                {isRecommended
                  ? (language === 'es'
                      ? `La retención de ${holdingMinutes} minutos permite la conexión de 142 viajeros con una demora aguas abajo mínima de ${knockOnDelaySeconds}s. El beneficio de transbordo supera ampliamente la penalización de puntualidad.`
                      : `A ${holdingMinutes}-minute hold secures transfers for 142 passengers with minimal downstream delay of ${knockOnDelaySeconds}s. Net connectivity benefits far exceed punctuality penalties.`)
                  : (language === 'es'
                      ? `Una retención de ${holdingMinutes} minutos excede el umbral de tolerancia: impone una demora de ${knockOnDelaySeconds}s a 48 pasajeros a bordo y riesgo de ruptura de turnos de conducción.`
                      : `A ${holdingMinutes}-minute hold exceeds tolerance thresholds: imposes ${knockOnDelaySeconds}s delay on 48 on-board passengers with shift break risks.`)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            {holdStatus === 'pending' ? (
              <>
                <button
                  onClick={handleRejectHold}
                  className="px-4 py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {language === 'es' ? 'Rechazar (Salida Inmediata)' : 'Reject (Immediate Departure)'}
                </button>
                <button
                  onClick={handleAuthorizeHold}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? `Autorizar y Enviar a SAE (${holdingMinutes}m)` : `Authorise & Dispatch to CAD/AVL (${holdingMinutes}m)`}</span>
                </button>
              </>
            ) : holdStatus === 'authorized' ? (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'es' ? `Orden Telemática Enviada a Autobús 352 a las ${authorizedTimestamp} (SAE N01/N05)` : `Telemetric Order Dispatched to Bus 352 at ${authorizedTimestamp} (CAD/AVL N01/N05)`}</span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-neutral-500" />
                <span>{language === 'es' ? `Retención Rechazada: Salida según horario original autorizada a las ${authorizedTimestamp}` : `Hold Rejected: Timetabled departure authorized at ${authorizedTimestamp}`}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Connection Protection Monitor Table */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
          {language === 'es' ? 'Historial de Decisiones de Conexión en la Red CRTM (Últimas 24h)' : 'Connection Protection Decisions History (Last 24h)'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] font-bold text-neutral-400 uppercase border-b border-[#DCE1E7] dark:border-[#2B3440]">
              <tr>
                <th className="py-2.5 px-3">{language === 'es' ? 'Intercambiador' : 'Interchange'}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Línea Alimentadora' : 'Feeder Service'}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Línea Conectora' : 'Connecting Line'}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Tiempo Retención' : 'Hold Time'}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Viajeros Salvados' : 'Protected Pax'}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Dictamen' : 'Verdict'}</th>
                <th className="py-2.5 px-3">{language === 'es' ? 'Estado' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE1E7] dark:divide-[#2B3440] text-neutral-600 dark:text-neutral-400">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">Atocha Dársena 14</td>
                <td className="py-2.5 px-3">Cercanías C-3 (Tren 24810)</td>
                <td className="py-2.5 px-3">Interurbano 352</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#0071BB]">+4 min</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600">142 pax</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">{language === 'es' ? 'RECOMENDADO' : 'RECOMMENDED'}</span></td>
                <td className="py-2.5 px-3">{holdStatus === 'authorized' ? (language === 'es' ? 'Ejecutado' : 'Executed') : (language === 'es' ? 'En Curso' : 'In Progress')}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">Moncloa Isla 1</td>
                <td className="py-2.5 px-3">Metro Línea 6 (Andén 1)</td>
                <td className="py-2.5 px-3">Interurbano 627 (Villanueva)</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#0071BB]">+3 min</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600">89 pax</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">{language === 'es' ? 'RECOMENDADO' : 'RECOMMENDED'}</span></td>
                <td className="py-2.5 px-3">{language === 'es' ? 'Completado (12:15)' : 'Completed (12:15)'}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">Chamartín Clara Campoamor</td>
                <td className="py-2.5 px-3">Cercanías C-4B</td>
                <td className="py-2.5 px-3">Bus EMT Línea 5</td>
                <td className="py-2.5 px-3 font-mono font-bold text-red-600">+8 min</td>
                <td className="py-2.5 px-3">18 pax</td>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 font-bold text-[10px]">{language === 'es' ? 'NO RECOMENDADO' : 'NOT RECOMMENDED'}</span></td>
                <td className="py-2.5 px-3">{language === 'es' ? 'Rechazado (11:02)' : 'Rejected (11:02)'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
