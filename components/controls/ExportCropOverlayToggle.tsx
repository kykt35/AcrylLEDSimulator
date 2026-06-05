"use client";

import React from "react";

type ExportCropOverlayToggleProps = {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
};

export function ExportCropOverlayToggle({
  visible,
  onVisibleChange
}: ExportCropOverlayToggleProps) {
  return (
    <div
      className="export-crop-overlay-toggle"
      data-testid="export-crop-overlay-toggle-host"
      onClick={(event) => event.stopPropagation()}
    >
      <label className="export-crop-overlay-toggle__control">
        <input
          aria-label="書出範囲を表示"
          type="checkbox"
          className="sr-only"
          checked={visible}
          onChange={(event) => onVisibleChange(event.target.checked)}
          data-testid="export-crop-overlay-toggle"
        />
        <span className={`toggle-switch${visible ? " is-on" : ""}`} aria-hidden="true">
          <span className="toggle-knob" />
        </span>
        <span className="export-crop-overlay-toggle__label">書出範囲</span>
      </label>
    </div>
  );
}
