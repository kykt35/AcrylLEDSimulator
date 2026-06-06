import {
  applyEngravingAdjustments,
  buildEdgeMap,
  buildLumaMap,
  defaultEngravingAdjustments,
  engravingEdgeWidthRange,
  engravingToneLevelRange,
  invertGrayscalePixels
} from "@/lib/image/engravingFilters";

describe("engravingFilters", () => {
  it("sets the default and maximum adjustment ranges", () => {
    expect(defaultEngravingAdjustments.edgeWidth).toBe(1);
    expect(engravingEdgeWidthRange.max).toBe(5);
    expect(defaultEngravingAdjustments.toneLevels).toBe(2);
    expect(engravingToneLevelRange.max).toBe(8);
  });

  it("inverts grayscale pixel values while preserving alpha", () => {
    const pixels = new Uint8ClampedArray([
      255, 255, 255, 255,
      40, 40, 40, 128
    ]);

    invertGrayscalePixels(pixels);

    expect(Array.from(pixels)).toEqual([
      0, 0, 0, 255,
      215, 215, 215, 128
    ]);
  });

  it("builds a luma map with alpha applied", () => {
    const pixels = new Uint8ClampedArray([
      255, 255, 255, 255,
      255, 0, 0, 128
    ]);

    const result = buildLumaMap(pixels);

    expect(result[0]).toBe(1);
    expect(result[1]).toBeCloseTo(0.15, 2);
  });

  it("applies contrast, gamma, threshold, and guide tone inversion", () => {
    const input = new Float32Array([0.1, 0.4, 0.8]);

    const normal = applyEngravingAdjustments(input, {
      contrast: 1.5,
      gamma: 0.8,
      threshold: 0.2,
      invert: false,
      edgeWeight: 0,
      edgeWidth: 1,
      toneLevels: 8
    });

    expect(normal[0]).toBe(0);
    expect(normal[1]).toBeGreaterThan(0.35);
    expect(normal[2]).toBeGreaterThan(normal[1]);

    const inverted = applyEngravingAdjustments(input, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: true,
      edgeWeight: 0,
      edgeWidth: 1,
      toneLevels: 8
    });

    expect(inverted[0]).toBeCloseTo(6 / 7, 4);
    expect(inverted[2]).toBeCloseTo(1 / 7, 4);
  });

  it("applies threshold after black guide tone inversion", () => {
    const input = new Float32Array([0.1, 0.8]);

    const result = applyEngravingAdjustments(input, {
      contrast: 1,
      gamma: 1,
      threshold: 0.5,
      invert: true,
      edgeWeight: 0,
      edgeWidth: 1,
      toneLevels: 8
    });

    expect(result[0]).toBeCloseTo(6 / 7, 4);
    expect(result[1]).toBe(0);
  });

  it("quantizes engraving strength to the selected tone levels", () => {
    const input = new Float32Array([0, 0.2, 0.49, 0.51, 0.8, 1]);

    const result = applyEngravingAdjustments(input, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: false,
      edgeWeight: 0,
      edgeWidth: 1,
      toneLevels: 4
    });

    expect(result[0]).toBe(0);
    expect(result[1]).toBeCloseTo(1 / 3, 4);
    expect(result[2]).toBeCloseTo(1 / 3, 4);
    expect(result[3]).toBeCloseTo(2 / 3, 4);
    expect(result[4]).toBeCloseTo(2 / 3, 4);
    expect(result[5]).toBe(1);
  });

  it("clamps tone levels to the supported range", () => {
    const input = new Float32Array([0.2, 0.8]);

    const result = applyEngravingAdjustments(input, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: false,
      edgeWeight: 0,
      edgeWidth: 1,
      toneLevels: 256
    });

    expect(result[0]).toBeCloseTo(1 / 7, 4);
    expect(result[1]).toBeCloseTo(6 / 7, 4);
  });

  it("adds edge emphasis when edgeWeight is enabled", () => {
    const width = 3;
    const height = 3;
    const source = new Float32Array([
      0, 0, 0,
      0, 1, 1,
      0, 1, 1
    ]);

    const edgeMap = buildEdgeMap(source, width, height);
    const withoutEdges = applyEngravingAdjustments(source, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: false,
      edgeWeight: 0,
      edgeWidth: 1,
      toneLevels: 8
    });
    const withEdges = applyEngravingAdjustments(source, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: false,
      edgeWeight: 0.5,
      edgeWidth: 1,
      toneLevels: 8
    }, edgeMap);

    expect(edgeMap[1]).toBeGreaterThan(0);
    expect(withEdges[1]).toBeGreaterThan(withoutEdges[1]);
  });

  it("widens the edge map when edgeWidth is increased", () => {
    const width = 5;
    const height = 5;
    const source = new Float32Array([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);

    const narrowEdgeMap = buildEdgeMap(source, width, height, 1);
    const wideEdgeMap = buildEdgeMap(source, width, height, 3);

    expect(narrowEdgeMap[0]).toBe(0);
    expect(wideEdgeMap[0]).toBeGreaterThan(0);
  });
});
