"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { NoticeDialog, NoticeModal } from "@/components/modals/NoticeModal";

export function SimulatorHeaderActions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileNoticeOpen, setIsMobileNoticeOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const closeMobileNotice = useCallback(() => {
    setIsMobileNoticeOpen(false);
  }, []);

  const openMobileNotice = useCallback(() => {
    closeMenu();
    setIsMobileNoticeOpen(true);
  }, [closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target)) {
        return;
      }

      closeMenu();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <nav className="header-actions" aria-label="サイトメニュー">
      <div className="header-actions-desktop">
        <Link href="/usage" className="secondary-link">
          使い方
        </Link>
        <Link href="/about" className="secondary-link">
          このアプリについて
        </Link>
        <NoticeModal triggerLabel="注意事項" buttonClassName="ghost-link" />
      </div>
      <div className="header-actions-mobile" ref={menuRef}>
        <button
          ref={toggleRef}
          type="button"
          className="header-menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          data-testid="header-menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="header-menu-toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        {isMenuOpen ? (
          <div id={menuId} className="header-menu-panel" role="menu" data-testid="header-menu-panel">
            <Link
              href="/usage"
              className="secondary-link header-menu-link"
              role="menuitem"
              onClick={closeMenu}
            >
              使い方
            </Link>
            <Link
              href="/about"
              className="secondary-link header-menu-link"
              role="menuitem"
              onClick={closeMenu}
            >
              このアプリについて
            </Link>
            <button
              type="button"
              className="ghost-link header-menu-link"
              role="menuitem"
              onClick={openMobileNotice}
            >
              注意事項
            </button>
          </div>
        ) : null}
        <NoticeDialog
          open={isMobileNoticeOpen}
          onClose={closeMobileNotice}
          returnFocusRef={toggleRef}
        />
      </div>
    </nav>
  );
}
