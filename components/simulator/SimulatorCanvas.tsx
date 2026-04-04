"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";
import { CameraController } from "@/components/simulator/CameraController";
import { LedBaseMesh } from "@/components/simulator/LedBaseMesh";
import { SceneLighting } from "@/components/simulator/SceneLighting";

type SimulatorCanvasProps = {
  imageUrl?: string | null;
  engravingImageUrl?: string | null;
  showSourceOverlay?: boolean;
  glowColor?: string;
  brightness?: number;
  background?: string;
  cameraPreset?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export function SimulatorCanvas({
  imageUrl,
  engravingImageUrl,
  showSourceOverlay = true,
  glowColor = "#7fe7ff",
  brightness = 1,
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
          showSourceOverlay={showSourceOverlay}
          glowColor={glowColor}
          brightness={brightness}
        />
        <LedBaseMesh glowColor={glowColor} brightness={brightness} />
        <CameraController preset={cameraPreset} />
      </Canvas>
    </div>
  );
}
