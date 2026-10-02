import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { t } from '../../services/localization';
import {
  Radio,
  Tv,
  Smartphone,
  Share2,
  Volume2,
  VolumeX,
  CheckCircle2,
  Send,
  Sparkles,
  RotateCcw,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface ChannelStatus {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  status: 'draft' | 'queued' | 'published';
  targetAudience: string;
}

export const PassengerCommsStudio: React.FC = () => {
  const { language, effectiveRole } = useAuth();
  const { activeSite } = useSite();

  const getSiteComms = (siteId: string) => {
    if (siteId === 'site-b') {
      return {
        hEs: 'Demoras a Rodalies R1 y R4 por avería técnica en Sants',
        hEn: 'Delays on Rodalies R1 and R4 due to technical outage at Sants',
        bEs: 'Por avería en la infraestructura en Barcelona Sants, los trenes de R1 y R4 circulan con demora media de 25 min. Se recomienda utilizar Metro L1 o bus exprés e11.1.',
        bEn: 'Due to infrastructure failure at Sants, Rodalies R1 & R4 trains run with 25 min average delays. Please use Metro Line 1 or express bus e11.1.',
        socialTarget: 'Canal oficial ATM / Rodalies amb 290k seguidors',
      };
    }
    if (siteId === 'site-c') {
      return {
        hEs: 'Demoras en Cercanías C-1 por incidencia en túnel de San Bernardo',
        hEn: 'Delays on Cercanías C-1 due to San Bernardo tunnel issue',
        bEs: 'Por avería en señalización entre Santa Justa y San Bernardo, la línea C-1 sufre demoras de 20 min. Se recomienda transbordar a Metro Línea 1 o autobuses TUSSAM C1.',
        bEn: 'Due to signalling outage between Santa Justa and San Bernardo, line C-1 experiences 20 min delays. Transfer to Metro Line 1 or TUSSAM C1 buses recommended.',
        socialTarget: 'Canal oficial Consorcio de Sevilla con 120k seguidores',
      };
    }
    return {
      hEs: 'Demoras en Cercanías C-3 y C-4 por avería técnica en Atocha',
      hEn: 'Delays on Cercanías C-3 and C-4 due to technical outage at Atocha',
      bEs: 'Por avería en catenaria entre Atocha y Méndez Álvaro, los trenes circulan con demoras medias de 25 min. Utilice Metro Línea 1 o el Servicio Especial de autobuses gratuito.',
      bEn: 'Due to overhead line fault between Atocha and Méndez Álvaro, trains operate with average delays of 25 min. Please use Metro Line 1 or free Special Bus Service.',
      socialTarget: 'Canal oficial público con 340k seguidores',
    };
  };

  const initialComms = getSiteComms(activeSite.id);
  const [headlineEs, setHeadlineEs] = useState(initialComms.hEs);
  const [headlineEn, setHeadlineEn] = useState(initialComms.hEn);
  const [bodyEs, setBodyEs] = useState(initialComms.bEs);
  const [bodyEn, setBodyEn] = useState(initialComms.bEn);

  useEffect(() => {
    const c = getSiteComms(activeSite.id);
    setHeadlineEs(c.hEs);
    setHeadlineEn(c.hEn);
    setBodyEs(c.bEs);
    setBodyEn(c.bEn);
  }, [activeSite.id]);

  const channelDefinitions = [
    {
      id: 'pis',
      name: language === 'es' ? 'Pantallas PIS de Andén' : 'Platform PIS Screens',
      icon: Tv,
      enabled: true,
      status: 'draft' as const,
      targetAudience: language === 'es' ? '42 pantallas en Atocha y Méndez Álvaro' : '42 displays at Atocha and Méndez Álvaro'
    },
    {
      id: 'pa',
      name: language === 'es' ? 'Megafonía de Estación (TTS)' : 'Station PA Audio (TTS)',
      icon: Volume2,
      enabled: true,
      status: 'draft' as const,
      targetAudience: language === 'es' ? 'Megafonía automática cada 4 minutos' : 'Automated chime every 4 minutes'
    },
    {
      id: 'app',
      name: language === 'es' ? 'App Móvil Mi Transporte' : 'My Transport Mobile App',
      icon: Smartphone,
      enabled: true,
      status: 'draft' as const,
      targetAudience: language === 'es' ? '184.000 usuarios activos en corredor Sur' : '184,000 active users in South corridor'
    },
    {
      id: 'social',
      name: language === 'es' ? 'X / Redes Sociales (@CRTM_Alertas)' : 'X / Social Media (@CRTM_Alertas)',
      icon: Share2,
      enabled: true,
      status: 'draft' as const,
      targetAudience: language === 'es' ? 'Canal oficial público con 340k seguidores' : 'Official public feed with 340k followers'
    },
  ];

  const [channels, setChannels] = useState<ChannelStatus[]>(channelDefinitions);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  const toggleChannel = (channelId: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch))
    );
  };

  const handleSimulateAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  const handlePublishAll = () => {
    const now = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setChannels((prev) =>
      prev.map((ch) => (ch.enabled ? { ...ch, status: 'published' } : ch))
    );
    setPublishedAt(now);
  };

  const handleResetToTemplate = () => {
    setHeadlineEs('Demoras en Cercanías C-3 y C-4 por avería técnica en Atocha');
    setHeadlineEn('Delays on Cercanías C-3 and C-4 due to technical outage at Atocha');
    setBodyEs(
      'Por avería en catenaria entre Atocha y Méndez Álvaro, los trenes circulan con demoras medias de 25 min. Utilice Metro Línea 1 o el Servicio Especial de autobuses gratuito habilitado en el intercambiador.'
    );
    setBodyEn(
      'Due to overhead line fault between Atocha and Méndez Álvaro, trains operate with average delays of 25 min. Please use Metro Line 1 or free Special Bus Service available at the interchange.'
    );
    setChannels((prev) => prev.map((ch) => ({ ...ch, status: 'draft' })));
    setPublishedAt(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es'
                ? 'Estudio de Difusión Multicanal de Información al Pasajero'
                : 'Multichannel Passenger Information Studio'}
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {language === 'es'
              ? 'Composición bilingüe sincronizada y emisión instantánea a pantallas PIS, megafonía, App CITRAM y Redes Sociales.'
              : 'Synchronized bilingual composition and instant dispatch across PIS screens, PA systems, CITRAM App, and social media.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Restablecer Plantilla' : 'Reset Template'}</span>
          </button>
          <button
            onClick={handlePublishAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Publicar en Canales Seleccionados' : 'Publish to Selected Channels'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Channel Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bilingual Message Editor */}
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-4">
          <div className="border-b border-[#DCE1E7] dark:border-[#2B3440] pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
              {language === 'es' ? 'Redactor Bilingüe Oficial (CRTM)' : 'Official Bilingual Editor (CRTM)'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] dark:text-[#5AAEE8]">
              {language === 'es' ? 'Aprobación R05' : 'R05 Approval'}
            </span>
          </div>

          {/* Spanish Version */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <span>{language === 'es' ? '🇪🇸 Mensaje en Castellano (Principal)' : '🇪🇸 Spanish Message (Primary)'}</span>
            </label>
            <input
              type="text"
              value={headlineEs}
              onChange={(e) => setHeadlineEs(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-1 focus:ring-[#0071BB]"
              placeholder={language === 'es' ? 'Titular en castellano...' : 'Headline in Spanish...'}
            />
            <textarea
              value={bodyEs}
              onChange={(e) => setBodyEs(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#0071BB]"
              placeholder={language === 'es' ? 'Cuerpo del aviso en castellano...' : 'Body in Spanish...'}
            />
          </div>

          {/* English Version */}
          <div className="space-y-2 pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440]">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <span>{language === 'es' ? '🇬🇧 Traducción al Inglés (Coordinada)' : '🇬🇧 English Translation (Coordinated)'}</span>
            </label>
            <input
              type="text"
              value={headlineEn}
              onChange={(e) => setHeadlineEn(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] focus:outline-none focus:ring-1 focus:ring-[#0071BB]"
              placeholder={language === 'es' ? 'Titular en inglés...' : 'English headline...'}
            />
            <textarea
              value={bodyEn}
              onChange={(e) => setBodyEn(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] bg-neutral-50 dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#0071BB]"
              placeholder={language === 'es' ? 'Cuerpo del aviso en inglés...' : 'English message body...'}
            />
          </div>

          {/* Active Channels Checkbox List */}
          <div className="space-y-2 pt-2 border-t border-[#DCE1E7] dark:border-[#2B3440]">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
              {language === 'es' ? 'Canales de Distribución Seleccionados:' : 'Selected Distribution Channels:'}
            </span>
            <div className="space-y-2">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      ch.enabled
                        ? 'border-[#0071BB]/40 bg-blue-50/10 dark:bg-blue-950/10'
                        : 'border-[#DCE1E7] dark:border-[#2B3440] opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ch.enabled ? 'bg-[#0071BB] text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">
                          {ch.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500">{ch.targetAudience}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ch.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {ch.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Transport Channel Previews */}
        <div className="space-y-4">
          {/* Preview 1: Platform PIS Display */}
          <div className="p-4 rounded-2xl bg-[#090C10] border border-neutral-700 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-800 pb-2">
              <span className="font-mono flex items-center gap-1.5 text-amber-400">
                <Tv className="w-3.5 h-3.5" /> {language === 'es' ? 'PANTALLA PIS ANDÉN 3-4 (ATOCHA)' : 'PLATFORM 3-4 PIS DISPLAY (ATOCHA)'}
              </span>
              <span className="font-mono text-emerald-400 font-bold">{language === 'es' ? '● VÍA 3 / VÍA 4' : '● TRACK 3 / TRACK 4'}</span>
            </div>
            <div className="py-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-red-600 text-white rounded">{language === 'es' ? 'AVISO CRTM' : 'CRTM ALERT'}</span>
                <p className="text-xs font-bold text-amber-300 font-mono tracking-wide">{language === 'es' ? headlineEs : headlineEn}</p>
              </div>
              <p className="text-xs text-neutral-300 font-mono mt-1 leading-relaxed">{language === 'es' ? bodyEs : bodyEn}</p>
            </div>
          </div>

          {/* Preview 2: Station PA Audio Simulation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
              <span className="flex items-center gap-1.5 text-[#0071BB] dark:text-[#5AAEE8]">
                <Volume2 className="w-4 h-4" /> {language === 'es' ? 'Megafonía Automatizada (TTS)' : 'Automated PA Audio (TTS)'}
              </span>
              <button
                onClick={handleSimulateAudio}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 text-[#0071BB] hover:bg-blue-500/20 text-[11px] font-semibold cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>{language === 'es' ? 'Reproduciendo Audio...' : 'Playing Audio...'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span>{language === 'es' ? 'Probar Megafonía' : 'Test PA Audio'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">
              {language === 'es'
                ? '"Atención señores viajeros: Por avería en la infraestructura de electrificación en Atocha, los trenes de Cercanías sufren demoras medias de 25 minutos. Se ruega utilicen como alternativa el Servicio Especial de autobuses..."'
                : '"Attention passengers: Due to an overhead electrical fault at Atocha, Cercanías trains are delayed by approximately 25 minutes. Please use the free Special Bus Service available outside the station..."'}
            </p>
          </div>

          {/* Preview 3: Mobile App Push Card */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
              <span className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300">
                <Smartphone className="w-4 h-4 text-[#0071BB]" /> {language === 'es' ? 'Notificación App Mi Transporte' : 'My Transport App Push Notification'}
              </span>
              <span className="text-[10px]">{language === 'es' ? 'Ahora mismo' : 'Just now'}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#1B1F24] dark:text-[#E8ECF1]">{language === 'es' ? headlineEs : headlineEn}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{language === 'es' ? bodyEs : bodyEn}</p>
              <div className="pt-1 flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-[#0071BB] font-semibold">
                  {language === 'es' ? 'Ver Alternativas de Viaje →' : 'View Travel Alternatives →'}
                </span>
              </div>
            </div>
          </div>

          {/* Preview 4: Social Media Tweet */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161B22] border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-[#DCE1E7] dark:border-[#2B3440] pb-2">
              <span className="flex items-center gap-1.5 font-bold text-neutral-700 dark:text-neutral-300">
                <Share2 className="w-4 h-4 text-[#0071BB]" /> @CRTM_Alertas (X / Twitter)
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {280 - (language === 'es' ? headlineEs.length + bodyEs.length : headlineEn.length + bodyEn.length)} {language === 'es' ? 'caracteres restantes' : 'characters remaining'}
              </span>
            </div>
            <p className="text-xs text-[#1B1F24] dark:text-[#E8ECF1]">
              🔴 <strong>{language === 'es' ? 'AVISO INCIDENCIA:' : 'INCIDENT ALERT:'}</strong> {language === 'es' ? headlineEs : headlineEn}.<br />
              {language === 'es' ? bodyEs : bodyEn}<br />
              <span className="text-[#0071BB]">#Atocha #Cercanías #MadridTransporte #CRTM</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
