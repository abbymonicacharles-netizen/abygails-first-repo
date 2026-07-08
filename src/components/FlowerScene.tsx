"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const matteSteel = {
  color: "#3a3d42",
  metalness: 0.08,
  roughness: 0.94,
  side: THREE.DoubleSide,
};

function Petal({
  angle,
  radius,
  height,
  tilt,
  scale = 1,
  inner = false,
}: {
  angle: number;
  radius: number;
  height: number;
  tilt: number;
  scale?: number;
  inner?: boolean;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = inner ? 0.028 : 0.038;
    shape.moveTo(0, 0);
    shape.bezierCurveTo(w * 0.6, height * 0.35, w * 0.5, height * 0.75, w * 0.15, height);
    shape.bezierCurveTo(0, height * 1.05, -w * 0.15, height, -w * 0.5, height * 0.75);
    shape.bezierCurveTo(-w * 0.6, height * 0.35, 0, 0, 0, 0);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: inner ? 0.012 : 0.016,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.002,
      bevelSegments: 2,
      curveSegments: 8,
    });
    geo.center();
    return geo;
  }, [height, inner]);

  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  return (
    <mesh
      geometry={geometry}
      position={[x, height * 0.35, z]}
      rotation={[tilt, angle, 0]}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial {...matteSteel} />
    </mesh>
  );
}

function Leaf({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.008, 0.05]} />
        <meshStandardMaterial {...matteSteel} />
      </mesh>
      <mesh position={[0, 0.005, 0]} castShadow>
        <boxGeometry args={[0.1, 0.003, 0.008]} />
        <meshStandardMaterial color="#2e3135" metalness={0.05} roughness={0.96} />
      </mesh>
    </group>
  );
}

function RoseModel() {
  const groupRef = useRef<THREE.Group>(null);

  const stemCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.85, 0),
        new THREE.Vector3(0.01, -0.55, 0),
        new THREE.Vector3(0.06, -0.25, 0),
        new THREE.Vector3(0.1, 0.05, 0),
        new THREE.Vector3(0.12, 0.28, 0),
      ]),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.22;
    }
  });

  const outerPetals = 6;
  const innerPetals = 5;

  return (
    <group ref={groupRef} scale={0.82}>
      {/* Thin curved stem */}
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[stemCurve, 32, 0.014, 8, false]} />
        <meshStandardMaterial {...matteSteel} />
      </mesh>

      {/* Three leaves at junction */}
      <Leaf position={[0.06, -0.22, 0]} rotation={[0.1, 0.5, -0.7]} />
      <Leaf position={[0.05, -0.24, 0.02]} rotation={[0.2, -0.4, 0.65]} />
      <Leaf position={[0.08, -0.23, -0.01]} rotation={[-0.1, 1.2, 0.55]} />

      {/* Bloom — cup shape, open top so interior is visible */}
      <group position={[0.12, 0.34, 0]}>
        {/* Weld ring at base of bloom */}
        <mesh position={[0, -0.02, 0]} castShadow>
          <torusGeometry args={[0.045, 0.006, 8, 24]} />
          <meshStandardMaterial color="#2e3135" metalness={0.1} roughness={0.92} />
        </mesh>

        {/* Outer petals — flare outward, form open cup */}
        {Array.from({ length: outerPetals }).map((_, i) => {
          const angle = (i / outerPetals) * Math.PI * 2;
          return (
            <Petal
              key={`outer-${i}`}
              angle={angle}
              radius={0.01}
              height={0.22}
              tilt={-0.55}
              scale={1}
            />
          );
        })}

        {/* Inner petals — smaller, tilted inward, visible from inside */}
        {Array.from({ length: innerPetals }).map((_, i) => {
          const angle = (i / innerPetals) * Math.PI * 2 + 0.3;
          return (
            <Petal
              key={`inner-${i}`}
              angle={angle}
              radius={0.005}
              height={0.14}
              tilt={-0.85}
              scale={0.85}
              inner
            />
          );
        })}

        {/* Inner bowl floor — shallow base so hollow interior reads */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#2a2d31" metalness={0.06} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={0.55} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.2} />
      <RoseModel />
    </>
  );
}

export function FlowerScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 2.2], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
