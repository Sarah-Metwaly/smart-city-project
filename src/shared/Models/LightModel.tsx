import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'



// ── تحميل النموذج ──────────────────────────────────────────
function StreetLight() {
  const { scene } = useGLTF('public/modules/streetlight.glb')
  return <primitive object={scene} scale={1} />
}

// ── Loading fallback ───────────────────────────────────────
function Loader() {
  return (
    <mesh>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial color="#334155" wireframe />
    </mesh>
  )
}

// ── المكوّن الرئيسي ────────────────────────────────────────
export default function LightModel() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
        />
        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <StreetLight />
        </Suspense>

        <OrbitControls
          enableZoom
          enableRotate
          enablePan
          minDistance={2}
          maxDistance={50}
        />
      </Canvas>
    </div>
  )
}

// preload لأداء أفضل
useGLTF.preload('/modules/streetlight.glb')