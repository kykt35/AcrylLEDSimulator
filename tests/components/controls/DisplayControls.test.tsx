import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DisplayControls } from "@/components/controls/DisplayControls";

describe("DisplayControls", () => {
  it("emits background, camera, and reset actions", async () => {
    const user = userEvent.setup();
    const onBackgroundChange = vi.fn();
    const onCameraPresetChange = vi.fn();
    const onResetView = vi.fn();

    render(
      <DisplayControls
        activeBackgroundId="night"
        activeCameraPreset="front"
        onBackgroundChange={onBackgroundChange}
        onCameraPresetChange={onCameraPresetChange}
        onResetView={onResetView}
      />
    );

    await user.click(screen.getByRole("button", { name: "Rose Glow" }));
    await user.click(screen.getByRole("button", { name: "俯瞰" }));
    await user.click(screen.getByRole("button", { name: "カメラ設定をリセット" }));

    expect(onBackgroundChange).toHaveBeenCalledWith("rose");
    expect(onCameraPresetChange).toHaveBeenCalledWith("tilt");
    expect(onResetView).toHaveBeenCalled();
    expect(screen.getByText("Rose Glow")).toBeInTheDocument();
  });

  it("shows the active background preset", () => {
    render(
      <DisplayControls
        activeBackgroundId="night"
        activeCameraPreset="front"
        onBackgroundChange={vi.fn()}
        onCameraPresetChange={vi.fn()}
        onResetView={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Night Studio" })).toHaveAttribute("aria-pressed", "true");
  });
});
