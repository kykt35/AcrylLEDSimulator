"use client";

import React from "react";

type SceneLightingProps = {
  background: string;
  glowColor: string;
  brightness: number;
};

export function SceneLighting({ background, glowColor, brightness }: SceneLightingProps) {
  return (
    <>
      <color attach="background" args={[background]} />
      <ambientLight intensity={0.7 * brightness} />
      <directionalLight position={[2, 4, 3]} intensity={1.4 * brightness} color="#ffffff" />
      <directionalLight position={[-2, 1.2, 2]} intensity={0.7 * brightness} color={glowColor} />
    </>
  );
}
