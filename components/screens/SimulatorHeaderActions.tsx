"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { NoticeDialog } from "@/components/modals/NoticeModal";

export function SimulatorHeaderActions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const desktopNoticeRef = useRef<HTMLButtonElement>(null);
  const lastNoticeTriggerRef = useRef<HTMLElement | null>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const closeNotice = useCallback(() => {
    setIsNoticeOpen(false);
  }, []);

  const openMobileNotice = useCallback(() => {
    lastNoticeTriggerRef.current = toggleRef.current;
    closeMenu();
    setIsNoticeOpen(true);
  }, [closeMenu]);

  const openDesktopNotice = useCallback(() => {
    lastNoticeTriggerRef.current = desktopNoticeRef.current;
    setIsNoticeOpen(true);
  }, []);

  const resolveNoticeReturnFocus = useCallback(() => {
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(max-width: 960px)").matches
        ? toggleRef.current
        : desktopNoticeRef.current;
    }

    return lastNoticeTriggerRef.current;
  }, []);

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
        <button
          ref={desktopNoticeRef}
          type="button"
          className="ghost-link"
          onClick={openDesktopNotice}
        >
          注意事項
        </button>
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
      </div>
      <NoticeDialog
        open={isNoticeOpen}
        onClose={closeNotice}
        resolveReturnFocus={resolveNoticeReturnFocus}
      />
    </nav>
  );
}
