"use client";

import React, { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { type AcrylicSizePreset } from "@/lib/simulator/acrylicSizePresets";

type CameraControllerProps = {
  preset: string;
  sizePreset: AcrylicSizePreset;
  controlsEnabled?: boolean;
};

const cameraPresets: Record<string, [number, number, number]> = {
  front: [0, 0.8, 4.6],
  tilt: [1.8, 1.6, 4],
  detail: [0.7, 0.25, 2.4]
};

export function CameraController({
  preset,
  sizePreset,
  controlsEnabled = true
}: CameraControllerProps) {
  const { camera } = useThree();

  useEffect(() => {
    const [x, y, z] = cameraPresets[preset] ?? cameraPresets.front;
    camera.position.set(x, y, z * sizePreset.cameraDistanceMultiplier);
    camera.lookAt(0, -0.2, 0);
  }, [camera, preset, sizePreset.cameraDistanceMultiplier]);

  return (
    <OrbitControls
      enabled={controlsEnabled}
      enablePan={false}
      minDistance={2.1}
      maxDistance={6.4}
    />
  );
}
