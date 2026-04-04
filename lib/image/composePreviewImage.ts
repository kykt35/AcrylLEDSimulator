import type { ImageLayout } from "@/lib/simulator/imageLayout";
import { clampImageLayout } from "@/lib/simulator/imageLayout";

const PREVIEW_WIDTH = 1580;
const PREVIEW_HEIGHT = 2380;
const ALPHA_THRESHOLD = 8;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("プレビュー画像の生成に失敗しました。"));
    image.src = src;
  });
}

function detectOpaqueBounds(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const { data } = context.getImageData(0, 0, width, height);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];

      if (alpha < ALPHA_THRESHOLD) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) {
    return {
      x: 0,
      y: 0,
      width,
      height
    };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

export async function composePreviewImageFromDataUrl(
  src: string,
  imageLayout: ImageLayout
): Promise<string> {
  const image = await loadImage(src);
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = image.width;
  sourceCanvas.height = image.height;
  const sourceContext = sourceCanvas.getContext("2d");

  if (!sourceContext) {
    throw new Error("元画像の解析に必要な canvas を初期化できません。");
  }

  sourceContext.clearRect(0, 0, image.width, image.height);
  sourceContext.drawImage(image, 0, 0, image.width, image.height);
  const opaqueBounds = detectOpaqueBounds(sourceContext, image.width, image.height);
  const canvas = document.createElement("canvas");
  canvas.width = PREVIEW_WIDTH;
  canvas.height = PREVIEW_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("プレビュー画像の生成に必要な canvas を初期化できません。");
  }

  const normalized = clampImageLayout(imageLayout);
  const imageAspect = opaqueBounds.width / opaqueBounds.height;
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
  context.drawImage(
    image,
    opaqueBounds.x,
    opaqueBounds.y,
    opaqueBounds.width,
    opaqueBounds.height,
    x,
    y,
    drawWidth,
    drawHeight
  );

  return canvas.toDataURL("image/png");
}
