"use client";

import React from "react";

type SaveControlsProps = {
  saveStatus: "idle" | "saving" | "success" | "error";
  errorMessage: string | null;
  hasImage: boolean;
  savedAt?: string | null;
  onSave: () => void | Promise<void>;
};

const saveStatusLabels = {
  idle: "現在の見え方を PNG として保存します。",
  saving: "保存中です。処理が終わるまでお待ちください。",
  success: "保存に成功しました。結果画面で出力画像を確認できます。",
  error: "保存に失敗しました。設定を保持したまま再試行できます。"
} satisfies Record<SaveControlsProps["saveStatus"], string>;

export function SaveControls({
  saveStatus,
  errorMessage,
  hasImage,
  savedAt,
  onSave
}: SaveControlsProps) {
  const helperMessage = !hasImage
    ? "先に PNG を読み込むと保存ボタンが有効になります。"
    : errorMessage ?? saveStatusLabels[saveStatus];

  return (
    <section className="panel-section">
      <div>
        <p className="panel-label">出力設定</p>
        <h2 className="panel-title">現在の表示を保存</h2>
      </div>
      <button
        type="button"
        className="primary-button"
        onClick={onSave}
        disabled={!hasImage || saveStatus === "saving"}
      >
        {saveStatus === "saving" ? "保存中..." : "画像を保存する"}
      </button>
      <div className="status-box">
        <p className="status-secondary">{helperMessage}</p>
        {savedAt ? <p className="status-secondary">最終保存: {new Date(savedAt).toLocaleString("ja-JP")}</p> : null}
      </div>
    </section>
  );
}
