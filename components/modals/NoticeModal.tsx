"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";

type NoticeModalProps = {
  triggerLabel: string;
  buttonClassName?: string;
};

type NoticeDialogProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function NoticeDialog({ open, onClose, returnFocusRef }: NoticeDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements?.[0];
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !focusableElements || focusableElements.length === 0) {
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusRef?.current?.focus();
    };
  }, [onClose, open, returnFocusRef]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="panel-label">Notice</p>
        <h2 id={titleId} className="panel-title">
          実物との差異について
        </h2>
        <div id={descriptionId} className="modal-copy">
          <p>表示上の色味や発光量は、実際の LED、印刷、アクリル素材、撮影環境によって差が出ます。</p>
          <p>この MVP は比較検討用のプレビューを優先しており、光学的に厳密な再現や量産時の個体差までは扱いません。</p>
          <p>ダウンロード前に複数の背景やカメラで確認し、最終判断は実機サンプルと併用してください。</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="primary-button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export function NoticeModal({
  triggerLabel,
  buttonClassName = "secondary-link"
}: NoticeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={buttonClassName}
        onClick={() => setIsOpen(true)}
      >
        {triggerLabel}
      </button>
      <NoticeDialog open={isOpen} onClose={closeDialog} returnFocusRef={triggerRef} />
    </>
  );
}
