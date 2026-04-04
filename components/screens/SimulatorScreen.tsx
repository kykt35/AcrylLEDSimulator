"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DisplayControls } from "@/components/controls/DisplayControls";
import { EngravingControls } from "@/components/controls/EngravingControls";
import { ImageControls } from "@/components/controls/ImageControls";
import { LightingControls } from "@/components/controls/LightingControls";
import { SaveControls } from "@/components/controls/SaveControls";
import { NoticeModal } from "@/components/modals/NoticeModal";
import { SaveCompleteModal } from "@/components/modals/SaveCompleteModal";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";
import { ErrorNotice } from "@/components/ui/ErrorNotice";
import { downloadBlob } from "@/lib/download/downloadBlob";
import { exportCanvasImage, type ExportImageFormat } from "@/lib/export/exportCanvasImage";
import { exportEngravingImage } from "@/lib/export/exportEngravingImage";
import { composePreviewImageFromDataUrl } from "@/lib/image/composePreviewImage";
import { generateEngravingMapFromDataUrl, type EngravingMapResult } from "@/lib/image/generateEngravingMap";
import {
  defaultEngravingAdjustments,
  type EngravingAdjustments
} from "@/lib/image/engravingFilters";
import { loadPngTexture } from "@/lib/image/loadPngTexture";
import {
  clearEditorSnapshot,
  readEditorSnapshot,
  writeEditorSnapshot,
  type EditorSnapshot
} from "@/lib/save/session";
import {
  clampImageLayout,
  defaultImageLayout,
  type ImageLayout
} from "@/lib/simulator/imageLayout";
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
  | { type: "load-success"; fileName: string; src: string | null }
  | { type: "load-error"; message: string }
  | { type: "reset" };

type SaveState = {
  status: "idle" | "saving" | "success" | "error";
  savedAt: string | null;
  errorMessage: string | null;
};

type SaveAction =
  | { type: "save-start" }
  | { type: "save-success"; savedAt: string | null }
  | { type: "save-error"; message: string }
  | { type: "save-reset" };

type EngravingState = {
  src: string | null;
  width: number | null;
  height: number | null;
  averageStrength: number | null;
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;
};

type PreviewImageState = {
  src: string | null;
  status: "idle" | "loading" | "ready" | "error";
};

const defaultSourceImageState: SourceImageState = {
  fileName: "未選択",
  src: null,
  status: "idle",
  errorMessage: null
};

const defaultSaveState: SaveState = {
  status: "idle",
  savedAt: null,
  errorMessage: null
};

const defaultEngravingState: EngravingState = {
  src: null,
  width: null,
  height: null,
  averageStrength: null,
  status: "idle",
  errorMessage: null
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
        ...defaultSaveState
      };
    default:
      return state;
  }
}

function buildDownloadFileName(fileName: string, format: ExportImageFormat): string {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return `${baseName || "acryl-led-simulation"}.${format}`;
}

export function SimulatorScreen({ searchParams = {} }: SimulatorScreenProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [sourceImage, dispatchSourceImage] = useReducer(sourceImageReducer, defaultSourceImageState);
  const [save, dispatchSave] = useReducer(saveReducer, defaultSaveState);
  const [engraving, setEngraving] = useState<EngravingState>(defaultEngravingState);
  const [previewImage, setPreviewImage] = useState<PreviewImageState>({
    src: null,
    status: "idle"
  });
  const [engravingAdjustments, setEngravingAdjustments] = useState<EngravingAdjustments>(
    defaultEngravingAdjustments
  );
  const [ledColorId, setLedColorId] = useState(lightingPresets[0].id);
  const [brightness, setBrightness] = useState(1.2);
  const [backgroundId, setBackgroundId] = useState("night");
  const [cameraPresetId, setCameraPresetId] = useState("front");
  const [showSourceOverlay, setShowSourceOverlay] = useState(true);
  const [imageLayout, setImageLayout] = useState<ImageLayout>(defaultImageLayout);
  const [isSaveCompleteOpen, setIsSaveCompleteOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportImageFormat>("png");

  const activeLightingPreset = useMemo(() => getLightingPreset(ledColorId), [ledColorId]);
  const activeBackgroundPreset = useMemo(() => getBackgroundPreset(backgroundId), [backgroundId]);

  const buildEditorSnapshot = useCallback(
    (): EditorSnapshot => ({
      sourceImage: {
        fileName: sourceImage.fileName,
        src: sourceImage.src
      },
      engraving: {
        src: engraving.src,
        adjustments: engravingAdjustments,
        averageStrength: engraving.averageStrength
      },
      simulation: {
        ledColorId,
        brightness,
        backgroundId,
        cameraPresetId,
        showSourceOverlay,
        imageLayout: clampImageLayout(imageLayout)
      }
    }),
    [
      backgroundId,
      brightness,
      cameraPresetId,
      engraving.averageStrength,
      engraving.src,
      engravingAdjustments,
      imageLayout,
      ledColorId,
      showSourceOverlay,
      sourceImage.fileName,
      sourceImage.src
    ]
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
      setPreviewImage({
        src: payload.src,
        status: "ready"
      });
      setEngraving({
        src: payload.engraving.src,
        width: payload.engraving.width,
        height: payload.engraving.height,
        averageStrength: payload.engraving.averageStrength,
        status: "ready",
        errorMessage: null
      });
    } catch (caughtError) {
      dispatchSourceImage({
        type: "load-error",
        message:
          caughtError instanceof Error ? caughtError.message : "PNG の読み込みに失敗しました。"
      });
      setPreviewImage({
        src: null,
        status: "error"
      });
      setEngraving(defaultEngravingState);
    }
  }, []);

  const handleResetView = useCallback(() => {
    setBackgroundId("night");
    setCameraPresetId("front");
    setShowSourceOverlay(true);
  }, []);

  const handleImageLayoutChange = useCallback((patch: Partial<ImageLayout>) => {
    setImageLayout((current) =>
      clampImageLayout({
        ...current,
        ...patch
      })
    );
  }, []);

  const resetEditor = useCallback(() => {
    dispatchSourceImage({ type: "reset" });
    dispatchSave({ type: "save-reset" });
    setEngraving(defaultEngravingState);
    setPreviewImage({
      src: null,
      status: "idle"
    });
    setEngravingAdjustments(defaultEngravingAdjustments);
    setLedColorId(lightingPresets[0].id);
    setBrightness(1.2);
    setBackgroundId("night");
    setCameraPresetId("front");
    setShowSourceOverlay(true);
    setImageLayout(defaultImageLayout);
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

    if (snapshot.sourceImage.src) {
      dispatchSourceImage({
        type: "load-success",
        fileName: snapshot.sourceImage.fileName,
        src: snapshot.sourceImage.src
      });
      setEngraving({
        src: snapshot.engraving.src,
        width: null,
        height: null,
        averageStrength: snapshot.engraving.averageStrength,
        status: snapshot.engraving.src ? "ready" : "idle",
        errorMessage: null
      });
      setPreviewImage({
        src: snapshot.sourceImage.src,
        status: snapshot.sourceImage.src ? "ready" : "idle"
      });
    } else {
      dispatchSourceImage({ type: "reset" });
      setEngraving(defaultEngravingState);
      setPreviewImage({
        src: null,
        status: "idle"
      });
    }
    setEngravingAdjustments(snapshot.engraving.adjustments);
    setLedColorId(snapshot.simulation.ledColorId);
    setBrightness(snapshot.simulation.brightness);
    setBackgroundId(snapshot.simulation.backgroundId);
    setCameraPresetId(snapshot.simulation.cameraPresetId);
    setShowSourceOverlay(snapshot.simulation.showSourceOverlay ?? true);
    setImageLayout(clampImageLayout(snapshot.simulation.imageLayout ?? defaultImageLayout));
  }, [resetEditor, searchParams]);

  useEffect(() => {
    if (!sourceImage.src) {
      setPreviewImage({
        src: null,
        status: "idle"
      });
      return;
    }

    let isActive = true;
    setPreviewImage((current) => ({
      src: current.src ?? sourceImage.src,
      status: "loading"
    }));

    composePreviewImageFromDataUrl(sourceImage.src, imageLayout)
      .then((src) => {
        if (!isActive) {
          return;
        }

        setPreviewImage({
          src,
          status: "ready"
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setPreviewImage({
          src: sourceImage.src,
          status: "error"
        });
      });

    return () => {
      isActive = false;
    };
  }, [imageLayout, sourceImage.src]);

  useEffect(() => {
    if (!sourceImage.src) {
      return;
    }

    let isActive = true;
    setEngraving((current) => ({
      ...current,
      status: "loading",
      errorMessage: null
    }));

    generateEngravingMapFromDataUrl(sourceImage.src, engravingAdjustments)
      .then((result: EngravingMapResult) => {
        if (!isActive) {
          return;
        }

        setEngraving({
          src: result.src,
          width: result.width,
          height: result.height,
          averageStrength: result.averageStrength,
          status: "ready",
          errorMessage: null
        });
      })
      .catch((caughtError) => {
        if (!isActive) {
          return;
        }

        setEngraving({
          ...defaultEngravingState,
          status: "error",
          errorMessage:
            caughtError instanceof Error ? caughtError.message : "彫刻用画像の生成に失敗しました。"
        });
      });

    return () => {
      isActive = false;
    };
  }, [engravingAdjustments, sourceImage.src]);

  const handleEngravingAdjustmentsChange = useCallback((patch: Partial<EngravingAdjustments>) => {
    setEngravingAdjustments((current) => ({
      ...current,
      ...patch
    }));
  }, []);

  const handleDownloadEngraving = useCallback(async () => {
    if (!engraving.src) {
      return;
    }

    const baseName = sourceImage.fileName.replace(/\.[^.]+$/, "") || "acryl-led-simulation";
    const exported = await exportEngravingImage(engraving.src, `${baseName}-engraving.png`);
    downloadBlob(exported.blob, exported.fileName);
  }, [engraving.src, sourceImage.fileName]);

  const handleSave = useCallback(async () => {
    if (!sourceImage.src) {
      return;
    }

    dispatchSave({ type: "save-start" });

    try {
      const exportedImageBlob = await exportCanvasImage(previewRef.current, exportFormat);
      const downloadedAt = new Date().toISOString();

      writeEditorSnapshot(buildEditorSnapshot());
      downloadBlob(exportedImageBlob, buildDownloadFileName(sourceImage.fileName, exportFormat));

      dispatchSave({
        type: "save-success",
        savedAt: downloadedAt
      });
      setIsSaveCompleteOpen(true);
    } catch (caughtError) {
      dispatchSave({
        type: "save-error",
        message:
          caughtError instanceof Error
            ? caughtError.message
            : "ダウンロードに失敗しました。時間をおいて再試行してください。"
      });
    }
  }, [
    backgroundId,
    brightness,
    buildEditorSnapshot,
    cameraPresetId,
    exportFormat,
    ledColorId,
    sourceImage.fileName,
    sourceImage.src
  ]);

  const previewSourceUrl = previewImage.src ?? sourceImage.src;

  return (
    <main className="shell">
      <section className="simulator-header">
        <div>
          <p className="eyebrow">Simulator</p>
          <h1 className="page-title">LEDアクスタ シミュレーター</h1>
          <p className="page-description">
            画像の読み込み、見え方の調整、ダウンロードまでを 1 画面で進めます。
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
            imageUrl={previewSourceUrl}
            engravingImageUrl={engraving.src}
            showSourceOverlay={showSourceOverlay}
            glowColor={activeLightingPreset.glowColor}
            background={activeBackgroundPreset.background}
            brightness={brightness}
            cameraPreset={cameraPresetId}
            containerRef={previewRef}
          />
          {sourceImage.errorMessage ? (
            <ErrorNotice title="画像の読み込みに失敗しました" message={sourceImage.errorMessage} />
          ) : null}
          {sourceImage.src ? (
            <div className="preview-grid" data-testid="simulator-preview-grid">
              <figure className="preview-card">
                <figcaption className="status-title">入力画像</figcaption>
                <div className="preview-image-frame">
                  <img
                    src={previewSourceUrl ?? undefined}
                    alt="元画像プレビュー"
                    className="preview-image"
                  />
                </div>
              </figure>
              <figure className="preview-card">
                <figcaption className="status-title">彫刻用グレースケール</figcaption>
                {engraving.src ? (
                  <div className="preview-image-frame">
                    <img
                      src={engraving.src}
                      alt="彫刻用グレースケールプレビュー"
                      className="preview-image"
                    />
                  </div>
                ) : (
                  <p className="status-secondary">生成待ち</p>
                )}
              </figure>
            </div>
          ) : null}
          {engraving.status === "error" && engraving.errorMessage ? (
            <ErrorNotice title="彫刻用画像の生成に失敗しました" message={engraving.errorMessage} />
          ) : null}
          {save.status === "error" && save.errorMessage ? (
            <ErrorNotice title="ダウンロードに失敗しました" message={save.errorMessage} />
          ) : null}
        </section>

        <aside className="control-panel">
          <ImageControls
            fileName={sourceImage.fileName}
            statusLabel={imageStatusLabel}
            errorMessage={sourceImage.errorMessage}
            imageLayout={imageLayout}
            onFileSelected={handleFileSelected}
            onImageLayoutChange={handleImageLayoutChange}
            onResetImageLayout={() => setImageLayout(defaultImageLayout)}
          />
          <EngravingControls
            adjustments={engravingAdjustments}
            sourceImageUrl={previewSourceUrl}
            engravingImageUrl={engraving.src}
            averageStrength={engraving.averageStrength}
            onAdjustmentsChange={handleEngravingAdjustmentsChange}
            onDownload={handleDownloadEngraving}
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
            showSourceOverlay={showSourceOverlay}
            onBackgroundChange={setBackgroundId}
            onCameraPresetChange={setCameraPresetId}
            onSourceOverlayChange={setShowSourceOverlay}
            onResetView={handleResetView}
          />
          <SaveControls
            saveStatus={save.status}
            errorMessage={save.errorMessage}
            hasImage={Boolean(sourceImage.src)}
            savedAt={save.savedAt}
            exportFormat={exportFormat}
            onFormatChange={setExportFormat}
            onSave={handleSave}
          />
        </aside>
      </div>

      <SaveCompleteModal
        isOpen={isSaveCompleteOpen}
        onClose={() => setIsSaveCompleteOpen(false)}
        formatLabel={exportFormat === "png" ? "PNG" : "JPG"}
      />
    </main>
  );
}
