"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";
import { CameraController } from "@/components/simulator/CameraController";
import { LedBaseMesh } from "@/components/simulator/LedBaseMesh";
import { SceneLighting } from "@/components/simulator/SceneLighting";
import {
  getAcrylicSizePreset,
  type AcrylicSizePreset
} from "@/lib/simulator/acrylicSizePresets";

type SimulatorCanvasProps = {
  imageUrl?: string | null;
  engravingImageUrl?: string | null;
  sizePreset?: AcrylicSizePreset;
  showSourceOverlay?: boolean;
  glowColor?: string;
  brightness?: number;
  heightAttenuation?: number;
  background?: string;
  cameraPreset?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export function SimulatorCanvas({
  imageUrl,
  engravingImageUrl,
  sizePreset = getAcrylicSizePreset("medium"),
  showSourceOverlay = false,
  glowColor = "#7fe7ff",
  brightness = 1,
  heightAttenuation = 0.3,
  background = "#07111f",
  cameraPreset = "front",
  containerRef
}: SimulatorCanvasProps) {
  return (
    <div ref={containerRef} className="simulator-canvas-host">
      <Canvas
        camera={{ position: [0, 0.8, 4.6], fov: 36 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <SceneLighting background={background} glowColor={glowColor} brightness={brightness} />
        <AcrylicStandMesh
          imageUrl={imageUrl}
          engravingImageUrl={engravingImageUrl}
          sizePreset={sizePreset}
          showSourceOverlay={showSourceOverlay}
          glowColor={glowColor}
          brightness={brightness}
          heightAttenuation={heightAttenuation}
        />
        <LedBaseMesh sizePreset={sizePreset} glowColor={glowColor} brightness={brightness} />
        <CameraController preset={cameraPreset} sizePreset={sizePreset} />
      </Canvas>
    </div>
  );
}
