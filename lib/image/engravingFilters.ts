export type EngravingAdjustments = {
  contrast: number;
  gamma: number;
  threshold: number;
  invert: boolean;
  edgeWeight: number;
  toneLevels: number;
};

export const defaultEngravingAdjustments: EngravingAdjustments = {
  contrast: 1.35,
  gamma: 0.9,
  threshold: 0.18,
  invert: false,
  edgeWeight: 0.2,
  toneLevels: 256
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function quantizeStrength(value: number, toneLevels: number): number {
  const safeToneLevels = Math.round(clamp(toneLevels, 2, 256));
  const steps = safeToneLevels - 1;

  return Math.round(clamp(value) * steps) / steps;
}

export function buildLumaMap(pixels: Uint8ClampedArray): Float32Array {
  const result = new Float32Array(pixels.length / 4);

  for (let index = 0; index < pixels.length; index += 4) {
    const r = pixels[index] / 255;
    const g = pixels[index + 1] / 255;
    const b = pixels[index + 2] / 255;
    const alpha = pixels[index + 3] / 255;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    result[index / 4] = luma * alpha;
  }

  return result;
}

export function buildEdgeMap(source: Float32Array, width: number, height: number): Float32Array {
  const result = new Float32Array(source.length);
  const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let gx = 0;
      let gy = 0;
      let kernelIndex = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, width - 1);
          const sampleY = clamp(y + offsetY, 0, height - 1);
          const sample = source[sampleY * width + sampleX];

          gx += sample * kernelX[kernelIndex];
          gy += sample * kernelY[kernelIndex];
          kernelIndex += 1;
        }
      }

      result[y * width + x] = clamp(Math.sqrt(gx * gx + gy * gy));
    }
  }

  return result;
}

export function applyEngravingAdjustments(
  source: Float32Array,
  adjustments: EngravingAdjustments,
  edgeMap?: Float32Array
): Float32Array {
  const result = new Float32Array(source.length);

  for (let index = 0; index < source.length; index += 1) {
    const guideSource = adjustments.invert ? 1 - source[index] : source[index];
    const contrasted = clamp((guideSource - 0.5) * adjustments.contrast + 0.5);
    const gammaCorrected = Math.pow(contrasted, adjustments.gamma);
    const thresholded = gammaCorrected < adjustments.threshold ? 0 : gammaCorrected;
    const edge = edgeMap ? edgeMap[index] * adjustments.edgeWeight : 0;
    const combined = clamp(thresholded + edge);

    result[index] = quantizeStrength(combined, adjustments.toneLevels);
  }

  return result;
}

export function createPreviewPixels(strengthMap: Float32Array): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(strengthMap.length * 4);

  for (let index = 0; index < strengthMap.length; index += 1) {
    const value = Math.round(clamp(strengthMap[index]) * 255);
    const pixelIndex = index * 4;

    pixels[pixelIndex] = value;
    pixels[pixelIndex + 1] = value;
    pixels[pixelIndex + 2] = value;
    pixels[pixelIndex + 3] = 255;
  }

  return pixels;
}
