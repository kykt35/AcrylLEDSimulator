import { exportCanvasImage } from "@/lib/export/exportCanvasImage";

describe("exportCanvasImage", () => {
  it("exports a png data url from the nested canvas", () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const toDataURL = vi.fn(() => "data:image/png;base64,exported");

    Object.defineProperty(canvas, "toDataURL", {
      configurable: true,
      value: toDataURL
    });

    root.appendChild(canvas);

    expect(exportCanvasImage(root)).toBe("data:image/png;base64,exported");
    expect(toDataURL).toHaveBeenCalledWith("image/png");
  });

  it("throws when the canvas does not exist", () => {
    const root = document.createElement("div");

    expect(() => exportCanvasImage(root)).toThrow("書き出し対象の canvas が見つかりません。");
  });
});
