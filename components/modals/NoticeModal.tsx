"use client";

import React, { useState } from "react";

type NoticeModalProps = {
  triggerLabel: string;
  buttonClassName?: string;
};

export function NoticeModal({ triggerLabel, buttonClassName = "secondary-link" }: NoticeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className={buttonClassName} onClick={() => setIsOpen(true)}>
        {triggerLabel}
      </button>
      {isOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="panel-label">Notice</p>
            <h2 id="notice-modal-title" className="panel-title">
              実物との差異について
            </h2>
            <div className="modal-copy">
              <p>表示上の色味や発光量は、実際の LED、印刷、アクリル素材、撮影環境によって差が出ます。</p>
              <p>この MVP は比較検討用のプレビューを優先しており、光学的に厳密な再現や量産時の個体差までは扱いません。</p>
              <p>ダウンロード前に複数の背景やカメラで確認し、最終判断は実機サンプルと併用してください。</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="primary-button" onClick={() => setIsOpen(false)}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
