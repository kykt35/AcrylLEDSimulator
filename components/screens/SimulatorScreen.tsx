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
  defaultAcrylicSizePresetId,
  getAcrylicSizePreset,
  type AcrylicSizePresetId
} from "@/lib/simulator/acrylicSizePresets";
import {
  clampImageLayout,
  defaultImageLayout,
  type ImageLayout
} from "@/lib/simulator/imageLayout";
import { cameraOptions, getBackgroundPreset } from "@/lib/simulator/displayPresets";
import { getLightingPreset, lightingPresets } from "@/lib/simulator/lightingPresets";

type ControlPanelTabId = "image" | "engraving" | "lighting" | "display" | "export";

type ControlPanelTabDefinition = {
  id: ControlPanelTabId;
  label: string;
  eyebrow: string;
  description: string;
};

type ControlPanelTabViewModel = ControlPanelTabDefinition & {
  statusLabel: string;
  completionState: "complete" | "active" | "pending";
};

const CONTROL_PANEL_TABS: readonly ControlPanelTabDefinition[] = [
  {
    id: "image",
    label: "画像",
    eyebrow: "Source",
    description: "入力画像の読み込みとプレビュー範囲を調整します。"
  },
  {
    id: "engraving",
    label: "彫刻",
    eyebrow: "Engraving",
    description: "彫刻用グレースケールの強度を調整します。"
  },
  {
    id: "lighting",
    label: "ライト",
    eyebrow: "Lighting",
    description: "LED の色味と明るさを整えます。"
  },
  {
    id: "display",
    label: "表示",
    eyebrow: "Display",
    description: "背景、カメラ、オーバーレイ表示を切り替えます。"
  },
  {
    id: "export",
    label: "書き出し",
    eyebrow: "Export",
    description: "現在の見え方を画像としてダウンロードします。"
  }
] as const;

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

const defaultHeightAttenuation = 0.3;

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

function hasImage(src: string | null): src is string {
  return Boolean(src);
}

function getTabDescription(tabId: ControlPanelTabId) {
  return CONTROL_PANEL_TABS.find((tab) => tab.id === tabId)?.description ?? "";
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
  const [previewEngravingImage, setPreviewEngravingImage] = useState<PreviewImageState>({
    src: null,
    status: "idle"
  });
  const [engravingAdjustments, setEngravingAdjustments] = useState<EngravingAdjustments>(
    defaultEngravingAdjustments
  );
  const [ledColorId, setLedColorId] = useState(lightingPresets[0].id);
  const [brightness, setBrightness] = useState(1.2);
  const [heightAttenuation, setHeightAttenuation] = useState(defaultHeightAttenuation);
  const [backgroundId, setBackgroundId] = useState("night");
  const [cameraPresetId, setCameraPresetId] = useState("front");
  const [acrylicSizeId, setAcrylicSizeId] = useState<AcrylicSizePresetId>(defaultAcrylicSizePresetId);
  const [showSourceOverlay, setShowSourceOverlay] = useState(false);
  const [imageLayout, setImageLayout] = useState<ImageLayout>(defaultImageLayout);
  const [isSaveCompleteOpen, setIsSaveCompleteOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportImageFormat>("png");
  const [controlPanelTab, setControlPanelTab] = useState<ControlPanelTabId>("image");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isImageReady = hasImage(sourceImage.src);
  const isEngravingReady = engraving.status === "ready";
  const isExportReady = isImageReady;
  const isBusy = sourceImage.status === "loading" || engraving.status === "loading" || save.status === "saving";

  const activeLightingPreset = useMemo(() => getLightingPreset(ledColorId), [ledColorId]);
  const activeBackgroundPreset = useMemo(() => getBackgroundPreset(backgroundId), [backgroundId]);
  const activeCameraOption = useMemo(
    () => cameraOptions.find((option) => option.id === cameraPresetId) ?? cameraOptions[0],
    [cameraPresetId]
  );
  const activeAcrylicSizePreset = useMemo(() => getAcrylicSizePreset(acrylicSizeId), [acrylicSizeId]);

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
        heightAttenuation,
        backgroundId,
        cameraPresetId,
        acrylicSizeId,
        showSourceOverlay,
        imageLayout: clampImageLayout(imageLayout)
      }
    }),
    [
      backgroundId,
      brightness,
      heightAttenuation,
      cameraPresetId,
      acrylicSizeId,
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

  const controlPanelTabs = useMemo<ControlPanelTabViewModel[]>(
    () =>
      CONTROL_PANEL_TABS.map((tab) => {
        switch (tab.id) {
          case "image":
            return {
              ...tab,
              statusLabel: sourceImage.src
                ? `${activeAcrylicSizePreset.label} / ${sourceImage.fileName}`
                : `${activeAcrylicSizePreset.label} / 未設定`,
              completionState: sourceImage.src ? "complete" : "active"
            };
          case "engraving":
            return {
              ...tab,
              statusLabel:
                engraving.status === "ready" && engraving.averageStrength != null
                  ? `平均 ${(engraving.averageStrength * 100).toFixed(0)}%`
                  : sourceImage.src
                    ? engraving.status === "loading"
                      ? "生成中"
                      : "調整前"
                    : "入力待ち"
              ,
              completionState: engraving.status === "ready" ? "complete" : sourceImage.src ? "active" : "pending"
            };
          case "lighting":
            return {
              ...tab,
              statusLabel: `${activeLightingPreset.label} / ${brightness.toFixed(1)}`,
              completionState: sourceImage.src ? "active" : "pending"
            };
          case "display":
            return {
              ...tab,
              statusLabel: `${activeBackgroundPreset.label} / ${activeCameraOption.label}`,
              completionState: sourceImage.src ? "active" : "pending"
            };
          case "export":
            return {
              ...tab,
              statusLabel: hasImage(sourceImage.src) ? exportFormat.toUpperCase() : "画像未選択",
              completionState: save.status === "success" ? "complete" : hasImage(sourceImage.src) ? "active" : "pending"
            };
          default:
            return {
              ...tab,
              statusLabel: "",
              completionState: "pending"
            };
        }
      }),
    [
      activeBackgroundPreset.label,
      activeAcrylicSizePreset.label,
      activeCameraOption.label,
      activeLightingPreset.label,
      brightness,
      engraving.averageStrength,
      engraving.status,
      exportFormat,
      save.status,
      sourceImage.fileName,
      sourceImage.src
    ]
  );

  const activeControlPanelTab = useMemo(
    () => controlPanelTabs.find((tab) => tab.id === controlPanelTab) ?? controlPanelTabs[0],
    [controlPanelTab, controlPanelTabs]
  );

  const liveRegionMessage = useMemo(() => {
    if (sourceImage.status === "loading") {
      return "画像を読み込み中です。";
    }

    if (sourceImage.status === "ready") {
      return `${sourceImage.fileName} の読み込みが完了しました。`;
    }

    if (sourceImage.status === "error" && sourceImage.errorMessage) {
      return sourceImage.errorMessage;
    }

    if (engraving.status === "loading") {
      return "彫刻用グレースケールを生成中です。";
    }

    if (engraving.status === "error" && engraving.errorMessage) {
      return engraving.errorMessage;
    }

    if (save.status === "saving") {
      return "ダウンロードを準備中です。";
    }

    if (save.status === "success") {
      return `${exportFormat.toUpperCase()} のダウンロードを開始しました。`;
    }

    if (save.status === "error" && save.errorMessage) {
      return save.errorMessage;
    }

    return "PNG をアップロードしてシミュレーションを始めましょう。";
  }, [
    engraving.errorMessage,
    engraving.status,
    exportFormat,
    save.errorMessage,
    save.status,
    sourceImage.errorMessage,
    sourceImage.fileName,
    sourceImage.status
  ]);

  const handleControlTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, tabId: ControlPanelTabId) => {
      const currentIndex = controlPanelTabs.findIndex((tab) => tab.id === tabId);

      if (currentIndex === -1) {
        return;
      }

      let nextIndex: number | null = null;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = (currentIndex + 1) % controlPanelTabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = (currentIndex - 1 + controlPanelTabs.length) % controlPanelTabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = controlPanelTabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const nextTab = controlPanelTabs[nextIndex];
      setControlPanelTab(nextTab.id);
      setIsMobileDrawerOpen(true);
      globalThis.document?.getElementById(`control-tab-${nextTab.id}`)?.focus();
    },
    [controlPanelTabs]
  );

  const activateControlPanelTab = useCallback((tabId: ControlPanelTabId) => {
    setControlPanelTab(tabId);
    setIsMobileDrawerOpen(true);
  }, []);

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
      setPreviewEngravingImage({
        src: payload.engraving.src,
        status: "ready"
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
      setPreviewEngravingImage({
        src: null,
        status: "error"
      });
      setEngraving(defaultEngravingState);
    }
  }, []);

  const handleResetView = useCallback(() => {
    setBackgroundId("night");
    setCameraPresetId("front");
    setShowSourceOverlay(false);
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
    setPreviewEngravingImage({
      src: null,
      status: "idle"
    });
    setEngravingAdjustments(defaultEngravingAdjustments);
    setLedColorId(lightingPresets[0].id);
    setBrightness(1.2);
    setHeightAttenuation(defaultHeightAttenuation);
    setBackgroundId("night");
    setCameraPresetId("front");
    setAcrylicSizeId(defaultAcrylicSizePresetId);
    setShowSourceOverlay(false);
    setImageLayout(defaultImageLayout);
    setIsMobileDrawerOpen(false);
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
      setPreviewEngravingImage({
        src: snapshot.engraving.src,
        status: snapshot.engraving.src ? "ready" : "idle"
      });
    } else {
      dispatchSourceImage({ type: "reset" });
      setEngraving(defaultEngravingState);
      setPreviewImage({
        src: null,
        status: "idle"
      });
      setPreviewEngravingImage({
        src: null,
        status: "idle"
      });
    }
    setEngravingAdjustments(snapshot.engraving.adjustments);
    setLedColorId(snapshot.simulation.ledColorId);
    setBrightness(snapshot.simulation.brightness);
    setHeightAttenuation(snapshot.simulation.heightAttenuation ?? defaultHeightAttenuation);
    setBackgroundId(snapshot.simulation.backgroundId);
    setCameraPresetId(snapshot.simulation.cameraPresetId);
    setAcrylicSizeId(snapshot.simulation.acrylicSizeId ?? defaultAcrylicSizePresetId);
    setShowSourceOverlay(snapshot.simulation.showSourceOverlay ?? false);
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
    if (!engraving.src) {
      setPreviewEngravingImage({
        src: null,
        status: "idle"
      });
      return;
    }

    let isActive = true;
    setPreviewEngravingImage((current) => ({
      src: current.src ?? engraving.src,
      status: "loading"
    }));

    composePreviewImageFromDataUrl(engraving.src, imageLayout)
      .then((src) => {
        if (!isActive) {
          return;
        }

        setPreviewEngravingImage({
          src,
          status: "ready"
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setPreviewEngravingImage({
          src: engraving.src,
          status: "error"
        });
      });

    return () => {
      isActive = false;
    };
  }, [engraving.src, imageLayout]);

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
  const previewEngravingUrl = previewEngravingImage.src ?? engraving.src;

  return (
    <main className="shell">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionMessage}
      </p>
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={isMobileDrawerOpen}
        aria-controls="mobile-control-panel-content"
        onClick={() => setIsMobileDrawerOpen((current) => !current)}
      >
        設定
      </button>
      <section className="simulator-header">
        <div>
          <p className="eyebrow">Simulator</p>
          <h1 className="page-title">LEDアクスタ シミュレーター</h1>
          <p className="page-description">
            画像の読み込み、見え方の調整、ダウンロードまでを 1 画面で進めます。
          </p>
        </div>
        <div className="header-actions">
          <button type="button" className="secondary-button compact" onClick={resetEditor}>
            全体をリセット
          </button>
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
              <h2 className="panel-title">3D プレビュー</h2>
            </div>
            <p className="preview-status" aria-live="polite">
              {sourceImage.status === "error"
                ? sourceImage.errorMessage
                : sourceImage.status === "ready"
                  ? "現在の設定がプレビューに反映されています。"
                  : imageStatusLabel}
            </p>
          </div>
          <div className="preview-stage">
            {sourceImage.src ? (
              <SimulatorCanvas
                imageUrl={previewSourceUrl}
                engravingImageUrl={previewEngravingUrl}
                sizePreset={activeAcrylicSizePreset}
                showSourceOverlay={showSourceOverlay}
                glowColor={activeLightingPreset.glowColor}
                background={activeBackgroundPreset.background}
                brightness={brightness}
                heightAttenuation={heightAttenuation}
                cameraPreset={cameraPresetId}
                containerRef={previewRef}
              />
            ) : (
              <div className="preview-empty-state" data-testid="preview-empty-state">
                <div className="preview-empty-icon" aria-hidden="true">
                  PNG
                </div>
                <h3>PNG をアップロードして始めましょう</h3>
                <p>画像タブから透過 PNG を読み込むと、3D プレビューと彫刻データを同時に確認できます。</p>
              </div>
            )}
            {isBusy ? (
              <div className="preview-loading-overlay" role="status" aria-live="polite">
                <span className="loading-spinner" aria-hidden="true" />
                <span>
                  {save.status === "saving"
                    ? "ダウンロードを準備中です。"
                    : sourceImage.status === "loading"
                      ? "画像を読み込み中です。"
                      : "彫刻プレビューを生成中です。"}
                </span>
              </div>
            ) : null}
          </div>
          {sourceImage.errorMessage ? (
            <ErrorNotice title="画像の読み込みに失敗しました" message={sourceImage.errorMessage} />
          ) : null}
          {engraving.status === "error" && engraving.errorMessage ? (
            <ErrorNotice title="彫刻用画像の生成に失敗しました" message={engraving.errorMessage} />
          ) : null}
          {save.status === "error" && save.errorMessage ? (
            <ErrorNotice title="ダウンロードに失敗しました" message={save.errorMessage} />
          ) : null}
        </section>

        <button
          type="button"
          className={`mobile-drawer-backdrop${isMobileDrawerOpen ? " is-visible" : ""}`}
          aria-label="コントロールパネルを閉じる"
          onClick={() => setIsMobileDrawerOpen(false)}
        />

        <aside
          className={`control-panel${isMobileDrawerOpen ? " is-mobile-open" : ""}`}
          data-mobile-open={isMobileDrawerOpen}
        >
          <div className="mobile-drawer-header">
            <div>
              <p className="panel-label">Controls</p>
              <strong className="mobile-drawer-toggle-title">{activeControlPanelTab.label}</strong>
              <p className="mobile-drawer-toggle-status">{activeControlPanelTab.statusLabel}</p>
            </div>
            <button
              type="button"
              className="ghost-link compact"
              aria-label="メニューを閉じる"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              閉じる
            </button>
          </div>
          <div id="mobile-control-panel-content" className="control-panel-content">
          <div className="control-tablist" role="tablist" aria-label="シミュレーター設定">
            {controlPanelTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                id={`control-tab-${tab.id}`}
                role="tab"
                className="control-tab"
                data-state={tab.completionState}
                aria-label={tab.label}
                aria-selected={controlPanelTab === tab.id}
                aria-controls={`control-panel-${tab.id}`}
                tabIndex={controlPanelTab === tab.id ? 0 : -1}
                onClick={() => activateControlPanelTab(tab.id)}
                onKeyDown={(event) => handleControlTabKeyDown(event, tab.id)}
              >
                <span className="control-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="control-tab-panels">
            <div
              id="control-panel-image"
              role="tabpanel"
              className="control-tab-panel"
              aria-labelledby="control-tab-image"
              hidden={controlPanelTab !== "image"}
              data-testid="control-panel-image"
            >
              <article className="control-panel-card">
                <div className="control-panel-summary" data-testid="control-panel-summary">
                  <h2 className="control-panel-summary-title">画像</h2>
                  <p className="control-panel-summary-status">
                    {activeControlPanelTab.id === "image" ? activeControlPanelTab.statusLabel : ""}
                  </p>
                  <button
                    type="button"
                    className="summary-help-button"
                    title={getTabDescription("image")}
                    aria-label="画像セクションの説明"
                  >
                    ?
                  </button>
                </div>
                <ImageControls
                  acrylicSizeId={acrylicSizeId}
                  fileName={sourceImage.fileName}
                  statusLabel={imageStatusLabel}
                  errorMessage={sourceImage.errorMessage}
                  previewSrc={previewSourceUrl}
                  imageLayout={imageLayout}
                  onAcrylicSizeChange={setAcrylicSizeId}
                  onFileSelected={handleFileSelected}
                  onImageLayoutChange={handleImageLayoutChange}
                  onResetImageLayout={() => setImageLayout(defaultImageLayout)}
                />
              </article>
            </div>
            <div
              id="control-panel-engraving"
              role="tabpanel"
              className="control-tab-panel"
              aria-labelledby="control-tab-engraving"
              hidden={controlPanelTab !== "engraving"}
              data-testid="control-panel-engraving"
            >
              <article className="control-panel-card">
                <div className="control-panel-summary" data-testid="control-panel-summary">
                  <h2 className="control-panel-summary-title">彫刻</h2>
                  <p className="control-panel-summary-status">
                    {activeControlPanelTab.id === "engraving" ? activeControlPanelTab.statusLabel : ""}
                  </p>
                  <button
                    type="button"
                    className="summary-help-button"
                    title={getTabDescription("engraving")}
                    aria-label="彫刻セクションの説明"
                  >
                    ?
                  </button>
                </div>
                <EngravingControls
                  adjustments={engravingAdjustments}
                  sourceImageUrl={previewSourceUrl}
                  engravingImageUrl={previewEngravingUrl}
                  averageStrength={engraving.averageStrength}
                  onAdjustmentsChange={handleEngravingAdjustmentsChange}
                  onDownload={handleDownloadEngraving}
                />
              </article>
            </div>
            <div
              id="control-panel-lighting"
              role="tabpanel"
              className="control-tab-panel"
              aria-labelledby="control-tab-lighting"
              hidden={controlPanelTab !== "lighting"}
              data-testid="control-panel-lighting"
            >
              <article className="control-panel-card">
                <div className="control-panel-summary" data-testid="control-panel-summary">
                  <h2 className="control-panel-summary-title">ライト</h2>
                  <p className="control-panel-summary-status">
                    {activeControlPanelTab.id === "lighting" ? activeControlPanelTab.statusLabel : ""}
                  </p>
                  <button
                    type="button"
                    className="summary-help-button"
                    title={getTabDescription("lighting")}
                    aria-label="ライトセクションの説明"
                  >
                    ?
                  </button>
                </div>
                <LightingControls
                  activePresetId={ledColorId}
                  brightness={brightness}
                  heightAttenuation={heightAttenuation}
                  onPresetChange={setLedColorId}
                  onBrightnessChange={setBrightness}
                  onHeightAttenuationChange={setHeightAttenuation}
                />
              </article>
            </div>
            <div
              id="control-panel-display"
              role="tabpanel"
              className="control-tab-panel"
              aria-labelledby="control-tab-display"
              hidden={controlPanelTab !== "display"}
              data-testid="control-panel-display"
            >
              <article className="control-panel-card">
                <div className="control-panel-summary" data-testid="control-panel-summary">
                  <h2 className="control-panel-summary-title">表示</h2>
                  <p className="control-panel-summary-status">
                    {activeControlPanelTab.id === "display" ? activeControlPanelTab.statusLabel : ""}
                  </p>
                  <button
                    type="button"
                    className="summary-help-button"
                    title={getTabDescription("display")}
                    aria-label="表示セクションの説明"
                  >
                    ?
                  </button>
                </div>
                <DisplayControls
                  activeBackgroundId={backgroundId}
                  activeCameraPreset={cameraPresetId}
                  showSourceOverlay={showSourceOverlay}
                  onBackgroundChange={setBackgroundId}
                  onCameraPresetChange={setCameraPresetId}
                  onSourceOverlayChange={setShowSourceOverlay}
                  onResetView={handleResetView}
                />
              </article>
            </div>
            <div
              id="control-panel-export"
              role="tabpanel"
              className="control-tab-panel"
              aria-labelledby="control-tab-export"
              hidden={controlPanelTab !== "export"}
              data-testid="control-panel-export"
            >
              <article className="control-panel-card">
                <div className="control-panel-summary" data-testid="control-panel-summary">
                  <h2 className="control-panel-summary-title">書き出し</h2>
                  <p className="control-panel-summary-status">
                    {activeControlPanelTab.id === "export" ? activeControlPanelTab.statusLabel : ""}
                  </p>
                  <button
                    type="button"
                    className="summary-help-button"
                    title={getTabDescription("export")}
                    aria-label="書き出しセクションの説明"
                  >
                    ?
                  </button>
                </div>
                <SaveControls
                  saveStatus={save.status}
                  errorMessage={save.errorMessage}
                  hasImage={Boolean(sourceImage.src)}
                  savedAt={save.savedAt}
                  exportFormat={exportFormat}
                  onFormatChange={setExportFormat}
                  onSave={handleSave}
                />
              </article>
            </div>
          </div>
          </div>
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
