import { downloadBlob } from "@/lib/download/downloadBlob";

describe("downloadBlob", () => {
  it("creates an object url and triggers an anchor download", () => {
    const blob = new Blob(["png"], { type: "image/png" });
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    const click = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const createElement = vi.spyOn(document, "createElement");

    vi.stubGlobal("URL", {
      ...URL,
      createObjectURL,
      revokeObjectURL
    });

    createElement.mockImplementation(((tagName: string) => {
      if (tagName === "a") {
        return {
          click,
          set href(value: string) {
            this._href = value;
          },
          get href() {
            return this._href;
          },
          set download(value: string) {
            this._download = value;
          },
          get download() {
            return this._download;
          }
        } as HTMLAnchorElement;
      }

      return originalCreateElement(tagName);
    }) as typeof document.createElement);

    downloadBlob(blob, "preview.png");

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");

    createElement.mockRestore();
    vi.unstubAllGlobals();
  });
});
