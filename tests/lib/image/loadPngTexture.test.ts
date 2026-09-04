import {
  loadPngTexture,
  maxPngFileSizeInBytes,
  readFileAsDataUrl,
  validatePngFile
} from "@/lib/image/loadPngTexture";

vi.mock("@/lib/image/generateEngravingMap", () => ({
  generateEngravingMapFromDataUrl: vi.fn().mockResolvedValue({
    src: "data:image/png;base64,engraving123",
    width: 320,
    height: 240,
    averageStrength: 0.42
  })
}));

import { generateEngravingMapFromDataUrl } from "@/lib/image/generateEngravingMap";

describe("loadPngTexture", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("rejects non-png files", async () => {
    const file = new File(["hello"], "sample.jpg", { type: "image/jpeg" });

    await expect(loadPngTexture(file)).rejects.toThrow("PNGファイルを選択してください。");
  });

  it("reads a png file as data url", async () => {
    const file = new File(["png"], "sample.png", { type: "image/png" });
    const fetchMock = vi.fn();
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
    vi.stubGlobal("fetch", fetchMock);

    await expect(loadPngTexture(file)).resolves.toEqual({
      src: "data:image/png;base64,abc123",
      name: "sample.png",
      engraving: {
        src: "data:image/png;base64,engraving123",
        width: 320,
        height: 240,
        averageStrength: 0.42
      }
    });

    expect(readAsDataUrl).toHaveBeenCalledWith(file);
    expect(validatePngFile(file)).toBeNull();
    expect(generateEngravingMapFromDataUrl).toHaveBeenCalledWith("data:image/png;base64,abc123");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects png files larger than the upload limit", async () => {
    const file = {
      type: "image/png",
      size: maxPngFileSizeInBytes + 1
    } as File;

    expect(validatePngFile(file)).toBe("8MB 以下の PNG ファイルを選択してください。");
  });

  it("accepts png files at the upload limit", () => {
    const file = {
      type: "image/png",
      size: maxPngFileSizeInBytes
    } as File;

    expect(validatePngFile(file)).toBeNull();
  });

  it("rejects when FileReader reports an error", async () => {
    const file = new File(["png"], "sample.png", { type: "image/png" });

    vi.stubGlobal(
      "FileReader",
      class MockFileReader {
        result: string | ArrayBuffer | null = null;
        onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
        onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
        readAsDataURL() {
          this.onerror?.(new ProgressEvent("error") as ProgressEvent<FileReader>);
        }
      } as unknown as typeof FileReader
    );

    await expect(loadPngTexture(file)).rejects.toThrow("Failed to read PNG file.");
    expect(generateEngravingMapFromDataUrl).not.toHaveBeenCalled();
  });

  it("rejects a non-string FileReader result", async () => {
    const file = new File(["png"], "sample.png", { type: "image/png" });

    vi.stubGlobal(
      "FileReader",
      class MockFileReader {
        result: string | ArrayBuffer | null = new ArrayBuffer(1);
        onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
        onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
        readAsDataURL() {
          this.onload?.(new ProgressEvent("load") as ProgressEvent<FileReader>);
        }
      } as unknown as typeof FileReader
    );

    await expect(readFileAsDataUrl(file)).rejects.toThrow("Failed to read PNG file.");
  });
});
