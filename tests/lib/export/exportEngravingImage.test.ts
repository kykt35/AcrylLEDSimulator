import { exportEngravingImage } from "@/lib/export/exportEngravingImage";

function readBlobBytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) {
        reject(new Error("BlobをArrayBufferとして読み込めませんでした。"));
        return;
      }

      resolve(new Uint8Array(reader.result));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

describe("exportEngravingImage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("converts a png data url into a downloadable blob payload", async () => {
    const result = await exportEngravingImage(
      "data:image/png;base64,Zm9v",
      "sample-engraving.png"
    );

    expect(result.fileName).toBe("sample-engraving.png");
    expect(result.blob.type).toBe("image/png");
    expect(result.blob.size).toBe(3);
    await expect(readBlobBytes(result.blob)).resolves.toEqual(
      new Uint8Array([102, 111, 111])
    );
  });

  it("accepts an invert option without changing the non-invert fast path", async () => {
    const blob = await exportEngravingImage("data:image/png;base64,Zm9v", "sample-engraving.png", {
      invert: false
    });

    expect(blob.fileName).toBe("sample-engraving.png");
    expect(blob.blob.type).toBe("image/png");
    expect(blob.blob.size).toBe(3);
  });

  it("exports an inverted png through canvas without changing the file name", async () => {
    const image = document.createElement("img");
    const canvas = document.createElement("canvas");
    const pixels = new Uint8ClampedArray([10, 20, 30, 128]);
    const exportedBlob = new Blob(["inverted"], { type: "image/png" });
    const drawImage = vi.fn();
    const getImageData = vi.fn(() => ({ data: pixels }));
    const putImageData = vi.fn();
    const toBlob = vi.fn((callback: BlobCallback) => callback(exportedBlob));

    Object.defineProperties(image, {
      width: { configurable: true, value: 1 },
      height: { configurable: true, value: 1 },
      src: {
        configurable: true,
        set: () => image.onload?.(new Event("load"))
      }
    });
    Object.defineProperties(canvas, {
      getContext: {
        configurable: true,
        value: () => ({ drawImage, getImageData, putImageData })
      },
      toBlob: { configurable: true, value: toBlob }
    });

    vi.stubGlobal("Image", vi.fn(() => image));
    vi.spyOn(document, "createElement").mockReturnValue(canvas);

    const result = await exportEngravingImage(
      "data:image/png;base64,Zm9v",
      "sample-engraving.png",
      { invert: true }
    );

    expect(result).toEqual({
      blob: exportedBlob,
      fileName: "sample-engraving.png"
    });
    expect(drawImage).toHaveBeenCalledWith(image, 0, 0, 1, 1);
    expect(getImageData).toHaveBeenCalledWith(0, 0, 1, 1);
    expect(Array.from(pixels)).toEqual([245, 235, 225, 128]);
    expect(putImageData).toHaveBeenCalledWith(
      expect.objectContaining({ data: pixels }),
      0,
      0
    );
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), "image/png");
  });

  it("rejects unsupported data urls", async () => {
    await expect(exportEngravingImage("data:text/plain;base64,Zm9v", "sample.txt")).rejects.toThrow(
      "彫刻用画像の形式が不正です。"
    );
  });
});
