/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CITRAM Control Tower Portal — Consorcio Regional de Transportes de Madrid
 */

import React, { useState } from 'react';
import { SiteProvider, useSite } from './services/siteContext';
import { AuthProvider, useAuth } from './services/authContext';
import { Header } from './components/Header';
import { NavigationRail } from './components/NavigationRail';
import { MfaModal } from './components/MfaModal';
import { LoginModal } from './components/LoginModal';
import { CommandPalette } from './components/CommandPalette';
import { DataTrustDrawer } from './components/trust/DataTrustDrawer';
import { ControlTowerView } from './components/tower/ControlTowerView';
import { MasterChecklistModal } from './components/MasterChecklistModal';
import { AdminVerificationPage } from './components/admin/AdminVerificationPage';
import { ScenarioControllerModal } from './components/simulator/ScenarioControllerModal';
import { ShowAndTellRehearsalRunner } from './components/simulator/ShowAndTellRehearsalRunner';
import { PresenterTools } from './components/presenter/PresenterTools';
import { RoleSpecificDashboard } from './components/roles/RoleSpecificDashboard';
import { AlertFloodView } from './components/alerts/AlertFloodView';
import { IncidentWorkspace } from './components/cases/IncidentWorkspace';
import { ConnectionProtectionView } from './components/intermodal/ConnectionProtectionView';
import { AccessibilityRoutingView } from './components/accessibility/AccessibilityRoutingView';
import { PassengerCommsStudio } from './components/comms/PassengerCommsStudio';
import { OperatorInboxView } from './components/operator/OperatorInboxView';
import { RbacMatrixEditor } from './components/admin/RbacMatrixEditor';
import { AdminControlCenter } from './components/admin/AdminControlCenter';
import { ActorDirectoryModal } from './components/network/ActorDirectoryModal';
import { NetworkExplorer } from './components/network/NetworkExplorer';
import { RoleId } from './types';
import { PunctualityBoard } from './components/operations/PunctualityBoard';
import { ConcessionComplianceBoard } from './components/operations/ConcessionComplianceBoard';
import { ShiftOperationsBoard } from './components/operations/ShiftOperationsBoard';
import { OperationsUniversalDesk } from './components/operations/OperationsUniversalDesk';
import { DemoScriptModal } from './components/demo/DemoScriptModal';
import { t } from './services/localization';
import {
  FolderOpen,
  Activity,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, effectiveRole, language, hasPermission, isWallDisplay, toggleWallDisplay, loginAsRole } = useAuth();
  const { activeSite, isSwitchingSite } = useSite();

  const [currentTab, setCurrentTab] = useState<string>('tower');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isActorDirectoryOpen, setIsActorDirectoryOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isDemoScriptOpen, setIsDemoScriptOpen] = useState(false);
  const [mapFps, setMapFps] = useState<number>(60);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('S2');
  const [trustDrawerState, setTrustDrawerState] = useState<{ isOpen: boolean; title: string }>({
    isOpen: false,
    title: '',
  });

  const handleOpenTrustDrawer = (title: string) => {
    setTrustDrawerState({ isOpen: true, title });
  };

  const handleOpenCase = (caseId: string) => {
    setCurrentTab('cases');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8] dark:bg-[#0E1217] text-[#1B1F24] dark:text-[#E8ECF1] transition-colors duration-200">
      {/* Top Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorModalOpen(true)}
        onOpenDemoScript={() => setIsDemoScriptOpen(true)}
      />

      {/* Main Body with Dynamic Navigation Rail & Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dynamic Left Rail limited to ≤ 7 items */}
        <NavigationRail
          currentTab={currentTab}
          onSelectTab={(tabId) => setCurrentTab(tabId)}
        />

        {/* Viewport Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Continuous 7-Scene Show-and-Tell Rehearsal Guide */}
          <ShowAndTellRehearsalRunner
            currentTab={currentTab}
            onSelectTab={(tabId) => setCurrentTab(tabId)}
            onOpenSimulatorModal={() => setIsSimulatorModalOpen(true)}
          />
          {/* Site Switching Loader Screen if changing tenant (< 300 ms) */}
          {isSwitchingSite ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#0071BB] border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-500 font-medium">
                {language === 'es' ? 'Cargando topología y reglas del sitio...' : 'Loading site topology and rules...'}
              </p>
            </div>
          ) : (
            <>
              {/* Tab: Control Tower (Glance / Focus) */}
              {currentTab === 'tower' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <ControlTowerView
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                    onFpsUpdate={(fps) => setMapFps(fps)}
                  />
                </div>
              )}

              {/* Tab: Punctuality & Headway Regularity Board */}
              {(currentTab === 'punctuality' || currentTab === 'operators') && (
                <div className="animate-in fade-in duration-150">
                  <PunctualityBoard
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}

              {/* Tab: Concession Compliance, KPIs, Penalties & Contract Disputes */}
              {(currentTab === 'compliance' || currentTab === 'penalties' || currentTab === 'disputes' || currentTab === 'kpis') && (
                <div className="animate-in fade-in duration-150">
                  <ConcessionComplianceBoard
                    initialSubTab={currentTab === 'penalties' ? 'penalties' : currentTab === 'disputes' ? 'disputes' : currentTab === 'kpis' ? 'kpis' : 'compliance'}
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}

              {/* Tab: Shift Lead & Team Operations Board */}
              {(currentTab === 'team_board' || currentTab === 'shift_log' || currentTab === 'handover' || currentTab === 'sla_board') && (
                <div className="animate-in fade-in duration-150">
                  <ShiftOperationsBoard
                    initialSubTab={currentTab === 'team_board' ? 'team' : currentTab === 'shift_log' ? 'shift_log' : currentTab === 'handover' ? 'handover' : 'sla_board'}
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}

              {/* Tab: Multimodal Network Explorer / Supply */}
              {(currentTab === 'supply' || currentTab === 'explore') && (
                <div className="animate-in fade-in duration-150">
                  <NetworkExplorer
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                    onOpenActorDirectory={() => setIsActorDirectoryOpen(true)}
                  />
                </div>
              )}

              {/* Tab: Admin Suite - RBAC Matrix Editor */}
              {currentTab === 'admin_roles' && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="roles" />
                </div>
              )}

              {/* Tab: Admin Suite - Parameters & Per-Site SLAs */}
              {currentTab === 'admin_params' && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="parameters" />
                </div>
              )}

              {/* Tab: Admin Suite - Telemetry Feeds & Integrations */}
              {(currentTab === 'admin_feeds' || currentTab === 'feed_validator' || currentTab === 'connectors') && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="feeds" />
                </div>
              )}

              {/* Tab: Admin Suite - Sites Portfolio */}
              {currentTab === 'portfolio_sites' && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="sites" />
                </div>
              )}

              {/* Tab: Admin Suite - Site Creation & Onboarding Wizard */}
              {(currentTab === 'site_onboarding' || currentTab === 'sites_in_progress' || currentTab === 'onboarding_wizard') && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="onboarding" />
                </div>
              )}

              {/* Tab: Admin Suite - Module Feature Flags */}
              {(currentTab === 'admin_modules' || currentTab === 'releases') && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="modules" />
                </div>
              )}

              {/* Tab: Admin Suite - Users & Accounts Directory */}
              {currentTab === 'admin_users' && (
                <div className="animate-in fade-in duration-150">
                  <AdminControlCenter initialSubTab="users" />
                </div>
              )}

              {/* Tab: Dedicated Admin Verification & Test Cases Page (Fases 1 a 7 & Checklist TC) */}
              {(currentTab === 'admin_verification' || currentTab === 'verification' || currentTab === 'test_cases') && (
                <div className="animate-in fade-in duration-150">
                  <AdminVerificationPage
                    activeScenarioId={activeScenarioId}
                    mapFps={mapFps}
                    isLaserActive={isLaserActive}
                    isSpotlightActive={isSpotlightActive}
                    onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
                    onOpenSimulator={() => setIsSimulatorModalOpen(true)}
                    onNavigateTab={(tab) => setCurrentTab(tab)}
                  />
                </div>
              )}

              {/* Tab: Cases Workspace */}
              {currentTab === 'cases' && (
                <div className="animate-in fade-in duration-150">
                  <IncidentWorkspace
                    onBackToTower={() => setCurrentTab('tower')}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}

              {/* Tab: Alerts Flood Stream */}
              {currentTab === 'alerts' && (
                <div className="animate-in fade-in duration-150">
                  <AlertFloodView
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}

              {/* Tab: Intermodal Connection Protection */}
              {(currentTab === 'connections' || currentTab === 'connections_risk') && (
                <div className="animate-in fade-in duration-150">
                  <ConnectionProtectionView onOpenTrustDrawer={handleOpenTrustDrawer} />
                </div>
              )}

              {/* Tab: Accessible Routing & PMR */}
              {currentTab === 'accessibility' && (
                <div className="animate-in fade-in duration-150">
                  <AccessibilityRoutingView />
                </div>
              )}

              {/* Tab: Passenger Comms Studio */}
              {(currentTab === 'messages' || currentTab === 'comms' || currentTab === 'drafts' || currentTab === 'channels' || currentTab === 'preview' || currentTab === 'templates') && (
                <div className="animate-in fade-in duration-150">
                  <PassengerCommsStudio />
                </div>
              )}

              {/* Tab: Operator Dispatch Inbox */}
              {currentTab === 'operator_inbox' && (
                <div className="animate-in fade-in duration-150">
                  <OperatorInboxView />
                </div>
              )}

              {/* Tab: Operations Universal Desk (Briefings, Inspections, Video, Runbooks, Schedules, Complaints, Audits, Emergencies, Events, Sensor Models, Mobile Tasks, Interchanges, APIs, Departures) */}
              {['overview', 'briefing', 'inspections', 'findings', 'reports', 'video', 'runbooks', 'debrief', 'schedules', 'change_requests', 'change_request', 'operator_services', 'complaints', 'enquiries', 'known_issues', 'audit_history', 'access_logs', 'evidence_pack', 'shared_situations', 'emergency_contacts', 'status_board', 'traffic_calendar', 'submit_event', 'my_submissions', 'data_quality', 'models', 'exports', 'dashboards', 'mobile_tasks', 'assets', 'checklist_mobile', 'interchange_view', 'docks', 'passenger_flow', 'local_alerts', 'api_catalogue', 'my_keys', 'api_sandbox', 'feed_status', 'live_departures', 'planner_mobile', 'disruptions'].includes(currentTab) && (
                <div className="animate-in fade-in duration-150">
                  <OperationsUniversalDesk
                    tab={currentTab}
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}

              {/* Role-Specific Specialized Views Fallback */}
              {['role_dashboard', 'role_home'].includes(currentTab) && (
                <div className="animate-in fade-in duration-150">
                  <RoleSpecificDashboard
                    onOpenCase={handleOpenCase}
                    onOpenTrustDrawer={handleOpenTrustDrawer}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MFA Modal when required */}
      <MfaModal />

      {/* 21 Roles Catalogue Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* 23 Non-Human Actors Directory Modal (ACT-01 to ACT-05) */}
      <ActorDirectoryModal
        isOpen={isActorDirectoryOpen}
        onClose={() => setIsActorDirectoryOpen(false)}
      />

      {/* Master 33 Test Cases & Evaluation Criteria Checklist Modal */}
      <MasterChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          if (tab === 'checklist') {
            setCurrentTab('admin_verification');
          } else if (tab === 'actors') {
            setIsActorDirectoryOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
      />

      {/* Data Trust Inspector Drawer */}
      <DataTrustDrawer
        isOpen={trustDrawerState.isOpen}
        onClose={() => setTrustDrawerState({ isOpen: false, title: '' })}
        factTitle={trustDrawerState.title}
      />

      {/* Presenter Tools Floating Dock (Láser, Spotlight, Muro 4K, Audio) */}
      <PresenterTools
        isWallMode={isWallDisplay}
        onToggleWallMode={toggleWallDisplay}
        isLaserPointerActive={isLaserActive}
        onToggleLaserPointer={() => setIsLaserActive(!isLaserActive)}
        isSpotlightActive={isSpotlightActive}
        onToggleSpotlight={() => setIsSpotlightActive(!isSpotlightActive)}
      />

      {/* 8 Disruption Scenarios & Chaos Injector Modal (S1-S8) */}
      <ScenarioControllerModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        activeScenarioId={activeScenarioId}
        onSelectScenario={(scId) => {
          setActiveScenarioId(scId);
          if (scId === 'S1') {
            setCurrentTab('tower');
          } else if (scId === 'S2' || scId === 'S3') {
            setCurrentTab('alerts');
          } else if (scId === 'S6') {
            setCurrentTab('accessibility');
          }
        }}
        onResetSimulation={() => {
          setActiveScenarioId('S1');
          setCurrentTab('tower');
        }}
      />

      {/* CITRAM Presentation Master Demo Script Modal */}
      <DemoScriptModal
        isOpen={isDemoScriptOpen}
        onClose={() => setIsDemoScriptOpen(false)}
        onSelectRoleAndTab={(roleId, tab) => {
          loginAsRole(roleId as RoleId);
          setCurrentTab(tab);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </SiteProvider>
  );
}
