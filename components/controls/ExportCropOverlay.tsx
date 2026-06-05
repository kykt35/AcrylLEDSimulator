"use client";

import React from "react";
import {
  clampExportCropRegion,
  type ExportCropRegion
} from "@/lib/export/exportCropRegion";

type ExportCropOverlayProps = {
  cropRegion: ExportCropRegion;
  onCropRegionChange: (region: ExportCropRegion) => void;
};

type DragMode = "move" | "nw" | "ne" | "sw" | "se";

type DragState = {
  mode: DragMode;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startRegion: ExportCropRegion;
};

const handleLabels: Record<DragMode, string> = {
  move: "書き出し範囲を移動",
  nw: "左上を調整",
  ne: "右上を調整",
  sw: "左下を調整",
  se: "右下を調整"
};

function resizeRegion(
  mode: Exclude<DragMode, "move">,
  startRegion: ExportCropRegion,
  deltaX: number,
  deltaY: number
): ExportCropRegion {
  if (mode === "se") {
    return clampExportCropRegion({
      x: startRegion.x,
      y: startRegion.y,
      width: startRegion.width + deltaX,
      height: startRegion.height + deltaY
    });
  }

  if (mode === "sw") {
    return clampExportCropRegion({
      x: startRegion.x + deltaX,
      y: startRegion.y,
      width: startRegion.width - deltaX,
      height: startRegion.height + deltaY
    });
  }

  if (mode === "ne") {
    return clampExportCropRegion({
      x: startRegion.x,
      y: startRegion.y + deltaY,
      width: startRegion.width + deltaX,
      height: startRegion.height - deltaY
    });
  }

  return clampExportCropRegion({
    x: startRegion.x + deltaX,
    y: startRegion.y + deltaY,
    width: startRegion.width - deltaX,
    height: startRegion.height - deltaY
  });
}

export function ExportCropOverlay({
  cropRegion,
  onCropRegionChange
}: ExportCropOverlayProps) {
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const dragStateRef = React.useRef<DragState | null>(null);

  const beginDrag = React.useCallback(
    (event: React.PointerEvent<HTMLElement>, mode: DragMode) => {
      event.preventDefault();
      event.stopPropagation();
      if ("setPointerCapture" in event.currentTarget) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      dragStateRef.current = {
        mode,
        pointerId: event.pointerId,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startRegion: cropRegion
      };
    },
    [cropRegion]
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      const stage = stageRef.current;

      if (!dragState || dragState.pointerId !== event.pointerId || !stage) {
        return;
      }

      event.stopPropagation();

      const bounds = stage.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const deltaX = (event.clientX - dragState.startPointerX) / bounds.width;
      const deltaY = (event.clientY - dragState.startPointerY) / bounds.height;

      if (dragState.mode === "move") {
        onCropRegionChange(
          clampExportCropRegion({
            x: dragState.startRegion.x + deltaX,
            y: dragState.startRegion.y + deltaY,
            width: dragState.startRegion.width,
            height: dragState.startRegion.height
          })
        );
        return;
      }

      onCropRegionChange(resizeRegion(dragState.mode, dragState.startRegion, deltaX, deltaY));
    },
    [onCropRegionChange]
  );

  const endDrag = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
    }
  }, []);

  const stopOverlayClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  const stopOverlayWheel = React.useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const leftPercent = cropRegion.x * 100;
  const topPercent = cropRegion.y * 100;
  const widthPercent = cropRegion.width * 100;
  const heightPercent = cropRegion.height * 100;
  const rightPercent = leftPercent + widthPercent;
  const bottomPercent = topPercent + heightPercent;

  return (
    <div
      ref={stageRef}
      className="export-crop-overlay"
      data-testid="export-crop-overlay"
      role="group"
      aria-label="書き出し範囲"
      onClick={stopOverlayClick}
      onWheel={stopOverlayWheel}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="export-crop-overlay__shade export-crop-overlay__shade-top" style={{ height: `${topPercent}%` }} />
      <div
        className="export-crop-overlay__shade export-crop-overlay__shade-bottom"
        style={{ top: `${bottomPercent}%` }}
      />
      <div
        className="export-crop-overlay__shade export-crop-overlay__shade-left"
        style={{ top: `${topPercent}%`, height: `${heightPercent}%`, width: `${leftPercent}%` }}
      />
      <div
        className="export-crop-overlay__shade export-crop-overlay__shade-right"
        style={{ top: `${topPercent}%`, height: `${heightPercent}%`, left: `${rightPercent}%` }}
      />
      <div
        className="export-crop-overlay__box"
        style={{
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          width: `${widthPercent}%`,
          height: `${heightPercent}%`
        }}
        onPointerDown={(event) => beginDrag(event, "move")}
      >
        {(["nw", "ne", "sw", "se"] as const).map((handle) => (
          <button
            key={handle}
            type="button"
            className={`export-crop-overlay__handle export-crop-overlay__handle-${handle}`}
            aria-label={handleLabels[handle]}
            onPointerDown={(event) => beginDrag(event, handle)}
          />
        ))}
      </div>
    </div>
  );
}
