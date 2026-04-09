"use client";

import React from "react";

type SaveCompleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formatLabel: string;
};

export function SaveCompleteModal({ isOpen, onClose, formatLabel }: SaveCompleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      <div className="success-toast" role="status">
        <span className="success-toast-icon" aria-hidden="true">
          ✓
        </span>
        <div className="success-toast-copy">
          <p className="panel-label">Download Ready</p>
          <h2 id="save-complete-title" className="panel-title">
            ダウンロードを開始しました
          </h2>
          <p>現在の見え方を {formatLabel} ファイルとして出力しました。このまま続けて調整できます。</p>
        </div>
        <button type="button" className="ghost-link compact" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
