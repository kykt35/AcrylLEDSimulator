"use client";

import React from "react";

type LedBaseMeshProps = {
  glowColor: string;
  brightness: number;
};

export function LedBaseMesh({ glowColor, brightness }: LedBaseMeshProps) {
  return (
    <group>
      <pointLight position={[0, -1.15, 0.35]} intensity={brightness * 18} color={glowColor} />
      <mesh position={[0, -1.45, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.26, 32]} />
        <meshStandardMaterial color="#1a2d44" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.24, 0.38]}>
        <boxGeometry args={[1.1, 0.12, 0.2]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={brightness * 1.4} />
      </mesh>
    </group>
  );
}
