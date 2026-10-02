import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { RoleId, PermissionKey, PermissionLevel } from '../../types';
import { ALL_ROLES } from '../../data/rolesData';
import { Shield, ShieldAlert, Check, X, Eye, RotateCcw, AlertTriangle } from 'lucide-react';

export const RbacMatrixEditor: React.FC = () => {
  const {
    permissionsMatrix,
    updatePermission,
    resetPermissions,
    setPreviewRoleId,
    effectiveRole,
    language,
  } = useAuth();

  const { activeSite, updateSiteConfig } = useSite();

  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('R01');
  const [filterQuery, setFilterQuery] = useState('');

  const permissionKeys: { key: PermissionKey; category: string; description: string }[] = [
    { key: 'tower.glance', category: 'Tower', description: 'Access Glance View (3 KPIs, 5 decision cards)' },
    { key: 'tower.explore', category: 'Tower', description: 'Access Explore View (all layers, replay, tables)' },
    { key: 'alerts.view', category: 'Alerts', description: 'View raw alert flood stream & rate gauge' },
    { key: 'alerts.promote', category: 'Alerts', description: 'Promote alert cluster into active case' },
    { key: 'cases.view', category: 'Cases', description: 'View case workspaces' },
    { key: 'cases.claim', category: 'Cases', description: 'Claim ownership of an open case' },
    { key: 'cases.edit', category: 'Cases', description: 'Update case scope, severity, and details' },
    { key: 'cases.instruct', category: 'Cases', description: 'Send formal instructions to transport operators' },
    { key: 'cases.close', category: 'Cases', description: 'Complete debrief and close resolved case' },
    { key: 'cases.override_checklist', category: 'Cases', description: 'Override mandatory closure checklist with waiver' },
    { key: 'runbooks.view', category: 'Runbooks', description: 'View runbook library and active steps' },
    { key: 'runbooks.execute', category: 'Runbooks', description: 'Execute and tick runbook operational steps' },
    { key: 'runbooks.kill_switch', category: 'Runbooks', description: 'Activate emergency automation kill switch' },
    { key: 'messages.draft', category: 'Passenger Comms', description: 'Draft passenger advisory messages' },
    { key: 'messages.approve', category: 'Passenger Comms', description: 'Approve drafted passenger notices' },
    { key: 'messages.publish', category: 'Passenger Comms', description: 'Publish messages to App, Web & Station Panels' },
    { key: 'connections.view', category: 'Connections', description: 'View connection protection board' },
    { key: 'connections.hold_approve', category: 'Connections', description: 'Approve connection vehicle hold request' },
    { key: 'connections.edit_params', category: 'Connections', description: 'Edit connection margin & buffer thresholds' },
    { key: 'operator.inbox', category: 'Operator', description: 'Access operator instructions inbox' },
    { key: 'operator.acknowledge', category: 'Operator', description: 'Acknowledge received instructions' },
    { key: 'admin.roles', category: 'Admin', description: 'Modify RBAC matrix permissions' },
    { key: 'admin.sites', category: 'Admin', description: 'Switch and configure multi-tenant sites' },
  ];

  const filteredPerms = permissionKeys.filter(
    (p) =>
      p.key.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const selectedRole = ALL_ROLES.find((r) => r.id === selectedRoleId) || ALL_ROLES[0];

  return (
    <div className="space-y-5 p-4 max-w-6xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0071BB] dark:text-[#5AAEE8]" />
            <h2 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Gestión de Control de Acceso y Permisos (RBAC)' : 'Role-Based Access Control (RBAC)'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'es'
              ? 'Los cambios se propagan a las sesiones abiertas en menos de 2 segundos sin cerrar sesión.'
              : 'Permission toggles propagate to active browser sessions in < 2 seconds without logout.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Enforcement Mode Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs">
            <span className="text-neutral-500 font-medium">{language === 'es' ? 'Modo:' : 'Mode:'}</span>
            <select
              value={activeSite.enforcementMode}
              onChange={(e) =>
                updateSiteConfig(activeSite.id, {
                  enforcementMode: e.target.value as 'enforced' | 'open_demo',
                })
              }
              className="font-semibold bg-transparent border-0 cursor-pointer text-[#1B1F24] dark:text-[#E8ECF1] focus:ring-0"
            >
              <option value="enforced">{language === 'es' ? 'Enforced (Estricto)' : 'Enforced (Strict)'}</option>
              <option value="open_demo">{language === 'es' ? 'Open Demo (Dispensa General)' : 'Open Demo (General Waiver)'}</option>
            </select>
          </div>

          {/* Reset Defaults button */}
          <button
            onClick={resetPermissions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium cursor-pointer text-neutral-600 dark:text-neutral-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Restablecer' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Role Picker & Preview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#161B22] p-3 rounded-xl border border-[#DCE1E7] dark:border-[#2B3440]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
            {language === 'es' ? 'Rol a Configurar:' : 'Role to Configure:'}
          </span>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value as RoleId)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-[#1B1F24] dark:text-[#E8ECF1] cursor-pointer"
          >
            {ALL_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.demoAccount.fullName} ({language === 'es' ? r.nameEs : r.nameEn})
              </option>
            ))}
          </select>
        </div>

        {/* Preview Button (RBAC-07) */}
        <button
          onClick={() => setPreviewRoleId(selectedRoleId)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'es' ? `Previsualizar Portal como ${selectedRole.id}` : `Preview Portal as ${selectedRole.id}`}</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder={language === 'es' ? 'Filtrar capacidades o módulos...' : 'Filter capabilities or modules...'}
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-72 px-3 py-1.5 text-xs bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] rounded-lg text-[#1B1F24] dark:text-[#E8ECF1]"
        />
        <div className="text-xs text-neutral-500">
          {language === 'es'
            ? `Mostrando ${filteredPerms.length} capacidades de ${permissionKeys.length}`
            : `Showing ${filteredPerms.length} of ${permissionKeys.length} capabilities`}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="rounded-xl border border-[#DCE1E7] dark:border-[#2B3440] overflow-hidden bg-white dark:bg-[#161B22] shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 font-semibold">
              <th className="py-2.5 px-4 w-32">{language === 'es' ? 'Módulo' : 'Module'}</th>
              <th className="py-2.5 px-4">{language === 'es' ? 'Capacidad / Acción' : 'Capability / Action'}</th>
              <th className="py-2.5 px-4">{language === 'es' ? 'Descripción Operativa' : 'Operational Description'}</th>
              <th className="py-2.5 px-4 text-center w-56">
                {language === 'es' ? `Estado para ${selectedRole.id}` : `Status for ${selectedRole.id}`}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE1E7] dark:divide-[#2B3440]">
            {filteredPerms.map((p) => {
              const currentVal = permissionsMatrix[selectedRoleId]?.[p.key] || 'off';
              return (
                <tr
                  key={p.key}
                  className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-mono font-medium text-neutral-500">
                    {p.category}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-[#1B1F24] dark:text-[#E8ECF1]">
                    {p.key}
                  </td>
                  <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400">
                    {p.description}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {/* Segmented Control: Off / View / Edit */}
                    <div className="inline-flex rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] p-0.5 bg-neutral-100 dark:bg-neutral-900">
                      <button
                        onClick={() => updatePermission(selectedRoleId, p.key, 'off')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                          currentVal === 'off'
                            ? 'bg-red-500 text-white shadow-xs font-semibold'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        Off
                      </button>
                      <button
                        onClick={() => updatePermission(selectedRoleId, p.key, 'view')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                          currentVal === 'view'
                            ? 'bg-amber-500 text-white shadow-xs font-semibold'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        View
                      </button>
                      <button
                        onClick={() => updatePermission(selectedRoleId, p.key, 'edit')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                          currentVal === 'edit'
                            ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
