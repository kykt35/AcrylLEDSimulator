import {
  clearEditorSnapshot,
  readEditorSnapshot,
  writeEditorSnapshot
} from "@/lib/save/session";
import { defaultAcrylicSizePresetId } from "@/lib/simulator/acrylicSizePresets";

describe("save session helpers", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("persists and reads the editor snapshot", () => {
    writeEditorSnapshot({
      sourceImage: {
        fileName: "sample.png",
        src: "data:image/png;base64,source"
      },
      engraving: {
        src: "data:image/png;base64,engraving",
        adjustments: {
          contrast: 1.4,
          gamma: 0.9,
          threshold: 0.2,
          invert: false,
          edgeWeight: 0.25,
          edgeWidth: 2,
          toneMode: "grayscale",
          toneLevels: 32
        },
        averageStrength: 0.4
      },
      simulation: {
        ledColorId: "lime",
        brightness: 1.6,
        heightAttenuation: 0.45,
        backgroundId: "forest",
        cameraPresetId: "detail",
        acrylicSizeId: "medium",
        showSourceOverlay: true,
        imageLayout: {
          contentFit: "cover",
          scale: 1.15,
          offsetX: 24,
          offsetY: -12
        }
      }
    });

    expect(readEditorSnapshot()?.simulation.cameraPresetId).toBe("detail");
    expect(readEditorSnapshot()?.simulation.imageLayout.contentFit).toBe("cover");
    expect(readEditorSnapshot()?.simulation.acrylicSizeId).toBe("medium");
    expect(readEditorSnapshot()?.simulation.showSourceOverlay).toBe(true);
    expect(readEditorSnapshot()?.simulation.heightAttenuation).toBe(0.45);
    expect(readEditorSnapshot()?.engraving.adjustments.edgeWidth).toBe(2);
    expect(readEditorSnapshot()?.engraving.adjustments.toneMode).toBe("grayscale");
    expect(readEditorSnapshot()?.engraving.adjustments.toneLevels).toBe(8);

    clearEditorSnapshot();
    expect(readEditorSnapshot()).toBeNull();
  });

  it("preserves a false source overlay flag when reading the snapshot", () => {
    writeEditorSnapshot({
      sourceImage: {
        fileName: "sample.png",
        src: "data:image/png;base64,source"
      },
      engraving: {
        src: "data:image/png;base64,engraving",
        adjustments: {
          contrast: 1.1,
          gamma: 1,
          threshold: 0.2,
          invert: false,
          edgeWeight: 0.25,
          edgeWidth: 1,
          toneMode: "stepped",
          toneLevels: 8
        },
        averageStrength: 0.4
      },
      simulation: {
        ledColorId: "lime",
        brightness: 1.6,
        heightAttenuation: 0.25,
        backgroundId: "forest",
        cameraPresetId: "detail",
        acrylicSizeId: "medium",
        showSourceOverlay: false,
        imageLayout: {
          contentFit: "contain",
          scale: 1,
          offsetX: 0,
          offsetY: 0
        }
      }
    });

    expect(readEditorSnapshot()?.simulation.showSourceOverlay).toBe(false);
  });

  it("falls back to in-memory state when sessionStorage writes fail", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    writeEditorSnapshot({
      sourceImage: {
        fileName: "sample.png",
        src: "data:image/png;base64,source"
      },
      engraving: {
        src: "data:image/png;base64,engraving",
        adjustments: {
          contrast: 1.35,
          gamma: 0.9,
          threshold: 0.18,
          invert: false,
          edgeWeight: 0.2,
          edgeWidth: 1,
          toneMode: "stepped",
          toneLevels: 2
        },
        averageStrength: 0.3
      },
      simulation: {
        ledColorId: "ice-blue",
        brightness: 1.2,
        heightAttenuation: 0.35,
        backgroundId: "night",
        cameraPresetId: "front",
        acrylicSizeId: "small",
        showSourceOverlay: true,
        imageLayout: {
          contentFit: "contain",
          scale: 1,
          offsetX: 0,
          offsetY: 0
        }
      }
    });

    expect(readEditorSnapshot()?.sourceImage.fileName).toBe("sample.png");
    expect(readEditorSnapshot()?.simulation.acrylicSizeId).toBe("small");
    expect(readEditorSnapshot()?.simulation.heightAttenuation).toBe(0.35);

    setItemSpy.mockRestore();
  });

  it("falls back to the default acrylic size when reading legacy snapshots", () => {
    window.sessionStorage.setItem(
      "acryl-led-simulator:editor",
      JSON.stringify({
        sourceImage: {
          fileName: "legacy.png",
          src: "data:image/png;base64,legacy"
        },
        engraving: {
          src: "data:image/png;base64,legacy-engraving",
          adjustments: {
            contrast: 1.2,
            gamma: 1,
            threshold: 0.2,
            invert: false,
            edgeWeight: 0.25
          },
          averageStrength: 0.4
        },
        simulation: {
          ledColorId: "lime",
          brightness: 1.4,
          backgroundId: "night",
          cameraPresetId: "front",
          showSourceOverlay: false,
          imageLayout: {
            contentFit: "contain",
            scale: 1,
            offsetX: 0,
            offsetY: 0
          }
        }
      })
    );

    expect(readEditorSnapshot()?.simulation.acrylicSizeId).toBe(defaultAcrylicSizePresetId);
    expect(readEditorSnapshot()?.simulation.heightAttenuation).toBe(0.3);
    expect(readEditorSnapshot()?.engraving.adjustments.edgeWidth).toBe(1);
    expect(readEditorSnapshot()?.engraving.adjustments.toneMode).toBe("grayscale");
    expect(readEditorSnapshot()?.engraving.adjustments.toneLevels).toBe(2);
  });
});
