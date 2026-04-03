export function validatePngFile(file: File): string | null {
  if (file.type !== "image/png") {
    return "PNGファイルを選択してください。";
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
}> {
  const error = validatePngFile(file);

  if (error) {
    throw new Error(error);
  }

  const src = await readFileAsDataUrl(file);

  return { src, name: file.name };
}
