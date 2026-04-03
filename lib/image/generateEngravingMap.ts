import {
  applyEngravingAdjustments,
  buildEdgeMap,
  buildLumaMap,
  createPreviewPixels,
  defaultEngravingAdjustments,
  type EngravingAdjustments
} from "@/lib/image/engravingFilters";

export type EngravingMapResult = {
  src: string;
  width: number;
  height: number;
  averageStrength: number;
};

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("画像の読み込みに失敗しました。"));
    image.src = src;
  });
}

export function generateEngravingMapFromImageData(
  imageData: ImageData,
  adjustments: EngravingAdjustments = defaultEngravingAdjustments
): {
  imageData: ImageData;
  averageStrength: number;
} {
  const baseLuma = buildLumaMap(imageData.data);
  const edgeMap = adjustments.edgeWeight > 0
    ? buildEdgeMap(baseLuma, imageData.width, imageData.height)
    : undefined;
  const strengthMap = applyEngravingAdjustments(baseLuma, adjustments, edgeMap);
  const pixels = createPreviewPixels(strengthMap);
  const averageStrength =
    strengthMap.reduce((sum, value) => sum + value, 0) / Math.max(strengthMap.length, 1);

  return {
    imageData: new ImageData(pixels, imageData.width, imageData.height),
    averageStrength
  };
}

export async function generateEngravingMapFromDataUrl(
  src: string,
  adjustments: EngravingAdjustments = defaultEngravingAdjustments
): Promise<EngravingMapResult> {
  const image = await loadImage(src);
  const readCanvas = createCanvas(image.width, image.height);
  const readContext = readCanvas.getContext("2d");

  if (!readContext) {
    throw new Error("画像処理用の canvas を初期化できません。");
  }

  readContext.drawImage(image, 0, 0, image.width, image.height);
  const sourceImageData = readContext.getImageData(0, 0, image.width, image.height);
  const engravingResult = generateEngravingMapFromImageData(sourceImageData, adjustments);
  const previewCanvas = createCanvas(image.width, image.height);
  const previewContext = previewCanvas.getContext("2d");

  if (!previewContext) {
    throw new Error("彫刻用 preview の canvas を初期化できません。");
  }

  previewContext.putImageData(engravingResult.imageData, 0, 0);

  return {
    src: previewCanvas.toDataURL("image/png"),
    width: image.width,
    height: image.height,
    averageStrength: engravingResult.averageStrength
  };
}
