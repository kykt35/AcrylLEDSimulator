"use client";

import React from "react";
import type { EngravingAdjustments } from "@/lib/image/engravingFilters";

type EngravingControlsProps = {
  adjustments: EngravingAdjustments;
  sourceImageUrl: string | null;
  engravingImageUrl: string | null;
  averageStrength?: number | null;
  onAdjustmentsChange: (patch: Partial<EngravingAdjustments>) => void;
  onDownload: () => void | Promise<void>;
};

type NumericAdjustmentControl = {
  key: "contrast" | "gamma" | "threshold" | "edgeWeight";
  label: string;
  min: number;
  max: number;
  step: number;
};

const numericControls: NumericAdjustmentControl[] = [
  { key: "contrast", label: "コントラスト", min: 0.5, max: 2.5, step: 0.05 },
  { key: "gamma", label: "中間調", min: 0.4, max: 1.8, step: 0.05 },
  { key: "threshold", label: "しきい値", min: 0, max: 1, step: 0.01 },
  { key: "edgeWeight", label: "輪郭強調", min: 0, max: 1, step: 0.05 }
];

export function EngravingControls({
  adjustments,
  sourceImageUrl,
  engravingImageUrl,
  averageStrength,
  onAdjustmentsChange,
  onDownload
}: EngravingControlsProps) {
  return (
    <section className="panel-section">
      <div>
        <p className="panel-label">彫刻データ</p>
        <h2 className="panel-title">グレースケールを調整する</h2>
      </div>
      <div className="helper-list">
        <p>白いほど強く彫刻され、LED 導光時に光りやすくなります。</p>
        <p>黒は未彫刻として扱います。</p>
      </div>
      <div className="control-grid">
        {numericControls.map((control) => (
          <label key={control.key} className="control-field">
            <span className="status-title">{control.label}</span>
            <input
              aria-label={control.label}
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
        <label className="checkbox-field">
          <input
            aria-label="白黒を反転"
            type="checkbox"
            checked={adjustments.invert}
            onChange={(event) => onAdjustmentsChange({ invert: event.target.checked })}
          />
          白黒を反転
        </label>
      </div>
      <div className="preview-grid" data-testid="engraving-preview-grid">
        <figure className="preview-card">
          <figcaption className="status-title">元画像</figcaption>
          {sourceImageUrl ? <img src={sourceImageUrl} alt="元画像プレビュー" className="preview-image" /> : <p className="status-secondary">未選択</p>}
        </figure>
        <figure className="preview-card">
          <figcaption className="status-title">彫刻用グレースケール</figcaption>
          {engravingImageUrl ? (
            <img
              src={engravingImageUrl}
              alt="彫刻用グレースケールプレビュー"
              className="preview-image"
            />
          ) : (
            <p className="status-secondary">未生成</p>
          )}
        </figure>
      </div>
      <div className="status-box">
        <p className="status-secondary">
          {averageStrength != null
            ? `平均彫刻強度: ${(averageStrength * 100).toFixed(1)}%`
            : "PNG を読み込むと彫刻用プレビューを生成します。"}
        </p>
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
