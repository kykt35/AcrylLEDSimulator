"use client";

import React from "react";
import { useTexture } from "@react-three/drei";
import { EngravingGlowMaterial } from "@/components/simulator/EngravingGlowMaterial";
import { getAcrylicMaterialPreset } from "@/lib/simulator/acrylicMaterial";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABBAEAjK36iwAAAABJRU5ErkJggg==";

type AcrylicStandMeshProps = {
  imageUrl?: string | null;
  engravingImageUrl?: string | null;
  showSourceOverlay?: boolean;
  glowColor?: string;
  brightness?: number;
};

export function AcrylicStandMesh({
  imageUrl,
  engravingImageUrl,
  showSourceOverlay = false,
  glowColor = "#7fe7ff",
  brightness = 1
}: AcrylicStandMeshProps) {
  const resolvedImageUrl = showSourceOverlay ? imageUrl : null;
  const preset = getAcrylicMaterialPreset(Boolean(resolvedImageUrl));
  const texture = useTexture(resolvedImageUrl || TRANSPARENT_PIXEL);

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
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[1.58, 2.38]} />
        <EngravingGlowMaterial
          engravingImageUrl={engravingImageUrl}
          glowColor={glowColor}
          brightness={brightness}
        />
      </mesh>
    </group>
  );
}
