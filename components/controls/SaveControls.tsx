"use client";

import React from "react";
import type { ExportImageFormat } from "@/lib/export/exportCanvasImage";

type SaveControlsProps = {
  saveStatus: "idle" | "saving" | "success" | "error";
  errorMessage: string | null;
  hasImage: boolean;
  savedAt?: string | null;
  exportFormat: ExportImageFormat;
  onFormatChange: (format: ExportImageFormat) => void;
  onSave: () => void | Promise<void>;
};

const saveStatusLabels = {
  idle: "現在の見え方をファイルとしてダウンロードします。",
  saving: "ダウンロードを準備中です。処理が終わるまでお待ちください。",
  success: "ダウンロードを開始しました。設定を保持したまま続けて調整できます。",
  error: "ダウンロードに失敗しました。設定を保持したまま再試行できます。"
} satisfies Record<SaveControlsProps["saveStatus"], string>;

export function SaveControls({
  saveStatus,
  errorMessage,
  hasImage,
  savedAt,
  exportFormat,
  onFormatChange,
  onSave
}: SaveControlsProps) {
  const helperMessage = !hasImage
    ? "先に PNG を読み込むとダウンロードボタンが有効になります。"
    : errorMessage ?? saveStatusLabels[saveStatus];

  return (
    <section className="panel-section">
      <div>
        <p className="panel-label">出力設定</p>
        <h2 className="panel-title">現在の表示をダウンロード</h2>
      </div>
      <div className="control-group" role="radiogroup" aria-label="出力形式">
        <label className="status-secondary">
          <input
            type="radio"
            name="export-format"
            value="png"
            checked={exportFormat === "png"}
            onChange={() => onFormatChange("png")}
          />
          PNG
        </label>
        <label className="status-secondary">
          <input
            type="radio"
            name="export-format"
            value="jpg"
            checked={exportFormat === "jpg"}
            onChange={() => onFormatChange("jpg")}
          />
          JPG
        </label>
      </div>
      <button
        type="button"
        className="primary-button"
        onClick={onSave}
        disabled={!hasImage || saveStatus === "saving"}
      >
        {saveStatus === "saving" ? "ダウンロード中..." : "画像をダウンロードする"}
      </button>
      <div className="status-box">
        <p className="status-secondary">{helperMessage}</p>
        {savedAt ? (
          <p className="status-secondary">最終ダウンロード: {new Date(savedAt).toLocaleString("ja-JP")}</p>
        ) : null}
        {exportFormat === "jpg" ? (
          <p className="status-secondary">JPG では透明部分が背景色で書き出されます。</p>
        ) : null}
      </div>
    </section>
  );
}
