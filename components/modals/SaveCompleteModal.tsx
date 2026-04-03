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
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-complete-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="panel-label">Download Ready</p>
        <h2 id="save-complete-title" className="panel-title">
          ダウンロードを開始しました
        </h2>
        <div className="modal-copy">
          <p>現在の見え方を {formatLabel} ファイルとして出力しました。続けて調整する場合はこのまま編集を続けてください。</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="primary-button" onClick={onClose}>
            編集を続ける
          </button>
        </div>
      </div>
    </div>
  );
}
