import React, {Suspense, useEffect, useRef, useState} from 'react';
// @ts-ignore
import {Canvas} from '@react-three/fiber';
import {PerspectiveCamera, useGLTF} from "@react-three/drei";
import {MeshStandardMaterial} from 'three';
import {ErrorBoundary} from '../../shared/utils/appUtils';
import './CityModel.css';
import {onPointerDown, onPointerMove, onPointerUp} from "../../shared/utils/threeUtils.tsx";

function Model({color, rotation, lights}: {color: string, rotation: [number, number, number], lights: boolean}) {
    const {materials, scene} = useGLTF('/models/city-model.glb');
    const streetColor = materials["[Color_001]4"] as MeshStandardMaterial;
    const modelRef = useRef(null);

    React.useEffect(() => {
        if (streetColor) {
            // eslint-disable-next-line react-hooks/immutability
            if (!lights) streetColor.opacity = 0
            else {
                streetColor.opacity = 0.27
                streetColor.emissiveIntensity = 1
                streetColor.color.set(color)
            }
        }
    }, [color, streetColor, lights]);

    return <primitive object={scene} scale={1} ref={modelRef} rotation={rotation} />;
}

function CityModel() {
    const [color, setColor] = React.useState('#eadb60');
    const [rotation, setRotation] = useState<[number, number, number]>([Math.PI/8, Math.PI/6, 0 ]);
    const [zoom, setZoom] = useState(4);
    const dragging = useRef<boolean>(false);
    const last = useRef<[number, number]>([0, 0]);
    const [alarm, setAlarm] = useState(false);
    const [lightsOn, setLightsOn] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Non-passive wheel listener so e.preventDefault() actually works,
    // preventing the page from scrolling while zooming the model.
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

    return (
        <div className="h-full flex flex-col justify-start gap-10 items-center">
            <div className='w-full flex justify-center items-center gap-10'>
                <button onClick={() => setAlarm(a => !a)} className={`bg-aman-${alarm ? "dark" : "white"} text-aman-${alarm ? "white" : "dark"} px-6 py-2 rounded-lg font-semibold font-inter hover:bg-aman-teal hover:text-aman-white transition-all`}>{alarm ? "Stop Alarm" : "Start Alarm"}</button>
                <button onClick={() => setLightsOn(l => !l)} className={`bg-aman-${lightsOn ? "dark" : "white"} text-aman-${lightsOn ? "white" : "dark"} px-6 py-2 rounded-lg font-semibold font-inter hover:bg-aman-teal hover:text-aman-white transition-all`}>{lightsOn ? "Turn Lights Off" : "Turn Lights On"}</button>
            </div>
            <ErrorBoundary>
                <div
                    ref={containerRef}
                    className={'h-full w-full  rounded-lg cursor-grab active:cursor-grabbing'}
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
                            <Model color={color} rotation={rotation} lights={lightsOn}/>
                        </Suspense>
                    </Canvas>
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default CityModel;

