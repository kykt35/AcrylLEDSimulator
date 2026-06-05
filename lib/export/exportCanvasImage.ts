import {
  clampExportCropRegion,
  defaultExportCropRegion,
  isFullExportCropRegion,
  type ExportCropRegion
} from "@/lib/export/exportCropRegion";

export type ExportImageFormat = "png" | "jpg";

const mimeTypeMap: Record<ExportImageFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg"
};

function resolveCanvas(rootElement: HTMLElement | null): HTMLCanvasElement | null {
  if (!rootElement) {
    return null;
  }

  const canvas = rootElement.querySelector("canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    return null;
  }

  return canvas;
}

function cropCanvasSource(
  source: HTMLCanvasElement,
  cropRegion: ExportCropRegion = defaultExportCropRegion
): HTMLCanvasElement {
  const region = clampExportCropRegion(cropRegion);
  const sourceX = Math.round(region.x * source.width);
  const sourceY = Math.round(region.y * source.height);
  const sourceWidth = Math.max(1, Math.round(region.width * source.width));
  const sourceHeight = Math.max(1, Math.round(region.height * source.height));
  const cropped = document.createElement("canvas");

  cropped.width = sourceWidth;
  cropped.height = sourceHeight;

  const context = cropped.getContext("2d");

  if (!context) {
    throw new Error("書き出し用の canvas を初期化できません。");
  }

  context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

  return cropped;
}

export function getCanvasPreviewDataUrl(
  rootElement: HTMLElement | null,
  format: ExportImageFormat = "png",
  cropRegion: ExportCropRegion = defaultExportCropRegion
): string | null {
  const canvas = resolveCanvas(rootElement);

  if (!canvas) {
    return null;
  }

  try {
    const exportCanvas = isFullExportCropRegion(cropRegion)
      ? canvas
      : cropCanvasSource(canvas, cropRegion);

    return exportCanvas.toDataURL(mimeTypeMap[format]);
  } catch {
    return null;
  }
}

export async function exportCanvasImage(
  rootElement: HTMLElement | null,
  format: ExportImageFormat = "png",
  cropRegion: ExportCropRegion = defaultExportCropRegion
): Promise<Blob> {
  if (!rootElement) {
    throw new Error("プレビュー領域が見つかりません。");
  }

  const canvas = resolveCanvas(rootElement);

  if (!canvas) {
    throw new Error("書き出し対象の canvas が見つかりません。");
  }

  const exportCanvas = isFullExportCropRegion(cropRegion)
    ? canvas
    : cropCanvasSource(canvas, cropRegion);

  return new Promise<Blob>((resolve, reject) => {
    exportCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("画像の書き出しに失敗しました。"));
        return;
      }

      resolve(blob);
    }, mimeTypeMap[format]);
  });
}
