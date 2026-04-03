import { NextResponse } from "next/server";

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function getPngDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];

  if (bytes.length < 24 || !pngSignature.every((value, index) => bytes[index] === value)) {
    return null;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  return {
    width: view.getUint32(16),
    height: view.getUint32(20)
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0 || file.type !== "image/png") {
    return NextResponse.json(
      {
        code: "INVALID_FILE",
        message: "PNG ファイルを選択してください。"
      },
      { status: 400 }
    );
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  const dimensions = getPngDimensions(buffer);

  if (!dimensions) {
    return NextResponse.json(
      {
        code: "INVALID_FILE",
        message: "PNG ファイルを選択してください。"
      },
      { status: 400 }
    );
  }

  const sourceImageId = `src_${crypto.randomUUID().slice(0, 8)}`;
  const safeFileName = sanitizeFileName(file.name);

  return NextResponse.json({
    sourceImageId,
    sourceImageUrl: `/uploads/${sourceImageId}-${safeFileName}`,
    fileName: file.name,
    mimeType: file.type,
    width: dimensions.width,
    height: dimensions.height
  });
}
