"use client";

import React from "react";
import { lightingPresets } from "@/lib/simulator/lightingPresets";

type LightingControlsProps = {
  activePresetId: string;
  brightness: number;
  heightAttenuation: number;
  onPresetChange: (presetId: string) => void;
  onBrightnessChange: (value: number) => void;
  onHeightAttenuationChange: (value: number) => void;
};

export function LightingControls({
  activePresetId,
  brightness,
  heightAttenuation,
  onPresetChange,
  onBrightnessChange,
  onHeightAttenuationChange
}: LightingControlsProps) {
  return (
    <section className="panel-section">
      <div className="panel-header">
        <p className="panel-label">発光設定</p>
        <h2 className="panel-title">LED カラーと明るさ</h2>
        <div className="helper-list">
          <p>発光色は彫刻面の見え方に直接影響します。</p>
          <p>明るさは書き出し結果にも反映されます。</p>
        </div>
      </div>

      <div className="panel-subsection">
        <div className="status-box">
          <p className="status-title">現在の発光設定</p>
          <p className="status-primary">
            {lightingPresets.find((preset) => preset.id === activePresetId)?.label ?? lightingPresets[0].label}
          </p>
          <p className="status-secondary">
            明るさ {brightness.toFixed(1)} / 高さ減衰 {heightAttenuation.toFixed(2)}
          </p>
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
      </div>

      <div className="panel-subsection">
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
        <label className="control-group">
          <span className="control-label">高さ方向の減衰 {heightAttenuation.toFixed(2)}</span>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={heightAttenuation}
            onChange={(event) => onHeightAttenuationChange(Number(event.target.value))}
            aria-label="高さ方向の減衰"
          />
        </label>
      </div>
    </section>
  );
}
