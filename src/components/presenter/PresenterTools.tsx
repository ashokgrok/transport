import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import {
  MousePointer,
  Sparkles,
  Volume2,
  VolumeX,
  Tv,
  Maximize2,
  Eye,
  Sliders,
  Check,
  X,
} from 'lucide-react';

interface PresenterToolsProps {
  isWallMode: boolean;
  onToggleWallMode: () => void;
  isLaserPointerActive: boolean;
  onToggleLaserPointer: () => void;
  isSpotlightActive: boolean;
  onToggleSpotlight: () => void;
}

export const PresenterTools: React.FC<PresenterToolsProps> = ({
  isWallMode,
  onToggleWallMode,
  isLaserPointerActive,
  onToggleLaserPointer,
  isSpotlightActive,
  onToggleSpotlight,
}) => {
  const { soundEnabled, toggleSound, language } = useAuth();
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

  // Laser pointer and spotlight mouse tracking
  useEffect(() => {
    if (!isLaserPointerActive && !isSpotlightActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLaserPointerActive, isSpotlightActive]);

  // Web Audio API Synthesizer (Zero external assets required)
  const playChime = (type: 'gentle' | 'alert' | 'success') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'gentle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.setValueAtTime(349.23, audioCtx.currentTime + 0.12); // F4
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // Audio context may require initial user gesture
    }
  };

  return (
    <>
      {/* Laser Pointer Glowing Red Cursor Overlay */}
      {isLaserPointerActive && (
        <div
          className="fixed pointer-events-none z-99999 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="relative flex items-center justify-center">
            {/* Outer halo */}
            <div className="w-12 h-12 rounded-full bg-red-600/30 blur-xs animate-ping" />
            {/* Core laser dot */}
            <div className="absolute w-4 h-4 rounded-full bg-[#FF1E27] shadow-[0_0_12px_#FF1E27] border border-white" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      )}

      {/* Spotlight Mask Overlay (Dims viewport except circle around cursor) */}
      {isSpotlightActive && (
        <div
          className="fixed inset-0 pointer-events-none z-99990 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0, 0, 0, 0.75) 100%)`,
          }}
        />
      )}

      {/* Floating Presenter Toolbar (Bottom Right Dock) */}
      <div className="fixed bottom-4 right-4 z-40 bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md rounded-2xl border border-[#DCE1E7] dark:border-[#2B3440] shadow-xl p-2 flex items-center gap-1.5 text-xs">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 border-r border-[#DCE1E7] dark:border-[#2B3440]">
          Show & Tell
        </span>

        {/* Laser Pointer Toggle */}
        <button
          onClick={onToggleLaserPointer}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            isLaserPointerActive
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={language === 'es' ? 'Activar Puntero Láser Virtual (Para presentaciones)' : 'Toggle Virtual Laser Pointer (Presentations)'}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Láser' : 'Laser'}</span>
        </button>

        {/* Spotlight Toggle */}
        <button
          onClick={onToggleSpotlight}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            isSpotlightActive
              ? 'bg-[#0071BB] text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={language === 'es' ? 'Activar Foco de Atención (Spotlight)' : 'Toggle Spotlight Focus'}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Foco' : 'Spotlight'}</span>
        </button>

        {/* 4K Wall Mode Toggle */}
        <button
          onClick={onToggleWallMode}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            isWallMode
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={language === 'es' ? 'Modo Videomuro 4K (Alta densidad y contraste para salas de control)' : '4K Videowall Display Mode (High density & contrast for control rooms)'}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Muro 4K' : '4K Wall'}</span>
        </button>

        {/* Audio Synthesis Test */}
        <button
          onClick={() => {
            playChime('gentle');
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold cursor-pointer"
          title={language === 'es' ? 'Probar Chime de Notificación Sonora (Web Audio API)' : 'Test Audio Notification Chime (Web Audio API)'}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Chime</span>
        </button>
      </div>
    </>
  );
};
