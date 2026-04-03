"use client";

import React from "react";
import { lightingPresets } from "@/lib/simulator/lightingPresets";

type LightingControlsProps = {
  activePresetId: string;
  brightness: number;
  activeCameraPreset: string;
  onPresetChange: (presetId: string) => void;
  onBrightnessChange: (value: number) => void;
  onCameraPresetChange: (presetId: string) => void;
};

const cameraOptions = [
  { id: "front", label: "正面" },
  { id: "tilt", label: "俯瞰" },
  { id: "detail", label: "接写" }
];

export function LightingControls({
  activePresetId,
  brightness,
  activeCameraPreset,
  onPresetChange,
  onBrightnessChange,
  onCameraPresetChange
}: LightingControlsProps) {
  return (
    <section style={{ display: "grid", gap: "16px" }}>
      <div>
        <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>発光設定</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {lightingPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetChange(preset.id)}
              aria-pressed={activePresetId === preset.id}
              style={{
                padding: "10px 12px",
                borderRadius: "999px",
                border: "1px solid var(--line)",
                background: activePresetId === preset.id ? preset.glowColor : "transparent",
                color: activePresetId === preset.id ? "#04101e" : "var(--text)"
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: "grid", gap: "8px" }}>
        <span>明るさ {brightness.toFixed(1)}</span>
        <input
          type="range"
          min="0.6"
          max="2.4"
          step="0.1"
          value={brightness}
          onChange={(event) => onBrightnessChange(Number(event.target.value))}
          aria-label="明るさ"
        />
      </label>

      <div>
        <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>カメラプリセット</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {cameraOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onCameraPresetChange(option.id)}
              aria-pressed={activeCameraPreset === option.id}
              style={{
                padding: "10px 12px",
                borderRadius: "999px",
                border: "1px solid var(--line)",
                background: activeCameraPreset === option.id ? "rgba(136, 240, 255, 0.18)" : "transparent",
                color: "var(--text)"
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
