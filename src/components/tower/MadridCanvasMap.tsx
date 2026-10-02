import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../services/authContext';
import { useSite } from '../../services/siteContext';
import { InterchangeHub, SimulatedVehicle } from '../../data/madridNetworkData';
import {
  getSiteInterchanges,
  generateSiteFleet,
  getSiteMapBounds,
  getSiteHeroCaseMarkerInfo,
  getSiteMinorNoticeMarkerInfo,
} from '../../data/multiSiteData';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Layers,
  Compass,
  Eye,
  AlertTriangle,
  Play,
  Pause,
  Video,
  Flame,
} from 'lucide-react';

export type MapLayerPreset = 'calm' | 'ops' | 'interchanges' | 'everything';
export type SemanticZoom = 'region' | 'district' | 'line' | 'vehicle';

interface MadridCanvasMapProps {
  layerPreset: MapLayerPreset;
  onSelectInterchange?: (hub: InterchangeHub) => void;
  onSelectIncident?: (incidentId: string) => void;
  focusedEntityId?: string | null;
  onClearFocus?: () => void;
  onFpsUpdate?: (fps: number) => void;
}

export const MadridCanvasMap: React.FC<MadridCanvasMapProps> = ({
  layerPreset,
  onSelectInterchange,
  onSelectIncident,
  focusedEntityId,
  onClearFocus,
  onFpsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, language } = useAuth();
  const { activeSite } = useSite();

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentFps, setCurrentFps] = useState<number>(60);
  const [isPaused, setIsPaused] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  // Dynamic Site Vehicles pool & Hubs
  const fleet = useMemo(() => generateSiteFleet(activeSite.id, 1200), [activeSite.id]);
  const siteInterchanges = useMemo(() => getSiteInterchanges(activeSite.id), [activeSite.id]);
  const siteBounds = useMemo(() => getSiteMapBounds(activeSite.id), [activeSite.id]);
  const heroMarker = useMemo(() => getSiteHeroCaseMarkerInfo(activeSite.id, language as 'es' | 'en'), [activeSite.id, language]);
  const minorMarker = useMemo(() => getSiteMinorNoticeMarkerInfo(activeSite.id, language as 'es' | 'en'), [activeSite.id, language]);

  // Reset pan and zoom when active site switches for instant visual responsiveness
  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setZoomLevel(1.2);
  }, [activeSite.id]);

  // Compute semantic zoom category based on zoomLevel
  const semanticZoom: SemanticZoom = useMemo(() => {
    if (zoomLevel < 1.4) return 'region';
    if (zoomLevel < 2.2) return 'district';
    if (zoomLevel < 3.2) return 'line';
    return 'vehicle';
  }, [zoomLevel]);

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel((prev) => Math.min(Math.max(prev * factor, 0.8), 4.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // High performance animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    // Map bounds in logical coordinates
    const logicalWidth = 1000;
    const logicalHeight = 650;

    const render = (time: number) => {
      // Calculate FPS
      frameCount++;
      if (time - fpsTimer >= 1000) {
        const fps = Math.round((frameCount * 1000) / (time - fpsTimer));
        setCurrentFps(fps);
        onFpsUpdate?.(fps);
        frameCount = 0;
        fpsTimer = time;
      }

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const isDark = theme === 'dark';

      // Ensure canvas pixel ratio matches screen
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background color
      ctx.fillStyle = isDark ? '#0B0F14' : '#E8EEF5';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Apply zoom & pan translation
      ctx.save();
      const centerX = rect.width / 2 + pan.x;
      const centerY = rect.height / 2 + pan.y;
      ctx.translate(centerX, centerY);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-logicalWidth / 2, -logicalHeight / 2);

      // 1. Regional Waterway / Coastline
      if (siteBounds.waterway && siteBounds.waterway.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = isDark ? '#1C2E42' : '#BDD4E7';
        ctx.lineWidth = siteBounds.waterway.width * 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        siteBounds.waterway.points.forEach((pt, pIdx) => {
          const ptX = 200 + (pt[0] / 100) * 600;
          const ptY = 620 - (pt[1] / 100) * 570;
          if (pIdx === 0) ctx.moveTo(ptX, ptY);
          else ctx.lineTo(ptX, ptY);
        });
        ctx.stroke();
      }

      // 2. Orbital Ring Highways (M-30/M-40, Rondas, SE-30)
      if (siteBounds.ringHighways) {
        const rh = siteBounds.ringHighways;
        const cx = 200 + (rh.centerX / 100) * 600;
        const cy = 620 - (rh.centerY / 100) * 570;
        const rx1 = (rh.innerRadiusX / 100) * 600;
        const ry1 = (rh.innerRadiusY / 100) * 570;
        const rx2 = (rh.outerRadiusX / 100) * 600;
        const ry2 = (rh.outerRadiusY / 100) * 570;

        ctx.beginPath();
        ctx.strokeStyle = isDark ? '#1F2733' : '#D0D7DE';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.ellipse(cx, cy, rx1, ry1, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = isDark ? '#161F2B' : '#E1E4E8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.ellipse(cx, cy, rx2, ry2, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Draw Commuter & Metro Corridors
      if (siteBounds.corridors) {
        siteBounds.corridors.forEach((corridor) => {
          if (!corridor.points || corridor.points.length < 2) return;
          ctx.beginPath();
          ctx.strokeStyle = corridor.color;
          ctx.lineWidth = layerPreset === 'calm' ? (corridor.width ? corridor.width * 0.7 : 2) : (corridor.width || 3);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          corridor.points.forEach((pt, pIdx) => {
            const px = 200 + (pt[0] / 100) * 600;
            const py = 620 - (pt[1] / 100) * 570;
            if (pIdx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
        });
      }

      // 3.5. Draw Passenger Density & Crowd Heatmap Layer
      if (showHeatmap && layerPreset !== 'calm') {
        const heatmapNodes = siteInterchanges.map((hub) => ({
          lat: hub.lat,
          lng: hub.lng,
          intensity: hub.activeCrowdLevel === 'surge' ? 1.0 : hub.activeCrowdLevel === 'high' ? 0.8 : 0.6,
          radius: hub.activeCrowdLevel === 'surge' ? 52 : 34,
          name: hub.name,
        }));

        heatmapNodes.forEach((node) => {
          const nodeY = 620 - ((node.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
          const nodeX = 200 + ((node.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;
          const dynamicPulse = 1 + Math.sin(time / 280 + node.intensity * 4) * 0.08;
          const currentRadius = node.radius * dynamicPulse;

          const grad = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, currentRadius);
          if (node.intensity >= 0.9) {
            // Critical / High saturation (Surge)
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.48)');
            grad.addColorStop(0.35, 'rgba(249, 115, 22, 0.32)');
            grad.addColorStop(0.7, 'rgba(234, 179, 8, 0.16)');
            grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          } else if (node.intensity >= 0.7) {
            // High passenger volume
            grad.addColorStop(0, 'rgba(249, 115, 22, 0.40)');
            grad.addColorStop(0.45, 'rgba(234, 179, 8, 0.22)');
            grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
          } else {
            // Moderate passenger volume
            grad.addColorStop(0, 'rgba(234, 179, 8, 0.32)');
            grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.14)');
            grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
          }

          ctx.beginPath();
          ctx.arc(nodeX, nodeY, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }

      // 4. Draw Fleet Vehicles (gliding positions)
      const renderVehicleLimit =
        layerPreset === 'calm' ? 150 : layerPreset === 'ops' ? 500 : layerPreset === 'interchanges' ? 300 : fleet.length;

      const animProgress = (time % 10000) / 10000;

      for (let i = 0; i < renderVehicleLimit; i++) {
        const v = fleet[i];
        const baseY = 620 - ((v.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
        const baseX = 200 + ((v.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;

        // Smooth gliding offset along heading
        const rad = (v.heading * Math.PI) / 180;
        const glideOffset = Math.sin(animProgress * Math.PI * 2 + i) * 6;
        const x = baseX + Math.cos(rad) * glideOffset;
        const y = baseY + Math.sin(rad) * glideOffset;

        // If calm mode, render as very faint subtle dots
        if (layerPreset === 'calm') {
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 71, 187, 0.15)';
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Operations, Interchanges or Everything: color code by mode
          ctx.fillStyle =
            v.mode === 'metro'
              ? '#0097D9'
              : v.mode === 'cercanias'
              ? '#8A1538'
              : v.mode === 'emt'
              ? '#0047BA'
              : '#00853F';

          ctx.beginPath();
          const dotRadius = semanticZoom === 'vehicle' ? 4 : semanticZoom === 'line' ? 3 : 2;
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();

          // Render line code if zoomed into Line or Vehicle level
          if (semanticZoom === 'vehicle' && i % 4 === 0) {
            ctx.fillStyle = isDark ? '#E8ECF1' : '#1B1F24';
            ctx.font = '8px Inter, sans-serif';
            ctx.fillText(v.lineCode, x + 5, y + 3);
          }
        }
      }

      // 5. Draw Interchanges (Atocha, Sants, Santa Justa, etc.)
      siteInterchanges.forEach((hub) => {
        // Project hub coordinates
        const y = 620 - ((hub.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
        const x = 200 + ((hub.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;

        const isAtocha = hub.code === 'ATO';
        const isSurge = hub.activeCrowdLevel === 'surge';

        // Outer glow/ring if surge
        if (isSurge) {
          ctx.beginPath();
          ctx.arc(x, y, 18 + Math.sin(time / 200) * 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fill();
        }

        // Hub Base Node
        ctx.beginPath();
        ctx.arc(x, y, isAtocha ? 9 : 6.5, 0, Math.PI * 2);
        ctx.fillStyle = isSurge ? '#B42318' : '#0071BB';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isDark ? '#161B22' : '#FFFFFF';
        ctx.stroke();

        // Hub Label (Typography math)
        ctx.fillStyle = isDark ? '#E8ECF1' : '#1B1F24';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText(hub.name.split(' ')[1] || hub.code, x + 12, y + 4);

        if (layerPreset === 'interchanges' || layerPreset === 'everything') {
          ctx.font = '9px Inter, sans-serif';
          ctx.fillStyle = isSurge ? '#EF4444' : isDark ? '#9CA3AF' : '#4B5563';
          ctx.fillText(`${(hub.dailyPassengers / 1000).toFixed(0)}k pax/d`, x + 12, y + 16);
        }
      });

      // 6. Draw Active Pulsing Incident Marker
      const heroIncY = 620 - ((heroMarker.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
      const heroIncX = 200 + ((heroMarker.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;

      const pulseRadius = 14 + Math.sin(time / 180) * 6;
      ctx.beginPath();
      ctx.arc(heroIncX, heroIncY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 35, 24, 0.28)';
      ctx.fill();

      // Incident Core Icon Marker
      ctx.beginPath();
      ctx.arc(heroIncX, heroIncY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#B42318';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Exclamation glyph
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('!', heroIncX - 2.5, heroIncY + 3.5);

      // 7. Draw Minor Station Notice
      const minorY = 620 - ((minorMarker.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
      const minorX = 200 + ((minorMarker.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;

      ctx.beginPath();
      ctx.arc(minorX, minorY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#B54708';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
      ctx.restore();

      if (!isPaused) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, zoomLevel, pan, layerPreset, isPaused, showHeatmap, semanticZoom, fleet, activeSite.id, siteBounds, siteInterchanges, heroMarker, minorMarker]);

  // Click on Canvas to select entities
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check collision with Hero incident marker
    const centerX = rect.width / 2 + pan.x;
    const centerY = rect.height / 2 + pan.y;

    const logicalWidth = 1000;
    const logicalHeight = 650;
    const heroIncLogicalY = 620 - ((heroMarker.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
    const heroIncLogicalX = 200 + ((heroMarker.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;

    const screenHeroX = centerX + (heroIncLogicalX - logicalWidth / 2) * zoomLevel;
    const screenHeroY = centerY + (heroIncLogicalY - logicalHeight / 2) * zoomLevel;

    const dist = Math.hypot(clickX - screenHeroX, clickY - screenHeroY);
    if (dist < 28) {
      onSelectIncident?.(heroMarker.id);
      return;
    }

    // Check collision with hubs
    for (const hub of siteInterchanges) {
      const hubLogicalY = 620 - ((hub.lat - siteBounds.minLat) / (siteBounds.maxLat - siteBounds.minLat)) * 570;
      const hubLogicalX = 200 + ((hub.lng - siteBounds.minLng) / (siteBounds.maxLng - siteBounds.minLng)) * 600;
      const screenHubX = centerX + (hubLogicalX - logicalWidth / 2) * zoomLevel;
      const screenHubY = centerY + (hubLogicalY - logicalHeight / 2) * zoomLevel;

      if (Math.hypot(clickX - screenHubX, clickY - screenHubY) < 22) {
        onSelectInterchange?.(hub);
        return;
      }
    }

    // Default clear focus
    onClearFocus?.();
  };

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-[#DCE1E7] dark:border-[#2B3440] bg-[#E8EEF5] dark:bg-[#0B0F14] select-none">
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      {/* Top Left: Semantic Zoom Level & Context Indicator */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className="bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs text-xs font-semibold text-[#1B1F24] dark:text-[#E8ECF1] flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#0071BB] dark:text-[#5AAEE8]" />
          <span>{activeSite.shortName || activeSite.city} {language === 'es' ? 'Metropolitano' : 'Metropolitan'}</span>
          <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {semanticZoom}
          </span>
        </div>

        {/* Real-Time Framerate Gauge (PERF-04 Target: 60 FPS) */}
        <div className="bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-xs px-2 py-1 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs text-[10px] font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              currentFps >= 55 ? 'bg-emerald-500' : currentFps >= 30 ? 'bg-amber-500' : 'bg-red-500'
            }`}
          />
          <span>{currentFps} FPS</span>
        </div>
      </div>

      {/* Top Right: Zoom and Reset Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs p-1 rounded-lg border border-[#DCE1E7] dark:border-[#2B3440] shadow-xs">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev * 1.25, 4.5))}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev * 0.8, 0.8))}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-0.5" />
        <button
          onClick={() => {
            setZoomLevel(1.2);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer text-xs font-semibold"
          title="Reset View"
        >
          1:1
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
          title={isPaused ? 'Resume Animation' : 'Pause Animation'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-neutral-500" />}
        </button>
        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-0.5" />
        {/* Heatmap Layer Toggle */}
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
            showHeatmap
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={showHeatmap ? (language === 'es' ? 'Ocultar mapa de calor de afluencia' : 'Hide crowd density heatmap') : (language === 'es' ? 'Mostrar mapa de calor de afluencia' : 'Show crowd density heatmap')}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Heatmap</span>
        </button>
      </div>

      {/* Bottom Center: Semantic Zoom Ladder */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs px-3 py-1 rounded-full border border-[#DCE1E7] dark:border-[#2B3440] shadow-sm flex items-center gap-2 text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
        <span className="text-neutral-400">{language === 'es' ? 'Escala:' : 'Scale:'}</span>
        {(['region', 'district', 'line', 'vehicle'] as const).map((z) => (
          <button
            key={z}
            onClick={() => {
              if (z === 'region') setZoomLevel(1.0);
              if (z === 'district') setZoomLevel(1.8);
              if (z === 'line') setZoomLevel(2.6);
              if (z === 'vehicle') setZoomLevel(3.8);
            }}
            className={`capitalize px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              semanticZoom === z
                ? 'bg-[#0071BB] text-white font-bold'
                : 'hover:text-black dark:hover:text-white'
            }`}
          >
            {z === 'region' ? (language === 'es' ? 'Región' : 'Region') :
             z === 'district' ? (language === 'es' ? 'Distrito' : 'District') :
             z === 'line' ? (language === 'es' ? 'Línea' : 'Line') :
             (language === 'es' ? 'Vehículo' : 'Vehicle')}
          </button>
        ))}
      </div>

      {/* Bottom Left: Quiet Legend */}
      <div className="absolute bottom-3 left-3 bg-white/85 dark:bg-[#161B22]/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#DCE1E7] dark:border-[#2B3440] text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#B42318]" /> {heroMarker.label}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#0071BB]" /> {language === 'es' ? 'Intercambiador' : 'Interchange'}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#0097D9]" /> {language === 'es' ? 'Red de Transporte' : 'Transit Network'}
        </span>
      </div>

      {/* Bottom Right: Heatmap Density Gauge (Visible when heatmap is active) */}
      {showHeatmap && (
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#DCE1E7] dark:border-[#2B3440] text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-2 shadow-xs">
          <Flame className="w-3 h-3 text-amber-500" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            {language === 'es' ? 'Afluencia:' : 'Crowd:'}
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px]">
            <span className="text-emerald-600 font-bold">{language === 'es' ? 'Baja' : 'Low'}</span>
            <span className="w-8 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
            <span className="text-red-600 font-bold">{language === 'es' ? 'Crítica' : 'Critical'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
