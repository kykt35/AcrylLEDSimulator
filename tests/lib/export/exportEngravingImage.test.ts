import { exportEngravingImage } from "@/lib/export/exportEngravingImage";

describe("exportEngravingImage", () => {
  it("converts a png data url into a downloadable blob payload", async () => {
    const blob = await exportEngravingImage("data:image/png;base64,Zm9v", "sample-engraving.png");

    expect(blob.fileName).toBe("sample-engraving.png");
    expect(blob.blob.type).toBe("image/png");
    expect(blob.blob.size).toBe(3);
  });

  it("accepts an invert option without changing the non-invert fast path", async () => {
    const blob = await exportEngravingImage("data:image/png;base64,Zm9v", "sample-engraving.png", {
      invert: false
    });

    expect(blob.fileName).toBe("sample-engraving.png");
    expect(blob.blob.type).toBe("image/png");
    expect(blob.blob.size).toBe(3);
  });

  it("rejects unsupported data urls", async () => {
    await expect(exportEngravingImage("data:text/plain;base64,Zm9v", "sample.txt")).rejects.toThrow(
      "彫刻用画像の形式が不正です。"
    );
  });
});
