"use client";

import React, { useMemo } from "react";
import { AdditiveBlending, Color } from "three";
import { useTexture } from "@react-three/drei";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABBAEAjK36iwAAAABJRU5ErkJggg==";

type EngravingGlowMaterialProps = {
  engravingImageUrl?: string | null;
  glowColor: string;
  brightness: number;
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D engravingMap;
  uniform vec3 glowColor;
  uniform float brightness;
  varying vec2 vUv;

  void main() {
    vec4 engravingSample = texture2D(engravingMap, vUv);
    float engraving = engravingSample.r;
    float edgeLighting = smoothstep(0.0, 0.4, 1.0 - vUv.y);
    float distanceFalloff = mix(1.0, 0.5, vUv.y);
    float glow = engraving * edgeLighting * distanceFalloff * brightness;

    if (glow <= 0.001) {
      discard;
    }

    gl_FragColor = vec4(glowColor * glow, glow);
  }
`;

export function EngravingGlowMaterial({
  engravingImageUrl,
  glowColor,
  brightness
}: EngravingGlowMaterialProps) {
  const engravingTexture = useTexture(engravingImageUrl || TRANSPARENT_PIXEL);
  const uniforms = useMemo(
    () => ({
      engravingMap: { value: engravingTexture },
      glowColor: { value: new Color(glowColor) },
      brightness: { value: brightness }
    }),
    [brightness, engravingTexture, glowColor]
  );

  return (
    <shaderMaterial
      key={`${glowColor}-${brightness}`}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent
      depthWrite={false}
      blending={AdditiveBlending}
    />
  );
}
