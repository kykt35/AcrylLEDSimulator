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
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
        onAdjustmentsChange={onAdjustmentsChange}
        onDownload={onDownload}
      />
    );

    fireEvent.change(screen.getByLabelText("しきい値"), { target: { value: "0.45" } });
    fireEvent.change(screen.getByLabelText("階調数 数値入力"), { target: { value: "16" } });
    await user.click(screen.getByRole("radio", { name: "黒を導光" }));
    await user.click(screen.getByRole("button", { name: "彫刻用 PNG をダウンロード" }));

    expect(onAdjustmentsChange).toHaveBeenCalledWith({ threshold: 0.45 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ toneLevels: 16 });
    expect(onAdjustmentsChange).toHaveBeenCalledWith({ invert: true });
    expect(onDownload).toHaveBeenCalled();
    expect(screen.getByText(defaultEngravingAdjustments.threshold.toFixed(2))).toBeInTheDocument();
  });

  it("shows both source and engraving previews", () => {
    render(
      <EngravingControls
        adjustments={defaultEngravingAdjustments}
        engravingImageUrl="data:image/png;base64,engraving"
        sourceImageUrl="data:image/png;base64,source"
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
