import { generateEngravingMapFromDataUrl, type EngravingMapResult } from "@/lib/image/generateEngravingMap";

export const maxPngFileSizeInBytes = 8 * 1024 * 1024;

export function validatePngFile(file: File): string | null {
  if (file.type !== "image/png") {
    return "PNGファイルを選択してください。";
  }

  if (file.size > maxPngFileSizeInBytes) {
    return "8MB 以下の PNG ファイルを選択してください。";
  }

  return null;
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read PNG file."));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read PNG file."));
    };

    reader.readAsDataURL(file);
  });
}

export async function loadPngTexture(file: File): Promise<{
  src: string;
  name: string;
  engraving: EngravingMapResult;
}> {
  const error = validatePngFile(file);

  if (error) {
    throw new Error(error);
  }

  const src = await readFileAsDataUrl(file);
  const engraving = await generateEngravingMapFromDataUrl(src);

  return {
    src,
    name: file.name,
    engraving
  };
}
