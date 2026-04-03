"use client";

import React from "react";
import { useTexture } from "@react-three/drei";
import { getAcrylicMaterialPreset } from "@/lib/simulator/acrylicMaterial";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABBAEAjK36iwAAAABJRU5ErkJggg==";

type AcrylicStandMeshProps = {
  imageUrl?: string | null;
  glowColor?: string;
  brightness?: number;
};

export function AcrylicStandMesh({
  imageUrl,
  glowColor = "#7fe7ff",
  brightness = 1
}: AcrylicStandMeshProps) {
  const preset = getAcrylicMaterialPreset(Boolean(imageUrl));
  const texture = useTexture(imageUrl || TRANSPARENT_PIXEL);

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.4, 0.08]} />
        <meshStandardMaterial
          transparent
          map={texture}
          color={preset.color}
          emissive={glowColor || preset.emissive}
          emissiveIntensity={preset.emissiveIntensity * brightness}
          opacity={preset.opacity}
          roughness={preset.roughness}
          metalness={preset.metalness}
        />
      </mesh>
    </group>
  );
}
