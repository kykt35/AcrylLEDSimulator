import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";
import { downloadBlob } from "@/lib/download/downloadBlob";
import { exportEngravingImage } from "@/lib/export/exportEngravingImage";
import { exportCanvasImage } from "@/lib/export/exportCanvasImage";
import { generateEngravingMapFromDataUrl } from "@/lib/image/generateEngravingMap";
import { loadPngTexture } from "@/lib/image/loadPngTexture";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}));

vi.mock("@/components/simulator/SimulatorCanvas", () => ({
  SimulatorCanvas: ({
    imageUrl,
    showSourceOverlay,
    imageLayout,
    containerRef
  }: {
    imageUrl?: string | null;
    showSourceOverlay?: boolean;
    imageLayout?: {
      contentFit: string;
      scale: number;
      offsetX: number;
      offsetY: number;
    };
    containerRef?: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div
      ref={containerRef}
      data-testid="simulator-canvas"
      data-show-source-overlay={String(Boolean(showSourceOverlay))}
      data-image-fit={imageLayout?.contentFit ?? ""}
      data-image-scale={String(imageLayout?.scale ?? "")}
      data-image-offset-x={String(imageLayout?.offsetX ?? "")}
      data-image-offset-y={String(imageLayout?.offsetY ?? "")}
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
    vi.mocked(downloadBlob).mockReset();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("updates preview state when a png file is selected", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveTextContent("data:image/png;base64,simulator");
    });

    expect(screen.getByText("simulator.png")).toBeInTheDocument();
    expect(screen.getByText("プレビューへ反映済みです。")).toBeInTheDocument();
    expect(screen.getAllByAltText("彫刻用グレースケールプレビュー")).toHaveLength(2);
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "true");
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-image-fit", "contain");
  });

  it("can hide the source overlay in the simulator preview", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "true");
    });

    await user.click(screen.getByLabelText("元画像を重ねて表示"));

    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-show-source-overlay", "false");
  });

  it("updates image layout controls for the preview", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-image-fit", "contain");
    });

    await user.click(screen.getByRole("button", { name: "Cover" }));
    fireEvent.change(screen.getByLabelText("画像サイズ"), { target: { value: "130" } });
    fireEvent.change(screen.getByLabelText("画像の横位置"), { target: { value: "25" } });

    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-image-fit", "cover");
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-image-scale", "1.3");
    expect(screen.getByTestId("simulator-canvas")).toHaveAttribute("data-image-offset-x", "25");
  });

  it("shows an error and keeps save disabled when image loading fails", async () => {
    const user = userEvent.setup();

    vi.mocked(loadPngTexture).mockRejectedValueOnce(new Error("PNGファイルを選択してください。"));

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "broken.png", { type: "image/png" });

    await user.upload(input, file);

    const alert = await screen.findByRole("alert");
    expect(within(alert).getByText("PNGファイルを選択してください。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeDisabled();
  });

  it("downloads the current preview as a png by default and opens the completion modal", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    await waitFor(() => {
      expect(screen.getByText("ダウンロードを開始しました")).toBeInTheDocument();
    });

    expect(exportCanvasImage).toHaveBeenCalledWith(expect.any(HTMLDivElement), "png");
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "simulator.png");
  });

  it("supports switching the download format to jpg", async () => {
    const user = userEvent.setup();

    vi.mocked(exportCanvasImage).mockResolvedValueOnce(new Blob(["jpg"], { type: "image/jpeg" }));

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
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

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像をダウンロードする" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像をダウンロードする" }));

    const alert = await screen.findByRole("alert");
    expect(
      within(alert).getByText("ダウンロードに失敗しました。時間をおいて再試行してください。")
    ).toBeInTheDocument();
    expect(screen.getByText("simulator.png")).toBeInTheDocument();
    expect(downloadBlob).not.toHaveBeenCalled();
  });

  it("regenerates the engraving preview and downloads the engraving png", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getAllByAltText("彫刻用グレースケールプレビュー")).toHaveLength(2);
    });

    await user.clear(screen.getByLabelText("しきい値"));
    await user.type(screen.getByLabelText("しきい値"), "0.45");
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
