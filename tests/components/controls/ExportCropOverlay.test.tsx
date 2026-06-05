import React from "react";
import { render, screen } from "@testing-library/react";
import { ExportCropOverlay } from "@/components/controls/ExportCropOverlay";

describe("ExportCropOverlay", () => {
  it("renders the crop overlay with corner handles", () => {
    render(
      <ExportCropOverlay
        cropRegion={{ x: 0.2, y: 0.2, width: 0.5, height: 0.5 }}
        onCropRegionChange={vi.fn()}
      />
    );

    expect(screen.getByTestId("export-crop-overlay")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "左上を調整" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "右上を調整" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "左下を調整" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "右下を調整" })).toBeInTheDocument();
  });
});
