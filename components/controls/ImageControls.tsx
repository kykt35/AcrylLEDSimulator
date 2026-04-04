"use client";

import React from "react";
import { ImageUploader } from "@/components/upload/ImageUploader";
import type { ImageLayout } from "@/lib/simulator/imageLayout";

type ImageControlsProps = {
  fileName: string;
  statusLabel: string;
  errorMessage: string | null;
  imageLayout: ImageLayout;
  onFileSelected: (file: File) => void;
  onImageLayoutChange: (patch: Partial<ImageLayout>) => void;
  onResetImageLayout: () => void;
};

export function ImageControls({
  fileName,
  statusLabel,
  errorMessage,
  imageLayout,
  onFileSelected,
  onImageLayoutChange,
  onResetImageLayout
}: ImageControlsProps) {
  return (
    <section className="panel-section">
      <div>
        <p className="panel-label">画像設定</p>
        <h2 className="panel-title">PNG をアップロード</h2>
      </div>
      <div className="helper-list">
        <p>透過 PNG を推奨します</p>
        <p>読み込み後に彫刻用グレースケール画像を自動生成します</p>
      </div>
      <ImageUploader onFileSelected={onFileSelected} />
      <div className="status-box">
        <p className="status-title">現在の入力</p>
        <p className="status-primary">{fileName}</p>
        <p className="status-secondary">{errorMessage ?? statusLabel}</p>
      </div>
      <div className="control-group">
        <div>
          <p className="status-title">プレビュー画像の調整</p>
          <p className="status-secondary">配置、サイズ、表示方法をここで切り替えられます。</p>
        </div>
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
        <label className="control-field">
          <span className="control-label">サイズ {Math.round(imageLayout.scale * 100)}%</span>
          <input
            type="range"
            min="40"
            max="160"
            step="5"
            aria-label="画像サイズ"
            value={Math.round(imageLayout.scale * 100)}
            onChange={(event) =>
              onImageLayoutChange({
                scale: Number(event.target.value) / 100
              })
            }
          />
        </label>
        <label className="control-field">
          <span className="control-label">横位置 {imageLayout.offsetX}</span>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            aria-label="画像の横位置"
            value={imageLayout.offsetX}
            onChange={(event) =>
              onImageLayoutChange({
                offsetX: Number(event.target.value)
              })
            }
          />
        </label>
        <label className="control-field">
          <span className="control-label">縦位置 {imageLayout.offsetY}</span>
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            aria-label="画像の縦位置"
            value={imageLayout.offsetY}
            onChange={(event) =>
              onImageLayoutChange({
                offsetY: Number(event.target.value)
              })
            }
          />
        </label>
      </div>
      <button type="button" className="secondary-button" onClick={onResetImageLayout}>
        画像調整をリセット
      </button>
    </section>
  );
}
