"use client";

import React from "react";
import {
  acrylicSizePresets,
  type AcrylicSizePresetId
} from "@/lib/simulator/acrylicSizePresets";
import type { ImageLayout } from "@/lib/simulator/imageLayout";

type ImageControlsProps = {
  acrylicSizeId: AcrylicSizePresetId;
  fileName: string;
  hasImage: boolean;
  statusLabel: string;
  errorMessage: string | null;
  imageLayout: ImageLayout;
  onAcrylicSizeChange: (sizeId: AcrylicSizePresetId) => void;
  onImageLayoutChange: (patch: Partial<ImageLayout>) => void;
  onResetImageLayout: () => void;
};

export function ImageControls({
  acrylicSizeId,
  fileName,
  hasImage,
  statusLabel,
  errorMessage,
  imageLayout,
  onAcrylicSizeChange,
  onImageLayoutChange,
  onResetImageLayout
}: ImageControlsProps) {
  const sliderControls = [
    {
      id: "scale",
      label: "サイズ",
      ariaLabel: "画像サイズ",
      valueLabel: `${Math.round(imageLayout.scale * 100)}%`,
      min: "40",
      max: "160",
      step: "5",
      value: Math.round(imageLayout.scale * 100),
      onChange: (nextValue: number) =>
        onImageLayoutChange({
          scale: nextValue / 100
        })
    },
    {
      id: "offsetX",
      label: "横位置",
      ariaLabel: "画像の横位置",
      valueLabel: `${imageLayout.offsetX}`,
      min: "-100",
      max: "100",
      step: "1",
      value: imageLayout.offsetX,
      onChange: (nextValue: number) =>
        onImageLayoutChange({
          offsetX: nextValue
        })
    },
    {
      id: "offsetY",
      label: "縦位置",
      ariaLabel: "画像の縦位置",
      valueLabel: `${imageLayout.offsetY}`,
      min: "-100",
      max: "100",
      step: "1",
      value: imageLayout.offsetY,
      onChange: (nextValue: number) =>
        onImageLayoutChange({
          offsetY: nextValue
        })
    }
  ] as const;

  return (
    <section className="panel-section">
      <div className="panel-header">
        <p className="panel-label">画像設定</p>
        <h2 className="panel-title">画像の配置を調整</h2>
        <div className="helper-list">
          <p>透過 PNG を推奨します</p>
          <p>読み込み後に彫刻用グレースケール画像を自動生成します</p>
          <p>画像の追加と差し替えは 3D ビュー上のドラッグまたはクリックで行います</p>
        </div>
      </div>
      <div className="panel-subsection">
        <div className="control-group">
          <span className="control-label">アクリル板サイズ</span>
          <div className="choice-row" role="radiogroup" aria-label="アクリル板サイズ">
            {acrylicSizePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="chip-button detailed"
                role="radio"
                aria-checked={acrylicSizeId === preset.id}
                onClick={() => onAcrylicSizeChange(preset.id)}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="status-box">
          <p className="status-title">現在の入力</p>
          <p className="status-primary">{fileName}</p>
          <p className="status-secondary">{errorMessage ?? statusLabel}</p>
        </div>
        <div className="status-box">
          <p className="status-title">画像の追加方法</p>
          <p className="status-secondary">3D ビューに画像をドラッグするか、クリックして PNG を選択してください。</p>
        </div>
      </div>
      {hasImage ? (
        <div className="panel-subsection">
          <div>
            <p className="status-title">プレビュー画像の調整</p>
            <p className="status-secondary">配置、サイズ、表示方法をここで切り替えられます。</p>
          </div>
          <div className="control-group">
            <span className="control-label">コンテントフィット</span>
            <div className="choice-row">
              {[
                { id: "contain", label: "Contain" },
                { id: "cover", label: "Cover" },
                { id: "fill", label: "Fill" }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="chip-button"
                  onClick={() =>
                    onImageLayoutChange({
                      contentFit: option.id as ImageLayout["contentFit"]
                    })
                  }
                  aria-pressed={imageLayout.contentFit === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="control-grid">
            {sliderControls.map((control) => (
              <label key={control.id} className="control-field range-field">
                <span className="control-label with-badge">
                  <span>{control.label}</span>
                  <span className="value-badge">{control.valueLabel}</span>
                </span>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  aria-label={control.ariaLabel}
                  value={control.value}
                  onChange={(event) => control.onChange(Number(event.target.value))}
                />
              </label>
            ))}
          </div>
          <button type="button" className="secondary-button" onClick={onResetImageLayout}>
            画像調整をリセット
          </button>
        </div>
      ) : (
        <div className="panel-subsection">
          <div className="status-box">
            <p className="status-title">プレビュー画像の調整</p>
            <p className="status-secondary">PNGを追加すると配置調整ができます。</p>
          </div>
        </div>
      )}
    </section>
  );
}
