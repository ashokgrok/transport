import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { getSiteShiftData } from '../../data/multiSiteData';
import {
  Users,
  Clock,
  Timer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Building2,
  Shield,
  ArrowRight,
  Send,
  Radio,
} from 'lucide-react';

interface ShiftOperationsBoardProps {
  initialSubTab?: 'team' | 'shift_log' | 'handover' | 'sla_board';
  onOpenCase?: (caseId: string) => void;
  onOpenTrustDrawer?: (title: string) => void;
}

export const ShiftOperationsBoard: React.FC<ShiftOperationsBoardProps> = ({
  initialSubTab = 'team',
  onOpenCase,
  onOpenTrustDrawer,
}) => {
  const { language } = useAuth();
  const { activeSite } = useSite();

  const [activeTab, setActiveTab] = useState<'team' | 'shift_log' | 'handover' | 'sla_board'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const siteShift = getSiteShiftData(activeSite.id);
  const [signedHandover, setSignedHandover] = useState(false);
  const [signatureName, setSignatureName] = useState(`${siteShift.shiftLead.name} (${siteShift.shiftLead.roleId} - Shift Lead)`);

  useEffect(() => {
    setSignatureName(`${siteShift.shiftLead.name} (${siteShift.shiftLead.roleId} - Shift Lead)`);
    setSignedHandover(false);
  }, [activeSite.id]);

  const [checklist, setChecklist] = useState([
    { id: 'chk-1', textEs: 'Todas las consolas de operadores han reconocido las alarmas de prioridad alta', textEn: 'All operator consoles acknowledged high-priority alarms', checked: true },
    { id: 'chk-2', textEs: 'Caso crítico de transporte activo coordinado con servicios de refuerzo', textEn: 'Active critical transport case coordinated with relief services', checked: true },
    { id: 'chk-3', textEs: 'Paneles de andén e información al viajero sincronizados con aviso oficial', textEn: 'Platform PIS screens and mobile apps synchronized with disruption notice', checked: true },
    { id: 'chk-4', textEs: 'Avisos de enlaces y retención de dársena verificados con operadores', textEn: 'Transfer hold and bay dispatch verified with operators', checked: true },
    { id: 'chk-5', textEs: 'Comprobación de enlace 112 y ausencia de heridos o emergencias médicas', textEn: '112 emergency liaison check confirmed zero passenger casualties', checked: true },
  ]);

  const teamMembers = siteShift.team;
  const shiftEvents = siteShift.events;
  const slaClocks = siteShift.slaClocks;

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es'
                  ? 'Gestión de Turno, Equipo y Relojes SLA'
                  : 'Operational Shift Team, Handover & SLA Clocks'}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? `Turno de Mañana en curso (06:00 - 14:30) · Jefe de Turno: Rubén Cano (${activeSite.shortName}).`
                  : `Morning Shift active (06:00 - 14:30) · Shift Lead: Rubén Cano (${activeSite.shortName}).`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
            {language === 'es' ? '6 Consolas Activas' : '6 Active Consoles'}
          </span>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
        {[
          { id: 'team' as const, labelEs: 'Panel de Equipo y Consolas', labelEn: 'Team & Console Status', icon: <Users className="w-4 h-4" /> },
          { id: 'shift_log' as const, labelEs: 'Libro de Novedades del Turno', labelEn: 'Shift Logbook', icon: <FileText className="w-4 h-4" /> },
          { id: 'handover' as const, labelEs: 'Protocolo de Relevo / Handover', labelEn: 'Shift Handover Protocol', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'sla_board' as const, labelEs: 'Relojes de Resolución SLA', labelEn: 'SLA Resolution Clocks', icon: <Timer className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0071BB] text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab.icon}
            <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: TEAM */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.roleId}
              className="p-4 rounded-xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0071BB]/10 text-[#0071BB]">
                  {member.roleId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En Guardia</span>
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">{member.name}</h4>
                <p className="text-xs text-neutral-500">{member.title}</p>
              </div>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>{member.console}</span>
                <span className="text-emerald-600 font-mono font-bold">100% Acuse</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SHIFT LOG */}
      {activeTab === 'shift_log' && (
        <div className="rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Cronología de Novedades del Turno' : 'Shift Logbook Chronology'}
            </h3>
            <span className="text-xs text-neutral-400">Horas sincronizadas con UTC+1</span>
          </div>

          <div className="space-y-3">
            {shiftEvents.map((evt, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#0E1217] border border-[#DCE1E7] dark:border-[#2B3440] flex items-start gap-3">
                <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8] shrink-0 pt-0.5">
                  {evt.time}
                </span>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {evt.author}
                  </span>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {language === 'es' ? evt.textEs : evt.textEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HANDOVER */}
      {activeTab === 'handover' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs p-6 space-y-6">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                {language === 'es' ? 'Protocolo de Relevo y Traspaso de Turno' : 'Shift Handover & Verification Protocol'}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Verificación obligatoria de 5 puntos antes de transferir el mando al turno entrante.'
                  : 'Mandatory 5-point verification checklist before command transfer to oncoming shift lead.'}
              </p>
            </div>
            {signedHandover && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Firmado Electrónicamente</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="p-3.5 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#0E1217] flex items-center justify-between cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#0071BB] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {language === 'es' ? item.textEs : item.textEn}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Verificado</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                Firma Digital del Jefe de Turno Saliente:
              </span>
              <span className="font-mono text-neutral-500 text-[11px]">
                {signatureName} · Certificado SHA-256: e8b4...12f0
              </span>
            </div>

            <button
              onClick={() => setSignedHandover(true)}
              disabled={signedHandover}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                signedHandover
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-default'
                  : 'bg-[#0071BB] hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {signedHandover ? '✓ Relevo Firmado' : 'Firmar Acta de Traspaso'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SLA BOARD */}
      {activeTab === 'sla_board' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slaClocks.map((clock) => (
              <div
                key={clock.caseId}
                className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
                    {clock.caseId}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                    clock.severity === 'critical' ? 'bg-red-500/10 text-red-600 animate-pulse' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {clock.severity}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                    {language === 'es' ? clock.titleEs : clock.titleEn}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    {language === 'es' ? clock.nextMilestoneEs : clock.nextMilestoneEn}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#0E1217] border border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-500">Tiempo Restante:</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {clock.remainingMinutes} min
                  </span>
                </div>

                <button
                  onClick={() => onOpenCase?.(clock.caseId)}
                  className="w-full py-2 rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'es' ? 'Abrir Caso en Curso' : 'Open Active Case'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
