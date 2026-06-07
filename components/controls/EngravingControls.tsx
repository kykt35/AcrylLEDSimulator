"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  engravingEdgeWidthRange,
  engravingToneLevelRange,
  normalizeEdgeWidth,
  normalizeToneMode,
  normalizeToneLevels,
  type EngravingAdjustments,
  type EngravingToneMode
} from "@/lib/image/engravingFilters";

export type EngravingDownloadOptions = {
  invert: boolean;
};

type EngravingControlsProps = {
  adjustments: EngravingAdjustments;
  isEngravingMode: boolean;
  sourceImageUrl: string | null;
  engravingImageUrl: string | null;
  onEngravingModeChange: (enabled: boolean) => void;
  onAdjustmentsChange: (patch: Partial<EngravingAdjustments>) => void;
  onDownload: (options: EngravingDownloadOptions) => void | Promise<void>;
};

type NumericAdjustmentControl = {
  key: "contrast" | "gamma" | "threshold" | "edgeWeight" | "edgeWidth" | "toneLevels";
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
  { key: "edgeWeight", label: "輪郭強調", min: 0, max: 2, step: 0.05 },
  {
    key: "edgeWidth",
    label: "線幅補正",
    min: engravingEdgeWidthRange.min,
    max: engravingEdgeWidthRange.max,
    step: 1,
    formatValue: (value) => `${Math.round(value)}`
  }
];

const toneLevelsControl: NumericAdjustmentControl = {
  key: "toneLevels",
  label: "階調数",
  min: engravingToneLevelRange.min,
  max: engravingToneLevelRange.max,
  step: 1,
  formatValue: (value) => `${Math.round(value)}`
};

const guideToneOptions = [
  { id: "white", label: "白を導光", invert: false },
  { id: "black", label: "黒を導光", invert: true }
] as const;

const toneModeOptions: ReadonlyArray<{ id: EngravingToneMode; label: string; toneMode: EngravingToneMode }> = [
  { id: "grayscale", label: "グレースケール", toneMode: "grayscale" },
  { id: "stepped", label: "階調", toneMode: "stepped" }
];

function parseNumericControlValue(control: NumericAdjustmentControl, rawValue: string): number {
  const value = Number(rawValue);

  if (control.key === "toneLevels") {
    return normalizeToneLevels(value);
  }

  if (control.key === "edgeWidth") {
    return normalizeEdgeWidth(value);
  }

  return value;
}

export function EngravingControls({
  adjustments,
  isEngravingMode,
  sourceImageUrl,
  engravingImageUrl,
  onEngravingModeChange,
  onAdjustmentsChange,
  onDownload
}: EngravingControlsProps) {
  const [invertDownload, setInvertDownload] = useState(false);
  const pendingScrollTopRef = useRef<number | null>(null);
  const activeToneMode = normalizeToneMode(adjustments.toneMode);

  const capturePanelScrollTop = () => {
    const scrollContainer = document.getElementById("control-panel-content");
    pendingScrollTopRef.current = scrollContainer?.scrollTop ?? 0;
  };

  const handleInvertDownloadChange = (checked: boolean) => {
    capturePanelScrollTop();
    setInvertDownload(checked);
  };

  const handleEngravingModeChange = (enabled: boolean) => {
    capturePanelScrollTop();
    onEngravingModeChange(enabled);
  };

  const handleToneModeChange = (toneMode: EngravingToneMode) => {
    capturePanelScrollTop();
    onAdjustmentsChange({ toneMode });
  };

  useLayoutEffect(() => {
    if (pendingScrollTopRef.current === null) {
      return;
    }

    const scrollContainer = document.getElementById("control-panel-content");
    const scrollTop = pendingScrollTopRef.current;
    pendingScrollTopRef.current = null;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTop = scrollTop;
    requestAnimationFrame(() => {
      scrollContainer.scrollTop = scrollTop;
    });
  }, [activeToneMode, invertDownload, isEngravingMode]);

  return (
    <section className="panel-section">
      <div className="panel-subsection">
        <label
          className="toggle-field"
          onMouseDown={(event) => event.preventDefault()}
        >
          <input
            type="checkbox"
            className="sr-only"
            aria-label="彫刻モード"
            checked={isEngravingMode}
            onChange={(event) => handleEngravingModeChange(event.target.checked)}
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
            <span className="control-label">導光対象</span>
            <div className="choice-row" role="radiogroup" aria-label="導光対象">
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
          <div className="control-group full-width">
            <span className="control-label">彫刻画像の表現</span>
            <div className="choice-row" role="radiogroup" aria-label="彫刻画像の表現">
              {toneModeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="chip-button"
                  role="radio"
                  aria-checked={activeToneMode === option.toneMode}
                  onClick={() => handleToneModeChange(option.toneMode)}
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
                  onAdjustmentsChange({
                    [control.key]: parseNumericControlValue(control, event.target.value)
                  })
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
                  onAdjustmentsChange({
                    [control.key]: parseNumericControlValue(control, event.target.value)
                  })
                }
              />
            </label>
          ))}
          {activeToneMode === "stepped" ? (
            <label key={toneLevelsControl.key} className="control-field range-field">
              <span className="control-label with-badge">
                <span>{toneLevelsControl.label}</span>
                <span className="value-badge">
                  {toneLevelsControl.formatValue
                    ? toneLevelsControl.formatValue(adjustments[toneLevelsControl.key])
                    : adjustments[toneLevelsControl.key].toFixed(2)}
                </span>
              </span>
              <input
                aria-label={toneLevelsControl.label}
                type="range"
                min={toneLevelsControl.min}
                max={toneLevelsControl.max}
                step={toneLevelsControl.step}
                value={adjustments[toneLevelsControl.key]}
                onChange={(event) =>
                  onAdjustmentsChange({
                    [toneLevelsControl.key]: parseNumericControlValue(toneLevelsControl, event.target.value)
                  })
                }
              />
              <input
                aria-label={`${toneLevelsControl.label} 数値入力`}
                type="number"
                min={toneLevelsControl.min}
                max={toneLevelsControl.max}
                step={toneLevelsControl.step}
                value={adjustments[toneLevelsControl.key]}
                onChange={(event) =>
                  onAdjustmentsChange({
                    [toneLevelsControl.key]: parseNumericControlValue(toneLevelsControl, event.target.value)
                  })
                }
              />
            </label>
          ) : null}
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
              <div className={`preview-image-frame${invertDownload ? " is-inverted" : ""}`}>
                <img
                  src={engravingImageUrl}
                  alt="彫刻用画像プレビュー"
                  className="preview-image"
                />
              </div>
            ) : (
              <p className="status-secondary">未生成</p>
            )}
          </figure>
        </div>
      </div>
      <div className="panel-subsection">
        <button
          type="button"
          role="switch"
          aria-checked={invertDownload}
          aria-label="白黒反転"
          className="toggle-field"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => handleInvertDownloadChange(!invertDownload)}
        >
          <span className={`toggle-switch${invertDownload ? " is-on" : ""}`} aria-hidden="true">
            <span className="toggle-knob" />
          </span>
          <span>白黒反転</span>
        </button>
      </div>
      <button
        type="button"
        className="secondary-button"
        disabled={!engravingImageUrl}
        onClick={() => onDownload({ invert: invertDownload })}
      >
        彫刻用 PNG をダウンロード
      </button>
    </section>
  );
}
