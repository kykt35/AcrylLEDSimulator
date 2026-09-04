import { invertGrayscalePixels } from "@/lib/image/engravingFilters";

type ExportEngravingImageOptions = {
  invert?: boolean;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("彫刻用画像の読み込みに失敗しました。"));
    image.src = src;
  });
}

function decodePngDataUrl(dataUrl: string): { mimeType: string; buffer: ArrayBuffer } {
  const match = dataUrl.match(/^data:(image\/png);base64,(.+)$/);

  if (!match) {
    throw new Error("彫刻用画像の形式が不正です。");
  }

  const [, mimeType, encoded] = match;
  const binary = atob(encoded);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return { mimeType, buffer };
}

async function invertPngDataUrl(dataUrl: string): Promise<Blob> {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("彫刻用画像の反転に必要な canvas を初期化できません。");
  }

  context.drawImage(image, 0, 0, image.width, image.height);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  invertGrayscalePixels(imageData.data);
  context.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("反転した彫刻用画像の生成に失敗しました。"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

export async function exportEngravingImage(
  dataUrl: string,
  fileName: string,
  options: ExportEngravingImageOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  if (options.invert) {
    return {
      blob: await invertPngDataUrl(dataUrl),
      fileName
    };
  }

  const { mimeType, buffer } = decodePngDataUrl(dataUrl);

  return {
    blob: new Blob([buffer], { type: mimeType }),
    fileName
  };
}
