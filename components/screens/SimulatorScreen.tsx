"use client";

import Link from "next/link";
import React, { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { DisplayControls } from "@/components/controls/DisplayControls";
import { ImageControls } from "@/components/controls/ImageControls";
import { LightingControls } from "@/components/controls/LightingControls";
import { SaveControls } from "@/components/controls/SaveControls";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";
import { loadPngTexture } from "@/lib/image/loadPngTexture";
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
  | { type: "load-error"; message: string };

type SaveState = {
  status: "idle" | "saving" | "success" | "error";
  exportedImageUrl: string | null;
  savedAt: string | null;
  errorMessage: string | null;
};

type SaveAction =
  | { type: "save-start" }
  | { type: "save-success"; exportedImageUrl: string; savedAt: string | null }
  | { type: "save-error"; message: string }
  | { type: "save-reset" };

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
        errorMessage: null
      };
    case "save-error":
      return {
        ...state,
        status: "error",
        errorMessage: action.message
      };
    case "save-reset":
      return {
        status: "idle",
        exportedImageUrl: null,
        savedAt: null,
        errorMessage: null
      };
    default:
      return state;
  }
}

export function SimulatorScreen() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [sourceImage, dispatchSourceImage] = useReducer(sourceImageReducer, {
    fileName: "未選択",
    src: null,
    status: "idle",
    errorMessage: null
  });
  const [save, dispatchSave] = useReducer(saveReducer, {
    status: "idle",
    exportedImageUrl: null,
    savedAt: null,
    errorMessage: null
  });
  const [ledColorId, setLedColorId] = useState(lightingPresets[0].id);
  const [brightness, setBrightness] = useState(1.2);
  const [backgroundId, setBackgroundId] = useState("night");
  const [cameraPresetId, setCameraPresetId] = useState("front");

  const activeLightingPreset = useMemo(() => getLightingPreset(ledColorId), [ledColorId]);
  const activeBackgroundPreset = useMemo(() => getBackgroundPreset(backgroundId), [backgroundId]);

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

  const handleSave = useCallback(() => {
    dispatchSave({ type: "save-reset" });
  }, []);

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
          <Link href="/result" className="ghost-link">
            保存結果を見る
          </Link>
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
            onSave={handleSave}
          />
        </aside>
      </div>
    </main>
  );
}
