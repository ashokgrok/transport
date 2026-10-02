import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import {
  Inbox,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Send,
  Building2,
  Bus,
  Train,
  ShieldAlert,
} from 'lucide-react';

interface OperatorInstruction {
  id: string;
  sender: string;
  targetOperator: string;
  timestamp: string;
  caseId: string;
  titleEs: string;
  titleEn: string;
  instructionTextEs: string;
  instructionTextEn: string;
  status: 'pending_ack' | 'acknowledged' | 'in_progress' | 'deviation_requested' | 'completed';
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  deviationNote?: string;
}

const INITIAL_INSTRUCTIONS: OperatorInstruction[] = [
  {
    id: 'INS-2026-001',
    sender: 'Andrés Molina (R03 - CITRAM)',
    targetOperator: 'EMT Madrid (R06)',
    timestamp: '13:42:45',
    caseId: 'INC-2026-0929-ATO',
    titleEs: 'Despacho de Servicio Especial de Refuerzo (4 autobuses articulados)',
    titleEn: 'Dispatch Special Relief Bus Service (4 articulated buses)',
    instructionTextEs: 'Activar Servicio Especial Atocha - Méndez Álvaro con 4 unidades articuladas desde cochera Entrevías para suplir vía férrea cortada.',
    instructionTextEn: 'Activate Special Service Atocha - Méndez Álvaro with 4 articulated units from Entrevías depot to replace disrupted rail section.',
    status: 'acknowledged',
    acknowledgedAt: '13:43:18',
    acknowledgedBy: 'Beatriz Lara (R06 - EMT)',
  },
  {
    id: 'INS-2026-002',
    sender: 'Lucía Ferrer (R01 - CITRAM)',
    targetOperator: 'Consorcio Interurbanos (R06)',
    timestamp: '13:45:10',
    caseId: 'INC-2026-0929-ATO',
    titleEs: 'Orden de Retención Intermodal Autobús Línea 352 (+4 min)',
    titleEn: 'Intermodal Hold Order for Bus Line 352 (+4 min)',
    instructionTextEs: 'Retener salida en Dársena 14 por 4 minutos para transbordo de 142 viajeros de Cercanías C-3.',
    instructionTextEn: 'Hold departure at Bay 14 for 4 minutes to guarantee transfer for 142 Cercanías C-3 passengers.',
    status: 'pending_ack',
  },
  {
    id: 'INS-2026-003',
    sender: 'Andrés Molina (R03 - CITRAM)',
    targetOperator: 'Metro de Madrid (R07)',
    timestamp: '13:44:00',
    caseId: 'INC-2026-0929-ATO',
    titleEs: 'Apertura de Tornos y Exención Tarifaria Línea 1 Atocha Renfe',
    titleEn: 'Turnstile Gate Release & Fare Exemption Line 1 Atocha Renfe',
    instructionTextEs: 'Liberar paso sin cargo en tornos 4 a 8 de Línea 1 Atocha para canalizar pasaje de Cercanías.',
    instructionTextEn: 'Release gates 4 through 8 at Line 1 Atocha without fare charge to absorb diverted Cercanías ridership.',
    status: 'acknowledged',
    acknowledgedAt: '13:44:35',
    acknowledgedBy: 'Javier Santos (R07 - Metro)',
  },
];

export const OperatorInboxView: React.FC = () => {
  const { language, effectiveRole } = useAuth();
  const { activeSite } = useSite();

  const [instructions, setInstructions] = useState<OperatorInstruction[]>(INITIAL_INSTRUCTIONS);
  const [selectedInstruction, setSelectedInstruction] = useState<OperatorInstruction | null>(null);
  const [deviationText, setDeviationText] = useState('');
  const [isDeviationModalOpen, setIsDeviationModalOpen] = useState(false);

  const handleAcknowledge = (instructionId: string) => {
    const now = new Date().toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setInstructions((prev) =>
      prev.map((ins) =>
        ins.id === instructionId
          ? {
              ...ins,
              status: 'acknowledged',
              acknowledgedAt: now,
              acknowledgedBy: `${effectiveRole.demoAccount.fullName} (${effectiveRole.id})`,
            }
          : ins
      )
    );
  };

  const handleRequestDeviation = () => {
    if (!selectedInstruction || !deviationText.trim()) return;
    setInstructions((prev) =>
      prev.map((ins) =>
        ins.id === selectedInstruction.id
          ? {
              ...ins,
              status: 'deviation_requested',
              deviationNote: deviationText.trim(),
            }
          : ins
      )
    );
    setIsDeviationModalOpen(false);
    setDeviationText('');
    setSelectedInstruction(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Bandeja de Entrada de Instrucciones Operativas (Bandeja de Operador)'
                : 'Operational Instructions Inbox (Operator Desk)'}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {language === 'es'
              ? 'Recepción bidireccional de órdenes mandatorias, acuses de recibo en 1 clic y solicitudes de desviación entre CITRAM y operadores.'
              : 'Two-way dispatch of mandatory orders, 1-click acknowledgments, and deviation requests between CITRAM and operating agencies.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-neutral-600 dark:text-neutral-400">
            {language === 'es' ? 'Pendientes de Acuse:' : 'Pending Acknowledgment:'}{' '}
            <strong className="text-amber-600">{instructions.filter((i) => i.status === 'pending_ack').length}</strong>
          </span>
        </div>
      </div>

      {/* Instructions List */}
      <div className="space-y-3">
        {instructions.map((ins) => {
          const isPending = ins.status === 'pending_ack';
          const isAck = ins.status === 'acknowledged';

          return (
            <div
              key={ins.id}
              className={`p-5 rounded-2xl border transition-all ${
                isPending
                  ? 'border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs'
                  : 'border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0071BB] dark:text-[#5AAEE8]">
                      {ins.id}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                      {language === 'es' ? 'Caso:' : 'Case:'} {ins.caseId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isPending
                          ? 'bg-amber-500/10 text-amber-600 animate-pulse'
                          : isAck
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      {ins.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                    {language === 'es' ? ins.titleEs : ins.titleEn}
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {language === 'es' ? ins.instructionTextEs : ins.instructionTextEn}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-neutral-500">
                    <span>{language === 'es' ? 'Emisor:' : 'Sender:'} <strong>{ins.sender}</strong> ({ins.timestamp})</span>
                    <span>{language === 'es' ? 'Destinatario:' : 'Recipient:'} <strong className="text-[#0071BB]">{ins.targetOperator}</strong></span>
                    {ins.acknowledgedAt && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {language === 'es'
                          ? `✓ Acuse firmado por ${ins.acknowledgedBy} a las ${ins.acknowledgedAt}`
                          : `✓ Acknowledgment signed by ${ins.acknowledgedBy} at ${ins.acknowledgedAt}`}
                      </span>
                    )}
                    {ins.deviationNote && (
                      <span className="text-amber-600 font-medium">
                        {language === 'es'
                          ? `⚠️ Desviación solicitada: "${ins.deviationNote}"`
                          : `⚠️ Deviation requested: "${ins.deviationNote}"`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Operator Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {isPending && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedInstruction(ins);
                          setIsDeviationModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        {language === 'es' ? 'Solicitar Aclaración / Desviación' : 'Request Clarification / Deviation'}
                      </button>
                      <button
                        onClick={() => handleAcknowledge(ins.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Firmar Acuse de Recibo (1 clic)' : 'Sign Acknowledgment (1-click)'}</span>
                      </button>
                    </>
                  )}

                  {isAck && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'es' ? 'Instrucción Acusada y en Ejecución' : 'Instruction Acknowledged & In Progress'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deviation Modal */}
      {isDeviationModalOpen && selectedInstruction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#161B22] rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] p-5 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'es' ? 'Solicitud de Desviación Operativa' : 'Operational Deviation Request'}</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'es'
                  ? 'Indique el motivo técnico por el cual no se puede ejecutar la orden según la propuesta de CITRAM.'
                  : 'Specify technical justification explaining why the CITRAM directive cannot be executed as proposed.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                {language === 'es' ? 'Justificación Técnica del Operador:' : 'Operator Technical Justification:'}
              </label>
              <textarea
                value={deviationText}
                onChange={(e) => setDeviationText(e.target.value)}
                placeholder={
                  language === 'es'
                    ? 'Ejemplo: Imposible retener más de 2 min por enlace crítico en destino final...'
                    : 'Example: Unable to hold beyond 2 min due to critical connection at terminal...'
                }
                className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-1 focus:ring-[#0071BB]"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440]">
              <button
                onClick={() => setIsDeviationModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-medium cursor-pointer"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleRequestDeviation}
                disabled={!deviationText.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                {language === 'es' ? 'Enviar Solicitud a Sala' : 'Submit Request to Control Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
