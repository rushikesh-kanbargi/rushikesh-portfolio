import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const scrollRef = { current: 0 };

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(2, -4, -4),
          new THREE.Vector3(-3, -8, 2),
          new THREE.Vector3(4, -12, -4),
          new THREE.Vector3(-2, -16, 4),
          new THREE.Vector3(3, -20, -2),
          new THREE.Vector3(-4, -24, 3),
          new THREE.Vector3(0, -32, 0),
        ],
        false,
        'catmullrom',
        0.5
      ),
    []
  );

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 200, 0.5, 8, false), [curve]);
  const { viewport } = useThree();

  const smoothedScrollPos = useRef(0);
  const smoothedScrollRot = useRef(0);
  const velocity = useRef(0);
  const cameraOffset = isMobile ? 14 : 6;
  const targetPos = useRef(new THREE.Vector3(0, 1, 6));
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const safeDelta = Math.min(Math.max(delta, 1 / 120), 0.1);
    const targetT = scrollRef.current;

    const dampPos = THREE.MathUtils.damp(smoothedScrollPos.current, targetT, 3.5, safeDelta);
    const rawVelocity = (dampPos - smoothedScrollPos.current) / safeDelta;
    const clampedVelocity = Math.max(-12, Math.min(12, rawVelocity));
    velocity.current = THREE.MathUtils.lerp(velocity.current, clampedVelocity, 0.06);
    if (Number.isNaN(velocity.current)) velocity.current = 0;

    smoothedScrollPos.current = dampPos;
    smoothedScrollRot.current = THREE.MathUtils.damp(smoothedScrollRot.current, targetT, 2.5, safeDelta);

    const tPos = smoothedScrollPos.current;
    const tRot = smoothedScrollRot.current;
    curve.getPointAt(tPos, targetPos.current);
    targetPos.current.y += 1;
    targetPos.current.z += cameraOffset;
    curve.getPointAt(Math.min(tRot + 0.01, 0.99), lookAtTarget.current);

    state.camera.position.lerp(targetPos.current, 1 - Math.exp(-12 * safeDelta));
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, velocity.current * -0.025, 0.1);
    state.camera.lookAt(lookAtTarget.current);

    if (groupRef.current) {
      groupRef.current.rotation.y = tRot * Math.PI * 0.1;
      const mouseX = (state.mouse.x * viewport.width) / 60;
      const mouseY = (state.mouse.y * viewport.height) / 60;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, mouseY, 2.5, safeDelta);
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, mouseX, 2.5, safeDelta) + (velocity.current * 0.012);
    }
  });

  const particleCount = isMobile ? 500 : 1200;
  const pathSparkleCount = isMobile ? 12 : 24;
  const crystalCount = isMobile ? 6 : 12;

  const crystalData = useMemo(() => {
    const data: { t: number; offset: THREE.Vector3; scale: number; isIcosa: boolean }[] = [];
    for (let i = 0; i < 12; i++) {
      const t = (i + 0.5) / 12;
      data.push({
        t,
        offset: new THREE.Vector3(
          (seededRandom(i * 7 + 1) - 0.5) * 12,
          (seededRandom(i * 11 + 2) - 0.5) * 8,
          (seededRandom(i * 13 + 3) - 0.5) * 12
        ),
        scale: seededRandom(i * 17 + 4) * 1.5 + 0.5,
        isIcosa: i % 2 === 0,
      });
    }
    return data;
  }, []);

  const crystalsToRender = crystalData.slice(0, crystalCount);
  const geoIcosa = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const geoOcta = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);

  return (
    <group ref={groupRef}>
      <Environment preset="night" />
      <Sparkles
        count={particleCount}
        scale={80}
        size={1.2}
        speed={0.2}
        opacity={0.35}
        color="#e8f0ff"
        noise={0.4}
      />
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial visible={false} />
      </mesh>
      {Array.from({ length: pathSparkleCount }).map((_, i) => {
        const t = i / pathSparkleCount;
        const pos = curve.getPointAt(t);
        return (
          <Sparkles
            key={i}
            position={pos}
            count={isMobile ? 10 : 20}
            scale={isMobile ? 2 : 3.5}
            size={1.5}
            speed={0.12}
            opacity={0.5}
            color={i % 2 === 0 ? '#7dd3fc' : '#a78bfa'}
            noise={0.45}
          />
        );
      })}
      {crystalsToRender.map(({ t, offset, scale, isIcosa }, i) => {
        const pos = curve.getPointAt(t);
        const finalPos = pos.clone().add(offset);
        return (
          <mesh
            key={`crystal-${i}`}
            position={finalPos}
            scale={scale}
            geometry={isIcosa ? geoIcosa : geoOcta}
            renderOrder={50 + i}
          >
            <meshPhysicalMaterial
              transmission={0.92}
              thickness={0.5}
              roughness={0.25}
              metalness={0.05}
              color={isIcosa ? '#38bdf8' : '#a78bfa'}
              envMapIntensity={0.6}
              transparent
              opacity={0.98}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function GlobalBackground3D({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let rafId = 0;
    function tick() {
      if (document.visibilityState === 'hidden') {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        scrollRef.current = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none bg-slate-950">
        {reduceMotion ? null : (
        <Canvas
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1,
          }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[8, 8, 8]} intensity={0.8} distance={80} decay={2} />
          <pointLight position={[-4, -2, 4]} intensity={0.25} color="#3b82f6" distance={50} />
          <Scene />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.75}
              luminanceSmoothing={0.95}
              intensity={0.6}
              radius={0.25}
            />
          </EffectComposer>
        </Canvas>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
