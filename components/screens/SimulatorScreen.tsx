"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DisplayControls } from "@/components/controls/DisplayControls";
import { ImageControls } from "@/components/controls/ImageControls";
import { LightingControls } from "@/components/controls/LightingControls";
import { SaveControls } from "@/components/controls/SaveControls";
import { NoticeModal } from "@/components/modals/NoticeModal";
import { SaveCompleteModal } from "@/components/modals/SaveCompleteModal";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";
import { ErrorNotice } from "@/components/ui/ErrorNotice";
import { exportCanvasImage } from "@/lib/export/exportCanvasImage";
import { loadPngTexture } from "@/lib/image/loadPngTexture";
import {
  clearEditorSnapshot,
  readEditorSnapshot,
  writeEditorSnapshot,
  writeLatestResult,
  type EditorSnapshot
} from "@/lib/save/session";
import { getBackgroundPreset } from "@/lib/simulator/displayPresets";
import { getLightingPreset, lightingPresets } from "@/lib/simulator/lightingPresets";

type SourceImageState = {
  fileName: string;
  src: string | null;
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;
};

type SourceImageAction =
  | { type: "load-start"; fileName: string }
  | { type: "load-success"; fileName: string; src: string }
  | { type: "load-error"; message: string }
  | { type: "reset" };

type SaveState = {
  status: "idle" | "saving" | "success" | "error";
  exportedImageUrl: string | null;
  savedAt: string | null;
  errorMessage: string | null;
  savedSimulationId: string | null;
};

type SaveAction =
  | { type: "save-start" }
  | {
      type: "save-success";
      exportedImageUrl: string;
      savedAt: string | null;
      savedSimulationId: string;
    }
  | { type: "save-error"; message: string }
  | { type: "save-reset" };

const defaultSourceImageState: SourceImageState = {
  fileName: "未選択",
  src: null,
  status: "idle",
  errorMessage: null
};

const defaultSaveState: SaveState = {
  status: "idle",
  exportedImageUrl: null,
  savedAt: null,
  errorMessage: null,
  savedSimulationId: null
};

type SimulatorScreenProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function sourceImageReducer(state: SourceImageState, action: SourceImageAction): SourceImageState {
  switch (action.type) {
    case "load-start":
      return {
        ...state,
        fileName: action.fileName,
        status: "loading",
        errorMessage: null
      };
    case "load-success":
      return {
        fileName: action.fileName,
        src: action.src,
        status: "ready",
        errorMessage: null
      };
    case "load-error":
      return {
        ...state,
        status: "error",
        errorMessage: action.message
      };
    case "reset":
      return defaultSourceImageState;
    default:
      return state;
  }
}

function saveReducer(state: SaveState, action: SaveAction): SaveState {
  switch (action.type) {
    case "save-start":
      return {
        ...state,
        status: "saving",
        errorMessage: null
      };
    case "save-success":
      return {
        status: "success",
        exportedImageUrl: action.exportedImageUrl,
        savedAt: action.savedAt,
        errorMessage: null,
        savedSimulationId: action.savedSimulationId
      };
    case "save-error":
      return {
        ...state,
        status: "error",
        errorMessage: action.message
      };
    case "save-reset":
      return {
        ...defaultSaveState
      };
    default:
      return state;
  }
}

export function SimulatorScreen({ searchParams = {} }: SimulatorScreenProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [sourceImage, dispatchSourceImage] = useReducer(sourceImageReducer, defaultSourceImageState);
  const [save, dispatchSave] = useReducer(saveReducer, defaultSaveState);
  const [ledColorId, setLedColorId] = useState(lightingPresets[0].id);
  const [brightness, setBrightness] = useState(1.2);
  const [backgroundId, setBackgroundId] = useState("night");
  const [cameraPresetId, setCameraPresetId] = useState("front");
  const [isSaveCompleteOpen, setIsSaveCompleteOpen] = useState(false);

  const activeLightingPreset = useMemo(() => getLightingPreset(ledColorId), [ledColorId]);
  const activeBackgroundPreset = useMemo(() => getBackgroundPreset(backgroundId), [backgroundId]);

  const buildEditorSnapshot = useCallback(
    (): EditorSnapshot => ({
      sourceImage: {
        fileName: sourceImage.fileName,
        src: sourceImage.src
      },
      simulation: {
        ledColorId,
        brightness,
        backgroundId,
        cameraPresetId
      }
    }),
    [backgroundId, brightness, cameraPresetId, ledColorId, sourceImage.fileName, sourceImage.src]
  );

  const imageStatusLabel = useMemo(() => {
    switch (sourceImage.status) {
      case "loading":
        return "画像を読み込み中です。";
      case "ready":
        return "プレビューへ反映済みです。";
      case "error":
        return "別の PNG ファイルで再試行してください。";
      default:
        return "PNG をアップロードすると 3D プレビューへ反映されます。";
    }
  }, [sourceImage.status]);

  const handleFileSelected = useCallback(async (file: File) => {
    dispatchSourceImage({ type: "load-start", fileName: file.name });
    dispatchSave({ type: "save-reset" });

    try {
      const payload = await loadPngTexture(file);
      dispatchSourceImage({
        type: "load-success",
        fileName: payload.name,
        src: payload.src
      });
    } catch (caughtError) {
      dispatchSourceImage({
        type: "load-error",
        message:
          caughtError instanceof Error ? caughtError.message : "PNG の読み込みに失敗しました。"
      });
    }
  }, []);

  const handleResetView = useCallback(() => {
    setBackgroundId("night");
    setCameraPresetId("front");
  }, []);

  const resetEditor = useCallback(() => {
    dispatchSourceImage({ type: "reset" });
    dispatchSave({ type: "save-reset" });
    setLedColorId(lightingPresets[0].id);
    setBrightness(1.2);
    setBackgroundId("night");
    setCameraPresetId("front");
    clearEditorSnapshot();
  }, []);

  useEffect(() => {
    const reset = searchParams.reset;
    const resume = searchParams.resume;
    const resetValue = Array.isArray(reset) ? reset[0] : reset;
    const resumeValue = Array.isArray(resume) ? resume[0] : resume;

    if (resetValue === "1") {
      resetEditor();
      return;
    }

    if (resumeValue !== "1") {
      return;
    }

    const snapshot = readEditorSnapshot();

    if (!snapshot) {
      return;
    }

    dispatchSourceImage({
      type: "load-success",
      fileName: snapshot.sourceImage.fileName,
      src: snapshot.sourceImage.src ?? ""
    });
    setLedColorId(snapshot.simulation.ledColorId);
    setBrightness(snapshot.simulation.brightness);
    setBackgroundId(snapshot.simulation.backgroundId);
    setCameraPresetId(snapshot.simulation.cameraPresetId);
  }, [resetEditor, searchParams]);

  const handleSave = useCallback(async () => {
    if (!sourceImage.src) {
      return;
    }

    dispatchSave({ type: "save-start" });

    try {
      const exportedImageDataUrl = exportCanvasImage(previewRef.current);
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sourceImageId: null,
          exportedImageDataUrl,
          simulation: {
            ledColorId,
            brightness,
            backgroundId,
            cameraPresetId
          },
          meta: {
            sourceFileName: sourceImage.fileName
          }
        })
      });

      const payload = (await response.json()) as {
        code?: string;
        message?: string;
        savedSimulationId?: string;
        resultImageUrl?: string;
        savedAt?: string;
      };

      if (!response.ok || !payload.savedSimulationId || !payload.resultImageUrl || !payload.savedAt) {
        throw new Error(payload.message ?? "保存に失敗しました。時間をおいて再試行してください。");
      }

      writeEditorSnapshot(buildEditorSnapshot());
      writeLatestResult({
        savedSimulationId: payload.savedSimulationId,
        resultImageUrl: payload.resultImageUrl,
        savedAt: payload.savedAt,
        sourceImage: {
          fileName: sourceImage.fileName,
          src: sourceImage.src
        },
        simulation: {
          ledColorId,
          brightness,
          backgroundId,
          cameraPresetId
        }
      });

      dispatchSave({
        type: "save-success",
        exportedImageUrl: payload.resultImageUrl,
        savedAt: payload.savedAt,
        savedSimulationId: payload.savedSimulationId
      });
      setIsSaveCompleteOpen(true);
    } catch (caughtError) {
      dispatchSave({
        type: "save-error",
        message:
          caughtError instanceof Error ? caughtError.message : "保存に失敗しました。時間をおいて再試行してください。"
      });
    }
  }, [
    backgroundId,
    brightness,
    buildEditorSnapshot,
    cameraPresetId,
    ledColorId,
    sourceImage.fileName,
    sourceImage.src
  ]);

  return (
    <main className="shell">
      <section className="simulator-header">
        <div>
          <p className="eyebrow">Simulator</p>
          <h1 className="page-title">LEDアクスタ シミュレーター</h1>
          <p className="page-description">
            画像の読み込み、見え方の調整、保存までを 1 画面で進めます。
          </p>
        </div>
        <div className="header-actions">
          <Link href="/" className="secondary-link">
            トップへ戻る
          </Link>
          <NoticeModal triggerLabel="注意事項" buttonClassName="ghost-link" />
        </div>
      </section>

      <div className="simulator-layout">
        <section className="preview-shell">
          <div className="preview-header">
            <div>
              <p className="panel-label">3D Preview</p>
              <h2 className="panel-title">Canvas mount verification</h2>
            </div>
            <p className="preview-status">
              {sourceImage.status === "error"
                ? sourceImage.errorMessage
                : sourceImage.status === "ready"
                  ? "現在の設定がプレビューに反映されています。"
                  : imageStatusLabel}
            </p>
          </div>
          <SimulatorCanvas
            imageUrl={sourceImage.src}
            glowColor={activeLightingPreset.glowColor}
            background={activeBackgroundPreset.background}
            brightness={brightness}
            cameraPreset={cameraPresetId}
            containerRef={previewRef}
          />
          {sourceImage.errorMessage ? (
            <ErrorNotice title="画像の読み込みに失敗しました" message={sourceImage.errorMessage} />
          ) : null}
          {save.status === "error" && save.errorMessage ? (
            <ErrorNotice title="保存に失敗しました" message={save.errorMessage} />
          ) : null}
        </section>

        <aside className="control-panel">
          <ImageControls
            fileName={sourceImage.fileName}
            statusLabel={imageStatusLabel}
            errorMessage={sourceImage.errorMessage}
            onFileSelected={handleFileSelected}
          />
          <LightingControls
            activePresetId={ledColorId}
            brightness={brightness}
            onPresetChange={setLedColorId}
            onBrightnessChange={setBrightness}
          />
          <DisplayControls
            activeBackgroundId={backgroundId}
            activeCameraPreset={cameraPresetId}
            onBackgroundChange={setBackgroundId}
            onCameraPresetChange={setCameraPresetId}
            onResetView={handleResetView}
          />
          <SaveControls
            saveStatus={save.status}
            errorMessage={save.errorMessage}
            hasImage={Boolean(sourceImage.src)}
            savedAt={save.savedAt}
            onSave={handleSave}
          />
        </aside>
      </div>

      <SaveCompleteModal
        isOpen={isSaveCompleteOpen}
        onClose={() => setIsSaveCompleteOpen(false)}
        onViewResult={() => router.push("/result")}
      />
    </main>
  );
}
