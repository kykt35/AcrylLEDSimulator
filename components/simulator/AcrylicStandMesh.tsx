"use client";

import React from "react";
import { useTexture } from "@react-three/drei";
import { EngravingGlowMaterial } from "@/components/simulator/EngravingGlowMaterial";
import { getAcrylicMaterialPreset } from "@/lib/simulator/acrylicMaterial";
import { getAcrylicSizePreset, type AcrylicSizePreset } from "@/lib/simulator/acrylicSizePresets";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABBAEAjK36iwAAAABJRU5ErkJggg==";

type AcrylicStandMeshProps = {
  imageUrl?: string | null;
  engravingImageUrl?: string | null;
  sizePreset?: AcrylicSizePreset;
  isEngravingMode?: boolean;
  glowColor?: string;
  brightness?: number;
  heightAttenuation?: number;
};

export function AcrylicStandMesh({
  imageUrl,
  engravingImageUrl,
  sizePreset = getAcrylicSizePreset("medium"),
  isEngravingMode = false,
  glowColor = "#7fe7ff",
  brightness = 1,
  heightAttenuation = 0.3
}: AcrylicStandMeshProps) {
  const resolvedImageUrl = isEngravingMode ? null : imageUrl;
  const preset = getAcrylicMaterialPreset(Boolean(resolvedImageUrl));
  const texture = useTexture(resolvedImageUrl || TRANSPARENT_PIXEL);
  const engravingPlaneInset = 0.02;

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[sizePreset.width, sizePreset.height, sizePreset.thickness]} />
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
      {isEngravingMode ? (
        <mesh position={[0, 0, sizePreset.thickness / 2 + 0.002]}>
          <planeGeometry
            args={[
              sizePreset.width - engravingPlaneInset,
              sizePreset.height - engravingPlaneInset
            ]}
          />
          <EngravingGlowMaterial
            engravingImageUrl={engravingImageUrl}
            glowColor={glowColor}
            brightness={brightness}
            heightAttenuation={heightAttenuation}
          />
        </mesh>
      ) : null}
    </group>
  );
}
