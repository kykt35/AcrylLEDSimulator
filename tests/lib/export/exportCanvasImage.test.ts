import { exportCanvasImage, getCanvasPreviewDataUrl } from "@/lib/export/exportCanvasImage";

describe("exportCanvasImage", () => {
  it("returns a png data url from the nested canvas by default", () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const toDataURL = vi.fn(() => "data:image/png;base64,preview");

    Object.defineProperty(canvas, "toDataURL", {
      configurable: true,
      value: toDataURL
    });

    root.appendChild(canvas);

    expect(getCanvasPreviewDataUrl(root)).toBe("data:image/png;base64,preview");
    expect(toDataURL).toHaveBeenCalledWith("image/png");
  });

  it("returns a jpeg data url when the format is specified", () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const toDataURL = vi.fn(() => "data:image/jpeg;base64,preview");

    Object.defineProperty(canvas, "toDataURL", {
      configurable: true,
      value: toDataURL
    });

    root.appendChild(canvas);

    expect(getCanvasPreviewDataUrl(root, "jpg")).toBe("data:image/jpeg;base64,preview");
    expect(toDataURL).toHaveBeenCalledWith("image/jpeg");
  });

  it("returns null when the canvas does not exist", () => {
    const root = document.createElement("div");

    expect(getCanvasPreviewDataUrl(root)).toBeNull();
  });

  it("returns a cropped png data url when a crop region is provided", () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    const croppedCanvas = document.createElement("canvas");
    const drawImage = vi.fn();
    const toDataURL = vi
      .fn()
      .mockReturnValueOnce("data:image/png;base64,full")
      .mockReturnValueOnce("data:image/png;base64,cropped");

    Object.defineProperty(canvas, "width", { configurable: true, value: 1000 });
    Object.defineProperty(canvas, "height", { configurable: true, value: 800 });
    Object.defineProperty(canvas, "toDataURL", { configurable: true, value: toDataURL });
    Object.defineProperty(canvas, "getContext", {
      configurable: true,
      value: () => ({ drawImage })
    });

    const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "canvas") {
        Object.defineProperty(croppedCanvas, "toDataURL", {
          configurable: true,
          value: () => "data:image/png;base64,cropped"
        });
        Object.defineProperty(croppedCanvas, "getContext", {
          configurable: true,
          value: () => ({ drawImage })
        });

        return croppedCanvas;
      }

      return document.createElementNS("http://www.w3.org/1999/xhtml", tagName) as HTMLCanvasElement;
    });

    root.appendChild(canvas);

    expect(
      getCanvasPreviewDataUrl(root, "png", {
        x: 0.1,
        y: 0.2,
        width: 0.5,
        height: 0.4
      })
    ).toBe("data:image/png;base64,cropped");

    expect(drawImage).toHaveBeenCalledWith(canvas, 100, 160, 500, 320, 0, 0, 500, 320);

    createElementSpy.mockRestore();
  });

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
