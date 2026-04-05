import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DisplayControls } from "@/components/controls/DisplayControls";

describe("DisplayControls", () => {
  it("emits background, camera, and reset actions", async () => {
    const user = userEvent.setup();
    const onBackgroundChange = vi.fn();
    const onCameraPresetChange = vi.fn();
    const onSourceOverlayChange = vi.fn();
    const onResetView = vi.fn();

    render(
      <DisplayControls
        activeBackgroundId="night"
        activeCameraPreset="front"
        showSourceOverlay={true}
        onBackgroundChange={onBackgroundChange}
        onCameraPresetChange={onCameraPresetChange}
        onSourceOverlayChange={onSourceOverlayChange}
        onResetView={onResetView}
      />
    );

    await user.click(screen.getByRole("button", { name: "Rose Glow" }));
    await user.click(screen.getByRole("button", { name: "俯瞰" }));
    await user.click(screen.getByLabelText("元画像を重ねて表示"));
    await user.click(screen.getByRole("button", { name: "表示設定をリセット" }));

    expect(onBackgroundChange).toHaveBeenCalledWith("rose");
    expect(onCameraPresetChange).toHaveBeenCalledWith("tilt");
    expect(onSourceOverlayChange).toHaveBeenCalledWith(false);
    expect(onResetView).toHaveBeenCalled();
  });

  it("shows overlay off state when source overlay is disabled", () => {
    render(
      <DisplayControls
        activeBackgroundId="night"
        activeCameraPreset="front"
        showSourceOverlay={false}
        onBackgroundChange={vi.fn()}
        onCameraPresetChange={vi.fn()}
        onSourceOverlayChange={vi.fn()}
        onResetView={vi.fn()}
      />
    );

    expect(screen.getByText("元画像表示オフ")).toBeInTheDocument();
    expect(screen.getByLabelText("元画像を重ねて表示")).not.toBeChecked();
  });
});
