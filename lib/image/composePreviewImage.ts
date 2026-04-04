import type { ImageLayout } from "@/lib/simulator/imageLayout";
import { clampImageLayout } from "@/lib/simulator/imageLayout";

const PREVIEW_WIDTH = 1580;
const PREVIEW_HEIGHT = 2380;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("プレビュー画像の生成に失敗しました。"));
    image.src = src;
  });
}

export async function composePreviewImageFromDataUrl(
  src: string,
  imageLayout: ImageLayout
): Promise<string> {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = PREVIEW_WIDTH;
  canvas.height = PREVIEW_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("プレビュー画像の生成に必要な canvas を初期化できません。");
  }

  const normalized = clampImageLayout(imageLayout);
  const imageAspect = image.width / image.height;
  const frameAspect = PREVIEW_WIDTH / PREVIEW_HEIGHT;
  let drawWidth = PREVIEW_WIDTH;
  let drawHeight = PREVIEW_HEIGHT;

  if (normalized.contentFit === "contain") {
    if (imageAspect > frameAspect) {
      drawHeight = PREVIEW_WIDTH / imageAspect;
    } else {
      drawWidth = PREVIEW_HEIGHT * imageAspect;
    }
  } else if (normalized.contentFit === "cover") {
    if (imageAspect > frameAspect) {
      drawWidth = PREVIEW_HEIGHT * imageAspect;
    } else {
      drawHeight = PREVIEW_WIDTH / imageAspect;
    }
  }

  drawWidth *= normalized.scale;
  drawHeight *= normalized.scale;

  const maxOffsetX = Math.abs(drawWidth - PREVIEW_WIDTH) / 2;
  const maxOffsetY = Math.abs(drawHeight - PREVIEW_HEIGHT) / 2;
  const x = (PREVIEW_WIDTH - drawWidth) / 2 + (normalized.offsetX / 100) * maxOffsetX;
  const y = (PREVIEW_HEIGHT - drawHeight) / 2 + (normalized.offsetY / 100) * maxOffsetY;

  context.clearRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
  context.drawImage(image, x, y, drawWidth, drawHeight);

  return canvas.toDataURL("image/png");
}
