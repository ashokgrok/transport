import React from 'react';
import { useAuth } from '../services/authContext';
import { t } from '../services/localization';
import {
  Radio,
  Activity,
  AlertTriangle,
  FolderOpen,
  Camera,
  MessageSquare,
  BookOpen,
  Users,
  Timer,
  GitBranch,
  FileCheck,
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  ShieldAlert,
  BarChart3,
  Database,
  Cpu,
  Inbox,
  Sparkles,
  Sliders,
  Settings,
  Flame,
  Smartphone,
  Compass,
  Accessibility,
  CheckCircle2,
} from 'lucide-react';

interface NavigationRailProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ currentTab, onSelectTab }) => {
  const { effectiveRole, language } = useAuth();

  // Mapping tab IDs to icons and translation keys
  const navItemDefs: Record<string, { labelKey: string; icon: React.ReactNode }> = {
    tower: { labelKey: 'nav.tower', icon: <Radio className="w-4 h-4" /> },
    alerts: { labelKey: 'nav.alerts', icon: <Flame className="w-4 h-4" /> },
    cases: { labelKey: 'nav.cases', icon: <FolderOpen className="w-4 h-4" /> },
    video: { labelKey: 'nav.video', icon: <Camera className="w-4 h-4" /> },
    messages: { labelKey: 'nav.messages', icon: <MessageSquare className="w-4 h-4" /> },
    shift_log: { labelKey: 'nav.shift_log', icon: <Clock className="w-4 h-4" /> },
    team_board: { labelKey: 'nav.team_board', icon: <Users className="w-4 h-4" /> },
    sla_board: { labelKey: 'nav.sla_board', icon: <Timer className="w-4 h-4" /> },
    handover: { labelKey: 'nav.handover', icon: <FileText className="w-4 h-4" /> },
    runbooks: { labelKey: 'nav.runbooks', icon: <BookOpen className="w-4 h-4" /> },
    comms: { labelKey: 'nav.comms', icon: <MessageSquare className="w-4 h-4" /> },
    connections: { labelKey: 'nav.connections', icon: <GitBranch className="w-4 h-4" /> },
    accessibility: { labelKey: 'nav.accessibility', icon: <Accessibility className="w-4 h-4" /> },
    debrief: { labelKey: 'nav.debrief', icon: <FileCheck className="w-4 h-4" /> },
    schedules: { labelKey: 'nav.schedules', icon: <Calendar className="w-4 h-4" /> },
    change_requests: { labelKey: 'nav.change_requests', icon: <Activity className="w-4 h-4" /> },
    supply: { labelKey: 'nav.supply', icon: <Layers className="w-4 h-4" /> },
    inspections: { labelKey: 'nav.inspections', icon: <FileCheck className="w-4 h-4" /> },
    findings: { labelKey: 'nav.findings', icon: <AlertTriangle className="w-4 h-4" /> },
    compliance: { labelKey: 'nav.compliance', icon: <ShieldAlert className="w-4 h-4" /> },
    kpis: { labelKey: 'nav.kpis', icon: <BarChart3 className="w-4 h-4" /> },
    penalties: { labelKey: 'nav.penalties', icon: <FileText className="w-4 h-4" /> },
    dashboards: { labelKey: 'nav.dashboards', icon: <BarChart3 className="w-4 h-4" /> },
    data_quality: { labelKey: 'nav.data_quality', icon: <Database className="w-4 h-4" /> },
    models: { labelKey: 'nav.models', icon: <Cpu className="w-4 h-4" /> },
    overview: { labelKey: 'nav.overview', icon: <BarChart3 className="w-4 h-4" /> },
    punctuality: { labelKey: 'nav.punctuality', icon: <Timer className="w-4 h-4" /> },
    briefing: { labelKey: 'nav.briefing', icon: <FileText className="w-4 h-4" /> },
    complaints: { labelKey: 'nav.complaints', icon: <HelpCircle className="w-4 h-4" /> },
    admin_users: { labelKey: 'nav.admin_users', icon: <Users className="w-4 h-4" /> },
    admin_roles: { labelKey: 'nav.admin_roles', icon: <ShieldAlert className="w-4 h-4" /> },
    admin_verification: { labelKey: 'nav.admin_verification', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    admin_modules: { labelKey: 'nav.admin_modules', icon: <Sliders className="w-4 h-4" /> },
    admin_feeds: { labelKey: 'nav.admin_feeds', icon: <Database className="w-4 h-4" /> },
    admin_params: { labelKey: 'nav.admin_params', icon: <Settings className="w-4 h-4" /> },
    audit_history: { labelKey: 'nav.audit_history', icon: <FileText className="w-4 h-4" /> },
    operator_services: { labelKey: 'nav.operator_services', icon: <Activity className="w-4 h-4" /> },
    operator_inbox: { labelKey: 'nav.operator_inbox', icon: <Inbox className="w-4 h-4" /> },
    connections_risk: { labelKey: 'nav.connections_risk', icon: <GitBranch className="w-4 h-4" /> },
    interchange_view: { labelKey: 'nav.interchange_view', icon: <Compass className="w-4 h-4" /> },
    mobile_tasks: { labelKey: 'nav.mobile_tasks', icon: <Smartphone className="w-4 h-4" /> },
    shared_situations: { labelKey: 'nav.shared_situations', icon: <ShieldAlert className="w-4 h-4" /> },
    traffic_calendar: { labelKey: 'nav.traffic_calendar', icon: <Calendar className="w-4 h-4" /> },
    live_departures: { labelKey: 'nav.live_departures', icon: <Clock className="w-4 h-4" /> },
    api_catalogue: { labelKey: 'nav.api_catalogue', icon: <Cpu className="w-4 h-4" /> },
    portfolio_sites: { labelKey: 'nav.portfolio_sites', icon: <Sliders className="w-4 h-4" /> },
    sites_in_progress: { labelKey: 'nav.sites_in_progress', icon: <Sparkles className="w-4 h-4" /> },
    site_onboarding: { labelKey: 'nav.site_onboarding', icon: <Sparkles className="w-4 h-4" /> },
    onboarding_wizard: { labelKey: 'nav.onboarding_wizard', icon: <Sparkles className="w-4 h-4" /> },
    feed_validator: { labelKey: 'nav.feed_validator', icon: <Database className="w-4 h-4" /> },
    connectors: { labelKey: 'nav.connectors', icon: <GitBranch className="w-4 h-4" /> },
    releases: { labelKey: 'nav.releases', icon: <Sparkles className="w-4 h-4" /> },
    operators: { labelKey: 'nav.operators', icon: <Layers className="w-4 h-4" /> },
    disputes: { labelKey: 'nav.disputes', icon: <FileText className="w-4 h-4" /> },
    reports: { labelKey: 'nav.reports', icon: <FileCheck className="w-4 h-4" /> },
    change_request: { labelKey: 'nav.change_request', icon: <Activity className="w-4 h-4" /> },
    docks: { labelKey: 'nav.docks', icon: <Compass className="w-4 h-4" /> },
    passenger_flow: { labelKey: 'nav.passenger_flow', icon: <Users className="w-4 h-4" /> },
    local_alerts: { labelKey: 'nav.local_alerts', icon: <AlertTriangle className="w-4 h-4" /> },
    explore: { labelKey: 'nav.explore', icon: <Layers className="w-4 h-4" /> },
    exports: { labelKey: 'nav.exports', icon: <Database className="w-4 h-4" /> },
    drafts: { labelKey: 'nav.drafts', icon: <FileText className="w-4 h-4" /> },
    channels: { labelKey: 'nav.channels', icon: <Radio className="w-4 h-4" /> },
    preview: { labelKey: 'nav.preview', icon: <Smartphone className="w-4 h-4" /> },
    templates: { labelKey: 'nav.templates', icon: <FileText className="w-4 h-4" /> },
    assets: { labelKey: 'nav.assets', icon: <Cpu className="w-4 h-4" /> },
    checklist_mobile: { labelKey: 'nav.checklist_mobile', icon: <FileCheck className="w-4 h-4" /> },
    enquiries: { labelKey: 'nav.enquiries', icon: <HelpCircle className="w-4 h-4" /> },
    known_issues: { labelKey: 'nav.known_issues', icon: <AlertTriangle className="w-4 h-4" /> },
    access_logs: { labelKey: 'nav.access_logs', icon: <FileText className="w-4 h-4" /> },
    evidence_pack: { labelKey: 'nav.evidence_pack', icon: <ShieldAlert className="w-4 h-4" /> },
    emergency_contacts: { labelKey: 'nav.emergency_contacts', icon: <ShieldAlert className="w-4 h-4" /> },
    status_board: { labelKey: 'nav.status_board', icon: <Activity className="w-4 h-4" /> },
    submit_event: { labelKey: 'nav.submit_event', icon: <Calendar className="w-4 h-4" /> },
    my_submissions: { labelKey: 'nav.my_submissions', icon: <FileCheck className="w-4 h-4" /> },
    planner_mobile: { labelKey: 'nav.planner_mobile', icon: <Compass className="w-4 h-4" /> },
    disruptions: { labelKey: 'nav.disruptions', icon: <Flame className="w-4 h-4" /> },
    my_keys: { labelKey: 'nav.my_keys', icon: <Cpu className="w-4 h-4" /> },
    api_sandbox: { labelKey: 'nav.api_sandbox', icon: <Sliders className="w-4 h-4" /> },
    feed_status: { labelKey: 'nav.feed_status', icon: <Database className="w-4 h-4" /> },
  };

  // Enforce NAV-01 and VIEW-02: at most seven navigation items for the signed-in role!
  const allowedNavKeys = effectiveRole.mainNav.slice(0, 7);

  const focusQuestion = language === 'es' ? effectiveRole.homeQuestionEs : effectiveRole.homeQuestionEn;

  return (
    <aside className="w-56 shrink-0 border-r border-[#DCE1E7] dark:border-[#2B3440] bg-white dark:bg-[#161B22] flex flex-col justify-between py-3 transition-colors duration-200">
      <div className="space-y-3.5 px-3 overflow-y-auto">
        {/* Role Home Focus Question Header */}
        <div className="p-2.5 rounded-lg bg-[#F5F6F8] dark:bg-[#0E1217] border border-[#DCE1E7] dark:border-[#2B3440] shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {language === 'es' ? 'Enfoque Operativo' : 'Operational Focus'}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] font-bold">
              {effectiveRole.id}
            </span>
          </div>

          <div className="text-[11px] leading-snug text-[#1B1F24] dark:text-[#E8ECF1] font-medium flex items-start gap-1.5">
            <span className="text-[#0071BB] dark:text-[#5AAEE8] font-bold text-xs shrink-0 select-none leading-none mt-0.5">
              ›
            </span>
            <span>{focusQuestion}</span>
          </div>
        </div>

        {/* Navigation List strictly limited to ≤ 7 items */}
        <nav className="space-y-1">
          <div className="px-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            {language === 'es' ? 'Vistas Asignadas (máx 7)' : 'Assigned Views (max 7)'}
          </div>
          {allowedNavKeys.map((key) => {
            const def = navItemDefs[key] || {
              labelKey: key,
              icon: <Activity className="w-4 h-4" />,
            };
            const isActive = currentTab === key;
            return (
              <button
                key={key}
                onClick={() => onSelectTab(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0071BB] text-white shadow-xs font-semibold'
                    : 'text-[#4F5B67] dark:text-[#A3AEBB] hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}>
                  {def.icon}
                </span>
                <span className="truncate">{t(def.labelKey, language)}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Profile Tag at Bottom */}
      <div className="px-3 pt-3 border-t border-[#DCE1E7] dark:border-[#2B3440]">
        <div className="text-[11px] font-semibold text-[#1B1F24] dark:text-[#E8ECF1] truncate">
          {effectiveRole.demoAccount.fullName}
        </div>
        <div className="text-[10px] text-neutral-500 font-mono">
          {effectiveRole.id} · {effectiveRole.demoAccount.username}
        </div>
      </div>
    </aside>
  );
};
