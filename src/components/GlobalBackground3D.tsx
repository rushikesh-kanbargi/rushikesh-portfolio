import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Global scroll ref to avoid React state lag
const scrollRef = { current: 0 };

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Shortened curve for slower, more controlled movement
  // Adjusted for mobile: narrower X spread
  const curve = useMemo(() => {
    const xFactor = isMobile ? 0.5 : 1; // Slightly wider to allow more movement
    const zFactor = isMobile ? 0.8 : 1; // More depth on mobile
    
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2 * xFactor, -4, -4 * zFactor),
      new THREE.Vector3(-3 * xFactor, -8, 2 * zFactor),
      new THREE.Vector3(4 * xFactor, -12, -4 * zFactor),
      new THREE.Vector3(-2 * xFactor, -16, 4 * zFactor),
      new THREE.Vector3(3 * xFactor, -20, -2 * zFactor),
      new THREE.Vector3(-4 * xFactor, -24, 3 * zFactor),
      new THREE.Vector3(0, -32, 0),
    ], false, 'catmullrom', 0.5);
  }, [isMobile]);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.5, 8, false), [curve]);

  const { viewport } = useThree();

  useFrame((state, delta) => {
    const t = scrollRef.current;
    
    // Move camera along the curve
    const point = curve.getPointAt(t);
    const lookAtPoint = curve.getPointAt(Math.min(t + 0.01, 0.99));
    
    // Smooth camera movement using delta time for framerate independence
    const damp = 1 - Math.exp(-5 * delta);
    
    // Push camera back significantly on mobile to avoid text overlap
    const targetPos = new THREE.Vector3(point.x, point.y + 1, point.z + (isMobile ? 14 : 6)); 
    state.camera.position.lerp(targetPos, damp);
    
    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt).add(state.camera.position);
    const newLookAt = currentLookAt.lerp(lookAtPoint, damp);
    state.camera.lookAt(newLookAt);

    if (groupRef.current) {
      // Rotate the entire group slightly for dynamic feel
      groupRef.current.rotation.y = t * Math.PI * 0.2;
      
      // Mouse Parallax
      const mouseX = (state.mouse.x * viewport.width) / 50;
      const mouseY = (state.mouse.y * viewport.height) / 50;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouseX, 0.1);
    }
  });

  // Performance tuning for mobile
  const particleCount = isMobile ? 800 : 2000;
  const pathSparkleCount = isMobile ? 20 : 40;
  const crystalCount = isMobile ? 6 : 12;

  return (
    <group ref={groupRef}>
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Subtle Background Sparkles - Clean Void */}
      <Sparkles count={particleCount} scale={100} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
      
      {/* The "Data Stream" Path */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial visible={false} />
      </mesh>
      
      {/* High density sparkles following the path */}
      {Array.from({ length: pathSparkleCount }).map((_, i) => {
        const t = i / pathSparkleCount;
        const pos = curve.getPointAt(t);
        return (
            <Sparkles 
                key={i}
                position={pos} 
                count={isMobile ? 20 : 50} 
                scale={isMobile ? 3 : 6} 
                size={3} 
                speed={0.2} 
                opacity={0.8}
                color={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"} // Cyan & Violet
                noise={0.5}
            />
        )
      })}

      {/* Floating Geometric Crystals */}
      {Array.from({ length: crystalCount }).map((_, i) => {
        const t = (i + 0.5) / crystalCount;
        const pos = curve.getPointAt(t);
        
        // Create a "Safe Zone" in the center for text
        let xOffset = (Math.random() - 0.5) * (isMobile ? 15 : 12);
        if (isMobile) {
            // On mobile, force objects to the sides (outside -3 to 3 range)
            if (Math.abs(xOffset) < 3) {
                xOffset = xOffset > 0 ? 3 + Math.random() * 2 : -3 - Math.random() * 2;
            }
        }

        const offset = new THREE.Vector3(
            xOffset,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * (isMobile ? 4 : 12)
        );
        const finalPos = pos.clone().add(offset);
        const scale = Math.random() * (isMobile ? 0.6 : 1.5) + 0.5; // Even smaller on mobile
        const geometry = i % 2 === 0 ? new THREE.IcosahedronGeometry(1, 0) : new THREE.OctahedronGeometry(1, 0);
        
        return (
          <Float key={`crystal-${i}`} speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
            <mesh position={finalPos} scale={scale} geometry={geometry}>
              <MeshTransmissionMaterial
                backside
                samples={isMobile ? 2 : 4} // Lower samples on mobile for performance
                thickness={0.5}
                chromaticAberration={0.5}
                anisotropy={0.5}
                distortion={0.5}
                distortionScale={0.5}
                temporalDistortion={0.1}
                iridescence={1}
                iridescenceIOR={1}
                iridescenceThicknessRange={[0, 1400]}
                roughness={0.1}
                color={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}
                toneMapped={false}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

export default function GlobalBackground3D({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Guard against divide by zero
      if (totalHeight <= 0) return;
      
      const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      scrollRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none bg-slate-950">
        <Canvas gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Scene />
          
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} radius={0.3} />
          </EffectComposer>
        </Canvas>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
