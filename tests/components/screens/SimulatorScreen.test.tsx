import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";
import { downloadBlob } from "@/lib/download/downloadBlob";
import { exportCanvasImage } from "@/lib/export/exportCanvasImage";
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
    containerRef
  }: {
    imageUrl?: string | null;
    containerRef?: React.RefObject<HTMLDivElement | null>;
  }) => (
    <div ref={containerRef} data-testid="simulator-canvas">
      {imageUrl ?? "empty"}
    </div>
  )
}));

vi.mock("@/lib/export/exportCanvasImage", () => ({
  exportCanvasImage: vi.fn(async () => new Blob(["png"], { type: "image/png" }))
}));

vi.mock("@/lib/download/downloadBlob", () => ({
  downloadBlob: vi.fn()
}));

vi.mock("@/lib/image/loadPngTexture", () => ({
  loadPngTexture: vi.fn().mockResolvedValue({
    src: "data:image/png;base64,simulator",
    name: "simulator.png"
  })
}));

describe("SimulatorScreen", () => {
  beforeEach(() => {
    vi.mocked(loadPngTexture).mockResolvedValue({
      src: "data:image/png;base64,simulator",
      name: "simulator.png"
    });
    vi.mocked(exportCanvasImage).mockResolvedValue(new Blob(["png"], { type: "image/png" }));
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
});
