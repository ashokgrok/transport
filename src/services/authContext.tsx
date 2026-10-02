import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RoleDefinition, RoleId, PermissionKey, PermissionLevel, RolePermissionsMatrix } from '../types';
import { ALL_ROLES, DEFAULT_PERMISSIONS_MATRIX } from '../data/rolesData';
import { useSite } from './siteContext';
import { Language } from './localization';

interface AuthContextType {
  currentRole: RoleDefinition;
  setRoleById: (roleId: RoleId) => void;
  isAuthenticated: boolean;
  loginAsRole: (roleId: RoleId, bypassMfa?: boolean) => void;
  logout: () => void;
  permissionsMatrix: RolePermissionsMatrix;
  updatePermission: (roleId: RoleId, key: PermissionKey, level: PermissionLevel) => void;
  resetPermissions: () => void;
  hasPermission: (key: PermissionKey, level?: 'view' | 'edit') => boolean;
  previewRoleId: RoleId | null;
  setPreviewRoleId: (roleId: RoleId | null) => void;
  effectiveRole: RoleDefinition;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isWallDisplay: boolean;
  toggleWallDisplay: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  mfaPendingRoleId: RoleId | null;
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  allRoles: RoleDefinition[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PERMISSIONS_STORAGE_KEY = 'citram_rbac_matrix_v1';
const BROADCAST_CHANNEL_NAME = 'citram_session_sync_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeSite } = useSite();

  // Language state (Spanish default as per PRD DEM-08)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('citram_lang');
    return (saved as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('citram_lang', lang);
    document.documentElement.lang = lang;
  };

  // Theme state (Light default as per PRD BR-02)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('citram_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [isWallDisplay, setIsWallDisplay] = useState<boolean>(() => {
    return localStorage.getItem('citram_wall_mode') === 'true';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('citram_sound') === 'true'; // off by default as per PRD DEM-09
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('citram_sound', String(next));
      return next;
    });
  };

  const toggleWallDisplay = () => {
    setIsWallDisplay((prev) => {
      const next = !prev;
      localStorage.setItem('citram_wall_mode', String(next));
      if (next) {
        document.documentElement.classList.add('wall-display');
      } else {
        document.documentElement.classList.remove('wall-display');
      }
      return next;
    });
  };

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('citram_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
      return next;
    });
  };

  // Active Role State (Default R01 Lucía for Scene 1 start)
  const [currentRoleId, setCurrentRoleId] = useState<RoleId>(() => {
    const saved = localStorage.getItem('citram_role_id');
    return (saved as RoleId) || 'R01';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [previewRoleId, setPreviewRoleId] = useState<RoleId | null>(null);
  const [mfaPendingRoleId, setMfaPendingRoleId] = useState<RoleId | null>(null);

  // RBAC permissions matrix
  const [permissionsMatrix, setPermissionsMatrix] = useState<RolePermissionsMatrix>(() => {
    const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_PERMISSIONS_MATRIX;
  });

  // Cross-tab broadcast channel for instantaneous RBAC & role propagation (< 2s)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'RBAC_UPDATE') {
          setPermissionsMatrix(event.data.matrix);
        }
      };
    }
    return () => {
      channel?.close();
    };
  }, []);

  const updatePermission = (roleId: RoleId, key: PermissionKey, level: PermissionLevel) => {
    setPermissionsMatrix((prev) => {
      const next = {
        ...prev,
        [roleId]: {
          ...prev[roleId],
          [key]: level,
        },
      };
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(next));

      // Broadcast to other open windows/tabs
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ type: 'RBAC_UPDATE', matrix: next });
        channel.close();
      }

      return next;
    });
  };

  const resetPermissions = () => {
    setPermissionsMatrix(DEFAULT_PERMISSIONS_MATRIX);
    localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'RBAC_UPDATE', matrix: DEFAULT_PERMISSIONS_MATRIX });
      channel.close();
    }
  };

  const loginAsRole = (roleId: RoleId, bypassMfa = false) => {
    const targetRole = ALL_ROLES.find((r) => r.id === roleId);
    if (!targetRole) return;

    if (targetRole.requiresMfa && !bypassMfa) {
      setMfaPendingRoleId(roleId);
      return;
    }

    setCurrentRoleId(roleId);
    setPreviewRoleId(null);
    setIsAuthenticated(true);
    localStorage.setItem('citram_role_id', roleId);
  };

  const verifyMfa = (code: string): boolean => {
    // Demo accept any 6-digit number or '123456'
    if (code.trim().length >= 4 && mfaPendingRoleId) {
      loginAsRole(mfaPendingRoleId, true);
      setMfaPendingRoleId(null);
      return true;
    }
    return false;
  };

  const cancelMfa = () => {
    setMfaPendingRoleId(null);
  };

  const setRoleById = (roleId: RoleId) => {
    loginAsRole(roleId, true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const currentRole = ALL_ROLES.find((r) => r.id === currentRoleId) || ALL_ROLES[0];
  const effectiveRole = previewRoleId ? (ALL_ROLES.find((r) => r.id === previewRoleId) || currentRole) : currentRole;

  // Permission verification
  const hasPermission = useCallback(
    (key: PermissionKey, requiredLevel: 'view' | 'edit' = 'view'): boolean => {
      // In Open Demo Mode, all authenticated users hold every permission
      if (activeSite.enforcementMode === 'open_demo') {
        return true;
      }

      const rolePerms = permissionsMatrix[effectiveRole.id];
      if (!rolePerms) return false;

      const userLevel = rolePerms[key] || 'off';
      if (userLevel === 'off') return false;
      if (requiredLevel === 'view') {
        return userLevel === 'view' || userLevel === 'edit';
      }
      return userLevel === 'edit';
    },
    [activeSite.enforcementMode, permissionsMatrix, effectiveRole.id]
  );

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        setRoleById,
        isAuthenticated,
        loginAsRole,
        logout,
        permissionsMatrix,
        updatePermission,
        resetPermissions,
        hasPermission,
        previewRoleId,
        setPreviewRoleId,
        effectiveRole,
        language,
        setLanguage,
        theme,
        toggleTheme,
        isWallDisplay,
        toggleWallDisplay,
        soundEnabled,
        toggleSound,
        mfaPendingRoleId,
        verifyMfa,
        cancelMfa,
        allRoles: ALL_ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
