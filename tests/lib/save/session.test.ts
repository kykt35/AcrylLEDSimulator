import {
  clearEditorSnapshot,
  clearLatestResult,
  readEditorSnapshot,
  readLatestResult,
  writeEditorSnapshot,
  writeLatestResult
} from "@/lib/save/session";

describe("save session helpers", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("persists and reads the latest result", () => {
    writeLatestResult({
      savedSimulationId: "sim_test",
      resultImageUrl: "data:image/png;base64,result",
      savedAt: "2026-04-03T10:00:00.000Z",
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

    expect(readLatestResult()?.savedSimulationId).toBe("sim_test");

    clearLatestResult();
    expect(readLatestResult()).toBeNull();
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
});
