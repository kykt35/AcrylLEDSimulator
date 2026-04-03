export async function exportEngravingImage(
  dataUrl: string,
  fileName: string
): Promise<{ blob: Blob; fileName: string }> {
  const match = dataUrl.match(/^data:(image\/png);base64,(.+)$/);

  if (!match) {
    throw new Error("彫刻用画像の形式が不正です。");
  }

  const [, mimeType, encoded] = match;
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return {
    blob: new Blob([bytes], { type: mimeType }),
    fileName
  };
}
