"use client";

import React from "react";
import type { EngravingAdjustments } from "@/lib/image/engravingFilters";

type EngravingControlsProps = {
  adjustments: EngravingAdjustments;
  isEngravingMode: boolean;
  sourceImageUrl: string | null;
  engravingImageUrl: string | null;
  onEngravingModeChange: (enabled: boolean) => void;
  onAdjustmentsChange: (patch: Partial<EngravingAdjustments>) => void;
  onDownload: () => void | Promise<void>;
};

type NumericAdjustmentControl = {
  key: "contrast" | "gamma" | "threshold" | "edgeWeight" | "toneLevels";
  label: string;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
};

const numericControls: NumericAdjustmentControl[] = [
  { key: "contrast", label: "コントラスト", min: 0.5, max: 2.5, step: 0.05 },
  { key: "gamma", label: "中間調", min: 0.4, max: 1.8, step: 0.05 },
  { key: "threshold", label: "しきい値", min: 0, max: 1, step: 0.01 },
  { key: "edgeWeight", label: "輪郭強調", min: 0, max: 1, step: 0.05 },
  {
    key: "toneLevels",
    label: "階調数",
    min: 2,
    max: 256,
    step: 1,
    formatValue: (value) => `${Math.round(value)}`
  }
];

const guideToneOptions = [
  { id: "white", label: "白を導光", invert: false },
  { id: "black", label: "黒を導光", invert: true }
] as const;

export function EngravingControls({
  adjustments,
  isEngravingMode,
  sourceImageUrl,
  engravingImageUrl,
  onEngravingModeChange,
  onAdjustmentsChange,
  onDownload
}: EngravingControlsProps) {
  return (
    <section className="panel-section">
      <div className="panel-subsection">
        <label className="toggle-field">
          <input
            type="checkbox"
            className="sr-only"
            aria-label="彫刻モード"
            checked={isEngravingMode}
            onChange={(event) => onEngravingModeChange(event.target.checked)}
          />
          <span className={`toggle-switch${isEngravingMode ? " is-on" : ""}`} aria-hidden="true">
            <span className="toggle-knob" />
          </span>
          <span>彫刻モード</span>
        </label>
      </div>
      <div className="panel-subsection">
        <div className="control-grid">
          <div className="control-group full-width">
            <span className="control-label">導光に使う階調</span>
            <div className="choice-row" role="radiogroup" aria-label="導光に使う階調">
              {guideToneOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="chip-button"
                  role="radio"
                  aria-checked={adjustments.invert === option.invert}
                  onClick={() => onAdjustmentsChange({ invert: option.invert })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {numericControls.map((control) => (
            <label key={control.key} className="control-field range-field">
              <span className="control-label with-badge">
                <span>{control.label}</span>
                <span className="value-badge">
                  {control.formatValue
                    ? control.formatValue(adjustments[control.key])
                    : adjustments[control.key].toFixed(2)}
                </span>
              </span>
              <input
                aria-label={control.label}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={adjustments[control.key]}
                onChange={(event) =>
                  onAdjustmentsChange({ [control.key]: Number(event.target.value) })
                }
              />
              <input
                aria-label={`${control.label} 数値入力`}
                type="number"
                min={control.min}
                max={control.max}
                step={control.step}
                value={adjustments[control.key]}
                onChange={(event) =>
                  onAdjustmentsChange({ [control.key]: Number(event.target.value) })
                }
              />
            </label>
          ))}
        </div>
      </div>
      <div className="panel-subsection">
        <p className="status-title">比較プレビュー</p>
        <div className="preview-grid" data-testid="engraving-preview-grid">
          <figure className="preview-card">
            <figcaption className="status-title">元画像</figcaption>
            {sourceImageUrl ? (
              <div className="preview-image-frame">
                <img
                  src={sourceImageUrl}
                  alt="元画像プレビュー"
                  className="preview-image"
                />
              </div>
            ) : (
              <p className="status-secondary">未選択</p>
            )}
          </figure>
          <figure className="preview-card">
            <figcaption className="status-title">彫刻用画像</figcaption>
            {engravingImageUrl ? (
              <div className="preview-image-frame">
                <img
                  src={engravingImageUrl}
                  alt="彫刻用グレースケールプレビュー"
                  className="preview-image"
                />
              </div>
            ) : (
              <p className="status-secondary">未生成</p>
            )}
          </figure>
        </div>
      </div>
      <button
        type="button"
        className="secondary-button"
        disabled={!engravingImageUrl}
        onClick={onDownload}
      >
        彫刻用 PNG をダウンロード
      </button>
    </section>
  );
}
