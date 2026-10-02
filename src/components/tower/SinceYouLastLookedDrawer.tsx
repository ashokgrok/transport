import React from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { getSiteDeltaEvents } from '../../data/multiSiteData';
import { X, Clock, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp, ArrowRight, Info } from 'lucide-react';

interface SinceYouLastLookedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCase: (caseId: string) => void;
}

export const SinceYouLastLookedDrawer: React.FC<SinceYouLastLookedDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCase,
}) => {
  const { language, effectiveRole } = useAuth();
  const { activeSite } = useSite();

  if (!isOpen) return null;

  const deltaEvents = getSiteDeltaEvents(activeSite.id, language as 'es' | 'en');

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-[#161B22] border-l border-[#DCE1E7] dark:border-[#2B3440] shadow-2xl h-full flex flex-col justify-between overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0071BB] dark:text-[#5AAEE8]" />
              <div>
                <h3 className="font-bold text-sm text-[#1B1F24] dark:text-[#E8ECF1]">
                  {language === 'es' ? 'Novedades desde tu última conexión' : 'Updates Since You Last Looked'}
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {language === 'es' ? `RESUMEN DELTA (${activeSite.shortName.toUpperCase()})` : `DELTA SUMMARY (${activeSite.shortName.toUpperCase()})`}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-neutral-500">
            {language === 'es' ? (
              <>Resumen sintético generado para <strong>{effectiveRole.demoAccount.fullName}</strong> en <strong>{activeSite.shortName}</strong> con los sucesos de los últimos 45 minutos.</>
            ) : (
              <>Synthetic digest generated for <strong>{effectiveRole.demoAccount.fullName}</strong> at <strong>{activeSite.shortName}</strong> covering events recorded in the last 45 minutes.</>
            )}
          </p>

          {/* Delta Highlights */}
          <div className="space-y-3">
            {deltaEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  evt.severity === 'critical'
                    ? 'border-red-500/30 bg-red-50/20 dark:bg-red-950/10'
                    : evt.severity === 'nominal'
                    ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      evt.severity === 'critical'
                        ? 'text-red-700 dark:text-red-400'
                        : evt.severity === 'nominal'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {evt.severity === 'critical' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : evt.severity === 'nominal' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                    )}
                    <span>{evt.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">{evt.timeAgo}</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {evt.description}
                </p>
                {evt.caseId && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCase(evt.caseId!);
                    }}
                    className="text-[11px] font-semibold text-[#0071BB] dark:text-[#5AAEE8] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>{evt.actionText || evt.caseId}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#DCE1E7] dark:border-[#2B3440] flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">{language === 'es' ? 'Todo al día' : 'All caught up'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold cursor-pointer"
          >
            {language === 'es' ? 'Entendido' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};

