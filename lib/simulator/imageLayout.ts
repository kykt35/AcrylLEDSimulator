import type { CSSProperties } from "react";

export type ImageContentFit = "contain" | "cover" | "fill";

export type ImageLayout = {
  contentFit: ImageContentFit;
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const defaultImageLayout: ImageLayout = {
  contentFit: "contain",
  scale: 1,
  offsetX: 0,
  offsetY: 0
};

export function clampImageLayout(layout: ImageLayout): ImageLayout {
  return {
    contentFit: layout.contentFit,
    scale: Math.min(1.6, Math.max(0.4, layout.scale)),
    offsetX: Math.min(100, Math.max(-100, layout.offsetX)),
    offsetY: Math.min(100, Math.max(-100, layout.offsetY))
  };
}

export function buildPreviewImageStyle(layout: ImageLayout): CSSProperties {
  const normalized = clampImageLayout(layout);

  return {
    objectFit: normalized.contentFit,
    objectPosition: `${50 + normalized.offsetX / 2}% ${50 + normalized.offsetY / 2}%`,
    transform: `scale(${normalized.scale})`,
    transformOrigin: "center"
  };
}
