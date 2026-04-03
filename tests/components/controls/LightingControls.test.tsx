import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LightingControls } from "@/components/controls/LightingControls";

describe("LightingControls", () => {
  it("emits preset, brightness, and camera changes", async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();
    const onBrightnessChange = vi.fn();
    const onCameraPresetChange = vi.fn();

    render(
      <LightingControls
        activePresetId="ice-blue"
        brightness={1.2}
        activeCameraPreset="front"
        onPresetChange={onPresetChange}
        onBrightnessChange={onBrightnessChange}
        onCameraPresetChange={onCameraPresetChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Sunset Pink" }));
    fireEvent.change(screen.getByLabelText("明るさ"), {
      target: { value: "1.8" }
    });
    await user.click(screen.getByRole("button", { name: "俯瞰" }));

    expect(onPresetChange).toHaveBeenCalledWith("sunset-pink");
    expect(onCameraPresetChange).toHaveBeenCalledWith("tilt");
    expect(onBrightnessChange).toHaveBeenCalledWith(1.8);
  });
});
