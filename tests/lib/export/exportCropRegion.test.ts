import {
  clampExportCropRegion,
  defaultExportCropRegion,
  isFullExportCropRegion
} from "@/lib/export/exportCropRegion";

describe("exportCropRegion", () => {
  it("keeps the default region as full canvas", () => {
    expect(isFullExportCropRegion(defaultExportCropRegion)).toBe(true);
  });

  it("clamps oversized regions inside the canvas", () => {
    expect(
      clampExportCropRegion({
        x: 0.9,
        y: 0.9,
        width: 0.5,
        height: 0.5
      })
    ).toEqual({
      x: 0.5,
      y: 0.5,
      width: 0.5,
      height: 0.5
    });
  });

  it("enforces a minimum crop size", () => {
    expect(
      clampExportCropRegion({
        x: 0.2,
        y: 0.2,
        width: 0.01,
        height: 0.01
      })
    ).toEqual({
      x: 0.2,
      y: 0.2,
      width: 0.08,
      height: 0.08
    });
  });
});
