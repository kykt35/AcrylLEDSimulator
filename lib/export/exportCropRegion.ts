export type ExportCropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const defaultExportCropRegion: ExportCropRegion = {
  x: 0,
  y: 0,
  width: 1,
  height: 1
};

const MIN_CROP_SIZE = 0.08;

export function clampExportCropRegion(
  region: ExportCropRegion,
  minSize: number = MIN_CROP_SIZE
): ExportCropRegion {
  const width = Math.max(minSize, Math.min(1, region.width));
  const height = Math.max(minSize, Math.min(1, region.height));
  const x = Math.max(0, Math.min(1 - width, region.x));
  const y = Math.max(0, Math.min(1 - height, region.y));

  return { x, y, width, height };
}

export function isFullExportCropRegion(region: ExportCropRegion): boolean {
  return (
    region.x <= 0.001 &&
    region.y <= 0.001 &&
    region.width >= 0.999 &&
    region.height >= 0.999
  );
}
