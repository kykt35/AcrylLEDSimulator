"use client";

import React from "react";
import { type AcrylicSizePreset } from "@/lib/simulator/acrylicSizePresets";

type LedBaseMeshProps = {
  sizePreset: AcrylicSizePreset;
  glowColor: string;
  brightness: number;
};

export function LedBaseMesh({ sizePreset, glowColor, brightness }: LedBaseMeshProps) {
  const baseY = -sizePreset.height / 2 - sizePreset.baseHeight / 2 - 0.12;
  const ledBarY = baseY + sizePreset.baseHeight * 0.8;

  return (
    <group>
      <pointLight
        position={[0, sizePreset.pointLightY, sizePreset.pointLightZ]}
        intensity={brightness * 18}
        color={glowColor}
      />
      <mesh position={[0, baseY, 0]}>
        <cylinderGeometry
          args={[sizePreset.baseWidth * 0.82, sizePreset.baseWidth, sizePreset.baseHeight, 32]}
        />
        <meshStandardMaterial color="#1a2d44" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, ledBarY, sizePreset.pointLightZ + 0.03]}>
        <boxGeometry args={[sizePreset.ledBarWidth, 0.12, 0.2]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={brightness * 1.4} />
      </mesh>
    </group>
  );
}
