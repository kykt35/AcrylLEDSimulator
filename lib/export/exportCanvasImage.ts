export type ExportImageFormat = "png" | "jpg";

const mimeTypeMap: Record<ExportImageFormat, string> = {
  png: "image/png",
  jpg: "image/jpeg"
};

export async function exportCanvasImage(
  rootElement: HTMLElement | null,
  format: ExportImageFormat = "png"
): Promise<Blob> {
  if (!rootElement) {
    throw new Error("プレビュー領域が見つかりません。");
  }

  const canvas = rootElement.querySelector("canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("書き出し対象の canvas が見つかりません。");
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("画像の書き出しに失敗しました。"));
        return;
      }

      resolve(blob);
    }, mimeTypeMap[format]);
  });
}
