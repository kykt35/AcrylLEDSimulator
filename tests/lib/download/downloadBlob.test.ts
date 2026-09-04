import { downloadBlob } from "@/lib/download/downloadBlob";

describe("downloadBlob", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("creates an object url and triggers an anchor download", () => {
    const blob = new Blob(["png"], { type: "image/png" });
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    const link = document.createElement("a");
    const click = vi.spyOn(link, "click").mockImplementation(() => undefined);

    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL
    });
    vi.spyOn(document, "createElement").mockReturnValue(link);

    downloadBlob(blob, "preview.png");

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(link.href).toBe("blob:test");
    expect(link.download).toBe("preview.png");
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });
});
