"use client";

import React, { useId, useState } from "react";

type ImageUploaderProps = {
  onFileSelected: (file: File) => void;
};

export function ImageUploader({ onFileSelected }: ImageUploaderProps) {
  const inputId = useId();
  const [status, setStatus] = useState("PNG をアップロードすると 3D プレビューへ反映されます。");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }
    setStatus(`${file.name} を選択しました。`);
    onFileSelected(file);
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
      <p id={`${inputId}-status`} style={{ margin: 0, color: "var(--muted)" }}>
        {status}
      </p>
    </section>
  );
}
