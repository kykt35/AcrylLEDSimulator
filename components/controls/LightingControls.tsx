"use client";

import React from "react";
import { lightingPresets } from "@/lib/simulator/lightingPresets";

type LightingControlsProps = {
  activePresetId: string;
  brightness: number;
  onPresetChange: (presetId: string) => void;
  onBrightnessChange: (value: number) => void;
};

export function LightingControls({
  activePresetId,
  brightness,
  onPresetChange,
  onBrightnessChange
}: LightingControlsProps) {
  return (
    <section className="panel-section">
      <div>
        <p className="panel-label">発光設定</p>
        <h2 className="panel-title">LED カラーと明るさ</h2>
      </div>

      <div className="control-group">
        <span className="control-label">LED 色プリセット</span>
        <div className="choice-row">
          {lightingPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetChange(preset.id)}
              aria-pressed={activePresetId === preset.id}
              className="chip-button"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <label className="control-group">
        <span className="control-label">明るさ {brightness.toFixed(1)}</span>
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
    </section>
  );
}
