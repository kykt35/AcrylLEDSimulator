"use client";

import React from "react";
import { backgroundPresets, cameraOptions } from "@/lib/simulator/displayPresets";

type DisplayControlsProps = {
  activeBackgroundId: string;
  activeCameraPreset: string;
  onBackgroundChange: (backgroundId: string) => void;
  onCameraPresetChange: (presetId: string) => void;
  onResetView: () => void;
};

export function DisplayControls({
  activeBackgroundId,
  activeCameraPreset,
  onBackgroundChange,
  onCameraPresetChange,
  onResetView
}: DisplayControlsProps) {
  return (
    <section className="panel-section">
      <div>
        <p className="panel-label">表示設定</p>
        <h2 className="panel-title">背景とカメラ</h2>
      </div>

      <div className="control-group">
        <span className="control-label">背景プリセット</span>
        <div className="choice-row">
          {backgroundPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="chip-button"
              onClick={() => onBackgroundChange(preset.id)}
              aria-pressed={activeBackgroundId === preset.id}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">カメラプリセット</span>
        <div className="choice-row">
          {cameraOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className="chip-button"
              onClick={() => onCameraPresetChange(option.id)}
              aria-pressed={activeCameraPreset === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="secondary-button" onClick={onResetView}>
        表示設定をリセット
      </button>
    </section>
  );
}
