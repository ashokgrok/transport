import { DataTrustBadge, FactType, FactFreshness } from '../types';

export interface CandidateSourceEvaluation {
  sourceId: string;
  sourceName: string;
  protocol: string;
  reportedValue: string;
  ageSeconds: number;
  qualityScore: number;
  status: 'selected' | 'discarded';
  reason: string;
}

export interface ArbitrationDecision {
  factId: string;
  factTitle: string;
  selectedSource: CandidateSourceEvaluation;
  candidates: CandidateSourceEvaluation[];
  ruleName: string;
  ruleDescription: string;
  evaluatedAt: string;
  confidenceScore: number;
}

export class DataTrustService {
  /**
   * Determine freshness label and state based on age in seconds
   */
  static getFreshness(ageSeconds: number): { freshness: FactFreshness; label: string } {
    if (ageSeconds <= 5) {
      return { freshness: 'Live', label: `Live · ${ageSeconds}s` };
    } else if (ageSeconds <= 30) {
      return { freshness: 'Delayed', label: `Delayed · ${ageSeconds}s` };
    } else if (ageSeconds <= 120) {
      return { freshness: 'Stale', label: `Stale · ${ageSeconds}s` };
    } else {
      return { freshness: 'Silent', label: `Silent · >${Math.round(ageSeconds / 60)}m` };
    }
  }

  /**
   * Evaluate competing sources for Scene 3 (Atocha connecting bus position)
   */
  static evaluateBusPositionArbitration(): ArbitrationDecision {
    const candidateA: CandidateSourceEvaluation = {
      sourceId: 'N06',
      sourceName: 'Telemetría Directa On-Board (GPS SAE)',
      protocol: 'JSON Event Stream',
      reportedValue: 'A 900 m de parada Atocha (08:40:12)',
      ageSeconds: 2,
      qualityScore: 98,
      status: 'selected',
      reason: 'Dato en tiempo real directo con latencia < 100ms y cobertura satelital óptima.',
    };

    const candidateB: CandidateSourceEvaluation = {
      sourceId: 'N05',
      sourceName: 'Sistema Central Operador Interurbano',
      protocol: 'SIRI-VM / AF-191',
      reportedValue: 'En dársena Atocha (08:39:16)',
      ageSeconds: 58,
      qualityScore: 72,
      status: 'discarded',
      reason: 'Dato obsoleto con 58s de retraso; supera el umbral de tolerancia de 30s.',
    };

    return {
      factId: 'fact-bus-352-pos',
      factTitle: 'Ubicación y Tiempo de Llegada: Bus Interurbano 352 (Atocha)',
      selectedSource: candidateA,
      candidates: [candidateA, candidateB],
      ruleName: 'RULE-DAT-04-FRESHNESS-PREFERENCE',
      ruleDescription:
        'Preferir la fuente de telemetría directa (N06) cuando la discrepancia de antigüedad supere 30 segundos sobre el sistema central del operador (N05).',
      evaluatedAt: new Date().toLocaleTimeString('es-ES'),
      confidenceScore: 96,
    };
  }

  /**
   * Anonymize driver inputs as per PRD ACT-05
   * Drivers are never given portal accounts; their inputs appear as anonymized vehicle events.
   */
  static anonymizeDriverEvent(rawEvent: {
    driverBadgeNumber?: string;
    driverName?: string;
    vehicleId: string;
    lineCode: string;
    eventType: string;
    timestamp: string;
  }) {
    return {
      eventType: rawEvent.eventType,
      vehicleId: rawEvent.vehicleId,
      lineCode: rawEvent.lineCode,
      timestamp: rawEvent.timestamp,
      provenance: 'ANONYMIZED_CABIN_TELEMETRY',
      operatorScope: 'Concession Operator Shared Event',
    };
  }
}
