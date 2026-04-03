import { loadPngTexture, validatePngFile } from "@/lib/image/loadPngTexture";

describe("loadPngTexture", () => {
  it("rejects non-png files", async () => {
    const file = new File(["hello"], "sample.jpg", { type: "image/jpeg" });

    await expect(loadPngTexture(file)).rejects.toThrow("PNGファイルを選択してください。");
  });

  it("reads a png file as data url", async () => {
    const file = new File(["png"], "sample.png", { type: "image/png" });
    const readAsDataUrl = vi.fn(function readAsDataURL(this: FileReader) {
      Object.defineProperty(this, "result", {
        configurable: true,
        value: "data:image/png;base64,abc123"
      });
      this.onload?.(new ProgressEvent("load") as ProgressEvent<FileReader>);
    });

    vi.stubGlobal(
      "FileReader",
      class MockFileReader {
        result: string | ArrayBuffer | null = null;
        onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
        onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
        readAsDataURL = readAsDataUrl;
      } as unknown as typeof FileReader
    );

    await expect(loadPngTexture(file)).resolves.toEqual({
      src: "data:image/png;base64,abc123",
      name: "sample.png"
    });

    expect(validatePngFile(file)).toBeNull();
    vi.unstubAllGlobals();
  });
});
