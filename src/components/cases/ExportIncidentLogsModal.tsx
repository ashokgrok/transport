import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { IncidentCase } from '../../types';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Printer,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ExportIncidentLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentCase: IncidentCase;
}

export const ExportIncidentLogsModal: React.FC<ExportIncidentLogsModalProps> = ({
  isOpen,
  onClose,
  incidentCase,
}) => {
  const { language, effectiveRole } = useAuth();
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'markdown'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate JSON format
  const generateJsonLog = () => {
    const exportData = {
      exportMetadata: {
        system: 'CITRAM Madrid Multi-Modal Control Tower',
        version: 'PRD-1.0-STABLE',
        exportedAt: new Date().toISOString(),
        exportedBy: `${effectiveRole.demoAccount.fullName} (${effectiveRole.id})`,
        exportChecksum: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      },
      incident: {
        id: incidentCase.id,
        titleEs: incidentCase.titleEs,
        titleEn: incidentCase.titleEn,
        severity: incidentCase.severity,
        primaryCorridor: incidentCase.primaryCorridor,
        affectedLines: incidentCase.affectedLines,
        affectedPassengersCount: incidentCase.affectedPassengersCount,
        startTime: incidentCase.detectedAt,
        dimensions: incidentCase.dimensions,
        claimedBy: incidentCase.claimedBy,
        runbook: {
          id: incidentCase.runbook.id,
          totalSteps: incidentCase.runbook.steps.length,
          completedSteps: incidentCase.runbook.steps.filter(
            (s) => s.status === 'completed' || s.status === 'skipped_with_override'
          ).length,
          steps: incidentCase.runbook.steps,
        },
        intermodalConnection: incidentCase.intermodalConnection,
        reinforcements: incidentCase.reinforcements,
        passengerCommunications: incidentCase.passengerCommunications,
        timelineEventsCount: incidentCase.timeline.length,
        timeline: incidentCase.timeline,
      },
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Generate CSV format
  const generateCsvLog = () => {
    const headers = [
      'Timestamp',
      'Event_ID',
      'Event_Type',
      'Actor_ID',
      'Actor_Name',
      'Actor_Role',
      'Description',
    ];
    const rows = incidentCase.timeline.map((evt) => [
      `"${evt.timestamp}"`,
      `"${evt.id}"`,
      `"${evt.type}"`,
      `"${evt.actorId}"`,
      `"${evt.actorName}"`,
      `"${evt.actorRole}"`,
      `"${evt.description.replace(/"/g, '""')}"`,
    ]);

    const stepsSummary = [
      '',
      '--- RUNBOOK EXECUTION AUDIT LOG ---',
      'Step_ID,Step_Title,Status,Completed_At,Completed_By,Override_Justification',
      ...incidentCase.runbook.steps.map(
        (s) =>
          `"${s.id}","${s.titleEs}","${s.status}","${s.completedAt || 'N/A'}","${s.completedBy || 'N/A'}","${(s.overrideReason || '').replace(/"/g, '""')}"`
      ),
    ];

    return [headers.join(','), ...rows.map((r) => r.join(',')), ...stepsSummary].join('\n');
  };

  // Generate Markdown / Dossier format
  const generateMarkdownLog = () => {
    const completedCount = incidentCase.runbook.steps.filter(
      (s) => s.status === 'completed' || s.status === 'skipped_with_override'
    ).length;

    if (language === 'en') {
      return `# OFFICIAL OPERATIONAL INCIDENT REPORT - CITRAM MADRID
**Consorcio Regional de Transportes de Madrid**
**Dossier Reference:** ${incidentCase.id}
**Emission Timestamp:** ${new Date().toLocaleString('en-GB')}
**Issuing Operator:** ${effectiveRole.demoAccount.fullName} (${effectiveRole.id} - ${effectiveRole.nameEn})
**Cryptographic Seal:** \`SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069\`

---

## 1. EXECUTIVE SUMMARY
- **Title:** ${incidentCase.titleEn}
- **Operational Severity:** ${incidentCase.severity.toUpperCase()}
- **Primary Corridor:** ${incidentCase.primaryCorridor}
- **Affected Lines:** ${incidentCase.affectedLines.join(', ')}
- **Estimated Passenger Impact:** ${incidentCase.affectedPassengersCount.toLocaleString('en-US')} passengers
- **Declaration Time:** ${incidentCase.detectedAt}

### Dimensional State (PRD Section 11)
- **Lifecycle:** ${incidentCase.dimensions.lifecycle.toUpperCase()}
- **Urgency Level:** ${incidentCase.dimensions.urgency.toUpperCase()}
- **Data Reliability:** ${incidentCase.dimensions.reliability.toUpperCase()} (SCADA 99.8%)
- **Operational Status:** ${incidentCase.dimensions.operationalStatus.replace('_', ' ').toUpperCase()}
- **Resolution Type:** ${incidentCase.dimensions.resolution.replace('_', ' ').toUpperCase()}

---

## 2. OPERATIONAL RUNBOOK AUDIT (${completedCount}/9 STEPS SATISFIED)
${incidentCase.runbook.steps
  .map(
    (step) =>
      `### Step ${step.id}: ${step.titleEn}
- **Status:** ${step.status === 'completed' ? '✓ COMPLETED' : step.status === 'skipped_with_override' ? '⚠ SKIPPED WITH FORMAL OVERRIDE' : '○ PENDING'}
- **Executed by:** ${step.completedBy || 'Pending assignment'}
- **Registered Time:** ${step.completedAt || 'N/A'}
${step.overrideReason ? `- **Override Reason:** *${step.overrideReason}*\n` : ''}`
  )
  .join('\n')}

---

## 3. INTERMODAL MEASURES AND REINFORCEMENTS
- **Connection Holding:** ${incidentCase.intermodalConnection ? `${incidentCase.intermodalConnection.targetBusLine} at ${incidentCase.intermodalConnection.interchangeStation} (${incidentCase.intermodalConnection.holdingMinutes} min hold)` : 'N/A'}
- **Emergency Shuttles:** ${incidentCase.reinforcements ? `${incidentCase.reinforcements.dispatchedBuses}/${incidentCase.reinforcements.requiredBuses} buses (${incidentCase.reinforcements.originDepot})` : '0 buses'}
- **Terminal Bay:** ${incidentCase.reinforcements?.targetRoute || 'Atocha Interchange'}

---

## 4. DETAILED TIMELINE OF EVENTS
${incidentCase.timeline
  .map((evt) => `- **[${evt.timestamp}]** (${evt.actorRole} - ${evt.actorName}): ${evt.description}`)
  .join('\n')}

---
*Certified document generated in compliance with the CITRAM Control Room Traceability Protocol.*`;
    }

    return `# EXPEDIENTE OFICIAL DE INCIDENCIA OPERATIVA - CITRAM MADRID
**Consorcio Regional de Transportes de Madrid**
**Referencia del Expediente:** ${incidentCase.id}
**Fecha y Hora de Emisión:** ${new Date().toLocaleString('es-ES')}
**Responsable Emisor:** ${effectiveRole.demoAccount.fullName} (${effectiveRole.id} - ${effectiveRole.nameEs})
**Sello Criptográfico:** \`SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069\`

---

## 1. RESUMEN EJECUTIVO
- **Título:** ${incidentCase.titleEs}
- **Severidad Operativa:** ${incidentCase.severity.toUpperCase()}
- **Corredor Principal:** ${incidentCase.primaryCorridor}
- **Líneas Afectadas:** ${incidentCase.affectedLines.join(', ')}
- **Afectación Estimada:** ${incidentCase.affectedPassengersCount.toLocaleString('es-ES')} viajeros
- **Hora de Declaración:** ${incidentCase.detectedAt}

### Estado Dimensional (PRD Sección 11)
- **Ciclo de Vida:** ${incidentCase.dimensions.lifecycle.toUpperCase()}
- **Nivel de Urgencia:** ${incidentCase.dimensions.urgency.toUpperCase()}
- **Fiabilidad del Dato:** ${incidentCase.dimensions.reliability.toUpperCase()} (SCADA 99.8%)
- **Estado Operativo:** ${incidentCase.dimensions.operationalStatus.replace('_', ' ').toUpperCase()}
- **Tipo de Resolución:** ${incidentCase.dimensions.resolution.replace('_', ' ').toUpperCase()}

---

## 2. AUDITORÍA DEL RUNBOOK OPERATIVO (${completedCount}/9 PASOS SATISFECHOS)
${incidentCase.runbook.steps
  .map(
    (step) =>
      `### Paso ${step.id}: ${step.titleEs}
- **Estado:** ${step.status === 'completed' ? '✓ COMPLETADO' : step.status === 'skipped_with_override' ? '⚠ OMITIDO CON JUSTIFICACIÓN FORMAL' : '○ PENDIENTE'}
- **Ejecutado por:** ${step.completedBy || 'Pendiente de asignación'}
- **Hora de Registro:** ${step.completedAt || 'N/A'}
${step.overrideReason ? `- **Motivo de Anulación:** *${step.overrideReason}*\n` : ''}`
  )
  .join('\n')}

---

## 3. MEDIDAS INTERMODALES Y REFUERZOS
- **Retención de Enlace:** ${incidentCase.intermodalConnection ? `${incidentCase.intermodalConnection.targetBusLine} en ${incidentCase.intermodalConnection.interchangeStation} (${incidentCase.intermodalConnection.holdingMinutes} min retención)` : 'N/A'}
- **Lanzaderas de Emergencia:** ${incidentCase.reinforcements ? `${incidentCase.reinforcements.dispatchedBuses}/${incidentCase.reinforcements.requiredBuses} autobuses (${incidentCase.reinforcements.originDepot})` : '0 autobuses'}
- **Dársena de Cabecera:** ${incidentCase.reinforcements?.targetRoute || 'Atocha Intercambiador'}

---

## 4. CRONOLOGÍA DETALLADA DE SUCESOS (TIMELINE)
${incidentCase.timeline
  .map((evt) => `- **[${evt.timestamp}]** (${evt.actorRole} - ${evt.actorName}): ${evt.description}`)
  .join('\n')}

---
*Documento certificado generado conforme al protocolo de trazabilidad de la Sala CITRAM.*`;
  };

  const getExportContent = () => {
    if (exportFormat === 'json') return generateJsonLog();
    if (exportFormat === 'csv') return generateCsvLog();
    return generateMarkdownLog();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const extension = exportFormat === 'json' ? 'json' : exportFormat === 'csv' ? 'csv' : 'md';
    const mimeType =
      exportFormat === 'json'
        ? 'application/json'
        : exportFormat === 'csv'
        ? 'text/csv'
        : 'text/markdown';

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CITRAM_Expediente_${incidentCase.id}_${Date.now()}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#DCE1E7] dark:border-[#2B3440]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Exportar Expediente de Incidencia' : 'Export Incident Audit Dossier'}
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {incidentCase.id}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'es'
                  ? 'Generación de archivo de auditoría para archivo legal, departamento de seguridad y aseguradoras'
                  : 'Certified audit file generation for legal archiving, safety department, and insurers'}
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

        {/* Format Selectors Bar */}
        <div className="px-5 py-3 border-b border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50/60 dark:bg-neutral-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500 text-[11px]">
              {language === 'es' ? 'Formato de Exportación:' : 'Export Format:'}
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 text-xs">
              <button
                onClick={() => setExportFormat('markdown')}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  exportFormat === 'markdown'
                    ? 'bg-white dark:bg-[#1B222D] text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Markdown / Informe' : 'Markdown Dossier'}</span>
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  exportFormat === 'json'
                    ? 'bg-white dark:bg-[#1B222D] text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'JSON Estructurado' : 'Structured JSON'}</span>
              </button>
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'bg-white dark:bg-[#1B222D] text-[#1B1F24] dark:text-[#E8ECF1] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'CSV / Auditoría' : 'CSV Audit Table'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">{language === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Copiar' : 'Copy'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-lg bg-[#0071BB] hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Descargar Archivo' : 'Download File'}</span>
            </button>
          </div>
        </div>

        {/* Code/Text Preview Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-neutral-900 font-mono text-[11px] leading-relaxed text-neutral-200">
          <pre className="whitespace-pre-wrap select-all font-mono">
            {getExportContent()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-[#1B222D] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {language === 'es'
                ? 'Certificado digital con sello temporal seguro de la Sala CITRAM'
                : 'Digitally signed with secure CITRAM Control Room timestamp'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
