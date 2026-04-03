import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimulatorScreen } from "@/components/screens/SimulatorScreen";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push
  }),
  useSearchParams: () => new URLSearchParams()
}));

vi.mock("@/components/simulator/SimulatorCanvas", () => ({
  SimulatorCanvas: ({ imageUrl }: { imageUrl?: string | null }) => (
    <div data-testid="simulator-canvas">{imageUrl ?? "empty"}</div>
  )
}));

vi.mock("@/lib/export/exportCanvasImage", () => ({
  exportCanvasImage: vi.fn(() => "data:image/png;base64,exported")
}));

vi.mock("@/lib/image/loadPngTexture", () => ({
  loadPngTexture: vi.fn().mockResolvedValue({
    src: "data:image/png;base64,simulator",
    name: "simulator.png"
  })
}));

describe("SimulatorScreen", () => {
  beforeEach(() => {
    push.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          savedSimulationId: "sim_test",
          resultImageUrl: "data:image/png;base64,exported",
          savedAt: "2026-04-03T10:00:00.000Z"
        })
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it("saves the current preview and opens the completion modal", async () => {
    const user = userEvent.setup();

    render(<SimulatorScreen />);

    const input = screen.getByLabelText("PNG アップロード");
    const file = new File(["png"], "simulator.png", { type: "image/png" });

    await user.upload(input, file);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "画像を保存する" })).toBeEnabled();
    });

    await user.click(screen.getByRole("button", { name: "画像を保存する" }));

    await waitFor(() => {
      expect(screen.getByText("保存が完了しました")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "結果を見る" }));
    expect(push).toHaveBeenCalledWith("/result");
  });
});
