"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

type ImageUploaderProps = {
  onFileSelected: (file: File) => void | Promise<void>;
  fileName?: string;
  statusMessage?: string;
  previewSrc?: string | null;
  isLoading?: boolean;
  errorMessage?: string | null;
};

const maxFileSizeInBytes = 8 * 1024 * 1024;

export function ImageUploader({
  onFileSelected,
  fileName = "未選択",
  statusMessage = "PNG をアップロードすると 3D プレビューへ反映されます。",
  previewSrc = null,
  isLoading = false,
  errorMessage = null
}: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState(statusMessage);
  const [isDragging, setIsDragging] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!validationMessage) {
      setStatus(statusMessage);
    }
  }, [statusMessage, validationMessage]);

  const helperText = useMemo(() => {
    if (validationMessage) {
      return validationMessage;
    }

    if (errorMessage) {
      return errorMessage;
    }

    if (isLoading) {
      return "画像を読み込み中です。プレビューを準備しています。";
    }

    return status;
  }, [errorMessage, isLoading, status, validationMessage]);

  function validateFile(file: File) {
    if (file.type !== "image/png") {
      return "PNG ファイルを選択してください。";
    }

    if (file.size > maxFileSizeInBytes) {
      return "8MB 以下の PNG を選択してください。";
    }

    return null;
  }

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    const nextValidationMessage = validateFile(file);

    if (nextValidationMessage) {
      setValidationMessage(nextValidationMessage);
      setStatus(nextValidationMessage);
      return;
    }

    setValidationMessage(null);
    setStatus(`${file.name} を選択しました。`);
    await onFileSelected(file);
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    await handleFile(event.target.files?.[0]);
  }

  async function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    await handleFile(event.dataTransfer.files?.[0]);
  }

  function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  }

  return (
    <section className="uploader-section">
      <label
        htmlFor={inputId}
        className={`upload-dropzone${isDragging ? " is-dragging" : ""}${isLoading ? " is-loading" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="upload-dropzone-icon" aria-hidden="true">
          {isLoading ? "..." : "PNG"}
        </span>
        <span className="upload-dropzone-copy">
          <span className="upload-dropzone-title">ここにドロップ または クリックして選択</span>
          <span className="upload-dropzone-subtitle">透過 PNG 推奨 / 最大 8MB</span>
        </span>
        <span className="upload-dropzone-meta">
          <span className="upload-meta-label">現在の入力</span>
          <strong>{fileName}</strong>
        </span>
        <input
          ref={inputRef}
          id={inputId}
          className="sr-only"
          type="file"
          accept="image/png"
          onChange={handleChange}
          aria-label="PNG アップロード"
          aria-describedby={`${inputId}-status ${inputId}-constraints`}
        />
      </label>

      <div className="upload-dropzone-footer">
        <p id={`${inputId}-status`} className={`upload-status${validationMessage || errorMessage ? " is-error" : ""}`}>
          {helperText}
        </p>
        <p id={`${inputId}-constraints`} className="upload-constraints">
          対応形式: PNG / 推奨は透過画像 / 大きすぎる画像は読み込みに時間がかかります
        </p>
      </div>

      {previewSrc ? (
        <div className="upload-thumbnail-card">
          <div className="upload-thumbnail-header">
            <p className="status-title">アップロードプレビュー</p>
            <button type="button" className="ghost-link compact" onClick={() => inputRef.current?.click()}>
              別の画像を選ぶ
            </button>
          </div>
          <div className="upload-thumbnail-frame">
            <img src={previewSrc} alt="アップロード画像プレビュー" className="preview-image" />
          </div>
        </div>
      ) : (
        <div className="upload-placeholder-card" aria-hidden="true">
          <span className="upload-placeholder-grid" />
          <p>アップロード後にここへサムネイルを表示します。</p>
        </div>
      )}
    </section>
  );
}
