import { NextResponse } from "next/server";

type SaveRequestPayload = {
  sourceImageId?: string | null;
  exportedImageDataUrl?: string;
  simulation?: {
    ledColorId?: string;
    brightness?: number;
    backgroundId?: string;
    cameraPresetId?: string;
  };
  meta?: {
    sourceFileName?: string;
  };
};

function isPngDataUrl(value: string): boolean {
  return value.startsWith("data:image/png;base64,");
}

export async function POST(request: Request) {
  let payload: SaveRequestPayload;

  try {
    payload = (await request.json()) as SaveRequestPayload;
  } catch {
    return NextResponse.json(
      {
        code: "INVALID_PAYLOAD",
        message: "保存データが不正です。"
      },
      { status: 400 }
    );
  }

  if (!payload.exportedImageDataUrl || !isPngDataUrl(payload.exportedImageDataUrl) || !payload.simulation) {
    return NextResponse.json(
      {
        code: "INVALID_PAYLOAD",
        message: "保存データが不正です。"
      },
      { status: 400 }
    );
  }

  const { ledColorId, brightness, backgroundId, cameraPresetId } = payload.simulation;

  if (
    !ledColorId ||
    typeof brightness !== "number" ||
    !Number.isFinite(brightness) ||
    !backgroundId ||
    !cameraPresetId
  ) {
    return NextResponse.json(
      {
        code: "INVALID_SIMULATION",
        message: "保存設定を確認してください。"
      },
      { status: 422 }
    );
  }

  const savedSimulationId = `sim_${crypto.randomUUID().slice(0, 8)}`;
  const savedAt = new Date().toISOString();

  return NextResponse.json({
    savedSimulationId,
    resultImageUrl: payload.exportedImageDataUrl,
    savedAt,
    simulation: {
      ledColorId,
      brightness,
      backgroundId,
      cameraPresetId
    },
    meta: {
      sourceFileName: payload.meta?.sourceFileName ?? null,
      sourceImageId: payload.sourceImageId ?? null
    }
  });
}
