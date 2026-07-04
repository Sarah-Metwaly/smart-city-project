import {Suspense, useEffect, useRef, useState, memo, useMemo} from 'react';
// @ts-ignore
import {Canvas} from '@react-three/fiber';
import {PerspectiveCamera, useGLTF} from "@react-three/drei";
import {MeshStandardMaterial} from 'three';
import {ErrorBoundary} from '../../shared/utils/appUtils';
import './CityModel.css';
import {onPointerDown, onPointerMove, onPointerUp} from "../../shared/utils/threeUtils.tsx";
import { useLightSystem } from '../../features/energy-optimization/hooks/useLightsytem.tsx';
import { useLiveIncidentStore } from '../../store/useLiveIncidentStore';
import { useAlarmSystem, useSyncAlarm } from './useAlarmSystem';

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
    config: MaterialConfig
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
    policeAlarm
}: ModelProps) {
    const {materials, scene} = useGLTF('/models/city-model.glb');
    const streetColor = materials["[Color_001]4"] as MeshStandardMaterial;
    const fireWarningLight = materials["fire_warning"] as MeshStandardMaterial;
    const policeWarningLight = materials["police_warning1"] as MeshStandardMaterial;
    const modelRef = useRef(null);

    // Color states for each alarm type
    const [streetCurrentColor, setStreetCurrentColor] = useState('#eadb60');
    const [fireCurrentColor, setFireCurrentColor] = useState('#ff0000');
    const [policeCurrentColor, setPoliceCurrentColor] = useState('#0000ff');

    // Street alarm blinking effect (yellow ↔ red)
    useEffect(() => {
        let cancelled = false;
        if (streetAlarm && lights) {
            const runBlinkEffect = async () => {
                while (!cancelled) {
                    setStreetCurrentColor("#ff0000");  // Red
                    await new Promise(r => setTimeout(r, 500));
                    if (cancelled) break;
                    setStreetCurrentColor("#eadb60");  // Yellow
                    await new Promise(r => setTimeout(r, 500));
                }
            };
            runBlinkEffect();
        } else {
            setStreetCurrentColor("#eadb60");  // Reset to yellow
        }
        return () => { cancelled = true; };
    }, [streetAlarm, lights]);

    // Fire alarm blinking effect (bright red ↔ dark red)
    useEffect(() => {
        let cancelled = false;
        if (fireAlarm) {
            const runBlinkEffect = async () => {
                while (!cancelled) {
                    setFireCurrentColor("#ff0000");  // Bright red
                    await new Promise(r => setTimeout(r, 500));
                    if (cancelled) break;
                    setFireCurrentColor("#8B0000");  // Dark red
                    await new Promise(r => setTimeout(r, 500));
                }
            };
            runBlinkEffect();
        } else {
            setFireCurrentColor("#ff0000");  // Reset to bright red
        }
        return () => { cancelled = true; };
    }, [fireAlarm]);

    // Police alarm blinking effect (bright blue ↔ dark blue)
    useEffect(() => {
        let cancelled = false;
        if (policeAlarm) {
            const runBlinkEffect = async () => {
                while (!cancelled) {
                    setPoliceCurrentColor("#0000ff");  // Bright blue
                    await new Promise(r => setTimeout(r, 500));
                    if (cancelled) break;
                    setPoliceCurrentColor("#00008B");  // Dark blue
                    await new Promise(r => setTimeout(r, 500));
                }
            };
            runBlinkEffect();
        } else {
            setPoliceCurrentColor("#0000ff");  // Reset to bright blue
        }
        return () => { cancelled = true; };
    }, [policeAlarm]);

    // Street lights effect - always semi-transparent when on
    useEffect(() => {
        if (!streetColor) return;

        const config: MaterialConfig = lights
            ? {
                opacity: 0.35,  // Always semi-transparent when lights are on
                emissiveIntensity: 1.2,  // Consistent intensity
                color: streetCurrentColor  // Color changes based on alarm
            }
            : {
                opacity: 0.0,
                emissiveIntensity: 0.0,
                color: streetCurrentColor
            };

        updateMaterial(streetColor, config);
    }, [streetCurrentColor, streetColor, lights]);

    // Fire warning light effect - semi-transparent when active, blinks when alarm is on
    useEffect(() => {
        if (!fireWarningLight) return;

        const config: MaterialConfig = fireAlarm
            ? {
                opacity: 0.8,  // Semi-transparent
                emissiveIntensity: 2.0,
                color: fireCurrentColor  // Color blinks between bright and dark red
            }
            : {
                opacity: 0.0,
                emissiveIntensity: 0.0,
                color: fireCurrentColor
            };

        updateMaterial(fireWarningLight, config);
    }, [fireAlarm, fireWarningLight, fireCurrentColor]);

    // Police warning light effect - semi-transparent when active, blinks when alarm is on
    useEffect(() => {
        if (!policeWarningLight) return;

        const config: MaterialConfig = policeAlarm
            ? {
                opacity: 0.8,  // Semi-transparent
                emissiveIntensity: 2.0,
                color: policeCurrentColor  // Color blinks between bright and dark blue
            }
            : {
                opacity: 0.0,
                emissiveIntensity: 0.0,
                color: policeCurrentColor
            };

        updateMaterial(policeWarningLight, config);
    }, [policeAlarm, policeWarningLight, policeCurrentColor]);

    return <primitive object={scene} scale={1} ref={modelRef} rotation={rotation} />;
});

function CityModel() {
    const [rotation, setRotation] = useState<[number, number, number]>([Math.PI/8, Math.PI/6, 0]);
    const [zoom, setZoom] = useState(4);
    const dragging = useRef<boolean>(false);
    const last = useRef<[number, number]>([0, 0]);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Alarm system hook
    const { alarms, setAlarm, toggleAlarm } = useAlarmSystem();
    
    // Monitor live incidents from WebSocket
    const { activeIncidents } = useLiveIncidentStore();

    const memoIncident = useMemo(() => activeIncidents, [activeIncidents]);

    const fireIncident = useMemo(() => memoIncident?.filter((incident:{type: string}) => incident.type === "FIRE_DETECTION"), [memoIncident]);

    const { isLightsOn, isLoading, isError } = useLightSystem();

    // Sync fire alarm with WebSocket-based active incidents
    useSyncAlarm('fire', fireIncident, setAlarm, 3000);

    // Sync police alarm with Websocket-based active incidents
    useSyncAlarm('police', memoIncident, setAlarm, 2000);

    // Handle-wheel zoom
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            setZoom(z => Math.max(1, Math.min(20, z + e.deltaY * 0.01)));
        };
        el.addEventListener('wheel', handleWheel, {passive: false});
        return () => el.removeEventListener('wheel', handleWheel);
    }, []);


    if (isLoading) return <div>Loading Light System Data...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <div className="h-full flex flex-col justify-start gap-10 items-center">
            <div className='w-full flex justify-center items-center gap-4 flex-wrap'>
                <button
                    onClick={() => toggleAlarm('street')}
                    className={`${
                        alarms.street 
                            ? "bg-red-600 text-white" 
                            : "bg-white text-gray-800"
                    } px-6 py-2 rounded-lg font-semibold font-inter hover:bg-red-500 hover:text-white transition-all border-2 border-red-600`}
                >
                    {alarms.street ? "🚨 Stop Street Alarm" : "Start Street Alarm"}
                </button>
                
                <button
                    className={`${
                        alarms.police 
                            ? "bg-blue-600 text-white" 
                            : "bg-white text-gray-800"
                    } px-6 py-2 rounded-lg font-semibold font-inter hover:bg-blue-500 hover:text-white transition-all border-2 border-blue-600`}
                >
                    Police Alarm: {alarms.police ? `ACTIVE (${activeIncidents.length} incident${activeIncidents.length !== 1 ? 's' : ''})` : "OFF"}
                </button>

                <div className={`${
                    alarms.fire ? "bg-red-100 border-red-600 text-red-800" : "bg-slate-200 border-slate-400 text-gray-800"
                } px-6 py-2 rounded-lg font-semibold font-inter border-2 transition-all`}>
                    🔥 Fire Alarm: {alarms.fire ? `ACTIVE (${fireIncident.length} incident${fireIncident.length !== 1 ? 's' : ''})` : "OFF"}
                </div>

                <div className={`px-6 py-2 rounded-lg font-semibold font-inter bg-slate-200 border-2 border-slate-400`}>
                    💡 System Lights: {isLightsOn ? "ON" : "OFF"}
                </div>
            </div>
            <ErrorBoundary>
                <div
                    ref={containerRef}
                    className={'h-full w-full rounded-lg cursor-grab active:cursor-grabbing'}
                    onMouseDown={(e) => onPointerDown(dragging, last, e)}
                    onMouseUp={() => onPointerUp(dragging)}
                    onMouseLeave={() => onPointerUp(dragging)}
                    onMouseMove={e => onPointerMove(dragging, last, e, setRotation)}
                    style={{touchAction: 'none'}}
                >
                    <Canvas>
                        <PerspectiveCamera makeDefault position={[0.5, 0, zoom]} rotation={[0, 0, 0]}/>
                        <ambientLight intensity={1}/>
                        <pointLight position={[3, 0, 12]} intensity={500}/>
                        <Suspense fallback={<mesh><boxGeometry/><meshStandardMaterial color="orange"/></mesh>}>
                            <Model
                                rotation={rotation}
                                lights={isLightsOn}
                                streetAlarm={alarms.street}
                                fireAlarm={alarms.fire}
                                policeAlarm={alarms.police}
                            />
                        </Suspense>
                    </Canvas>
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default CityModel;