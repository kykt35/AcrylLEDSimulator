"use client";

import React from "react";
import type { ExportImageFormat } from "@/lib/export/exportCanvasImage";

type SaveControlsProps = {
  saveStatus: "idle" | "saving" | "success" | "error";
  hasImage: boolean;
  croppedPreviewUrl: string | null;
  exportFormat: ExportImageFormat;
  onFormatChange: (format: ExportImageFormat) => void;
  onSave: () => void | Promise<void>;
};

export function SaveControls({
  saveStatus,
  hasImage,
  croppedPreviewUrl,
  exportFormat,
  onFormatChange,
  onSave
}: SaveControlsProps) {
  return (
    <section className="panel-section">
      {croppedPreviewUrl ? (
        <div className="panel-subsection">
          <figure className="preview-card export-result-preview-card" data-testid="export-result-preview-card">
            <figcaption className="status-title">書き出しプレビュー</figcaption>
            <div className="preview-image-frame export-result-preview-frame">
              <img
                src={croppedPreviewUrl}
                alt="書き出しプレビュー"
                className="preview-image"
                data-testid="export-preview-image"
              />
            </div>
          </figure>
        </div>
      ) : null}
      <div className="panel-subsection">
        <div className="control-group" role="radiogroup" aria-label="出力形式">
          <div className="segmented-control">
            {(["png", "jpg"] as const).map((format) => (
              <button
                key={format}
                type="button"
                role="radio"
                aria-checked={exportFormat === format}
                className={`segment-button${exportFormat === format ? " is-active" : ""}`}
                onClick={() => onFormatChange(format)}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="primary-button"
        onClick={onSave}
        disabled={!hasImage || saveStatus === "saving"}
      >
        {saveStatus === "saving" ? "ダウンロード中..." : "画像をダウンロードする"}
      </button>
    </section>
  );
}
