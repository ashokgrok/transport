import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteConfig } from '../types';
import { INITIAL_SITES } from '../data/sitesData';

interface SiteContextType {
  sites: SiteConfig[];
  activeSite: SiteConfig;
  setActiveSiteId: (siteId: string) => void;
  updateSiteConfig: (siteId: string, updates: Partial<SiteConfig>) => void;
  createSite: (newSite: SiteConfig) => void;
  deleteSite: (siteId: string) => void;
  resetSitesToDefault: () => void;
  isSwitchingSite: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<SiteConfig[]>(() => {
    const saved = localStorage.getItem('citram_sites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure default parameters and feeds are preserved if saved from older version
        return parsed.map((s: SiteConfig) => {
          const init = INITIAL_SITES.find((i) => i.id === s.id);
          return {
            ...init,
            ...s,
            parameters: s.parameters || init?.parameters,
            feeds: s.feeds || init?.feeds,
            modules: s.modules || init?.modules,
          };
        });
      } catch (e) { /* ignore */ }
    }
    return INITIAL_SITES;
  });

  const [activeSiteId, setActiveSiteIdState] = useState<string>(() => {
    const saved = localStorage.getItem('citram_active_site_id');
    return saved || 'madrid';
  });

  const [isSwitchingSite, setIsSwitchingSite] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('citram_sites', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('citram_active_site_id', activeSiteId);
  }, [activeSiteId]);

  const activeSite = sites.find((s) => s.id === activeSiteId) || sites[0];

  const setActiveSiteId = (siteId: string) => {
    if (siteId === activeSiteId) return;
    setIsSwitchingSite(true);
    // Smooth transition under 300ms (budget < 2s)
    setTimeout(() => {
      setActiveSiteIdState(siteId);
      setIsSwitchingSite(false);
    }, 280);
  };

  const updateSiteConfig = (siteId: string, updates: Partial<SiteConfig>) => {
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, ...updates } : s))
    );
  };

  const createSite = (newSite: SiteConfig) => {
    setSites((prev) => [...prev.filter((s) => s.id !== newSite.id), newSite]);
  };

  const deleteSite = (siteId: string) => {
    setSites((prev) => {
      if (prev.length <= 1) return prev; // Keep at least one site
      const remaining = prev.filter((s) => s.id !== siteId);
      if (activeSiteId === siteId) {
        setActiveSiteIdState(remaining[0].id);
      }
      return remaining;
    });
  };

  const resetSitesToDefault = () => {
    localStorage.removeItem('citram_sites');
    setSites(INITIAL_SITES);
    setActiveSiteIdState('madrid');
  };

  return (
    <SiteContext.Provider
      value={{
        sites,
        activeSite,
        setActiveSiteId,
        updateSiteConfig,
        createSite,
        deleteSite,
        resetSitesToDefault,
        isSwitchingSite,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
