import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";
import { downloadBlob } from "@/lib/download/downloadBlob";
import { exportEngravingImage } from "@/lib/export/exportEngravingImage";
import { exportCanvasImage } from "@/lib/export/exportCanvasImage";
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
    showSourceOverlay,
    containerRef,
    heightAttenuation
  }: {
    imageUrl?: string | null;
    showSourceOverlay?: boolean;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    heightAttenuation?: number;
  }) => (
    <div
      ref={containerRef}
      data-testid="simulator-canvas"
      data-show-source-overlay={String(Boolean(showSourceOverlay))}
      data-height-attenuation={heightAttenuation ?? ""}
    >
      {imageUrl ?? "empty"}
    </div>
  )
}));

vi.mock("@/lib/export/exportCanvasImage", () => ({
  exportCanvasImage: vi.fn(async () => new Blob(["png"], { type: "image/png" }))
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

    expect(composePreviewImageFromDataUrl).toHaveBeenCalledWith(
      "data:image/png;base64,engraving",
      expect.objectContaining({ contentFit: "contain" })
    );
    expect(screen.getAllByText("simulator.png").length).toBeGreaterThan(0);
    expect(screen.getAllByText("プレビューへ反映済みです。").length).toBeGreaterThan(0);
    expect(screen.getAllByAltText("彫刻用グレースケールプレビュー")).toHaveLength(1);
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "false");
    expect(within(screen.getByTestId("control-panel-image")).getByTestId("control-panel-summary")).toHaveTextContent(
      "画像"
    );
    expect(screen.getByRole("tab", { name: "画像" })).toHaveAttribute("data-state", "complete");
    expect(screen.getByRole("tab", { name: "画像" })).toHaveTextContent("画像");
  });

  it("supports click and drag interactions on the preview upload surface", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const uploadSurface = screen.getByTestId("preview-upload-surface");
    expect(uploadSurface).toHaveAttribute(
      "aria-label",
      "3Dビューに画像をドラッグするか、クリックして PNG を選択"
    );

    fireEvent.dragOver(uploadSurface, {
      dataTransfer: {
        dropEffect: "none"
      }
    });
    expect(uploadSurface).toHaveClass("is-drag-active");
    expect(screen.getByText("ここにドロップして画像を差し替え")).toBeInTheDocument();

    const input = screen.getByLabelText("3Dビュー画像アップロード");
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

    const displayTab = screen.getByRole("tab", { name: "表示" });
    displayTab.focus();

    await user.keyboard("{ArrowRight}");

    const exportTab = screen.getByRole("tab", { name: "書き出し" });
    expect(exportTab).toHaveFocus();
    expect(exportTab).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByTestId("control-panel-export")).getByTestId("control-panel-summary")).toHaveTextContent(
      "書き出し"
    );
    expect(within(screen.getByTestId("control-panel-export")).getByTestId("control-panel-summary")).toHaveTextContent(
      "画像未選択"
    );
    expect(screen.getByTestId("control-panel-export")).not.toHaveAttribute("hidden");
    expect(screen.getByTestId("control-panel-image")).toHaveAttribute("hidden");

    await user.keyboard("{Home}");

    const imageTab = screen.getByRole("tab", { name: "画像" });
    expect(imageTab).toHaveFocus();
    expect(imageTab).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByTestId("control-panel-image")).getByTestId("control-panel-summary")).toHaveTextContent(
      "未設定"
    );
    expect(screen.getByTestId("control-panel-image")).not.toHaveAttribute("hidden");
    expect(screen.getByTestId("control-panel-export")).toHaveAttribute("hidden");
  });

  it("moves through the guided control steps after an image is uploaded", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "彫刻を調整する" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "彫刻を調整する" }));
    expect(screen.getByRole("tab", { name: "彫刻" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("button", { name: "ライトを調整する" }));
    expect(screen.getByRole("tab", { name: "ライト" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("button", { name: "表示を確認する" }));
    expect(screen.getByRole("tab", { name: "表示" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("button", { name: "書き出しへ進む" }));
    expect(screen.getByRole("tab", { name: "書き出し" })).toHaveAttribute("aria-selected", "true");
  });

  it("surfaces an export shortcut after an image is uploaded", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    expect(screen.queryByRole("button", { name: "すぐに書き出しへ進む" })).not.toBeInTheDocument();

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "すぐに書き出しへ進む" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "すぐに書き出しへ進む" }));
    expect(screen.getByRole("tab", { name: "書き出し" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps the control panel visible without the mobile drawer", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    expect(screen.queryByRole("button", { name: "設定" })).not.toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "シミュレーター設定" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "画像" })).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("tab", { name: "ライト" }));
    expect(screen.getByRole("tab", { name: "ライト" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("control-panel-lighting")).not.toHaveAttribute("hidden");
  });

  it("updates the acrylic size selection", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    expect(screen.getByRole("radio", { name: "M (120 x 180 mm)" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("tab", { name: "画像" })).toHaveTextContent("画像");

    await user.click(screen.getByRole("radio", { name: "L (150 x 200 mm)" }));

    expect(screen.getByRole("radio", { name: "L (150 x 200 mm)" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("tab", { name: "画像" })).toHaveTextContent("画像");
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

    await user.click(screen.getByRole("tab", { name: "ライト" }));
    fireEvent.change(screen.getByLabelText("高さ方向の減衰"), {
      target: { value: "0.45" }
    });

    expect(within(screen.getByTestId("control-panel-lighting")).getByText("0.45")).toBeInTheDocument();
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-height-attenuation", "0.45");
  });

  it("updates the active lighting preset label when selecting a white preset", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    await user.click(screen.getByRole("tab", { name: "ライト" }));
    await user.click(screen.getByRole("button", { name: "Warm White" }));

    const lightingStatus = screen.getByText("現在の発光設定").parentElement;

    expect(lightingStatus).toHaveTextContent("Warm White");
  });

  it("keeps the source overlay hidden by default and after resetting display settings", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "false");
    });

    await user.click(screen.getByRole("tab", { name: "表示" }));
    expect(screen.getByText("現在の表示設定")).toBeInTheDocument();
    expect(screen.getByText("現在の表示設定").parentElement).toHaveTextContent("元画像表示オフ");
    expect(screen.getByLabelText("元画像を重ねて表示")).not.toBeChecked();

    await user.click(screen.getByLabelText("元画像を重ねて表示"));
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "true");

    await user.click(screen.getByRole("button", { name: "表示設定をリセット" }));
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "false");
    expect(screen.getByLabelText("元画像を重ねて表示")).not.toBeChecked();
  });

  it("restores the saved source overlay setting when resuming from a snapshot", async () => {
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
          edgeWeight: 0.2
        },
        averageStrength: 0.3
      },
      simulation: {
        ledColorId: "ice-blue",
        brightness: 1.2,
        backgroundId: "night",
        cameraPresetId: "front",
        acrylicSizeId: "small",
        showSourceOverlay: true,
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
      expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "true");
    });

    expect(screen.getByRole("radio", { name: "S (100 x 150 mm)" })).toHaveAttribute("aria-checked", "true");
    await user.click(screen.getByRole("tab", { name: "表示" }));
    expect(screen.getByLabelText("元画像を重ねて表示")).toBeChecked();
    expect(screen.getByText("現在の表示設定").parentElement).toHaveTextContent("元画像表示オン");
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
    await user.click(screen.getByRole("tab", { name: "書き出し" }));
    expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeDisabled();
  });

  it("shows the guided empty state before an image is uploaded", () => {
    render(<SimulatorScreen />);

    expect(screen.getByText("1. PNG追加")).toBeInTheDocument();
    expect(screen.getByText("2. 調整")).toBeInTheDocument();
    expect(screen.getByText("3. 書き出し")).toBeInTheDocument();
    expect(screen.getByTestId("preview-empty-state")).toHaveTextContent("3Dビューへ PNG を追加して始めましょう");
    expect(screen.getByRole("complementary", { name: "シミュレーター設定" })).toBeInTheDocument();
    expect(screen.getByText("PNGを追加すると配置調整ができます。")).toBeInTheDocument();
    expect(screen.queryByLabelText("画像サイズ")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PNGを追加すると次へ進めます" })).toBeDisabled();
  });

  it("downloads the current preview as a png by default and opens the completion toast", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "書き出し" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("tab", { name: "書き出し" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    await waitFor(() => {
      expect(screen.getByText("ダウンロードを開始しました")).toBeInTheDocument();
    });

    expect(exportCanvasImage).toHaveBeenCalledWith(expect.any(HTMLDivElement), "png");
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
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "書き出し" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("tab", { name: "書き出し" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });
    expect(screen.getByText("ダウンロード状態")).toBeInTheDocument();

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
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "書き出し" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("tab", { name: "書き出し" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    const alert = await screen.findByRole("alert");
    expect(
      within(alert).getByText("ダウンロードに失敗しました。時間をおいて再試行してください。")
    ).toBeInTheDocument();
    expect(screen.getAllByText("simulator.png").length).toBeGreaterThan(0);
    expect(downloadBlob).not.toHaveBeenCalled();
  });

  it("regenerates the engraving preview and downloads the engraving png", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("3Dビュー画像アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getAllByAltText("彫刻用グレースケールプレビュー")).toHaveLength(1);
    });

    await user.click(screen.getByRole("tab", { name: "彫刻" }));
    fireEvent.change(screen.getByLabelText("しきい値 数値入力"), { target: { value: "0.45" } });
    await user.click(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" }));

    await waitFor(() => {
      expect(generateEngravingMapFromDataUrl).toHaveBeenCalledWith(
        "data:image/png;base64,simulator",
        expect.objectContaining({ threshold: 0.45 })
      );
      expect(exportEngravingImage).toHaveBeenCalledWith(
        "data:image/png;base64,engraving",
        "simulator-engraving.png"
      );
    });

    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "simulator-engraving.png");
  });
});
