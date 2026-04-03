"use client";

import React, { useId, useState } from "react";
import { loadPngTexture } from "@/lib/image/loadPngTexture";

type ImageUploaderProps = {
  onImageSelected: (payload: { src: string; name: string }) => void;
};

export function ImageUploader({ onImageSelected }: ImageUploaderProps) {
  const inputId = useId();
  const [status, setStatus] = useState("PNG をアップロードすると 3D プレビューへ反映されます。");
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const payload = await loadPngTexture(file);
      setError(null);
      setStatus(`${payload.name} を読み込みました。`);
      onImageSelected(payload);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "PNG の読み込みに失敗しました。";
      setError(message);
      setStatus("別の PNG ファイルで再試行してください。");
    }
  }

  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <div>
        <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>画像設定</p>
        <label htmlFor={inputId} style={{ display: "grid", gap: "8px" }}>
          <span>PNG アップロード</span>
          <input
            id={inputId}
            type="file"
            accept="image/png"
            onChange={handleChange}
            aria-describedby={`${inputId}-status`}
          />
        </label>
      </div>
      <p id={`${inputId}-status`} style={{ margin: 0, color: error ? "#ffb4b4" : "var(--muted)" }}>
        {error ?? status}
      </p>
    </section>
  );
}
