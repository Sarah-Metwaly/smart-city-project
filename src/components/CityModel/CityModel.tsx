import { Suspense, useEffect, useRef, useState, memo } from 'react';
// @ts-ignore
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';
import { ErrorBoundary } from '../../shared/utils/appUtils';
import './CityModel.css';
import {
  onPointerDown,
  onPointerMove,
  onPointerUp,
} from '../../shared/utils/threeUtils.tsx';
import { useLightSystem } from '../../features/energy-optimization/hooks/useLightsytem.tsx';
import { useActiveAlerts } from '../../features/fire-department/hooks/useActiveAlerts.tsx';
import { useIncidents } from '../../shared/hooks/useIncidentTable.tsx';
import { Siren, Flame, Lightbulb } from 'lucide-react';

// Types
interface ModelProps {
  rotation: [number, number, number];
  lights: boolean;
  streetAlarm: boolean;
  fireAlarm: boolean;
  policeAlarm: boolean;
}

interface MaterialConfig {
  opacity: number;
  emissiveIntensity: number;
  color: string;
}

// Utility function to update material properties
const updateMaterial = (
  material: MeshStandardMaterial | undefined,
  config: MaterialConfig,
): void => {
  if (!material) return;

  material.transparent = true;
  material.opacity = config.opacity;
  material.emissiveIntensity = config.emissiveIntensity;
  material.color.set(config.color);
  if (material.emissive) {
    material.emissive.set(config.color);
  }
  material.needsUpdate = true;
};

const Model = memo(function Model({
  rotation,
  lights,
  streetAlarm,
  fireAlarm,
  policeAlarm,
}: ModelProps) {
  const { materials, scene } = useGLTF('/models/city-model.glb');
  const streetColor = materials['[Color_001]4'] as MeshStandardMaterial;
  const fireWarningLight = materials['fire_warning'] as MeshStandardMaterial;
  const policeWarningLight = materials[
    'police_warning1'
  ] as MeshStandardMaterial;
  const modelRef = useRef(null);

  const [streetCurrentColor, setStreetCurrentColor] = useState('#eadb60');
  const [fireCurrentColor, setFireCurrentColor] = useState('#ff0000');
  const [policeCurrentColor, setPoliceCurrentColor] = useState('#0000ff');

  // Street alarm blinking effect (yellow ↔ red)
  useEffect(() => {
    let cancelled = false;
    if (streetAlarm && lights) {
      const runBlinkEffect = async () => {
        while (!cancelled) {
          setStreetCurrentColor('#ff0000');
          await new Promise((r) => setTimeout(r, 500));
          if (cancelled) break;
          setStreetCurrentColor('#eadb60');
          await new Promise((r) => setTimeout(r, 500));
        }
      };
      runBlinkEffect();
    } else {
      setStreetCurrentColor('#eadb60');
    }
    return () => {
      cancelled = true;
    };
  }, [streetAlarm, lights]);

  // Fire alarm blinking effect (bright red ↔ dark red)
  useEffect(() => {
    let cancelled = false;
    if (fireAlarm) {
      const runBlinkEffect = async () => {
        while (!cancelled) {
          setFireCurrentColor('#ff0000');
          await new Promise((r) => setTimeout(r, 500));
          if (cancelled) break;
          setFireCurrentColor('#8B0000');
          await new Promise((r) => setTimeout(r, 500));
        }
      };
      runBlinkEffect();
    } else {
      setFireCurrentColor('#ff0000');
    }
    return () => {
      cancelled = true;
    };
  }, [fireAlarm]);

  // Police alarm blinking effect (bright blue ↔ dark blue)
  useEffect(() => {
    let cancelled = false;
    if (policeAlarm) {
      const runBlinkEffect = async () => {
        while (!cancelled) {
          setPoliceCurrentColor('#0000ff');
          await new Promise((r) => setTimeout(r, 500));
          if (cancelled) break;
          setPoliceCurrentColor('#00008B');
          await new Promise((r) => setTimeout(r, 500));
        }
      };
      runBlinkEffect();
    } else {
      setPoliceCurrentColor('#0000ff');
    }
    return () => {
      cancelled = true;
    };
  }, [policeAlarm]);

  // Street lights effect
  useEffect(() => {
    if (!streetColor) return;
    const config: MaterialConfig = lights
      ? { opacity: 0.35, emissiveIntensity: 1.2, color: streetCurrentColor }
      : { opacity: 0.0, emissiveIntensity: 0.0, color: streetCurrentColor };
    updateMaterial(streetColor, config);
  }, [streetCurrentColor, streetColor, lights]);

  // Fire warning light effect
  useEffect(() => {
    if (!fireWarningLight) return;
    const config: MaterialConfig = fireAlarm
      ? { opacity: 0.8, emissiveIntensity: 2.0, color: fireCurrentColor }
      : { opacity: 0.0, emissiveIntensity: 0.0, color: fireCurrentColor };
    updateMaterial(fireWarningLight, config);
  }, [fireAlarm, fireWarningLight, fireCurrentColor]);

  // Police warning light effect
  useEffect(() => {
    if (!policeWarningLight) return;
    const config: MaterialConfig = policeAlarm
      ? { opacity: 0.8, emissiveIntensity: 2.0, color: policeCurrentColor }
      : { opacity: 0.0, emissiveIntensity: 0.0, color: policeCurrentColor };
    updateMaterial(policeWarningLight, config);
  }, [policeAlarm, policeWarningLight, policeCurrentColor]);

  return (
    <primitive object={scene} scale={1} ref={modelRef} rotation={rotation} />
  );
});

function CityModel() {
  const [rotation, setRotation] = useState<[number, number, number]>([
    Math.PI / 8,
    Math.PI / 6,
    0,
  ]);
  const [zoom, setZoom] = useState(4);
  const dragging = useRef<boolean>(false);
  const last = useRef<[number, number]>([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isLightsOn, isFaulty, hasData: hasLightData } = useLightSystem();
  const { hasActiveAlarm, policeIncidents } = useActiveAlerts();
  const { Incidents: fireIncidents } = useIncidents(
    '/api/v1/incidents/DailyIncidents?type=FIRE_DETECTION',
  );

  const fireActiveCount =
    fireIncidents?.filter((i) => i.status?.toUpperCase() === 'ACTIVE').length ??
    0;
  const Fireactive = fireActiveCount > 0;
  const policeActiveCount = policeIncidents?.length ?? 0;

  // Handle-wheel zoom (desktop) + pinch zoom (mobile) — re-attaches once the first light reading arrives and the container mounts
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(1, Math.min(20, z + e.deltaY * 0.01)));
    };

    // Track pinch distance between two touch points
    let lastPinchDistance: number | null = null;

    const getPinchDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastPinchDistance = getPinchDistance(e.touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getPinchDistance(e.touches);
        if (lastPinchDistance !== null) {
          const delta = currentDistance - lastPinchDistance;
          // Pinching outward (fingers moving apart) = zoom in = decrease zoom value
          setZoom((z) => Math.max(1, Math.min(20, z - delta * 0.02)));
        }
        lastPinchDistance = currentDistance;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastPinchDistance = null;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [hasLightData]);

  if (!hasLightData) return <div>Loading Light System Data...</div>;

  return (
    <div className="h-full flex flex-col justify-start gap-6 items-center">
      {/* Status strip — read-only, no interactive controls */}
      <div className="w-full flex justify-center items-center gap-3 flex-wrap">
        <StatusChip
          icon={<Siren className="h-3.5 w-3.5" />}
          label="Police"
          active={hasActiveAlarm}
          detail={hasActiveAlarm ? `${policeActiveCount} active` : 'Normal'}
          color="#3B82F6"
        />
        <StatusChip
          icon={<Flame className="h-3.5 w-3.5" />}
          label="Fire"
          active={Fireactive}
          detail={Fireactive ? `${fireActiveCount} active` : 'Normal'}
          color="#EF4444"
        />
        <StatusChip
          icon={<Lightbulb className="h-3.5 w-3.5" />}
          label="Street Lights"
          active={isLightsOn}
          detail={isFaulty ? 'Faulty' : isLightsOn ? 'On' : 'Off'}
          color={isFaulty ? '#EF4444' : '#EAB308'}
          neutralWhenOff
        />
      </div>

      <ErrorBoundary>
        <div
          ref={containerRef}
          className={
            'h-full w-full rounded-lg cursor-grab active:cursor-grabbing'
          }
          onMouseDown={(e) => onPointerDown(dragging, last, e)}
          onMouseUp={() => onPointerUp(dragging)}
          onMouseLeave={() => onPointerUp(dragging)}
          onMouseMove={(e) => onPointerMove(dragging, last, e, setRotation)}
          style={{ touchAction: 'none' }}
        >
          <Canvas>
            <PerspectiveCamera
              makeDefault
              position={[0.5, 0, zoom]}
              rotation={[0, 0, 0]}
            />
            <ambientLight intensity={1} />
            <pointLight position={[3, 0, 12]} intensity={500} />
            <Suspense
              fallback={
                <mesh>
                  <boxGeometry />
                  <meshStandardMaterial color="orange" />
                </mesh>
              }
            >
              <Model
                rotation={rotation}
                lights={isLightsOn}
                streetAlarm={isFaulty}
                fireAlarm={Fireactive}
                policeAlarm={hasActiveAlarm}
              />
            </Suspense>
          </Canvas>
        </div>
      </ErrorBoundary>
    </div>
  );
}

function StatusChip({
  icon,
  label,
  active,
  detail,
  color,
  neutralWhenOff = false,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  detail: string;
  color: string;
  neutralWhenOff?: boolean;
}) {
  // "neutralWhenOff" panels (like street lights) don't need a red/alert
  // treatment when inactive — off is a normal state, not a warning.
  const isAlert = active && !neutralWhenOff;

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg border transition-all ${
        isAlert
          ? 'bg-white/5 border-white/10'
          : 'bg-aman-teal/40 border-aman-teal'
      }`}
    >
      <span
        className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
          isAlert ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: active ? `${color}22` : 'rgba(255,255,255,0.05)',
          color: active ? color : '#58717D',
        }}
      >
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-[9.5px] uppercase tracking-wider text-aman-blue">
          {label}
        </span>
        <span
          className="text-[12px] font-mono font-semibold"
          style={{ color: active ? color : '#F4FEFE' }}
        >
          {detail}
        </span>
      </div>
    </div>
  );
}

export default CityModel;
