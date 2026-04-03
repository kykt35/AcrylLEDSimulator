export function exportCanvasImage(rootElement: HTMLElement | null): string {
  if (!rootElement) {
    throw new Error("プレビュー領域が見つかりません。");
  }

  const canvas = rootElement.querySelector("canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("書き出し対象の canvas が見つかりません。");
  }

  return canvas.toDataURL("image/png");
}
