"use client";

import React, { useState } from "react";
import { exportCanvasImage } from "@/lib/export/exportCanvasImage";

type ExportPreviewButtonProps = {
  previewRoot: HTMLElement | null;
  onExported: (dataUrl: string) => void;
};

export function ExportPreviewButton({ previewRoot, onExported }: ExportPreviewButtonProps) {
  const [status, setStatus] = useState("未出力");

  function handleExport() {
    try {
      const dataUrl = exportCanvasImage(previewRoot);
      onExported(dataUrl);
      setStatus("PNGを書き出しました。");
    } catch (caughtError) {
      setStatus(caughtError instanceof Error ? caughtError.message : "画像書き出しに失敗しました。");
    }
  }

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      <button
        type="button"
        onClick={handleExport}
        style={{
          padding: "12px 14px",
          borderRadius: "14px",
          border: "1px solid var(--line)",
          background: "rgba(136, 240, 255, 0.16)",
          color: "var(--text)"
        }}
      >
        画像を書き出す
      </button>
      <p style={{ margin: 0, color: "var(--muted)" }}>{status}</p>
    </div>
  );
}
