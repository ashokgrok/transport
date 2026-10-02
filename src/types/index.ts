/**
 * CITRAM Control Tower Portal — Core TypeScript Types
 * Designed in compliance with Consorcio Regional de Transportes de Madrid (CRTM)
 */

export type SiteStatus = 'live' | 'draft' | 'onboarding' | 'suspended';

export interface DecisionCardItem {
  id: string;
  title: string;
  incidentType: string;
  severity: 'critical' | 'high' | 'medium' | 'moderate' | 'low';
  whatHappened: string;
  impact: string;
  recommendedAction: string;
  reason: string;
  timeLeftMinutes: number;
  slaTargetMinutes: number;
  primaryActionLabel: string;
  affectedLines: string[];
}

export interface SiteFeedConfig {
  id: string;
  name: string;
  type: 'GTFS-RT' | 'SIRI-SX' | 'SIRI-ET' | 'SCADA-LIFTS' | 'TURNSTILE-TAP' | 'CCTV-STREAM' | 'DGT-TRAFFIC' | '112-EMERGENCY';
  endpoint: string;
  status: 'healthy' | 'degraded' | 'offline';
  latencyMs: number;
  recordsPerSec: number;
  lastIngestion: string;
  authMode: 'api_key' | 'bearer' | 'oauth2' | 'mutual_tls';
  apiKeyMasked?: string;
  enabled: boolean;
  refreshIntervalSeconds: number;
  targetOperators?: string[];
  protocolVersion?: string;
}

export interface SiteParameters {
  incidentAutoDeclareDelayMinutes: number; // e.g. 8
  connectionHoldMaxMinutes: number; // e.g. 5
  headwayToleranceSeconds: number; // e.g. 120
  overcrowdingThresholdPaxPerM2: number; // e.g. 3.5
  criticalSlaTargetMinutes: number; // e.g. 45
  liftUnavailabilityEscalationMinutes: number; // e.g. 15
  autoReplayBufferHours: number; // e.g. 24
  retentionDays: number; // e.g. 90
}

export interface SiteModuleConfig {
  control_tower: boolean;
  intermodal_connections: boolean;
  accessible_routing: boolean;
  passenger_comms: boolean;
  runbook_automation: boolean;
  alert_flood_engine: boolean;
  simulator_rehearsal: boolean;
}

export interface SiteConfig {
  id: string;
  name: string;
  shortName: string;
  city?: string;
  tagline: string;
  region: string;
  country: string;
  status: SiteStatus;
  primaryColor: string; // Brand color (never used as status/error)
  logoUrl?: string;
  timeZone: string;
  units: 'metric' | 'imperial';
  language: 'es' | 'en';
  operatingDayStart: string; // e.g. "04:30"
  enforcementMode: 'enforced' | 'open_demo';
  headlineIndicators: string[];
  maxDecisionCards: number;
  parameters?: SiteParameters;
  feeds?: SiteFeedConfig[];
  modules?: SiteModuleConfig;
  operatorsCount?: number;
  linesCount?: number;
  stationsCount?: number;
}

export type RoleId =
  | 'R01' | 'R02' | 'R03' | 'R04' | 'R05'
  | 'R06' | 'R07' | 'R08' | 'R09' | 'R10'
  | 'R11' | 'R12' | 'R13' | 'R14' | 'R15'
  | 'R16' | 'R17' | 'R18' | 'R19' | 'R20' | 'R21';

export type RoleGroup =
  | 'Authority staff (contractor)'
  | 'Authority staff (CRTM)'
  | 'Authority staff (CRTM IT)'
  | 'Operators'
  | 'Interchange entities'
  | 'Operators and maintainers'
  | 'Emergency services'
  | 'City councils, DGT'
  | 'Public'
  | 'Third parties'
  | 'Platform provider';

export interface RoleDefinition {
  id: RoleId;
  nameEs: string;
  nameEn: string;
  demoAccount: {
    username: string;
    fullName: string;
    titleEs: string;
    titleEn: string;
    avatarUrl?: string;
    organization: string;
  };
  group: RoleGroup;
  requiresMfa: boolean;
  dataScope: string;
  homeQuestionEs: string;
  homeQuestionEn: string;
  mainNav: string[];
  keyActions: string[];
}

export type PermissionLevel = 'off' | 'view' | 'edit';

export type PermissionKey =
  | 'tower.glance'
  | 'tower.explore'
  | 'alerts.view'
  | 'alerts.promote'
  | 'cases.view'
  | 'cases.claim'
  | 'cases.edit'
  | 'cases.instruct'
  | 'cases.close'
  | 'cases.override_checklist'
  | 'runbooks.view'
  | 'runbooks.execute'
  | 'runbooks.kill_switch'
  | 'messages.draft'
  | 'messages.approve'
  | 'messages.publish'
  | 'connections.view'
  | 'connections.hold_approve'
  | 'connections.edit_params'
  | 'schedule.view'
  | 'schedule.approve_changes'
  | 'sla.view_board'
  | 'sla.edit_policies'
  | 'operator.inbox'
  | 'operator.acknowledge'
  | 'operator.request_change'
  | 'inspections.record'
  | 'compliance.review'
  | 'compliance.penalties'
  | 'data.view_feeds'
  | 'data.silence_feed'
  | 'analytics.dashboards'
  | 'analytics.export'
  | 'admin.sites'
  | 'admin.users'
  | 'admin.roles'
  | 'admin.modules'
  | 'admin.audit'
  | 'simulator.run'
  | 'simulator.chaos';

export type RolePermissionsMatrix = Record<RoleId, Record<PermissionKey, PermissionLevel>>;

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type FactType = 'Measured' | 'Operator-reported' | 'Operator-confirmed' | 'Predicted' | 'Inferred' | 'Manual';
export type FactFreshness = 'Live' | 'Delayed' | 'Stale' | 'Silent';

export interface DataTrustBadge {
  type: FactType;
  freshness: FactFreshness;
  ageSeconds: number;
  sourceId: string;
  sourceName: string;
  confidenceScore?: number; // 0 to 100
  arbitrationRuleApplied?: string;
}

export interface NonHumanActor {
  id: string; // N01 to N23
  name: string;
  organization: string;
  sends: string;
  receives: string;
  interface: string;
  failureAction: string;
  protocol: 'SIRI' | 'GTFS-RT' | 'AF-191' | 'REST' | 'OIDC' | 'Internal' | 'Event Stream';
  status: 'healthy' | 'degraded' | 'stale' | 'silent' | 'simulated';
  lastMessageTime: string;
  messageRatePerSec: number;
  latencyMs: number;
  qualityScore: number; // 0 to 100
  owner: string;
  backupSourceId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  siteId: string;
  userId: string;
  userName: string;
  roleId: RoleId;
  action: string;
  details: string;
  ipAddress?: string;
}

// Phase 4: Incident Workspace & 5-Dimensional State
export type IncidentLifecycle = 'detected' | 'triaged' | 'active' | 'mitigating' | 'restoring' | 'resolved' | 'closed';
export type IncidentUrgency = 'immediate' | 'urgent' | 'standard' | 'deferred';
export type IncidentReliability = 'confirmed' | 'probable' | 'suspected' | 'unconfirmed';
export type IncidentOperationalStatus = 'normal' | 'minor_delays' | 'major_disruption' | 'service_suspended' | 'evacuated';
export type IncidentResolutionStatus = 'unassigned' | 'investigating' | 'mitigation_in_progress' | 'restored' | 'signoff_complete';

export interface FiveDimensionalState {
  lifecycle: IncidentLifecycle;
  urgency: IncidentUrgency;
  reliability: IncidentReliability;
  operationalStatus: IncidentOperationalStatus;
  resolution: IncidentResolutionStatus;
}

export interface RunbookStep {
  id: number; // 1 to 9 for the standard closure checklist
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  actorRole: string; // e.g. "R01 / R03"
  nonHumanActor?: string; // e.g. "N01 (EMT), N03 (Renfe)"
  status: 'pending' | 'in_progress' | 'completed' | 'skipped_with_override';
  completedAt?: string;
  completedBy?: string;
  overrideReason?: string;
  evidenceNotes?: string;
  actionPayload?: {
    type: 'notify' | 'dispatch_buses' | 'passenger_message' | 'hold_connection' | 'route_waiver' | 'accessibility' | 'adif_clearance' | 'documentation';
    details: string;
  };
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  type: 'status_change' | 'action_executed' | 'communication' | 'operator_note' | 'actor_telemetry' | 'decision';
  actorId: string;
  actorName: string;
  actorRole: string;
  description: string;
  dataBadge?: DataTrustBadge;
}

export interface IncidentCase {
  id: string;
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  dimensions: FiveDimensionalState;
  severity: SeverityLevel;
  primaryCorridor: string;
  affectedLines: string[];
  affectedStations: string[];
  affectedPassengersCount: number;
  claimedBy?: {
    userId: string;
    fullName: string;
    roleId: RoleId;
    roleName: string;
    claimedAt: string;
  };
  detectedAt: string;
  slaTargetMinutes: number;
  slaTimeRemainingMinutes: number;
  runbook: {
    id: string;
    code: string;
    name: string;
    steps: RunbookStep[];
  };
  timeline: IncidentTimelineEvent[];
  intermodalConnection?: {
    trainService: string;
    targetBusLine: string;
    interchangeStation: string;
    holdingMinutes: number;
    passengersBenefiting: number;
    subsequentKnockOnDelaySeconds: number;
    costImpactEuros: number;
    judgment: 'RECOMMENDED' | 'NOT_RECOMMENDED';
    status: 'pending_approval' | 'approved' | 'rejected' | 'executed';
  };
  reinforcements?: {
    requiredBuses: number;
    dispatchedBuses: number;
    originDepot: string;
    targetRoute: string;
    status: 'requested' | 'assigned' | 'in_transit' | 'on_station';
  };
  passengerCommunications?: {
    status: 'draft' | 'approved' | 'published';
    channels: string[];
    headlineEs: string;
    headlineEn: string;
    bodyEs: string;
    bodyEn: string;
  };
}

