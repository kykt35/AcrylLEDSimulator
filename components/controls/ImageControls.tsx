"use client";

import React from "react";
import { ImageUploader } from "@/components/upload/ImageUploader";

type ImageControlsProps = {
  fileName: string;
  statusLabel: string;
  errorMessage: string | null;
  onFileSelected: (file: File) => void;
};

export function ImageControls({
  fileName,
  statusLabel,
  errorMessage,
  onFileSelected
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
    </section>
  );
}
