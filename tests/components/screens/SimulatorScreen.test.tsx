import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";
import { downloadBlob } from "@/lib/download/downloadBlob";
import { exportEngravingImage } from "@/lib/export/exportEngravingImage";
import { exportCanvasImage, getCanvasPreviewDataUrl } from "@/lib/export/exportCanvasImage";
import { composePreviewImageFromDataUrl } from "@/lib/image/composePreviewImage";
import { generateEngravingMapFromDataUrl } from "@/lib/image/generateEngravingMap";
import { loadPngTexture } from "@/lib/image/loadPngTexture";
import { clearEditorSnapshot, writeEditorSnapshot } from "@/lib/save/session";
import { defaultAcrylicSizePresetId } from "@/lib/simulator/acrylicSizePresets";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}));

vi.mock("@/lib/image/composePreviewImage", () => ({
  composePreviewImageFromDataUrl: vi.fn(async (src: string) => `${src}-preview`)
}));

vi.mock("@/components/simulator/SimulatorCanvas", () => ({
  SimulatorCanvas: ({
    imageUrl,
    isEngravingMode,
    containerRef,
    heightAttenuation
  }: {
    imageUrl?: string | null;
    isEngravingMode?: boolean;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    heightAttenuation?: number;
  }) => (
    <div
      ref={containerRef}
      className="simulator-canvas-host"
      data-testid="simulator-canvas"
      data-is-engraving-mode={String(Boolean(isEngravingMode))}
      data-height-attenuation={heightAttenuation ?? ""}
    >
      <canvas />
      {imageUrl ?? "empty"}
    </div>
  )
}));

vi.mock("@/lib/export/exportCanvasImage", () => ({
  exportCanvasImage: vi.fn(async () => new Blob(["png"], { type: "image/png" })),
  getCanvasPreviewDataUrl: vi.fn((_root, _format, cropRegion) =>
    cropRegion ? "data:image/png;base64,cropped-preview" : "data:image/png;base64,export-preview"
  )
}));

vi.mock("@/lib/export/exportEngravingImage", () => ({
  exportEngravingImage: vi.fn(async () => ({
    blob: new Blob(["engraving"], { type: "image/png" }),
    fileName: "simulator-engraving.png"
  }))
}));

vi.mock("@/lib/image/generateEngravingMap", () => ({
  generateEngravingMapFromDataUrl: vi.fn().mockResolvedValue({
    src: "data:image/png;base64,engraving",
    width: 640,
    height: 640,
    averageStrength: 0.4
  })
}));

vi.mock("@/lib/download/downloadBlob", () => ({
  downloadBlob: vi.fn()
}));

vi.mock("@/lib/image/loadPngTexture", () => ({
  loadPngTexture: vi.fn().mockResolvedValue({
    src: "data:image/png;base64,simulator",
    name: "simulator.png",
    engraving: {
      src: "data:image/png;base64,engraving",
      width: 640,
      height: 640,
      averageStrength: 0.4
    }
  })
}));

describe("SimulatorScreen", () => {
  const uploadSampleImage = async (user: ReturnType<typeof userEvent.setup>) => {
    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toBeInTheDocument();
    });
  };

  const openControlDrawer = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole("tab", { name: "配置" }));
    return screen.getByRole("complementary", { name: "シミュレーター設定" });
  };

  beforeEach(() => {
    vi.mocked(loadPngTexture).mockResolvedValue({
      src: "data:image/png;base64,simulator",
      name: "simulator.png",
      engraving: {
        src: "data:image/png;base64,engraving",
        width: 640,
        height: 640,
        averageStrength: 0.4
      }
    });
    vi.mocked(exportCanvasImage).mockResolvedValue(new Blob(["png"], { type: "image/png" }));
    vi.mocked(exportEngravingImage).mockResolvedValue({
      blob: new Blob(["engraving"], { type: "image/png" }),
      fileName: "simulator-engraving.png"
    });
    vi.mocked(generateEngravingMapFromDataUrl).mockResolvedValue({
      src: "data:image/png;base64,engraving",
      width: 640,
      height: 640,
      averageStrength: 0.4
    });
    vi.mocked(composePreviewImageFromDataUrl).mockImplementation(async (src: string) => `${src}-preview`);
    vi.mocked(downloadBlob).mockReset();
  });

  afterEach(() => {
    clearEditorSnapshot();
    window.sessionStorage.clear();
  });

  it("updates preview state when a png file is selected", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveTextContent("data:image/png;base64,simulator-preview");
    });

    await openControlDrawer(user);

    expect(composePreviewImageFromDataUrl).toHaveBeenCalledWith(
      "data:image/png;base64,engraving",
      expect.objectContaining({ contentFit: "contain" })
    );
    expect(screen.getByText("simulator.png の読み込みが完了しました。")).toBeInTheDocument();
    expect(screen.queryByAltText("彫刻用グレースケールプレビュー")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "彫刻" }));
    expect(screen.getAllByAltText("彫刻用グレースケールプレビュー")).toHaveLength(1);
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-is-engraving-mode", "false");
    expect(screen.getByRole("tab", { name: "配置" })).toHaveAttribute("data-state", "complete");
    expect(screen.getByRole("tab", { name: "配置" })).toHaveTextContent("配置");
    expect(screen.getByTestId("export-crop-overlay-toggle")).toBeInTheDocument();
  });

  it("supports click and drag interactions on the preview upload surface", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const uploadSurface = screen.getByTestId("preview-upload-surface");
    expect(uploadSurface).toHaveAttribute(
      "aria-label",
      "3Dビューに画像をドラッグするか、クリックして PNG を選択"
    );
    expect(uploadSurface).toHaveAttribute("role", "button");
    expect(uploadSurface).toHaveAttribute("tabindex", "0");

    const input = screen.getByLabelText("3Dビュー画像アップロード") as HTMLInputElement;
    const inputClickSpy = vi.spyOn(input, "click");

    fireEvent.click(uploadSurface);
    expect(inputClickSpy).toHaveBeenCalledTimes(1);

    fireEvent.dragOver(uploadSurface, {
      dataTransfer: {
        dropEffect: "none"
      }
    });
    expect(uploadSurface).toHaveClass("is-drag-active");
    expect(screen.getByText("ここにドロップして画像を差し替え")).toBeInTheDocument();

    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveTextContent("data:image/png;base64,simulator-preview");
    });

    expect(screen.queryByText("画像を差し替える")).not.toBeInTheDocument();
  });

  it("updates the section summary and supports keyboard tab navigation", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);
    await uploadSampleImage(user);
    await openControlDrawer(user);

    const displayTab = screen.getByRole("tab", { name: "カメラ" });
    displayTab.focus();

    await user.keyboard("{ArrowRight}");

    const imageTab = screen.getByRole("tab", { name: "配置" });
    expect(imageTab).toHaveFocus();
    expect(imageTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("control-panel-image")).toBeInTheDocument();
    expect(screen.queryByTestId("control-panel-export")).not.toBeInTheDocument();

    await user.keyboard("{Home}");

    const lightingTab = screen.getByRole("tab", { name: "ライト" });
    expect(lightingTab).toHaveFocus();
    expect(lightingTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("control-panel-lighting")).toBeInTheDocument();
    expect(screen.queryByTestId("control-panel-image")).not.toBeInTheDocument();
  });

  it("switches control tabs after an image is uploaded", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);

    await user.click(screen.getByRole("tab", { name: "彫刻" }));
    expect(screen.getByRole("tab", { name: "彫刻" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: "ライト" }));
    expect(screen.getByRole("tab", { name: "ライト" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: "カメラ" }));
    expect(screen.getByRole("tab", { name: "カメラ" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: "書出し" }));
    expect(screen.getByRole("tab", { name: "書出し" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps settings panels hidden until a preview menu item is opened", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    expect(screen.queryByRole("tab", { name: "配置" })).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();

    await uploadSampleImage(user);

    const imageTab = screen.getByRole("tab", { name: "配置" });

    expect(imageTab).toHaveAttribute("aria-expanded", "false");
    expect(imageTab).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();

    await user.click(imageTab);

    expect(imageTab).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("complementary", { name: "シミュレーター設定" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "配置" })).toHaveAttribute("aria-selected", "true");

    await user.click(imageTab);

    expect(imageTab).toHaveAttribute("aria-expanded", "false");
    expect(imageTab).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "ライト" }));
    expect(screen.getByRole("tab", { name: "ライト" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("control-panel-lighting")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();
  });

  it("closes the control drawer when clicking the 3d preview", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toBeInTheDocument();
    });

    await openControlDrawer(user);
    expect(screen.getByRole("complementary", { name: "シミュレーター設定" })).toBeInTheDocument();

    await user.click(screen.getByTestId("simulator-canvas"));

    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "配置" })).toHaveAttribute("aria-expanded", "false");
  });

  it("updates the acrylic size selection", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);
    await uploadSampleImage(user);
    await openControlDrawer(user);

    expect(screen.getByRole("radio", { name: "M (120 x 180 mm)" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("tab", { name: "配置" })).toHaveTextContent("配置");

    await user.click(screen.getByRole("radio", { name: "L (150 x 200 mm)" }));

    expect(screen.getByRole("radio", { name: "L (150 x 200 mm)" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("tab", { name: "配置" })).toHaveTextContent("配置");
  });

  it("updates height attenuation from the lighting controls", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toBeInTheDocument();
    });

    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-height-attenuation", "0.3");

    await openControlDrawer(user);
    await user.click(screen.getByRole("tab", { name: "ライト" }));
    fireEvent.change(screen.getByLabelText("高さ方向の減衰"), {
      target: { value: "0.45" }
    });

    expect(within(screen.getByTestId("control-panel-lighting")).getByText("0.45")).toBeInTheDocument();
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-height-attenuation", "0.45");
  });

  it("shows the source image by default and switches to engraving mode from the engraving panel", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-is-engraving-mode", "false");
    });

    await openControlDrawer(user);
    await user.click(screen.getByRole("tab", { name: "彫刻" }));
    expect(screen.getByLabelText("彫刻モード")).not.toBeChecked();

    await user.click(screen.getByLabelText("彫刻モード"));
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-is-engraving-mode", "true");

    await user.click(screen.getByRole("tab", { name: "カメラ" }));
    await user.click(screen.getByRole("button", { name: "カメラ設定をリセット" }));
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-is-engraving-mode", "true");
  });

  it("restores the saved display mode when resuming from a snapshot", async () => {
    const user = userEvent.setup();

    writeEditorSnapshot({
      sourceImage: {
        fileName: "saved.png",
        src: "data:image/png;base64,saved"
      },
      engraving: {
        src: "data:image/png;base64,saved-engraving",
        adjustments: {
          contrast: 1.35,
          gamma: 0.9,
          threshold: 0.18,
          invert: false,
          edgeWeight: 0.2,
          edgeWidth: 1,
          toneLevels: 8
        },
        averageStrength: 0.3
      },
      simulation: {
        ledColorId: "ice-blue",
        brightness: 1.2,
        backgroundId: "night",
        cameraPresetId: "front",
        acrylicSizeId: "small",
        showSourceOverlay: false,
        imageLayout: {
          contentFit: "contain",
          scale: 1,
          offsetX: 0,
          offsetY: 0
        }
      }
    });

    render(<SimulatorScreen searchParams={{ resume: "1" }} />);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-is-engraving-mode", "true");
    });

    await openControlDrawer(user);
    expect(screen.getByRole("radio", { name: "S (100 x 150 mm)" })).toHaveAttribute("aria-checked", "true");
    await user.click(screen.getByRole("tab", { name: "彫刻" }));
    expect(screen.getByLabelText("彫刻モード")).toBeChecked();
  });

  it("updates image layout controls for the preview", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(composePreviewImageFromDataUrl).toHaveBeenCalledWith(
        "data:image/png;base64,simulator",
        expect.objectContaining({ contentFit: "contain" })
      );
      expect(composePreviewImageFromDataUrl).toHaveBeenCalledWith(
        "data:image/png;base64,engraving",
        expect.objectContaining({ contentFit: "contain" })
      );
    });

    await openControlDrawer(user);
    await user.click(screen.getByRole("button", { name: "余白なく広げる" }));
    fireEvent.change(screen.getByLabelText("画像サイズ"), { target: { value: "130" } });
    fireEvent.change(screen.getByLabelText("画像の横位置"), { target: { value: "25" } });

    await waitFor(() => {
      expect(composePreviewImageFromDataUrl).toHaveBeenCalledWith(
        "data:image/png;base64,simulator",
        expect.objectContaining({
          contentFit: "cover",
          scale: 1.3,
          offsetX: 25
        })
      );
      expect(composePreviewImageFromDataUrl).toHaveBeenCalledWith(
        "data:image/png;base64,engraving",
        expect.objectContaining({
          contentFit: "cover",
          scale: 1.3,
          offsetX: 25
        })
      );
      expect(screen.getByTestId("simulator-canvas")).toHaveTextContent("data:image/png;base64,simulator-preview");
    });
  });

  it("shows an error and keeps save disabled when image loading fails", async () => {
    const user = userEvent.setup();

    vi.mocked(loadPngTexture).mockRejectedValueOnce(new Error("PNGファイルを選択してください。"));

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "broken.png", { type: "image/png" });

    await user.upload(input, file);

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("PNGファイルを選択してください。")).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "書出し" })).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();
  });

  it("shows the guided empty state before an image is uploaded", () => {
    render(<SimulatorScreen />);

    expect(screen.getByRole("link", { name: "使い方" })).toHaveAttribute("href", "/usage");
    expect(screen.queryByText("1. PNG追加")).not.toBeInTheDocument();
    expect(screen.queryByText("2. 調整")).not.toBeInTheDocument();
    expect(screen.queryByText("3. 書出し")).not.toBeInTheDocument();
    expect(screen.getByTestId("preview-empty-state")).toHaveTextContent("PNGファイルを追加して始めましょう");
    expect(screen.queryByRole("tab", { name: "配置" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "リセット" })).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary", { name: "シミュレーター設定" })).not.toBeInTheDocument();
  });

  it("keeps the export crop overlay hidden when the export tab is opened", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await user.click(screen.getByRole("tab", { name: "書出し" }));

    await waitFor(() => {
      expect(screen.getByTestId("export-preview-image")).toBeInTheDocument();
      expect(screen.getByTestId("export-crop-overlay-toggle")).not.toBeChecked();
    });

    expect(screen.queryByTestId("export-crop-overlay")).not.toBeInTheDocument();
    expect(screen.getByTestId("export-preview-image")).toHaveAttribute(
      "src",
      "data:image/png;base64,cropped-preview"
    );
    expect(getCanvasPreviewDataUrl).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      "png",
      expect.objectContaining({ width: 1, height: 1 })
    );
  });

  it("shows and hides the export crop overlay with the toggle", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await user.click(screen.getByRole("tab", { name: "書出し" }));

    await user.click(screen.getByTestId("export-crop-overlay-toggle"));
    expect(screen.getByTestId("export-crop-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("export-crop-overlay-toggle")).toBeChecked();

    await user.click(screen.getByTestId("export-crop-overlay-toggle"));

    expect(screen.queryByTestId("export-crop-overlay")).not.toBeInTheDocument();
    expect(screen.getByTestId("export-crop-overlay-toggle")).not.toBeChecked();
  });

  it("downloads the current preview as a png by default and opens the completion toast", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "書出し" })).toBeInTheDocument();
    });
    await user.click(screen.getByRole("tab", { name: "書出し" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    await waitFor(() => {
      expect(screen.getByText("ダウンロードを開始しました")).toBeInTheDocument();
    });

    expect(exportCanvasImage).toHaveBeenCalledWith(
      expect.any(HTMLDivElement),
      "png",
      expect.objectContaining({ width: 1, height: 1 })
    );
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "simulator.png");
    expect(screen.getByRole("status")).toHaveTextContent("PNG ファイルとして出力しました");
  });

  it("supports switching the download format to jpg", async () => {
    const user = userEvent.setup();

    vi.mocked(exportCanvasImage).mockResolvedValueOnce(new Blob(["jpg"], { type: "image/jpeg" }));

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "書出し" })).toBeInTheDocument();
    });
    await user.click(screen.getByRole("tab", { name: "書出し" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });
    await user.click(screen.getByRole("radio", { name: "JPG" }));
    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    await waitFor(() => {
      expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "simulator.jpg");
    });
  });

  it("keeps the current image and settings when downloading fails", async () => {
    const user = userEvent.setup();

    vi.mocked(exportCanvasImage).mockRejectedValueOnce(
      new Error("ダウンロードに失敗しました。時間をおいて再試行してください。")
    );

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "書出し" })).toBeInTheDocument();
    });
    await user.click(screen.getByRole("tab", { name: "書出し" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    const alert = await screen.findByRole("alert");
    expect(
      within(alert).getByText("ダウンロードに失敗しました。時間をおいて再試行してください。")
    ).toBeInTheDocument();
    expect(screen.getByTestId("simulator-canvas")).toHaveTextContent("data:image/png;base64,simulator-preview");
    expect(downloadBlob).not.toHaveBeenCalled();
  });

  it("regenerates the engraving preview and downloads the engraving png", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await user.click(screen.getByRole("tab", { name: "彫刻" }));
    await waitFor(() => {
      expect(screen.getAllByAltText("彫刻用グレースケールプレビュー")).toHaveLength(1);
    });
    expect(screen.getByRole("radio", { name: "白を導光" })).toHaveAttribute("aria-checked", "true");
    await user.click(screen.getByRole("radio", { name: "黒を導光" }));
    fireEvent.change(screen.getByLabelText("しきい値 数値入力"), { target: { value: "0.45" } });
    fireEvent.change(screen.getByLabelText("階調数 数値入力"), { target: { value: "4" } });
    await user.click(screen.getByLabelText("白黒反転"));
    await user.click(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" }));

    await waitFor(() => {
      expect(generateEngravingMapFromDataUrl).toHaveBeenCalledWith(
        "data:image/png;base64,simulator",
        expect.objectContaining({ invert: true, threshold: 0.45, toneLevels: 4 })
      );
      expect(exportEngravingImage).toHaveBeenCalledWith(
        "data:image/png;base64,engraving",
        "simulator-engraving.png",
        { invert: true }
      );
    });

    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "simulator-engraving.png");
  });

  it("keeps engraving panel controls visible after toggling download invert", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await openControlDrawer(user);
    await user.click(screen.getByRole("tab", { name: "彫刻" }));

    await user.click(screen.getByLabelText("白黒反転"));
    await user.click(screen.getByLabelText("白黒反転"));

    expect(screen.getByTestId("control-panel-engraving")).toBeInTheDocument();
    expect(screen.getByLabelText("しきい値")).toBeInTheDocument();
    expect(screen.getByTestId("engraving-preview-grid")).toBeInTheDocument();
  });
});
