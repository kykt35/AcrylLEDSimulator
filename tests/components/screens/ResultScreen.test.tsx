import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultScreen } from "@/components/screens/ResultScreen";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push
  })
}));

describe("ResultScreen", () => {
  beforeEach(() => {
    push.mockReset();
    window.sessionStorage.clear();
  });

  it("renders the saved result and supports resume and reset actions", async () => {
    const user = userEvent.setup();

    window.sessionStorage.setItem(
      "acryl-led-simulator:result",
      JSON.stringify({
        savedSimulationId: "sim_test",
        resultImageUrl: "data:image/png;base64,result",
        savedAt: "2026-04-03T10:00:00.000Z",
        sourceImage: {
          fileName: "uploaded.png",
          src: "data:image/png;base64,uploaded"
        },
        simulation: {
          ledColorId: "ice-blue",
          brightness: 1.2,
          backgroundId: "night",
          cameraPresetId: "front"
        }
      })
    );

    render(<ResultScreen />);

    expect(await screen.findByText("保存が完了しました")).toBeInTheDocument();
    expect(screen.getByText("uploaded.png")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "再編集する" }));
    expect(push).toHaveBeenCalledWith("/simulator?resume=1");

    await user.click(screen.getByRole("button", { name: "新規作成する" }));
    expect(push).toHaveBeenCalledWith("/simulator?reset=1");
  });
});
