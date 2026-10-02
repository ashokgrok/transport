import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import {
  Smartphone,
  Bus,
  Train,
  Compass,
  Building2,
  Activity,
  Flame,
  Shield,
  ShieldAlert,
  BarChart3,
  Sliders,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  Search,
  MapPin,
  ExternalLink,
  Code2,
  Copy,
  Check,
  FileText,
  DollarSign,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { KpiDrilldownModal, KpiDrilldownTab } from '../tower/KpiDrilldownModal';

interface RoleSpecificDashboardProps {
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (title: string) => void;
}

export const RoleSpecificDashboard: React.FC<RoleSpecificDashboardProps> = ({
  onOpenCase,
  onOpenTrustDrawer,
}) => {
  const { currentRole, effectiveRole, language, setPreviewRoleId } = useAuth();
  const { activeSite, sites, setActiveSiteId } = useSite();

  const [copiedCode, setCopiedCode] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [activeApiTab, setActiveApiTab] = useState<'siri' | 'gtfs' | 'rest'>('rest');
  const [drilldownTab, setDrilldownTab] = useState<KpiDrilldownTab | null>(null);

  const handleCopyCurl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 1. R15: Citizen / Traveling Passenger Mobile View (PRD Section 3 & 5)
  if (effectiveRole.id === 'R15') {
    return (
      <div className="max-w-md mx-auto space-y-4">
        {/* Smartphone Shell Card */}
        <div className="bg-white dark:bg-[#161B22] rounded-3xl border-4 border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden">
          {/* Mobile Top App Bar */}
          <div className="bg-[#D10002] text-white p-4 text-center">
            <h2 className="text-sm font-bold tracking-wide">Mi Transporte CRTM</h2>
            <p className="text-[11px] opacity-90">Consorcio Regional de Transportes de Madrid</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder={
                  language === 'es'
                    ? '¿A dónde quieres ir? (Ej: Méndez Álvaro)'
                    : 'Where do you want to go? (e.g. Méndez Álvaro)'
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-2 focus:ring-[#0071BB]"
              />
            </div>

            {/* Active Disruption Banner */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{language === 'es' ? 'Aviso en Líneas C-3 y C-4' : 'Alert on Lines C-3 and C-4'}</span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {language === 'es'
                  ? 'Demoras por avería en Atocha. Se recomienda utilizar Metro Línea 1 o el Servicio Especial de autobuses gratuito en el intercambiador.'
                  : 'Delays due to fault at Atocha. We recommend using Metro Line 1 or the free Special Bus Service at the interchange.'}
              </p>
            </div>

            {/* Live Departures from Nearby Station */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>{language === 'es' ? 'Próximas Salidas (Atocha Renfe)' : 'Upcoming Departures (Atocha Renfe)'}</span>
                <span className="text-[10px] text-neutral-400">{language === 'es' ? 'En tiempo real' : 'Real-time'}</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                        {language === 'es' ? 'Metro Línea 1 · Pinar de Chamartín' : 'Metro Line 1 · Pinar de Chamartín'}
                      </p>
                      <p className="text-[10px] text-emerald-600">
                        {language === 'es' ? 'Servicio habitual · Cada 3 min' : 'Normal service · Every 3 min'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">1 min</span>
                </div>

                <div className="p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-[#0071BB] text-white flex items-center justify-center font-bold text-[10px]">
                      SE
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                        {language === 'es' ? 'Bus Servicio Especial · Méndez Álvaro' : 'Special Bus Service · Méndez Álvaro'}
                      </p>
                      <p className="text-[10px] text-[#0071BB]">
                        {language === 'es' ? 'Paso gratuito con billete Renfe' : 'Free access with Renfe ticket'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600">3 min</span>
                </div>

                <div className="p-3 rounded-xl border border-red-500/30 bg-red-50/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded bg-[#7A1E65] text-white flex items-center justify-center font-bold text-xs">
                      C3
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">Cercanías C-3 · Aranjuez</p>
                      <p className="text-[10px] text-red-600">
                        {language === 'es' ? 'Avería catenaria · Demora +25 min' : 'Catenary fault · Delay +25 min'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-red-600">+25m</span>
                </div>
              </div>
            </div>

            {/* Travel Card Balance Card */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-[#0071BB] to-blue-700 text-white shadow-md space-y-2">
              <div className="flex justify-between items-center text-xs opacity-90">
                <span>{language === 'es' ? 'Tarjeta Transporte Público (TTP)' : 'Public Transport Card (TTP)'}</span>
                <span className="font-mono">•••• 8912</span>
              </div>
              <div>
                <p className="text-xl font-black">
                  {language === 'es' ? 'Abono Joven 30 Días' : 'Youth 30-Day Pass'}
                </p>
                <p className="text-[11px] opacity-80">
                  {language === 'es'
                    ? 'Válido en todas las zonas (A a E2) hasta 24 Octubre'
                    : 'Valid across all zones (A through E2) until October 24'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. R14: Interchange Facility Manager (Intercambiadores Moncloa, Atocha, Chamartín)
  if (effectiveRole.id === 'R14') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0071BB]" />
              <h1 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Panel de Gestión de Intercambiador Multimodal (Atocha / Moncloa)'
                  : 'Multimodal Interchange Facility Management Desk (Atocha / Moncloa)'}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'es'
                ? 'Supervisión de dársenas de autobuses, aforos en vestíbulos y disponibilidad de pasillos y escaleras mecánicas.'
                : 'Monitoring bus departure bays, concourse crowd levels, escalator status, and pedestrian circulation corridors.'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
            {language === 'es' ? 'Aforo Global: 64% (Normalidad)' : 'Global Occupancy: 64% (Normal)'}
          </span>
        </div>

        {/* Bays / Dársenas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { bayEs: 'Dársena 11', bayEn: 'Bay 11', line: 'Bus 351', status: 'libre', pax: 12 },
            { bayEs: 'Dársena 12', bayEn: 'Bay 12', line: 'Bus 352', status: 'ocupada', pax: 48 },
            { bayEs: 'Dársena 13', bayEn: 'Bay 13', line: 'Bus 353', status: 'ocupada', pax: 35 },
            { bayEs: 'Dársena 14', bayEn: 'Bay 14', line: language === 'es' ? 'Bus SE (Refuerzo)' : 'Bus SE (Relief)', status: 'retenida', pax: 142 },
            { bayEs: 'Dársena 15', bayEn: 'Bay 15', line: 'Bus Exprés 203', status: 'libre', pax: 8 },
            { bayEs: 'Dársena 16', bayEn: 'Bay 16', line: 'Interurbano 337', status: 'libre', pax: 19 },
          ].map((d, i) => {
            const statusLabel =
              d.status === 'retenida'
                ? (language === 'es' ? 'retenida' : 'held')
                : d.status === 'ocupada'
                ? (language === 'es' ? 'ocupada' : 'occupied')
                : (language === 'es' ? 'libre' : 'available');

            return (
              <div
                key={i}
                className={`p-3 rounded-xl border space-y-1.5 ${
                  d.status === 'retenida'
                    ? 'border-[#0071BB] bg-blue-50/20 dark:bg-blue-950/20'
                    : d.status === 'ocupada'
                    ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900'
                    : 'border-emerald-500/30 bg-emerald-50/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                    {language === 'es' ? d.bayEs : d.bayEn}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    d.status === 'retenida' ? 'bg-blue-500/20 text-[#0071BB]' : d.status === 'ocupada' ? 'bg-neutral-200 text-neutral-700' : 'bg-emerald-500/20 text-emerald-700'
                  }`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{d.line}</p>
                <p className="text-[10px] text-neutral-500">
                  {d.pax} {language === 'es' ? 'viajeros en andén' : 'passengers on platform'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. R19: Developer & Open Data Partner Portal (API Catalogue & Live Explorer)
  if (effectiveRole.id === 'R19') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#0071BB]" />
              <h1 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Portal de Desarrolladores y Datos Abiertos (CRTM Open Data Hub)'
                  : 'Developer & Open Data Partner Portal (CRTM Open Data Hub)'}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'es'
                ? 'Especificaciones OpenAPI, SIRI-VM, GTFS-Realtime y Webhooks de eventos en tiempo real.'
                : 'OpenAPI specifications, SIRI-VM telemetry, GTFS-Realtime feeds, and event streaming webhooks.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500">
              {language === 'es' ? 'Cuota:' : 'Quota:'} <strong>14.280 / 100.000 {language === 'es' ? 'reqs hoy' : 'reqs today'}</strong>
            </span>
          </div>
        </div>

        {/* API Protocols Tabs */}
        <div className="flex items-center gap-2 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
          {(['rest', 'siri', 'gtfs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveApiTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeApiTab === tab
                  ? 'bg-[#0071BB] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab === 'rest' ? 'REST API v2' : tab === 'siri' ? (language === 'es' ? 'SIRI-VM Telemetría' : 'SIRI-VM Telemetry') : 'GTFS-Realtime Feeds'}
            </button>
          ))}
        </div>

        {/* API Endpoint Documentation & Interactive cURL */}
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">GET</span>
              <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                /api/v2/networks/madrid/disruptions/live
              </span>
            </div>
            <button
              onClick={() => handleCopyCurl('curl -X GET "https://api.crtm.es/v2/networks/madrid/disruptions/live" -H "Authorization: Bearer crtm_live_demo_key"')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? (language === 'es' ? 'Copiado!' : 'Copied!') : (language === 'es' ? 'Copiar cURL' : 'Copy cURL')}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#090C10] text-neutral-200 font-mono text-xs overflow-x-auto">
{`{
  "status": "success",
  "data": {
    "activeDisruptionsCount": 1,
    "incidentId": "INC-2026-0929-ATO",
    "severity": "critical",
    "corridor": "Atocha - Méndez Álvaro",
    "affectedLines": ["C-3", "C-4", "C-5", "352"],
    "delayEstimateMinutes": 25,
    "stepFreeAccessibleAlternative": {
      "pathAvailable": true,
      "route": "Lift 02 North Concourse to Bus Bay 14"
    }
  }
}`}
          </pre>
        </div>
      </div>
    );
  }

  // 4. R20: Multi-Site Super-Admin Portfolio (PRD Section 17 & Scene 1)
  if (effectiveRole.id === 'R20') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0071BB]" />
              <h1 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Cartera de Sitios y Clientes Multi-Tenant (CITRAM Platform Portfolio)'
                  : 'Multi-Tenant Sites & Regional Authority Portfolio'}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {language === 'es'
                ? 'Supervisión de despliegues, conformidad normativa regional y conmutación de sitios en vivo.'
                : 'Deployment health, regional regulatory conformance, and live site switching.'}
            </p>
          </div>
          <span className="text-xs font-bold text-neutral-500">
            {language === 'es' ? 'Sitio Activo:' : 'Active Site:'} <strong>{activeSite.name}</strong>
          </span>
        </div>

        {/* Sites Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sites.map((site) => {
            const isCurrent = site.id === activeSite.id;
            return (
              <div
                key={site.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-[#0071BB] bg-blue-50/10 dark:bg-blue-950/10 shadow-sm'
                    : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: site.primaryColor }}
                    />
                    <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                      {site.shortName}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    site.status === 'live' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {site.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 italic mb-3">"{site.tagline}"</p>

                <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400 mb-4 border-t border-[#DCE1E7] dark:border-[#2B3440] pt-2">
                  <p>{language === 'es' ? 'Región:' : 'Region:'} <strong>{site.region}, {site.country}</strong></p>
                  <p>{language === 'es' ? 'Modo de Cumplimiento:' : 'Enforcement Mode:'} <strong>{site.enforcementMode}</strong></p>
                  <p>{language === 'es' ? 'Zona Horaria:' : 'Timezone:'} <strong>{site.timeZone}</strong></p>
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
                    ? (language === 'es' ? 'Sitio Activo en Sesión' : 'Current Active Site')
                    : (language === 'es' ? `Conmutar a ${site.shortName}` : `Switch to ${site.shortName}`)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. Default Executive / Operational Dashboard for other roles (R10, R11, R16, R17, R18, etc.)
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
              {effectiveRole.id}
            </span>
            <h1 className="text-base font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? effectiveRole.nameEs : effectiveRole.nameEn} · {effectiveRole.demoAccount.organization}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {(language === 'es' ? effectiveRole.homeQuestionEs : effectiveRole.homeQuestionEn)
              .match(/¿?[^?]+[?]/g)?.map((q, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200 dark:border-neutral-700/60 flex items-center gap-1.5"
                >
                  <span className="text-[#0071BB] dark:text-[#5AAEE8] font-bold">›</span>
                  <span>{q.trim()}</span>
                </span>
              )) || (
              <p className="text-xs text-neutral-500 mt-1 italic">
                "{language === 'es' ? effectiveRole.homeQuestionEs : effectiveRole.homeQuestionEn}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]">
            {language === 'es' ? 'Alcance:' : 'Scope:'} {effectiveRole.dataScope}
          </span>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Punctuality / Health */}
        <div
          onClick={() => setDrilldownTab('health')}
          className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] hover:shadow-md transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">
              {language === 'es' ? 'Puntualidad Global del Modo' : 'Global Mode Punctuality'}
            </span>
            <span className="text-[10px] font-semibold text-[#0071BB] dark:text-[#5AAEE8] opacity-0 group-hover:opacity-100 transition-opacity">
              {language === 'es' ? 'Desglose →' : 'Drill down →'}
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.4%</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {language === 'es' ? 'Objetivo contractual: ≥ 96.0%' : 'Contractual SLA: ≥ 96.0%'}
          </p>
        </div>

        {/* Metric 2: Active Incidents */}
        <div
          onClick={() => setDrilldownTab('incidents')}
          className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] hover:shadow-md transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">
              {language === 'es' ? 'Incidentes Activos en Alcance' : 'Active Incidents in Scope'}
            </span>
            <span className="text-[10px] font-semibold text-[#0071BB] dark:text-[#5AAEE8] opacity-0 group-hover:opacity-100 transition-opacity">
              {language === 'es' ? 'Ver Casos →' : 'View Cases →'}
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            1 {language === 'es' ? 'caso' : 'case'}
          </p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            INC-2026-0929 · {language === 'es' ? 'Catenaria Atocha' : 'Atocha Catenary'}
          </p>
        </div>

        {/* Metric 3: Data Trust / Latency */}
        <div
          onClick={() => setDrilldownTab('latency')}
          className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] hover:border-[#0071BB] dark:hover:border-[#5AAEE8] hover:shadow-md transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">
              {language === 'es' ? 'Índice de Confianza de Datos' : 'Data Trust Index'}
            </span>
            <span className="text-[10px] font-semibold text-[#0071BB] dark:text-[#5AAEE8] opacity-0 group-hover:opacity-100 transition-opacity">
              {language === 'es' ? 'Telemetría →' : 'Telemetry →'}
            </span>
          </div>
          <p className="text-2xl font-black text-[#0071BB] dark:text-[#5AAEE8] mt-1">96.8%</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {language === 'es' ? '23 conectores N01-N23 supervisados' : '23 connectors N01-N23 supervised'}
          </p>
        </div>
      </div>

      {/* Key Role Actions */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
          {language === 'es'
            ? `Acciones y Vistas Autorizadas para ${effectiveRole.demoAccount.fullName}`
            : `Authorised Views and Operations for ${effectiveRole.demoAccount.fullName}`}
        </h3>
        <div className="flex flex-wrap gap-2">
          {effectiveRole.keyActions.map((action, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
            >
              ✓ {action}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Deep Drilldown Modal */}
      <KpiDrilldownModal
        isOpen={drilldownTab !== null}
        onClose={() => setDrilldownTab(null)}
        initialTab={drilldownTab || 'incidents'}
        onOpenCase={onOpenCase}
        onOpenTrustDrawer={onOpenTrustDrawer}
      />
    </div>
  );
};
