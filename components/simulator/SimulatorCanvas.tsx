"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";

export function SimulatorCanvas() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "420px",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(169, 216, 255, 0.2)",
        background:
          "radial-gradient(circle at top, rgba(136, 240, 255, 0.18), rgba(7, 17, 31, 0.9) 48%, rgba(3, 7, 13, 0.98) 100%)"
      }}
    >
      <Canvas camera={{ position: [0, 0.8, 4.6], fov: 36 }}>
        <color attach="background" args={["#07111f"]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 4, 3]} intensity={1.8} />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 2.4, 0.08]} />
          <meshStandardMaterial color="#8fe9ff" metalness={0.08} roughness={0.12} />
        </mesh>
        <mesh position={[0, -1.45, 0]}>
          <cylinderGeometry args={[0.9, 1.1, 0.26, 32]} />
          <meshStandardMaterial color="#1a2d44" metalness={0.3} roughness={0.5} />
        </mesh>
      </Canvas>
    </div>
  );
}
