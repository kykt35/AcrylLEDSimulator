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
      simulation: {
        ledColorId: "lime",
        brightness: 1.6,
        backgroundId: "forest",
        cameraPresetId: "detail"
      }
    });

    expect(readEditorSnapshot()?.simulation.cameraPresetId).toBe("detail");

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
      simulation: {
        ledColorId: "ice-blue",
        brightness: 1.2,
        backgroundId: "night",
        cameraPresetId: "front"
      }
    });

    expect(readEditorSnapshot()?.sourceImage.fileName).toBe("sample.png");

    setItemSpy.mockRestore();
  });
});
