"use client";

import React from "react";
import { backgroundPresets, cameraOptions } from "@/lib/simulator/displayPresets";

type DisplayControlsProps = {
  activeBackgroundId: string;
  activeCameraPreset: string;
  showSourceOverlay: boolean;
  onBackgroundChange: (backgroundId: string) => void;
  onCameraPresetChange: (presetId: string) => void;
  onSourceOverlayChange: (show: boolean) => void;
  onResetView: () => void;
};

export function DisplayControls({
  activeBackgroundId,
  activeCameraPreset,
  showSourceOverlay,
  onBackgroundChange,
  onCameraPresetChange,
  onSourceOverlayChange,
  onResetView
}: DisplayControlsProps) {
  return (
    <section className="panel-section">
      <div className="panel-header">
        <p className="panel-label">表示設定</p>
        <h2 className="panel-title">背景とカメラ</h2>
        <div className="helper-list">
          <p>閲覧環境に近い背景で見え方を確認できます。</p>
          <p>カメラ位置を切り替えて仕上がりを比較します。</p>
        </div>
      </div>

      <div className="panel-subsection">
        <div className="status-box">
          <p className="status-title">現在の表示設定</p>
          <p className="status-primary">
            {backgroundPresets.find((preset) => preset.id === activeBackgroundId)?.label ?? backgroundPresets[0].label}
          </p>
          <p className="status-secondary">
            {cameraOptions.find((option) => option.id === activeCameraPreset)?.label ?? cameraOptions[0].label}
            {showSourceOverlay ? " / 元画像表示オン" : " / 元画像表示オフ"}
          </p>
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
      </div>

      <div className="panel-subsection">
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

        <label className="checkbox-field">
          <input
            type="checkbox"
            aria-label="元画像を重ねて表示"
            checked={showSourceOverlay}
            onChange={(event) => onSourceOverlayChange(event.target.checked)}
          />
          元画像を重ねて表示
        </label>

        <button type="button" className="secondary-button" onClick={onResetView}>
          表示設定をリセット
        </button>
      </div>
    </section>
  );
}
