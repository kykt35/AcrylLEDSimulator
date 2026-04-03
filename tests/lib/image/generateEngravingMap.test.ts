import {
  applyEngravingAdjustments,
  buildEdgeMap,
  buildLumaMap
} from "@/lib/image/engravingFilters";

describe("engravingFilters", () => {
  it("builds a luma map with alpha applied", () => {
    const pixels = new Uint8ClampedArray([
      255, 255, 255, 255,
      255, 0, 0, 128
    ]);

    const result = buildLumaMap(pixels);

    expect(result[0]).toBe(1);
    expect(result[1]).toBeCloseTo(0.15, 2);
  });

  it("applies contrast, gamma, threshold, and invert", () => {
    const input = new Float32Array([0.1, 0.4, 0.8]);

    const normal = applyEngravingAdjustments(input, {
      contrast: 1.5,
      gamma: 0.8,
      threshold: 0.2,
      invert: false,
      edgeWeight: 0
    });

    expect(normal[0]).toBe(0);
    expect(normal[1]).toBeGreaterThan(0.35);
    expect(normal[2]).toBeGreaterThan(normal[1]);

    const inverted = applyEngravingAdjustments(input, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: true,
      edgeWeight: 0
    });

    expect(inverted[0]).toBeCloseTo(0.9, 4);
    expect(inverted[2]).toBeCloseTo(0.2, 4);
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
      edgeWeight: 0
    });
    const withEdges = applyEngravingAdjustments(source, {
      contrast: 1,
      gamma: 1,
      threshold: 0,
      invert: false,
      edgeWeight: 0.5
    }, edgeMap);

    expect(edgeMap[1]).toBeGreaterThan(0);
    expect(withEdges[1]).toBeGreaterThan(withoutEdges[1]);
  });
});
