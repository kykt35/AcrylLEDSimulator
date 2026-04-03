import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LightingControls } from "@/components/controls/LightingControls";

describe("LightingControls", () => {
  it("emits preset and brightness changes", async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();
    const onBrightnessChange = vi.fn();

    render(
      <LightingControls
        activePresetId="ice-blue"
        brightness={1.2}
        onPresetChange={onPresetChange}
        onBrightnessChange={onBrightnessChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Sunset Pink" }));
    fireEvent.change(screen.getByLabelText("明るさ"), {
      target: { value: "1.8" }
    });

    expect(onPresetChange).toHaveBeenCalledWith("sunset-pink");
    expect(onBrightnessChange).toHaveBeenCalledWith(1.8);
  });
});
