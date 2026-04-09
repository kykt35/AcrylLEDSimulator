import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LightingControls } from "@/components/controls/LightingControls";

describe("LightingControls", () => {
  it("emits preset and brightness changes", async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();
    const onBrightnessChange = vi.fn();
    const onHeightAttenuationChange = vi.fn();

    render(
      <LightingControls
        activePresetId="ice-blue"
        brightness={1.2}
        heightAttenuation={0.3}
        onPresetChange={onPresetChange}
        onBrightnessChange={onBrightnessChange}
        onHeightAttenuationChange={onHeightAttenuationChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Sunset Pink" }));
    fireEvent.change(screen.getByLabelText("明るさ"), {
      target: { value: "1.8" }
    });
    fireEvent.change(screen.getByLabelText("高さ方向の減衰"), {
      target: { value: "0.45" }
    });

    expect(onPresetChange).toHaveBeenCalledWith("sunset-pink");
    expect(onBrightnessChange).toHaveBeenCalledWith(1.8);
    expect(onHeightAttenuationChange).toHaveBeenCalledWith(0.45);
    expect(screen.getByText("1.2")).toBeInTheDocument();
  });

  it("emits white preset selections", async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();

    render(
      <LightingControls
        activePresetId="ice-blue"
        brightness={1.2}
        heightAttenuation={0.3}
        onPresetChange={onPresetChange}
        onBrightnessChange={vi.fn()}
        onHeightAttenuationChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "Warm White" }));
    await user.click(screen.getByRole("button", { name: "Cool White" }));

    expect(onPresetChange).toHaveBeenNthCalledWith(1, "warm-white");
    expect(onPresetChange).toHaveBeenNthCalledWith(2, "cool-white");
  });
});
