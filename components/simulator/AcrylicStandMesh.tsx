"use client";

import React, { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { ClampToEdgeWrapping } from "three";
import { EngravingGlowMaterial } from "@/components/simulator/EngravingGlowMaterial";
import { getAcrylicMaterialPreset } from "@/lib/simulator/acrylicMaterial";
import {
  clampImageLayout,
  defaultImageLayout,
  type ImageLayout
} from "@/lib/simulator/imageLayout";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABBAEAjK36iwAAAABJRU5ErkJggg==";
const PLATE_WIDTH = 1.58;
const PLATE_HEIGHT = 2.38;

type AcrylicStandMeshProps = {
  imageUrl?: string | null;
  engravingImageUrl?: string | null;
  imageLayout?: ImageLayout;
  showSourceOverlay?: boolean;
  glowColor?: string;
  brightness?: number;
};

function resolveImageAspect(texture: { image?: { width?: number; height?: number } }): number {
  const width = texture.image?.width;
  const height = texture.image?.height;

  if (typeof width !== "number" || typeof height !== "number" || width <= 0 || height <= 0) {
    return 1;
  }

  return width / height;
}

export function AcrylicStandMesh({
  imageUrl,
  engravingImageUrl,
  imageLayout = defaultImageLayout,
  showSourceOverlay = true,
  glowColor = "#7fe7ff",
  brightness = 1
}: AcrylicStandMeshProps) {
  const resolvedImageUrl = showSourceOverlay ? imageUrl : null;
  const preset = getAcrylicMaterialPreset(Boolean(resolvedImageUrl));
  const texture = useTexture(resolvedImageUrl || TRANSPARENT_PIXEL);
  const normalizedLayout = clampImageLayout(imageLayout);
  const overlayLayout = useMemo(() => {
    const imageAspect = resolveImageAspect(texture);
    const plateAspect = PLATE_WIDTH / PLATE_HEIGHT;
    let width = PLATE_WIDTH;
    let height = PLATE_HEIGHT;
    let repeatX = 1;
    let repeatY = 1;

    if (normalizedLayout.contentFit === "contain") {
      if (imageAspect > plateAspect) {
        width = PLATE_WIDTH;
        height = width / imageAspect;
      } else {
        height = PLATE_HEIGHT;
        width = height * imageAspect;
      }

      width *= normalizedLayout.scale;
      height *= normalizedLayout.scale;
    } else if (normalizedLayout.contentFit === "cover") {
      const cropScale = 1 / normalizedLayout.scale;

      if (imageAspect > plateAspect) {
        repeatX = (plateAspect / imageAspect) * cropScale;
      } else {
        repeatY = (imageAspect / plateAspect) * cropScale;
      }

      repeatX = Math.min(1, repeatX);
      repeatY = Math.min(1, repeatY);
    } else {
      width = PLATE_WIDTH * normalizedLayout.scale;
      height = PLATE_HEIGHT * normalizedLayout.scale;
    }

    const xTravel = Math.abs(PLATE_WIDTH - width) / 2;
    const yTravel = Math.abs(PLATE_HEIGHT - height) / 2;
    const meshX = (normalizedLayout.offsetX / 100) * xTravel;
    const meshY = (-normalizedLayout.offsetY / 100) * yTravel;
    const textureTravelX = (1 - repeatX) / 2;
    const textureTravelY = (1 - repeatY) / 2;
    const textureOffsetX = textureTravelX + (normalizedLayout.offsetX / 100) * textureTravelX;
    const textureOffsetY = textureTravelY - (normalizedLayout.offsetY / 100) * textureTravelY;

    return {
      width,
      height,
      meshX,
      meshY,
      repeatX,
      repeatY,
      textureOffsetX,
      textureOffsetY
    };
  }, [normalizedLayout, texture]);

  useEffect(() => {
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.repeat.set(overlayLayout.repeatX, overlayLayout.repeatY);
    texture.offset.set(overlayLayout.textureOffsetX, overlayLayout.textureOffsetY);
    texture.needsUpdate = true;
  }, [
    overlayLayout.repeatX,
    overlayLayout.repeatY,
    overlayLayout.textureOffsetX,
    overlayLayout.textureOffsetY,
    texture
  ]);

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.4, 0.08]} />
        <meshStandardMaterial
          transparent
          color={preset.color}
          emissive={glowColor || preset.emissive}
          emissiveIntensity={preset.emissiveIntensity * brightness}
          opacity={preset.opacity}
          roughness={preset.roughness}
          metalness={preset.metalness}
        />
      </mesh>
      {resolvedImageUrl ? (
        <mesh position={[overlayLayout.meshX, overlayLayout.meshY, 0.043]}>
          <planeGeometry args={[overlayLayout.width, overlayLayout.height]} />
          <meshBasicMaterial transparent map={texture} alphaTest={0.01} toneMapped={false} />
        </mesh>
      ) : null}
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
