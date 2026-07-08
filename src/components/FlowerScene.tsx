"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

const metal = {
  color: "#aeb6bf",
  metalness: 0.92,
  roughness: 0.22,
};

const metalDark = {
  color: "#6b7580",
  metalness: 0.9,
  roughness: 0.3,
};

const metalLight = {
  color: "#d8dee5",
  metalness: 0.95,
  roughness: 0.15,
};

const blushRing = {
  color: "#e85d8a",
  metalness: 0.6,
  roughness: 0.35,
};

function HexNut({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.1, 6]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 6]} />
        <meshStandardMaterial {...metalDark} />
      </mesh>
    </group>
  );
}

function Leaf({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.28, 0.06, 0.14]} />
      <meshStandardMaterial {...metalLight} />
    </mesh>
  );
}

function FlowerModel() {
  const groupRef = useRef<THREE.Group>(null);

  const stemCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.35, 0),
        new THREE.Vector3(0.02, -0.9, 0),
        new THREE.Vector3(0.12, -0.45, 0),
        new THREE.Vector3(0.22, 0.05, 0),
        new THREE.Vector3(0.28, 0.55, 0),
      ]),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.55;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]} receiveShadow>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.12} />
      </mesh>

      {/* Bolt base */}
      <mesh position={[0, -1.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.22, 12]} />
        <meshStandardMaterial {...metalDark} />
      </mesh>
      <mesh position={[0, -1.34, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.12, 6]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, -1.26, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 12]} />
        <meshStandardMaterial {...metalLight} />
      </mesh>

      {/* Threaded stem tube */}
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[stemCurve, 40, 0.055, 10, false]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      {/* Thread ridges on stem */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t = 0.15 + i * 0.07;
        const point = stemCurve.getPoint(t);
        const tangent = stemCurve.getTangent(t);
        const angle = Math.atan2(tangent.x, tangent.y);
        return (
          <mesh
            key={`ridge-${i}`}
            position={[point.x, point.y, point.z]}
            rotation={[0, 0, angle]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.015, 0.06]} />
            <meshStandardMaterial {...metalDark} />
          </mesh>
        );
      })}

      {/* Leaves */}
      <Leaf position={[0.18, -0.35, 0]} rotation={[0, 0.4, 0.6]} />
      <Leaf position={[0.2, -0.05, 0.05]} rotation={[0.2, 0.5, 0.4]} />

      {/* Flower head group — offset to follow stem curve */}
      <group position={[0.28, 0.62, 0]}>
        {/* Connector rod */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
          <meshStandardMaterial {...metal} />
        </mesh>

        {/* Central hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.14, 16]} />
          <meshStandardMaterial {...metalDark} />
        </mesh>
        <mesh position={[0, 0, 0.05]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial {...metalLight} />
        </mesh>

        {/* Blush accent ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.42, 0.012, 8, 48]} />
          <meshStandardMaterial {...blushRing} />
        </mesh>

        {/* Six hex-nut petals */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.sin(angle) * 0.38;
          const z = Math.cos(angle) * 0.38;
          return (
            <HexNut
              key={`petal-${i}`}
              position={[x, 0.06, z]}
              rotation={[0.3, angle, 0]}
              scale={1.15}
            />
          );
        })}
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} castShadow />
      <directionalLight position={[-3, 2, -4]} intensity={0.45} color="#f9a8c4" />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#ffffff" />
      <Environment preset="city" />
      <FlowerModel />
    </>
  );
}

export function FlowerScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.15, 3.8], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
