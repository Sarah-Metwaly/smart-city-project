import React, {Suspense, useEffect, useRef, useState} from 'react';
// @ts-ignore
import {Canvas} from '@react-three/fiber';
import {PerspectiveCamera, useGLTF} from "@react-three/drei";
import {MeshStandardMaterial} from 'three';
import {ErrorBoundary} from '../../shared/utils/appUtils';
import './CityModel.css';
import {onPointerDown, onPointerMove, onPointerUp} from "../../shared/utils/threeUtils.tsx";
import { useLightSystem } from '../../features/energy-optimization/hooks/useLightsytem.tsx';
import { useActiveAlerts } from '../../features/fire-department/hooks/useActiveAlerts.tsx';
import { useIncidents } from '../../shared/hooks/useIncidentTable.tsx';







function Model({color, rotation, lights}: {color: string, rotation: [number, number, number], lights: boolean}) {
    const {materials, scene} = useGLTF('/models/city-model.glb');
    const streetColor = materials["[Color_001]4"] as MeshStandardMaterial;
    const modelRef = useRef(null);
    console.log("All available materials:", Object.keys(materials));
    console.log("Is streetColor found?:", streetColor);

    React.useEffect(() => {
        if (streetColor) {
            streetColor.transparent = true;
            if (!lights) {
                streetColor.opacity = 0.0;
                streetColor.emissiveIntensity = 0.0;
            } else {
                streetColor.opacity = 0.27;
                streetColor.emissiveIntensity = 1.0;
                streetColor.color.set(color);
                if (streetColor.emissive) {
                    streetColor.emissive.set(color);
                }
            }
            streetColor.needsUpdate = true;
        }
    }, [color, streetColor, lights]);

    return <primitive object={scene} scale={1} ref={modelRef} rotation={rotation} />;
}

function CityModel() {
    const [color, setColor] = React.useState('#eadb60');
    const [rotation, setRotation] = useState<[number, number, number]>([Math.PI/8, Math.PI/6, 0]);
    const [zoom, setZoom] = useState(4);
    const dragging = useRef<boolean>(false);
    const last = useRef<[number, number]>([0, 0]);
    const [alarm, setAlarm] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { isLightsOn, isLoading, isError } = useLightSystem();
    const {hasActiveAlarm} = useActiveAlerts();
    const { Incidents } = useIncidents("/api/v1/incidents/DailyIncidents?type=FIRE_DETECTION");

    const Fireactive = (Incidents?.filter((i) => i.status?.toUpperCase() === "ACTIVE").length ?? 0) > 0;     

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

    useEffect(() => {
        let cancelled = false;
        if (alarm) {
            const runAlarm = async () => {
                while (!cancelled) {
                    setColor("#ff0000");
                    await new Promise(r => setTimeout(r, 500));
                    if (cancelled) break;
                    setColor("#eadb60");
                    await new Promise(r => setTimeout(r, 500));
                }
            };
            runAlarm();
        } else {
            setTimeout(() => setColor("#eadb60"), 0);
        }
        return () => { cancelled = true; };
    }, [alarm]);

    if (isLoading) return <div>Loading Light System Data...</div>;
    if (isError) return <div>Error loading data</div>;

    return (
        <div className="h-full flex flex-col justify-start gap-10 items-center">
            <div className='w-full flex justify-center items-center gap-10'>
                <button
                    onClick={() => setAlarm(a => !a)}
                    className={`bg-aman-${alarm ? "dark" : "white"} text-aman-${alarm ? "white" : "dark"} px-6 py-2 rounded-lg font-semibold font-inter hover:bg-aman-teal hover:text-aman-white transition-all`}
                >
                    {alarm ? "Stop Alarm" : "Start Alarm"}
                </button>
                <div className={`px-6 py-2 rounded-lg font-semibold font-inter bg-slate-200`}>
                    System Lights: {isLightsOn ? "ON" : "OFF"}
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
                            <Model color={color} rotation={rotation} lights={isLightsOn}/>
                        </Suspense>
                    </Canvas>
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default CityModel;