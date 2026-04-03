"use client";

import React from "react";

type SaveCompleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onViewResult: () => void;
};

export function SaveCompleteModal({ isOpen, onClose, onViewResult }: SaveCompleteModalProps) {
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
        <p className="panel-label">Save Complete</p>
        <h2 id="save-complete-title" className="panel-title">
          保存が完了しました
        </h2>
        <div className="modal-copy">
          <p>現在の見え方を保存しました。結果画面で画像確認とダウンロードができます。</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="primary-button" onClick={onViewResult}>
            結果を見る
          </button>
          <button type="button" className="secondary-button" onClick={onClose}>
            編集を続ける
          </button>
        </div>
      </div>
    </div>
  );
}
