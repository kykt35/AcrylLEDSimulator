import {
  clearEditorSnapshot,
  readEditorSnapshot,
  writeEditorSnapshot
} from "@/lib/save/session";

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
          edgeWeight: 0.25
        },
        averageStrength: 0.4
      },
      simulation: {
        ledColorId: "lime",
        brightness: 1.6,
        backgroundId: "forest",
        cameraPresetId: "detail",
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

    clearEditorSnapshot();
    expect(readEditorSnapshot()).toBeNull();
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
          edgeWeight: 0.2
        },
        averageStrength: 0.3
      },
      simulation: {
        ledColorId: "ice-blue",
        brightness: 1.2,
        backgroundId: "night",
        cameraPresetId: "front",
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

    setItemSpy.mockRestore();
  });
});
