import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function GraduationCap() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.6, 0.55, 0.18, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.45, 0.35, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#D4A853" metalness={0.6} roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export function GraduationCap3D() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]">
      <Canvas
        camera={{ position: [0, 0.2, 3], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} />
        <GraduationCap />
      </Canvas>
    </div>
  );
}
