import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EngravingControls } from "@/components/controls/EngravingControls";
import { defaultEngravingAdjustments } from "@/lib/image/engravingFilters";

describe("EngravingControls", () => {
  it("updates numeric adjustments, guide tone, tone mode, and tone levels", async () => {
    const user = userEvent.setup();
    const onAdjustmentsChange = vi.fn();
    const onDownload = vi.fn();

    const { rerender } = render(
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
    fireEvent.change(screen.getByLabelText("線幅補正"), { target: { value: "3" } });
    await user.click(screen.getByRole("radio", { name: "黒を導光" }));

    const toneModeGroup = screen.getByRole("radiogroup", { name: "彫刻画像の表現" });
    expect(within(toneModeGroup).getAllByRole("radio").map((button) => button.textContent)).toEqual([
      "グレースケール",
      "階調"
    ]);
    expect(within(toneModeGroup).getByRole("radio", { name: "グレースケール" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.queryByLabelText("階調数")).not.toBeInTheDocument();

    await user.click(within(toneModeGroup).getByRole("radio", { name: "階調" }));
    rerender(
      <EngravingControls
        adjustments={{ ...defaultEngravingAdjustments, toneMode: "stepped" }}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={onAdjustmentsChange}
        onDownload={onDownload}
      />
    );
    fireEvent.change(screen.getByLabelText("階調数 数値入力"), { target: { value: "16" } });
    await user.click(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" }));

    expect(screen.getByLabelText("線幅補正")).toHaveAttribute("max", "5");
    expect(screen.getByRole("radio", { name: "階調" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("階調数")).toHaveAttribute("max", "8");
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ threshold: 0.45 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ edgeWidth: 3 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ toneLevels: 8 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ toneMode: "stepped" });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ invert: true });
    expect(onDownload).toHaveBeenCalledWith({ invert: false });
    expect(screen.getByText(defaultEngravingAdjustments.threshold.toFixed(2))).toBeInTheDocument();
  });

  it("hides tone level controls while grayscale tone mode is selected", () => {
    render(
      <EngravingControls
        adjustments={{ ...defaultEngravingAdjustments, toneMode: "grayscale" }}
        isEngravingMode={false}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onEngravingModeChange={vi.fn()}
        onAdjustmentsChange={vi.fn()}
        onDownload={vi.fn()}
      />
    );

    expect(screen.getByRole("radio", { name: "グレースケール" })).toHaveAttribute("aria-checked", "true");
    expect(screen.queryByLabelText("階調数")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("階調数 数値入力")).not.toBeInTheDocument();
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
    expect(screen.getByAltText("彫刻用画像プレビュー")).toHaveClass("preview-image");
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

    const engravingPreview = screen.getByAltText("彫刻用画像プレビュー");
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
    expect(screen.getByAltText("彫刻用画像プレビュー")).toHaveAttribute(
      "src",
      "data:image/png;base64,engraving"
    );
  });
});
