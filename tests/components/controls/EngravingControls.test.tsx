import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EngravingControls } from "@/components/controls/EngravingControls";
import { defaultEngravingAdjustments } from "@/lib/image/engravingFilters";

describe("EngravingControls", () => {
  it("updates numeric adjustments, guide tone, and tone levels", async () => {
    const user = userEvent.setup();
    const onAdjustmentsChange = vi.fn();
    const onDownload = vi.fn();

    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={onAdjustmentsChange}
        onDownload={onDownload}
      />
    );

    fireEvent.change(screen.getByLabelText("しきい値"), { target: { value: "0.45" } });
    fireEvent.change(screen.getByLabelText("階調数 数値入力"), { target: { value: "16" } });
    await user.click(screen.getByRole("radio", { name: "黒を導光" }));
    await user.click(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" }));

    expect(screen.getByLabelText("階調数")).toHaveAttribute("max", "8");
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ threshold: 0.45 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ toneLevels: 8 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ invert: true });
    expect(onDownload).toHaveBeenCalledWith({ invert: false });
    expect(screen.getByText(defaultEngravingAdjustments.threshold.toFixed(2))).toBeInTheDocument();
  });

  it("keeps panel controls visible after toggling download invert", async () => {
    const user = userEvent.setup();

    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText("白黒反転"));
    await user.click(screen.getByLabelText("白黒反転"));

    expect(screen.getByLabelText("しきい値")).toBeInTheDocument();
    expect(screen.getByTestId("engraving-preview-grid")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" })).toBeInTheDocument();
    expect(screen.getByAltText("彫刻用グレースケールプレビュー")).toHaveClass("preview-image");
  });

  it("reflects download invert in the engraving preview image", async () => {
    const user = userEvent.setup();

    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    const engravingPreview = screen.getByAltText("彫刻用グレースケールプレビュー");
    expect(engravingPreview.parentElement).not.toHaveClass("is-inverted");

    await user.click(screen.getByLabelText("白黒反転"));

    expect(engravingPreview.parentElement).toHaveClass("preview-image-frame", "is-inverted");
  });

  it("emits engraving mode changes from the toggle", async () => {
    const user = userEvent.setup();
    const onEngravingModeChange = vi.fn();

    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={onEngravingModeChange}
        onAdjustmentsChange={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText("彫刻モード"));

    expect(onEngravingModeChange).toHaveBeenCalledWith(true);
  });

  it("downloads with invert when the toggle is enabled", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={vi.fn()}
        onDownload={onDownload}
      />
    );

    await user.click(screen.getByRole("switch", { name: "白黒反転" }));
    await user.click(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" }));

    expect(onDownload).toHaveBeenCalledWith({ invert: true });
  });

  it("shows both source and engraving previews", () => {
    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    expect(screen.getByAltText("元画像プレビュー")).toHaveAttribute("src", "data:image/png;base64,source");
    expect(screen.getByAltText("彫刻用グレースケールプレビュー")).toHaveAttribute(
      "src",
      "data:image/png;base64,engraving"
    );
  });
});
