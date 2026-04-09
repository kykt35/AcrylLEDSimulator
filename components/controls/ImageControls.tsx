"use client";

import React from "react";
import { ImageUploader } from "@/components/upload/ImageUploader";
import {
  acrylicSizePresets,
  type AcrylicSizePresetId
} from "@/lib/simulator/acrylicSizePresets";
import type { ImageLayout } from "@/lib/simulator/imageLayout";

type ImageControlsProps = {
  acrylicSizeId: AcrylicSizePresetId;
  fileName: string;
  statusLabel: string;
  errorMessage: string | null;
  previewSrc?: string | null;
  imageLayout: ImageLayout;
  onAcrylicSizeChange: (sizeId: AcrylicSizePresetId) => void;
  onFileSelected: (file: File) => void;
  onImageLayoutChange: (patch: Partial<ImageLayout>) => void;
  onResetImageLayout: () => void;
};

export function ImageControls({
  acrylicSizeId,
  fileName,
  statusLabel,
  errorMessage,
  previewSrc,
  imageLayout,
  onAcrylicSizeChange,
  onFileSelected,
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
        <h2 className="panel-title">PNG をアップロード</h2>
        <div className="helper-list">
          <p>透過 PNG を推奨します</p>
          <p>読み込み後に彫刻用グレースケール画像を自動生成します</p>
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
        <p className="status-title">画像ファイル</p>
        <ImageUploader
          onFileSelected={onFileSelected}
          fileName={fileName}
          statusMessage={statusLabel}
          previewSrc={errorMessage ? null : previewSrc}
          isLoading={statusLabel.includes("読み込み中")}
          errorMessage={errorMessage}
        />
        <div className="status-box">
          <p className="status-title">現在の入力</p>
          <p className="status-primary">{fileName}</p>
          <p className="status-secondary">{errorMessage ?? statusLabel}</p>
        </div>
      </div>
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
    </section>
  );
}
