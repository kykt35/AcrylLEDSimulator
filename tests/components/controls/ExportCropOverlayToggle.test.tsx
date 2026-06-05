import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportCropOverlayToggle } from "@/components/controls/ExportCropOverlayToggle";

describe("ExportCropOverlayToggle", () => {
  it("toggles export crop overlay visibility", async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();

    render(<ExportCropOverlayToggle visible={false} onVisibleChange={onVisibleChange} />);

    await user.click(screen.getByTestId("export-crop-overlay-toggle"));

    expect(onVisibleChange).toHaveBeenCalledWith(true);
  });
});
