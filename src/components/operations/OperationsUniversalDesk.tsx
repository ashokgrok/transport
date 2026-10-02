import React, { useState, useMemo } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import {
  FileCheck,
  AlertTriangle,
  FileText,
  Database,
  Cpu,
  HelpCircle,
  Shield,
  ShieldAlert,
  Calendar,
  Camera,
  BookOpen,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Users,
  Search,
  ExternalLink,
  ArrowRight,
  Eye,
  Plus,
  Play,
  RotateCcw,
  Smartphone,
  Compass,
  MapPin,
  Code2,
  Copy,
  Check,
  Sliders,
  Flame,
  Radio,
  Train,
  Bus,
} from 'lucide-react';

interface OperationsUniversalDeskProps {
  tab: string;
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (title: string) => void;
}

export const OperationsUniversalDesk: React.FC<OperationsUniversalDeskProps> = ({
  tab,
  onOpenCase,
  onOpenTrustDrawer,
}) => {
  const { language, effectiveRole } = useAuth();
  const { activeSite } = useSite();
  const [activeCam, setActiveCam] = useState<number>(1);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeApiProtocol, setActiveApiProtocol] = useState<'rest' | 'siri' | 'gtfs'>('rest');
  const [liveSearchQuery, setLiveSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const cctvCameras = useMemo(() => {
    if (activeSite.id === 'site-b') {
      return [
        { id: 1, title: 'CAM-01: Barcelona Sants · Andana Vies 7 i 8', status: 'LIVE', pax: 'Aforament 84% (Alerta Rodalies)', color: 'bg-red-500' },
        { id: 2, title: 'CAM-02: Plaça de Catalunya · Vestíbul Enllaç L1/L3', status: 'LIVE', pax: 'Aforament 62% (Fluït)', color: 'bg-emerald-500' },
        { id: 3, title: 'CAM-03: Sagrera Meridiana · Dàrsenes d\'Autobusos', status: 'LIVE', pax: 'Aforament 45% (Nominal)', color: 'bg-emerald-500' },
        { id: 4, title: 'CAM-04: Plaça d\'Espanya · Enllaç FGC / L1', status: 'LIVE', pax: 'Aforament 38% (Normal)', color: 'bg-emerald-500' },
      ];
    }
    if (activeSite.id === 'site-c') {
      return [
        { id: 1, title: 'CAM-01: Sevilla Santa Justa · Andenes Cercanías Vía 3/4', status: 'LIVE', pax: 'Aforo 75% (Retrasos C-1)', color: 'bg-amber-500' },
        { id: 2, title: 'CAM-02: San Bernardo · Vestíbulo Transbordo Metro L1', status: 'LIVE', pax: 'Aforo 52% (Fluido)', color: 'bg-emerald-500' },
        { id: 3, title: 'CAM-03: Plaza de Armas · Dársena 3 Autobuses Aljarafe', status: 'LIVE', pax: 'Aforo 65% (Denso)', color: 'bg-amber-500' },
        { id: 4, title: 'CAM-04: Prado de San Sebastián · Parada MetroCentro T1', status: 'LIVE', pax: 'Aforo 30% (Nominal)', color: 'bg-emerald-500' },
      ];
    }
    return [
      { id: 1, title: 'CAM-01: Atocha Cercanías · Andén Vías 3 y 4', status: 'LIVE', pax: 'Aforo 42% (Normal)', color: 'bg-emerald-500' },
      { id: 2, title: 'CAM-02: Atocha Intercambiador · Dársena 14 (SE Bus)', status: 'LIVE', pax: 'Aforo 78% (Alta concentración)', color: 'bg-amber-500' },
      { id: 3, title: 'CAM-03: Chamartín Clara Campoamor · Andén Vía 7', status: 'LIVE', pax: 'Aforo 35% (Normal)', color: 'bg-emerald-500' },
      { id: 4, title: 'CAM-04: Moncloa · Vestíbulo Principal Isla 1', status: 'LIVE', pax: 'Aforo 55% (Fluido)', color: 'bg-emerald-500' },
    ];
  }, [activeSite.id]);

  const liveDepartures = useMemo(() => {
    if (activeSite.id === 'site-b') {
      return [
        { line: '1', lineCode: 'L1', name: 'Metro L1 · Fondo', mode: 'metro', color: '#E30613', eta: '2 min', platform: 'Andana 1', delay: 'En hora' },
        { line: '5', lineCode: 'L5', name: 'Metro L5 · Vall d\'Hebron', mode: 'metro', color: '#0072CE', eta: '3 min', platform: 'Andana 2', delay: 'En hora' },
        { line: 'R1', lineCode: 'R1', name: 'Rodalies R1 · Mataró / Maçanet', mode: 'cercanias', color: '#0085C7', eta: '24 min', platform: 'Via 7', delay: '+20 min dem.' },
        { line: 'R4', lineCode: 'R4', name: 'Rodalies R4 · Manresa', mode: 'cercanias', color: '#F39200', eta: '18 min', platform: 'Via 8', delay: '+16 min dem.' },
        { line: 'H12', lineCode: 'H12', name: 'Bus H12 · Besòs Verneda', mode: 'emt', color: '#D8232A', eta: '4 min', platform: 'Parada 120', delay: 'En hora' },
        { line: 'e11', lineCode: 'e11', name: 'Exprés.cat e11.1 · Mataró Centre', mode: 'interurban', color: '#007A3D', eta: '6 min', platform: 'Dàrsena 6', delay: 'Retenció' },
      ];
    }
    if (activeSite.id === 'site-c') {
      return [
        { line: '1', lineCode: 'L1', name: 'Metro L1 · Olivar de Quintos', mode: 'metro', color: '#00853F', eta: '3 min', platform: 'Andén 1', delay: 'En hora' },
        { line: 'C1', lineCode: 'C1', name: 'TUSSAM C1 · Circular Exterior', mode: 'emt', color: '#E31B23', eta: '4 min', platform: 'Parada Santa Justa', delay: 'En hora' },
        { line: 'C-1', lineCode: 'C1', name: 'Cercanías C-1 · Lora del Río', mode: 'cercanias', color: '#8A1538', eta: '22 min', platform: 'Vía 3', delay: '+18 min dem.' },
        { line: 'T1', lineCode: 'T1', name: 'MetroCentro T1 · San Bernardo', mode: 'light_rail', color: '#F39200', eta: '5 min', platform: 'Parada Plaza Nueva', delay: 'En hora' },
        { line: 'M160', lineCode: 'M160', name: 'Autobús M-160 · Bormujos / Aljarafe', mode: 'interurban', color: '#1A7F37', eta: '8 min', platform: 'Dársena 3', delay: '+10 min dem.' },
        { line: '28', lineCode: '28', name: 'TUSSAM Línea 28 · Parque Alcosa', mode: 'emt', color: '#E31B23', eta: '6 min', platform: 'Parada José Laguillo', delay: 'En hora' },
      ];
    }
    return [
      { line: '1', lineCode: 'L1', name: 'Metro L1 · Pinar de Chamartín', mode: 'metro', color: '#2E7D32', eta: '2 min', platform: 'Andén 1', delay: 'En hora' },
      { line: 'SE', lineCode: 'SE', name: 'Bus Servicio Especial · Méndez Álvaro', mode: 'emt', color: '#0071BB', eta: '3 min', platform: 'Dársena 14', delay: 'Gratuito' },
      { line: '6', lineCode: 'L6', name: 'Metro L6 · Circular Cuatro Caminos', mode: 'metro', color: '#8D9297', eta: '4 min', platform: 'Andén 2', delay: 'En hora' },
      { line: 'C-3', lineCode: 'C3', name: 'Cercanías C-3 · Aranjuez', mode: 'cercanias', color: '#7A1E65', eta: '25 min', platform: 'Vía 3', delay: '+22 min dem.' },
      { line: 'C-4', lineCode: 'C4', name: 'Cercanías C-4 · Alcobendas', mode: 'cercanias', color: '#0055A5', eta: '18 min', platform: 'Vía 4', delay: '+15 min dem.' },
      { line: '27', lineCode: '27', name: 'EMT Línea 27 · Plaza Castilla', mode: 'emt', color: '#0071BB', eta: '5 min', platform: 'Parada 82', delay: 'En hora' },
    ];
  }, [activeSite.id]);

  const handleCopyCurl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const showToast = (msg: string) => {
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  // 1. EXECUTIVE OVERVIEW & BRIEFING
  if (tab === 'overview' || tab === 'briefing') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        {downloadToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#161B22] text-white border border-emerald-500/50 shadow-xl px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadToast}</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Dossier y Resumen Ejecutivo Diario' : 'Executive Operational Overview & Briefing'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? `Consolidación de indicadores de servicio regional (${activeSite.shortName}) para alta dirección.`
                    : `Consolidated regional service indicators (${activeSite.shortName}) for executive leadership.`}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast(language === 'es' ? 'Descargando Dossier Ejecutivo Diario (PDF)...' : 'Downloading Executive Briefing (PDF)...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Descargar Dossier (PDF)' : 'Download Briefing (PDF)'}</span>
          </button>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'es' ? 'Disponibilidad Multimodal' : 'Multimodal Availability'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">99.85%</span>
              <span className="text-xs text-emerald-600 font-bold">Obj. 98.0%</span>
            </div>
            <p className="text-xs text-neutral-500">
              {language === 'es' ? 'Metro 99.9% · EMT 99.8% · Cercanías 98.4%' : 'Metro 99.9% · EMT 99.8% · Rail 98.4%'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'es' ? 'Volumen de Viajeros Hoy' : 'Passenger Volume Today'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-[#0071BB] dark:text-[#5AAEE8]">3.42 M</span>
              <span className="text-xs text-neutral-500">+1.4% vs 2025</span>
            </div>
            <p className="text-xs text-neutral-500">
              {language === 'es' ? 'Punta de mañana superada sin incidencias graves' : 'Morning peak handled with zero safety events'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              {language === 'es' ? 'Incidencias Relevantes' : 'Major Disruptions'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">1 caso</span>
              <span className="text-xs text-neutral-500">Catenaria Atocha</span>
            </div>
            <p className="text-xs text-neutral-500">
              {language === 'es' ? 'Servicio especial de autobuses activo. Cero viajeros bloqueados.' : 'Relief bus shuttle active. Zero stranded passengers.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. FIELD QUALITY INSPECTIONS & AUDIT FINDINGS
  if (tab === 'inspections' || tab === 'findings' || tab === 'reports') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Inspecciones Técnicas de Red y Hallazgos' : 'Field Quality Inspections & Audit Findings'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Auditoría en terreno de estaciones, señalética, limpieza y accesibilidad PMR.'
                    : 'On-site technical audits of station facilities, signage, cleanliness, and PMR accessibility.'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(language === 'es' ? 'Abriendo formulario de nueva inspección de campo...' : 'Opening new inspection form...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Nueva Inspección de Campo' : 'New Field Inspection'}</span>
          </button>
        </div>

        {/* Inspections Table */}
        <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] font-bold text-xs text-[#1B1F24] dark:text-[#E8ECF1]">
            {language === 'es' ? 'Plan Diario de Inspecciones (18 programadas)' : 'Daily Inspection Schedule (18 scheduled)'}
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {[
              { id: 'INS-01', location: 'Intercambiador Moncloa (Isla 1)', type: 'Ascensor / Accesibilidad', status: 'finding', notes: 'Escalera mecánica 4 ruidosa · Ficha de mantenimiento emitida', inspector: 'Diego Navas (R06)' },
              { id: 'INS-02', location: 'Estación Méndez Álvaro (Cercanías)', type: 'Megaafonía y PIS', status: 'compliant', notes: 'Pruebas de audio conformes · 100% inteligible', inspector: 'Diego Navas (R06)' },
              { id: 'INS-03', location: 'Atocha Cercanías (Andenes 3 y 4)', type: 'Seguridad en Andén', status: 'finding', notes: 'Señalética provisional de transbordo SE instalada correctamente', inspector: 'Marta Valls (R06)' },
              { id: 'INS-04', location: 'Plaza de Castilla (Dársenas EMT)', type: 'Limpieza y Confort', status: 'compliant', notes: 'Conformidad con estándar de calidad CRTM', inspector: 'Marta Valls (R06)' },
            ].map((ins) => (
              <div key={ins.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0071BB]">{ins.id}</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{ins.location}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium">{ins.type}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">{ins.notes}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-neutral-400">{ins.inspector}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    ins.status === 'compliant' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {ins.status === 'compliant' ? 'Conforme' : 'Hallazgo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. CCTV SURVEILLANCE & STATION CAMERAS
  if (tab === 'video') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Muro de Videovigilancia y Cámaras de Andén (CCTV)' : 'CCTV Surveillance Wall & Platform Cameras'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Supervisión en tiempo real de andenes, dársenas de intercambiador y vestíbulos de gran afluencia.'
                    : 'Real-time video feed monitoring across train platforms, bus bays, and high-density passenger concourses.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Cam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cctvCameras.map((cam) => (
            <div key={cam.id} className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-black text-white overflow-hidden shadow-md flex flex-col justify-between h-64 relative group">
              {/* Overlay Top Bar */}
              <div className="p-3 bg-black/60 backdrop-blur-xs flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-mono text-xs font-bold">{cam.title}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 font-bold uppercase">{cam.status}</span>
              </div>

              {/* Simulated Camera Center Graphics */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/40 mb-2">
                  <Eye className="w-8 h-8" />
                </div>
                <span className="font-mono text-xs text-white/70">Feed WebRTC H.264 · 25 FPS · 1080p</span>
                <span className="text-[11px] text-white/50 mt-1">Detección de aglomeración por IA activa</span>
              </div>

              {/* Overlay Bottom Bar */}
              <div className="p-3 bg-black/60 backdrop-blur-xs flex items-center justify-between text-xs z-10">
                <span className="text-white/80 font-medium">{cam.pax}</span>
                <button
                  onClick={() => alert(`Ampliando cámara ${cam.id} a pantalla completa...`)}
                  className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-[10px] font-bold cursor-pointer"
                >
                  Pantalla Completa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. RUNBOOKS LIBRARY & ACTIVE PROCEDURAL EXECUTION
  if (tab === 'runbooks' || tab === 'debrief') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Biblioteca de Procedimientos y Runbooks Operativos' : 'Operational Runbooks & Debrief Library'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Protocolos de actuación estandarizados paso a paso con trazabilidad y firmas de cierre.'
                    : 'Standardized step-by-step operating procedures with full auditability and electronic sign-offs.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Runbook Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { code: 'RB-01', title: 'Corte de Catenaria y Coordinación Intermodal', status: 'active', stepsCount: 9, completedSteps: 5, targetCase: 'INC-2026-0929-ATO' },
            { code: 'RB-02', title: 'Evacuación de Estación Subterránea por Humo', status: 'standby', stepsCount: 12, completedSteps: 0 },
            { code: 'RB-03', title: 'Fenómeno Meteorológico Adverso / Alerta DGT', status: 'standby', stepsCount: 8, completedSteps: 0 },
            { code: 'RB-04', title: 'Avería Masiva de Billetería y Tornos Calypso', status: 'standby', stepsCount: 6, completedSteps: 0 },
          ].map((rb) => (
            <div key={rb.code} className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0071BB]/10 text-[#0071BB]">
                  {rb.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  rb.status === 'active' ? 'bg-amber-500/10 text-amber-600 animate-pulse' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {rb.status === 'active' ? 'En Ejecución' : 'En Espera'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">{rb.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {rb.status === 'active'
                    ? `Paso 5 de ${rb.stepsCount} en progreso (Asignado al caso ${rb.targetCase})`
                    : `${rb.stepsCount} pasos operativos definidos`}
                </p>
              </div>

              {rb.status === 'active' ? (
                <button
                  onClick={() => onOpenCase?.(rb.targetCase!)}
                  className="w-full py-2 rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Abrir Runbook en Espacio del Caso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => alert(`Activando simulación para ${rb.code}...`)}
                  className="w-full py-2 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Ver Protocolo
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. SCHEDULES, SUPPLY & TIMETABLE RECONCILER
  if (tab === 'schedules' || tab === 'supply' || tab === 'change_requests' || tab === 'change_request' || tab === 'operator_services') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Horarios, Oferta y Peticiones de Modificación de Servicio' : 'Schedules, Supply & Service Modification Requests'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Reconciliación entre horario programado (GESTRA / NeTEx) y oferta real realizada por los operadores.'
                    : 'Reconciliation of scheduled timetable vs actual realised supply and fleet allocations.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Deviation Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Expediciones Programadas</span>
            <p className="text-2xl font-black text-[#1B1F24] dark:text-[#E8ECF1] mt-1">5.120</p>
            <p className="text-xs text-neutral-500 mt-0.5">Plan de servicio diario activo</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Expediciones Realizadas</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">5.108</p>
            <p className="text-xs text-neutral-500 mt-0.5">99.76% cumplimiento de oferta</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase">Peticiones de Cambio Pendientes</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">2</p>
            <p className="text-xs text-neutral-500 mt-0.5">Refuerzos festivo y desvío obras</p>
          </div>
        </div>
      </div>
    );
  }

  // 6. CITIZEN COMPLAINTS, ENQUIRIES & KNOWN ISSUES
  if (tab === 'complaints' || tab === 'enquiries' || tab === 'known_issues') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Atención al Ciudadano y Reclamaciones' : 'Citizen Complaints & Inquiries Queue'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Buzón de consultas de viajeros, problemas conocidos en red y respuestas sincronizadas con Comms Studio.'
                    : 'Passenger inquiry queue, known service issues, and templated customer care responses.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {[
            { id: 'REC-0929-01', user: 'Ana Gómez', topic: 'Retraso C-3 Atocha', status: 'answered', reply: 'Aviso enviado: Desvío por Metro L1 o Bus SE sin coste adicional' },
            { id: 'REC-0929-02', user: 'Carlos Moreno', topic: 'Ascensor Moncloa Andén L6', status: 'in_review', reply: 'Asistencia Atendo desplazada a andén' },
            { id: 'REC-0929-03', user: 'Laura Sanz', topic: 'Frecuencia Línea 27 EMT', status: 'answered', reply: 'Intervalo nominal restablecido a 4 min' },
          ].map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0071BB]">{item.id}</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{item.user}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{item.topic}</span>
                </div>
                <p className="text-[11px] text-neutral-500">{item.reply}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase self-start sm:self-auto ${
                item.status === 'answered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
              }`}>
                {item.status === 'answered' ? 'Resuelta' : 'En Gestión'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. SECURITY & CHANGE AUDIT TRAIL
  if (tab === 'audit_history' || tab === 'access_logs' || tab === 'evidence_pack') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Registro de Auditoría de Seguridad y Cambios' : 'Security Audit Trail & Change Ledger'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Trazabilidad inmutable de cambios de permisos, aperturas de caso y firmas de runbooks.'
                    : 'Immutable audit log of role assignments, case overrides, and electronic closure signatures.'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => showToast(language === 'es' ? 'Generando Paquete de Evidencias Legal (PDF)...' : 'Generating Legal Evidence Pack (PDF)...')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Exportar Paquete de Evidencias' : 'Export Evidence Pack'}</span>
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {[
            { time: '13:42:00', user: 'Andrés Molina (R03)', action: 'CASE_CLAIM', details: 'Caso INC-2026-0929-ATO reclamado formalmente', hash: 'e81a...44f2' },
            { time: '13:42:15', user: 'Andrés Molina (R03)', action: 'RUNBOOK_STEP', details: 'Paso 1 completado con firma digital', hash: 'd99c...11b0' },
            { time: '13:43:02', user: 'Andrés Molina (R03)', action: 'RUNBOOK_STEP', details: 'Paso 2 completado: Notificación operadores', hash: 'bb41...77fa' },
            { time: '12:00:00', user: 'Rubén Cano (R02)', action: 'SHIFT_HANDOVER', details: 'Traspaso de turno de mañana firmado', hash: '22c1...99ee' },
          ].map((log, idx) => (
            <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-[#1B222D]/40 font-mono text-[11px]">
              <div>
                <span className="text-neutral-400">{log.time}</span> · <span className="font-bold text-neutral-800 dark:text-neutral-200">{log.user}</span>
                <span className="text-neutral-600 dark:text-neutral-400 block font-sans text-xs mt-0.5">{log.details}</span>
              </div>
              <span className="text-neutral-400 text-[10px]">SHA-256: {log.hash}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. 112 EMERGENCY & MULTI-AGENCY INCIDENT DESK
  if (tab === 'shared_situations' || tab === 'emergency_contacts' || tab === 'status_board') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Enlace de Servicios de Emergencia (112 / ASEM)' : 'Emergency Services Liaison Desk (112)'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Canal directo de coordinación con Bomberos, SAMUR-Protección Civil y Policía.'
                    : 'Direct multi-agency channel linking CITRAM with Fire, Medical SAMUR, and Police dispatch.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-neutral-800 dark:text-neutral-200">
              Canal 112 Activo y Sincronizado · Cero Heridos Registrados en Red
            </span>
          </div>
          <span className="font-mono text-emerald-600 font-bold">112 ASEM Conectado</span>
        </div>
      </div>
    );
  }

  // 9. DGT TRAFFIC & CITY COUNCIL EVENTS CALENDAR
  if (tab === 'traffic_calendar' || tab === 'submit_event' || tab === 'my_submissions') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Calendario de Tráfico, Cortes y Obras en Vía Pública' : 'Traffic Events, Roadworks & Public Space Coordination'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Coordinación con Dirección General de Tráfico (DGT) y Ayuntamiento de Madrid.'
                    : 'Road occupancy coordination with City Council and General Traffic Directorate (DGT).'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {[
            { date: 'Hoy 15:00 - 20:00', event: 'Obras de Asfaltado en Lateral Paseo de la Castellana', impact: 'Líneas EMT 14, 27 y 150 desviadas por carril central' },
            { date: 'Domingo 08:00 - 14:00', event: 'Carrera Popular Madrid Sur (Villaverde)', impact: 'Líneas 79 y 130 con cabecera provisional' },
          ].map((ev, i) => (
            <div key={i} className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{ev.event}</span>
                <span className="font-mono text-neutral-400 text-[11px]">{ev.date}</span>
              </div>
              <p className="text-[11px] text-neutral-500">{ev.impact}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 10. TELEMETRY DATA QUALITY & SENSOR MODELS
  if (tab === 'data_quality' || tab === 'models' || tab === 'exports') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Auditoría de Calidad de Datos y Sensores N01-N23' : 'Data Quality, Telemetry Integrity & Model Drift'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Evaluación automática de pérdida de paquetes, frescura de telemetría y confianza matemática.'
                    : 'Real-time telemetry verification, packet drop audits, and statistical confidence scoring.'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onOpenTrustDrawer?.('Data Ingestion Health')}
            className="px-3 py-1.5 rounded-lg border border-[#0071BB] text-[#0071BB] text-xs font-semibold cursor-pointer"
          >
            Ver Certificado de Calidad
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
            <span className="text-neutral-400 font-bold uppercase text-[10px]">Tasa de Entrega de Paquetes</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">99.98%</p>
            <p className="text-neutral-500 mt-0.5">0 feeds caídos · Latencia 24ms</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
            <span className="text-neutral-400 font-bold uppercase text-[10px]">Puntuación de Confianza</span>
            <p className="text-2xl font-black text-[#0071BB] mt-1">98.2 / 100</p>
            <p className="text-neutral-500 mt-0.5">Conforme con ISO/TS 14827</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
            <span className="text-neutral-400 font-bold uppercase text-[10px]">Modelo Predictivo (+60m)</span>
            <p className="text-2xl font-black text-purple-600 mt-1">Activo</p>
            <p className="text-neutral-500 mt-0.5">Rendimiento nominal 99.85%</p>
          </div>
        </div>
      </div>
    );
  }

  // 11. MOBILE FIELD TASKS & ASSET CHECKLIST
  if (tab === 'mobile_tasks' || tab === 'assets' || tab === 'checklist_mobile') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        {downloadToast && (
          <div className="fixed top-20 right-6 z-50 bg-[#161B22] text-white border border-emerald-500/50 shadow-xl px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadToast}</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Órdenes de Trabajo y Mantenimiento Móvil de Campo' : 'Mobile Field Tasks & Asset Inspection'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Supervisión in situ, escaneo QR de activos, verificación de escaleras, ascensores y validadoras.'
                    : 'On-site fieldwork, asset QR barcode validation, escalators, lifts, and gate maintenance.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast(language === 'es' ? 'Lector de código QR / NFC activado' : 'Camera QR / NFC scanner activated')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#0071BB]" />
              <span>{language === 'es' ? 'Escanear Activo QR' : 'Scan Asset QR'}</span>
            </button>
            <button
              onClick={() => showToast(language === 'es' ? 'Nueva orden de trabajo abierta' : 'New work order ticket created')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071BB] text-white hover:bg-blue-700 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Crear Tarea' : 'Create Task'}</span>
            </button>
          </div>
        </div>

        {/* Task Filters */}
        <div className="flex items-center gap-2 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTaskFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                taskFilter === filter
                  ? 'bg-[#0071BB] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {filter === 'all'
                ? (language === 'es' ? 'Todas (6)' : 'All (6)')
                : filter === 'pending'
                ? (language === 'es' ? 'Pendientes (2)' : 'Pending (2)')
                : filter === 'in_progress'
                ? (language === 'es' ? 'En Curso (2)' : 'In Progress (2)')
                : (language === 'es' ? 'Completadas (2)' : 'Completed (2)')}
            </button>
          ))}
        </div>

        {/* Task Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'TSK-1049',
              titleEs: 'Revisión Ascensor PMR 02 Vestíbulo Norte',
              titleEn: 'PMR Lift 02 North Concourse Inspection',
              station: 'Atocha Cercanías',
              operator: 'Adif / Thyssenkrupp',
              status: 'in_progress',
              priority: 'urgent',
              dueTime: '14:30',
              assignee: 'Equipo Móvil 04',
            },
            {
              id: 'TSK-1050',
              titleEs: 'Limpieza y Desbloqueo Escáner QR Torno 05',
              titleEn: 'Gate 05 QR Scanner Cleaning & Reset',
              station: 'Moncloa Intercambiador',
              operator: 'Metro de Madrid',
              status: 'pending',
              priority: 'medium',
              dueTime: '15:00',
              assignee: 'Técnico R16',
            },
            {
              id: 'TSK-1051',
              titleEs: 'Inspección Catenaria Sección 3B Post-Incidente',
              titleEn: 'Catenary Section 3B Post-Incident Check',
              station: 'Atocha - Méndez Álvaro',
              operator: 'Renfe Cercanías / Adif',
              status: 'in_progress',
              priority: 'urgent',
              dueTime: '14:15',
              assignee: 'Brigada de Vía Renfe',
            },
            {
              id: 'TSK-1052',
              titleEs: 'Verificación Pantallas PIS Dársenas 11-16',
              titleEn: 'PIS Platform Displays Verification Bays 11-16',
              station: 'Plaza de Castilla',
              operator: 'Interurbanos / CRTM',
              status: 'pending',
              priority: 'low',
              dueTime: '17:00',
              assignee: 'Sistemas CITRAM',
            },
            {
              id: 'TSK-1047',
              titleEs: 'Auditoría Accesibilidad Podotáctil Andén 2',
              titleEn: 'Tactile Paving Accessibility Audit Platform 2',
              station: 'Sol Metro / Renfe',
              operator: 'Metro de Madrid',
              status: 'completed',
              priority: 'normal',
              dueTime: '12:00',
              assignee: 'Inspector de Campo R05',
            },
            {
              id: 'TSK-1048',
              titleEs: 'Comprobación Megafonía de Emergencia Bilingüe',
              titleEn: 'Emergency Bilingual PA System Test',
              station: 'Chamartín Clara Campoamor',
              operator: 'Adif / Metro',
              status: 'completed',
              priority: 'normal',
              dueTime: '11:30',
              assignee: 'Audio Ops Team',
            },
          ]
            .filter((t) => taskFilter === 'all' || t.status === taskFilter)
            .map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0071BB]">{task.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      task.status === 'in_progress'
                        ? 'bg-blue-500/10 text-[#0071BB]'
                        : task.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                    {language === 'es' ? task.titleEs : task.titleEn}
                  </h4>
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span>{task.station} · {task.operator}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] border-t border-[#DCE1E7] dark:border-[#2B3440] pt-2 text-neutral-500">
                  <span>{task.assignee}</span>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">Plazo: {task.dueTime}</span>
                </div>
                <button
                  onClick={() => showToast(language === 'es' ? `Tarea ${task.id} actualizada` : `Task ${task.id} updated`)}
                  className="w-full py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  {language === 'es' ? 'Actualizar Estado' : 'Update Status'}
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // 12. MULTIMODAL INTERCHANGE FACILITY & BAYS
  if (tab === 'interchange_view' || tab === 'docks' || tab === 'passenger_flow' || tab === 'local_alerts') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Supervisión de Intercambiadores Multimodales (Atocha / Moncloa)' : 'Multimodal Interchange Facility & Docks Monitor'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Dársenas de autobuses interurbanos y urbanos, aforos en vestíbulos y disponibilidad de escaleras y pasillos.'
                    : 'Bus departure bays, concourse crowd occupancy, escalator status, and intermodal connection protection.'}
                </p>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
            {language === 'es' ? 'Aforo Global: 64% (Normalidad)' : 'Global Occupancy: 64% (Normal)'}
          </span>
        </div>

        {/* Departure Bays Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { bay: 'Dársena 11', line: 'Bus 351', status: 'free', pax: 12, mode: 'Interurbano' },
            { bay: 'Dársena 12', line: 'Bus 352', status: 'occupied', pax: 48, mode: 'Interurbano' },
            { bay: 'Dársena 13', line: 'Bus 353', status: 'occupied', pax: 35, mode: 'Interurbano' },
            { bay: 'Dársena 14', line: 'Bus SE Atocha', status: 'held', pax: 142, mode: 'Refuerzo Especial' },
            { bay: 'Dársena 15', line: 'Bus Exprés 203', status: 'free', pax: 8, mode: 'EMT Aeropuerto' },
            { bay: 'Dársena 16', line: 'Interurbano 337', status: 'free', pax: 19, mode: 'Interurbano' },
          ].map((bay, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border space-y-1.5 ${
                bay.status === 'held'
                  ? 'border-[#0071BB] bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                  : bay.status === 'occupied'
                  ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900'
                  : 'border-emerald-500/30 bg-emerald-50/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{bay.bay}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    bay.status === 'held'
                      ? 'bg-blue-500/20 text-[#0071BB]'
                      : bay.status === 'occupied'
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {bay.status === 'held' ? (language === 'es' ? 'Retenida' : 'Held') : bay.status === 'occupied' ? (language === 'es' ? 'Ocupada' : 'Occupied') : (language === 'es' ? 'Libre' : 'Available')}
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{bay.line}</p>
              <p className="text-[10px] text-neutral-500">{bay.pax} viajeros en andén</p>
              <p className="text-[9px] text-[#0071BB] font-semibold">{bay.mode}</p>
            </div>
          ))}
        </div>

        {/* Facility Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
            <span className="text-neutral-400 font-bold uppercase text-[10px]">Escaleras Mecánicas Operativas</span>
            <p className="text-2xl font-black text-emerald-600">98.2%</p>
            <p className="text-neutral-500">54 / 55 en servicio</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
            <span className="text-neutral-400 font-bold uppercase text-[10px]">Ascensores PMR Disponibles</span>
            <p className="text-2xl font-black text-amber-600">95.0%</p>
            <p className="text-neutral-500">19 / 20 operativos (1 en mantenimiento)</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-1">
            <span className="text-neutral-400 font-bold uppercase text-[10px]">Aforo en Vestíbulo Central</span>
            <p className="text-2xl font-black text-[#0071BB]">1.240 pax</p>
            <p className="text-neutral-500">Capacidad máxima: 2.800 pax</p>
          </div>
        </div>
      </div>
    );
  }

  // 13. DEVELOPER OPEN DATA & API CATALOGUE
  if (tab === 'api_catalogue' || tab === 'my_keys' || tab === 'api_sandbox' || tab === 'feed_status') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Portal de Desarrolladores y Catálogo de APIs Abiertas' : 'Developer & Open Data Partner Portal'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Especificaciones OpenAPI v3, SIRI-VM, GTFS-Realtime y Webhooks de eventos en tiempo real.'
                    : 'OpenAPI specifications, SIRI-VM telemetry, GTFS-Realtime feeds, and event streaming webhooks.'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500">
              {language === 'es' ? 'Cuota:' : 'Quota:'} <strong>14.280 / 100.000 reqs</strong>
            </span>
          </div>
        </div>

        {/* API Protocols Switcher */}
        <div className="flex items-center gap-2 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
          {(['rest', 'siri', 'gtfs'] as const).map((proto) => (
            <button
              key={proto}
              onClick={() => setActiveApiProtocol(proto)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeApiProtocol === proto
                  ? 'bg-[#0071BB] text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {proto === 'rest' ? 'REST API v2' : proto === 'siri' ? 'SIRI-VM Telemetría' : 'GTFS-Realtime Feeds'}
            </button>
          ))}
        </div>

        {/* Interactive cURL Test */}
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">GET</span>
              <span className="font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                /api/v2/networks/{activeSite.id}/disruptions/live
              </span>
            </div>
            <button
              onClick={() => handleCopyCurl(`curl -X GET "https://api.crtm.es/v2/networks/${activeSite.id}/disruptions/live" -H "Authorization: Bearer crtm_live_demo_key"`)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCurl ? (language === 'es' ? 'Copiado!' : 'Copied!') : (language === 'es' ? 'Copiar cURL' : 'Copy cURL')}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#090C10] text-neutral-200 font-mono text-xs overflow-x-auto">
{`{
  "status": "success",
  "data": {
    "site": "${activeSite.id}",
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

  // 14. PASSENGER MOBILITY & LIVE DEPARTURES
  if (tab === 'live_departures' || tab === 'planner_mobile' || tab === 'disruptions') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Panel de Próximas Salidas Multimodales y Avisos en Vivo' : 'Real-time Multimodal Departures & Disruption Alerts'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'es'
                    ? 'Salidas en tiempo real por andén, transbordos accesibles e incidencias en curso.'
                    : 'Real-time departures by platform, accessible connections, and active travel alerts.'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={liveSearchQuery}
              onChange={(e) => setLiveSearchQuery(e.target.value)}
              placeholder={language === 'es' ? 'Filtrar línea o destino...' : 'Filter line or destination...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0071BB]"
            />
          </div>
        </div>

        {/* Active Disruption Alert Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{language === 'es' ? 'Aviso Importante: Retrasos en Cercanías C-3 y C-4' : 'Travel Alert: Delays on Lines C-3 and C-4'}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs">
            {language === 'es'
              ? 'Por avería en catenaria en Atocha, se recomiendan itinerarios alternativos con Metro Línea 1 o el Servicio Especial gratuito de autobuses.'
              : 'Due to catenary issue at Atocha, alternative routing is recommended via Metro Line 1 or the free Special Bus Service.'}
          </p>
        </div>

        {/* Live Departures List */}
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#DCE1E7] dark:border-[#2B3440] font-bold text-xs flex justify-between items-center">
            <span>{language === 'es' ? 'Estación Central / Atocha Intercambiador' : 'Central Hub / Atocha Interchange'}</span>
            <span className="text-[10px] text-neutral-400">{language === 'es' ? 'Actualizado cada 15s' : 'Updated every 15s'}</span>
          </div>

          <div className="divide-y divide-[#DCE1E7] dark:divide-[#2B3440]">
            {liveDepartures
              .filter((d) => !liveSearchQuery || d.name.toLowerCase().includes(liveSearchQuery.toLowerCase()))
              .map((dep, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center"
                      style={{ backgroundColor: dep.color }}
                    >
                      {dep.lineCode}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{dep.name}</h4>
                      <p className="text-[11px] text-neutral-500">{dep.platform}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{dep.eta}</span>
                    <p className={`text-[10px] font-bold ${dep.delay.includes('+') ? 'text-red-500' : 'text-emerald-600'}`}>
                      {dep.delay}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // Default Fallback for other niche role tabs
  return (
    <div className="p-6 max-w-7xl mx-auto bg-white dark:bg-[#161B22] rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#0071BB]" />
        <h3 className="font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1] capitalize">
          {tab.replace('_', ' ')}
        </h3>
      </div>
      <p className="text-xs text-neutral-500">
        Vista operativa activa para el perfil {effectiveRole.nameEs}. Todos los datos sincronizados en tiempo real con CITRAM.
      </p>
    </div>
  );
};
