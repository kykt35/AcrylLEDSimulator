import { exportCanvasImage } from "@/lib/export/exportCanvasImage";

describe("exportCanvasImage", () => {
  it("exports a png blob from the nested canvas by default", async () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const exportedBlob = new Blob(["png"], { type: "image/png" });
    const toBlob = vi.fn((callback: BlobCallback, type?: string) => {
      callback(exportedBlob);
      return undefined;
    });

    Object.defineProperty(canvas, "toBlob", {
      configurable: true,
      value: toBlob
    });

    root.appendChild(canvas);

    await expect(exportCanvasImage(root)).resolves.toBe(exportedBlob);
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), "image/png");
  });

  it("exports a jpeg blob when the format is specified", async () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const exportedBlob = new Blob(["jpeg"], { type: "image/jpeg" });
    const toBlob = vi.fn((callback: BlobCallback, type?: string) => {
      callback(exportedBlob);
      return undefined;
    });

    Object.defineProperty(canvas, "toBlob", {
      configurable: true,
      value: toBlob
    });

    root.appendChild(canvas);

    await expect(exportCanvasImage(root, "jpg")).resolves.toBe(exportedBlob);
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), "image/jpeg");
  });

  it("throws when the canvas does not exist", async () => {
    const root = document.createElement("div");

    await expect(exportCanvasImage(root)).rejects.toThrow("書き出し対象の canvas が見つかりません。");
  });

  it("throws when blob export fails", async () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const toBlob = vi.fn((callback: BlobCallback) => {
      callback(null);
      return undefined;
    });

    Object.defineProperty(canvas, "toBlob", {
      configurable: true,
      value: toBlob
    });

    root.appendChild(canvas);

    await expect(exportCanvasImage(root)).rejects.toThrow("画像の書き出しに失敗しました。");
  });
});
